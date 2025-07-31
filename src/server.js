require('dotenv').config();
// server.js


const express = require('express');
const cors = require('cors');
const session = require('express-session');
const bcrypt = require('bcryptjs');

const { supabase } = require('./lib/supabaseClient')

const app = express();
app.use(express.json());

// Enable CORS to allow credentials from je client
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // in prod via HTTPS op true zetten
}));


// Onboarding (register business) with Supabase
// Onboarding (register business) via Supabase

app.post('/api/complete-onboarding', async (req, res) => {
    const {
        manager_first_name,
        manager_last_name,
        horeca_name,
        address,
        phonenumber,
        email,
        password
    } = req.body;

    // Valideer inputs
    if (!manager_first_name || !manager_last_name || !horeca_name
        || !address || !phonenumber || !email || !password) {
        return res
            .status(400)
            .json({ success: false, message: 'Missing required fields' });
    }

    const hashed = bcrypt.hashSync(password, 10)

    const { data, error } = await supabase
        .from('business_info')
        .insert([{
            manager_first_name,
            manager_last_name,
            horeca_name,
            address,
            phone_number: phonenumber,
            email,
            password: hashed
        }])
        .select('id')      // ask Supabase to return the new `id`
        .single()          // flatten the response

    if (error) {
        console.error('Supabase insert error', error)
        return res.status(500).json({ success: false, message: error.message })
    }

    // now `data` is guaranteed non-null
    res.json({
        success:    true,
        insertedId: data.id
    })
})

// Login endpoint

// Login endpoint
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    // 1) Haal user op uit Supabase
    const { data: user, error } = await supabase
        .from('business_info')
        .select(`
      id,
      email,
      password,
      horeca_name,
      manager_first_name,
      manager_last_name
    `)
        .eq('email', email)
        .maybeSingle();

    if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({ success: false, message: 'Database error' });
    }
    if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // 2) Vergelijk wachtwoord
    if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // 3) Sessiedata vullen
    req.session.user = {
        id:                 user.id,
        email:              user.email,
        horeca_name:        user.horeca_name,
        manager_first_name: user.manager_first_name,
        manager_last_name:  user.manager_last_name
    };

    // 4) Antwoord aan client
    res.json({
        success:     true,
        business_id: user.id,
        horeca_name: user.horeca_name
    });
});

// Middleware
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    res.status(401).json({ error: 'Not authenticated' });
}

// Optioneel: haal ingelogde user op
app.get('/api/user', isAuthenticated, (req, res) => {
    res.json({ user: req.session.user });
});

// now your Supabase-backed menu-items:
// server.js
app.get('/api/menu-items', isAuthenticated, async (req, res) => {
    const businessId = req.session.user.id

    const { data, error } = await supabase
        .from('menu_items')
        .select(`
      id_menu_item,
      price,
      created_at,
      products (
        id_product,
        name,
        brand,
        categories ( category_name ),
        subcategories ( subcat_name ),
        floor_price, 
        low_price, 
        high_price, 
        ceiling_price
      )
    `)
        .eq('business_id', businessId)

    if (error) return res.status(500).json({ error: error.message })

    // flatten here
    const flattened = data.map(mi => ({
        id_menu_item: mi.id_menu_item,
        price: mi.price,
        created_at: mi.created_at,
        item_name: mi.products.name,
        producent: mi.products.brand,
        category: mi.products.categories.category_name,
        subcategory: mi.products.subcategories?.subcat_name ?? '',
        floor_price: mi.products.floor_price,
        low_price: mi.products.low_price,
        high_price: mi.products.high_price,
        ceiling_price: mi.products.ceiling_price
    }))

    res.json(flattened)
})


// finally start the server
app.listen(3007, () => {
    console.log('Server running on http://localhost:3007');
});

app.delete('/api/menu-items/:id', isAuthenticated, async (req, res) => {
    const businessId = req.session.user.id;
    const menuItemId = Number(req.params.id);

    try {
        // 1) delete sales
        const { error: salesErr } = await supabase
            .from('sales')
            .delete()
            .eq('menu_item_id', menuItemId);

        if (salesErr) {
            console.error('Supabase sales delete error:', salesErr);
            return res.status(500).json({ error: 'Failed deleting sales' });
        }

        // 2) delete menu_item
        const { error: itemErr, count } = await supabase
            .from('menu_items')
            .delete({ count: 'exact' }) // vraag meteen 'count' op
            .match({ id_menu_item: menuItemId, business_id: businessId });

        if (itemErr) {
            console.error('Supabase menu_items delete error:', itemErr);
            return res.status(500).json({ error: 'Failed deleting menu item' });
        }
        if (count === 0) {
            return res.status(404).json({ error: 'Item not found or no rights' });
        }

        return res.json({ success: true });
    } catch (err) {
        console.error('Unexpected error:', err);
        return res.status(500).json({ error: 'Server error' });
    }
});

// Update prijzen van menu_items via Supabase
app.patch('/api/menu-items', isAuthenticated, async (req, res) => {
    const businessId = req.session.user.id;
    const updates    = req.body.updates; // array van { id_menu_item, price }

    if (!Array.isArray(updates)) {
        return res.status(400).json({ error: 'Invalid payload' });
    }

    try {
        // loop door alle updates en doe een Supabase update per item
        for (let { id_menu_item, price } of updates) {
            const { error } = await supabase
                .from('menu_items')
                .update({ price })
                .match({ id_menu_item, business_id: businessId });

            if (error) {
                console.error('Supabase update error for', id_menu_item, error);
                throw error;
            }
        }
        res.json({ success: true });
    } catch (err) {
        return res.status(500).json({ error: 'Failed updating prices' });
    }
});



// Haal alle bestaande products op (voor autocomplete) via Supabase
app.get('/api/products', isAuthenticated, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('id_product, name, brand, id_category, id_subcategory, low_price, high_price')
            .order('name', { ascending: true })

        if (error) {
            console.error('Supabase fetch error:', error)
            return res.status(500).json({ error: 'Database error' })
        }

        res.json(data)
    } catch (err) {
        console.error('Unexpected error fetching products:', err)
        res.status(500).json({ error: 'Server error' })
    }
})

// 2. Haal alle categories op (dropdown) via Supabase
app.get('/api/categories', isAuthenticated, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('categories')
            .select('id_category, category_name')
            .order('category_name', { ascending: true })

        if (error) {
            console.error('Supabase fetch error (categories):', error)
            return res.status(500).json({ error: 'Database error' })
        }

        res.json(data)
    } catch (err) {
        console.error('Unexpected error fetching categories:', err)
        res.status(500).json({ error: 'Server error' })
    }
})

// 3. Haal alle subcategories op (dropdown) via Supabase
app.get('/api/subcategories', isAuthenticated, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('subcategories')
            .select('id_subcat, id_category, subcat_name')
            .order('subcat_name', { ascending: true })

        if (error) {
            console.error('Supabase fetch error (subcategories):', error)
            return res.status(500).json({ error: 'Database error' })
        }

        res.json(data)
    } catch (err) {
        console.error('Unexpected error fetching subcategories:', err)
        res.status(500).json({ error: 'Server error' })
    }
})


// 4. Voeg een nieuw menu_item toe via Supabase
app.post('/api/menu-items', isAuthenticated, async (req, res) => {
    const businessId = req.session.user.id
    const { product_id, price } = req.body

    try {
        const { data, error } = await supabase
            .from('menu_items')
            .insert([{
                business_id: businessId,
                product_id,
                price
            }])
            .select('id_menu_item')
            .single()

        if (error) {
            console.error('Supabase insert error (menu_items):', error)
            return res.status(500).json({ error: 'Database error' })
        }

        res.json({ success: true, insertId: data.id_menu_item })
    } catch (err) {
        console.error('Unexpected error inserting menu_item:', err)
        res.status(500).json({ error: 'Server error' })
    }
})



// ===== server.js =====
app.get('/api/sales', isAuthenticated, async (req, res) => {
    const businessId = req.session.user.id;

    try {
        const { data: mItems, error } = await supabase
            .from('menu_items')
            .select(`
        id_menu_item,
        price,
        created_at,
        products!inner(
          name,
          brand,
          production_city,
          production_country,
          is_trending,
          is_high_margin,
          eco_friendly,
          season,
          categories!inner(category_name),
          subcategories(subcat_name)
        ),
        sales(sold_at)
      `)
            .eq('business_id', businessId);

        if (error) {
            console.error('Supabase fetch error (menu_items with sales):', error);
            return res.status(500).json({ error: 'Database error' });
        }

        const stats = mItems.map(mi => {
            const prod = mi.products;
            const cat  = prod.categories;
            const sub  = prod.subcategories;  // kan undefined zijn

            const thisYear = mi.sales.filter(s =>
                s.sold_at >= '2025-01-01' && s.sold_at <= '2025-12-31'
            ).length;

            const lastYear = mi.sales.filter(s =>
                s.sold_at >= '2024-01-01' && s.sold_at <= '2024-12-31'
            ).length;

            return {
                id_menu_item:   mi.id_menu_item,
                item_name:      prod.name,
                producent:      prod.brand,
                category:       cat.category_name,
                subcategory:    sub?.subcat_name ?? '',
                price:          mi.price,
                created_at:     mi.created_at,
                total_sold:     thisYear,
                last_year_sold: lastYear,
                is_trending:    prod.is_trending,
                is_high_margin: prod.is_high_margin,
                eco_friendly:   prod.eco_friendly,
                season:         prod.season,
                prodCity:       prod.production_city,
                prodCountry:    prod.production_country
            };
        });

        res.json(stats);
    } catch (err) {
        console.error('Unexpected error in /api/sales:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/business-info', isAuthenticated, async (req, res) => {
    const businessId = req.session.user.id;

    try {
        // 1) Haal het adres op uit Supabase
        const { data: row, error } = await supabase
            .from('business_info')
            .select('address')
            .eq('id', businessId)
            .single();

        if (error) {
            console.error('Supabase fetch error (business-info):', error);
            return res.status(500).json({ error: 'Database error' });
        }
        if (!row) {
            return res.status(404).json({ error: 'Business not found' });
        }

        // 2) Pars het adres naar city + country
        const address = row.address || '';
        const parts = address.split(',').map(s => s.trim());
        const city = parts.length > 1 ? parts[parts.length - 1] : '';
        // land niet apart opgeslagen, dus leeg teruggeven
        res.json({ city, country: '' });

    } catch (err) {
        console.error('Unexpected error in /api/business-info:', err);
        res.status(500).json({ error: 'Server error' });
    }
});


app.get('/api/sales/last-year', isAuthenticated, async (req, res) => {
    const businessId = req.session.user.id;
    // bepaal dynamisch vorig jaar
    const lastYear = new Date().getFullYear() - 1;
    const start = `${lastYear}-01-01`;
    const end   = `${lastYear}-12-31`;

    try {
        // 1) Haal alle menu_items op inclusief geneste product- en sales-info
        const { data: mItems, error } = await supabase
            .from('menu_items')
            .select(`
        id_menu_item,
        price,
        created_at,
        products!inner(
          id_category,
          name,
          brand,
          production_country,
          production_city,
          is_trending,
          is_high_margin,
          eco_friendly,
          season,
          categories!inner(category_name),
          subcategories!inner(subcat_name)
        ),
        sales(sold_at)
      `)
            .eq('business_id', businessId);

        if (error) {
            console.error('Supabase fetch error (last-year sales):', error);
            return res.status(500).json({ error: 'Database error' });
        }

        // 2) Tel per menu_item de verkopen in dat jaar
        const stats = mItems.map(mi => {
            const prod = mi.products;
            const cat  = prod.categories;
            const sub  = prod.subcategories;

            // filter op sold_at tussen start en end
            const total_sold = (mi.sales || [])
                .filter(s => s.sold_at >= start && s.sold_at <= end)
                .length;

            return {
                id_menu_item:    mi.id_menu_item,
                id_category:     prod.id_category,
                item_name:       prod.name,
                producent:       prod.brand,
                category:        cat.category_name,
                subcategorie:    sub?.subcat_name ?? '',
                price:           mi.price,
                created_at:      mi.created_at,
                land:            prod.production_country,
                stad:            prod.production_city,
                total_sold,
                is_trending:     prod.is_trending,
                is_high_margin:  prod.is_high_margin,
                eco_friendly:    prod.eco_friendly,
                season:          prod.season ?? 'Unknown'
            };
        });

        // 3) sorteer op id_menu_item
        stats.sort((a, b) => a.id_menu_item - b.id_menu_item);

        res.json(stats);

    } catch (err) {
        console.error('Unexpected error in /api/sales/last-year:', err);
        res.status(500).json({ error: 'Server error' });
    }
});


app.get('/api/items-not-on-menu', isAuthenticated, async (req, res) => {
    const businessId = req.session.user.id;

    try {
        // 1) Haal alle product_id’s op die al in menu_items staan voor deze business
        const { data: menuItems, error: miError } = await supabase
            .from('menu_items')
            .select('product_id')
            .eq('business_id', businessId);

        if (miError) {
            console.error('Supabase fetch error (menu_items):', miError);
            return res.status(500).json({ error: 'Database error fetching menu items' });
        }

        // Pak alle IDs in een array
        const takenIds = menuItems.map(mi => mi.product_id);

        // 2) Haal alle products op wíe niet in die lijst zitten, mét hun category via de foreign key
        const { data: products, error: pError } = await supabase
            .from('products')
            .select(`
        id_product,
        name,
        brand,
        production_city,
        production_country,
        is_trending,
        is_high_margin,
        eco_friendly,
        season,
        low_price,
        high_price,
        categories!inner(category_name)
      `)
            // filter op producten die NIET in takenIds zitten
            .not('id_product', 'in', `(${takenIds.join(',')})`)
            .order('name', { ascending: true });

        if (pError) {
            console.error('Supabase fetch error (products):', pError);
            return res.status(500).json({ error: 'Database error fetching products' });
        }

        // 3) flatten de category join en stuur terug
        const flattened = products.map(p => ({
            id:           p.id_product,
            id_product:   p.id_product,
            name:         p.name,
            brand:        p.brand,
            category:     p.categories.category_name,
            prodCity:     p.production_city,
            prodCountry:  p.production_country,
            is_trending:  p.is_trending,
            is_high_margin: p.is_high_margin,
            eco_friendly: p.eco_friendly,
            season:       p.season,
            low_price:    p.low_price,
            high_price:   p.high_price,
        }));

        res.json(flattened);

    } catch (err) {
        console.error('Unexpected error in /api/items-not-on-menu:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/menu-counts', isAuthenticated, async (req, res) => {
    const businessId = req.session.user.id;

    try {
        // 1) Haal alle menu_items op mét hun category_name via een nested select
        const { data: items, error } = await supabase
            .from('menu_items')
            .select(`
        id_menu_item,
        products!inner(
          categories!inner(category_name)
        )
      `)
            .eq('business_id', businessId);

        if (error) {
            console.error('Supabase fetch error (menu-counts):', error);
            return res.status(500).json({ error: 'Database error' });
        }

        // 2) Groepeer in JS per category_name
        const countsMap = items.reduce((acc, mi) => {
            const cat = mi.products.categories.category_name;
            acc[cat] = (acc[cat] || 0) + 1;
            return acc;
        }, {});

        // 3) Zet om naar array en sorteer op categorie-naam
        const results = Object.entries(countsMap)
            .map(([category, count_on_menu]) => ({ category, count_on_menu }))
            .sort((a, b) => a.category.localeCompare(b.category));

        res.json(results);

    } catch (err) {
        console.error('Unexpected error in /api/menu-counts:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

const OpenAI = require('openai');
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});


app.post('/api/describe-item', async (req, res) => {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "Missing items array" });
    }

    try {
        // Bouw één gecombineerde prompt
        const prompt = `Geef een aantrekkelijke en korte beschrijving (max 12 woorden) van elk van de volgende drankjes voor op een menukaart:\n\n` +
            items.map((item, idx) =>
                `${idx + 1}. ${item.name} (${item.category})`
            ).join('\n');

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 150,
            temperature: 0.7,
        });

        const text = response.choices[0]?.message?.content?.trim();

        // Probeer op te splitsen in aparte regels
        const lines = text.split('\n').filter(Boolean);
        const descriptions = lines.map(line => line.replace(/^\d+\.\s*/, ''));

        // Koppel terug aan de originele items
        const result = items.map((item, idx) => ({
            name: item.name,
            description: descriptions[idx] || `Een ${item.category.toLowerCase()} die je menu verrijkt.`
        }));

        res.json({ result });
    } catch (err) {
        console.error("AI-generatie mislukt:", err.message);
        res.status(500).json({ error: "AI-generatie mislukt" });
    }
});

app.get('/api/sales/last-90-days', isAuthenticated, async (req, res) => {
    const businessId = req.session.user.id;

    try {
        const { data: mItems, error } = await supabase
            .from('menu_items')
            .select(`
                id_menu_item,
                price,
                created_at,
                products!inner(
                    name,
                    brand,
                    categories!inner(category_name)
                ),
                sales(sold_at)
            `)
            .eq('business_id', businessId);

        if (error) {
            console.error('Supabase fetch error (last-90-days):', error);
            return res.status(500).json({ error: 'Database error' });
        }

        // Zoek laatste verkoopdatum
        const allDates = mItems.flatMap(mi => mi.sales.map(s => new Date(s.sold_at)));
        const latestDate = new Date(Math.max(...allDates));
        const cutoffDate = new Date(latestDate);
        cutoffDate.setDate(cutoffDate.getDate() - 90);

        const results = mItems.map(mi => {
            const category = mi.products.categories?.category_name || '';
            const salesCount = mi.sales.filter(s => {
                const date = new Date(s.sold_at);
                return date >= cutoffDate && date <= latestDate;
            }).length;

            return {
                id_menu_item: mi.id_menu_item,
                name:         mi.products.name,
                brand:        mi.products.brand,
                category,
                total_sold:   salesCount
            };
        });

        res.json(results);
    } catch (err) {
        console.error('Unexpected error in /api/sales/last-90-days:', err);
        res.status(500).json({ error: 'Server error' });
    }
});


app.get('/api/sales/growth', isAuthenticated, async (req, res) => {
    const businessId = req.session.user.id;

    try {
        const { data: mItems, error } = await supabase
            .from('menu_items')
            .select(`
                id_menu_item,
                price,
                products!inner(name, brand),
                sales(sold_at)
            `)
            .eq('business_id', businessId);

        if (error) {
            console.error('Supabase fetch error (growth):', error);
            return res.status(500).json({ error: 'Database error' });
        }

        const stats = mItems.map(mi => {
            const sales2025 = mi.sales.filter(s =>
                s.sold_at >= '2025-01-01' && s.sold_at <= '2025-12-31'
            ).length;

            const sales2024 = mi.sales.filter(s =>
                s.sold_at >= '2024-01-01' && s.sold_at <= '2024-12-31'
            ).length;

            const diff = sales2025 - sales2024;
            const pct = sales2024 === 0 ? (sales2025 > 0 ? 100 : 0) : ((diff / sales2024) * 100);

            return {
                id_menu_item: mi.id_menu_item,
                name: mi.products.name,
                brand: mi.products.brand,
                sold_2025: sales2025,
                sold_2024: sales2024,
                growth_abs: diff,
                growth_pct: pct.toFixed(1)
            };
        });

        res.json(stats);
    } catch (err) {
        console.error('Unexpected error in /api/sales/growth:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/price-comparison', isAuthenticated, async (req, res) => {
    try {
        const userId = req.session.user.id;

        // 1. Haal alle menu items van de huidige zaak op
        const { data: ownItems, error: ownError } = await supabase
            .from('menu_items')
            .select('product_id, price, products(name)')
            .eq('business_id', userId);

        if (ownError) throw ownError;

        // 2. Haal alle menu items van andere zaken op
        const { data: others, error: othersError } = await supabase
            .from('menu_items')
            .select('product_id, price')
            .neq('business_id', userId);

        if (othersError) throw othersError;

        // 3. Bereken gemiddelde prijs per product_id in JS
        const avgByProduct = {};
        const countByProduct = {};

        others.forEach(({ product_id, price }) => {
            if (!avgByProduct[product_id]) {
                avgByProduct[product_id] = 0;
                countByProduct[product_id] = 0;
            }
            avgByProduct[product_id] += price;
            countByProduct[product_id] += 1;
        });

        // 4. Maak array met vergelijking
        const comparisons = ownItems
            .map(({ product_id, price, products }) => {
                const avg = avgByProduct[product_id] / countByProduct[product_id];
                if (!avg) return null; // geen data bij andere zaken

                const diff = (price - avg);
                return {
                    name: products?.name || 'Onbekend product',
                    price: price.toFixed(2),
                    avg_price: avg.toFixed(2),
                    difference: diff,
                    comparison: diff >= 0
                        ? `+ €${diff.toFixed(2).replace('.', ',')}`
                        : `- €${Math.abs(diff).toFixed(2).replace('.', ',')}`
                };
            })
            .filter(Boolean);

        // 5. Sorteer op verschil
        const sorted = comparisons.sort((a, b) => Math.abs(b.difference) - Math.abs(a.difference));

        res.json(sorted.slice(0, 10)); // top 10 verschillen
    } catch (err) {
        console.error("Serverfout /api/price-comparison:", err);
        res.status(500).json({ error: 'Server error' });
    }
});

