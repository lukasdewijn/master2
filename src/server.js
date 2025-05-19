// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const session = require('express-session');
const bcrypt = require('bcryptjs');

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

// MySQL connectie
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
db.connect(err => {
    if (err) {
        console.error('Failed to connect to MySQL:', err);
        process.exit(1);
    }
    console.log('Connected to MySQL database!');
});

// Onboarding (register business)
app.post('/api/complete-onboarding', (req, res) => {
    const {
        manager_first_name,
        manager_last_name,
        horeca_name,
        address,
        phonenumber,
        email,
        password
    } = req.body;

    // hash het wachtwoord
    const hashed = bcrypt.hashSync(password, 10);

    const sql = `
    INSERT INTO business_info
      (manager_first_name, manager_last_name, horeca_name, address, phone_number, email, password)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
    const params = [
        manager_first_name,
        manager_last_name,
        horeca_name,
        address,
        phonenumber,
        email,
        hashed
    ];

    db.query(sql, params, (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ success: true, insertedId: result.insertId });
    });
});

// Login endpoint
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    const sql = 'SELECT * FROM business_info WHERE email = ?';
    db.query(sql, [email], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        if (results.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const user = results[0];
        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // ✔ Sessiestore vullen
        req.session.user = {
            id: user.id,
            email: user.email,
            horeca_name: user.horeca_name,
            manager_first_name: user.manager_first_name,
            manager_last_name: user.manager_last_name
        };

        // Retourneer alleen wat de client nodig heeft
        res.json({
            success: true,
            business_id: user.id,
            horeca_name: user.horeca_name
        });
    });
});

// Middleware: sessie check
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    res.status(401).json({ error: 'Not authenticated' });
}

// Optioneel: endpoint om client de ingelogde gebruiker terug te geven
app.get('/api/user', isAuthenticated, (req, res) => {
    res.json({ user: req.session.user });
});

// Menu-items ophalen voor de ingelogde zaak
app.get('/api/menu-items', isAuthenticated, (req, res) => {
    const businessId = req.session.user.id;

    const sql = `
    SELECT
      mi.id_menu_item,
      mi.product_id,
      p.name          AS item_name,
      p.brand         AS producent,
      c.category_name AS category,
      sc.subcat_name  AS subcategory,
      mi.price,
      mi.created_at
    FROM menu_items mi
    JOIN products       p   ON mi.product_id     = p.id_product
    JOIN categories     c   ON p.id_category     = c.id_category
    LEFT JOIN subcategories sc ON p.id_subcategory = sc.id_subcat
    WHERE mi.business_id = ?
    ORDER BY mi.id_menu_item
  `;

    db.query(sql, [businessId], (err, results) => {
        if (err) {
            console.error('Fout bij ophalen menu_items:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

app.patch('/api/menu-items', isAuthenticated, (req, res) => {
    const businessId = req.session.user.id;
    const updates     = req.body.updates; // [ { id_menu_item, price }, … ]

    if (!Array.isArray(updates)) {
        return res.status(400).json({ error: 'Invalid payload' });
    }

    const sql = `
    UPDATE menu_items
       SET price = ?
     WHERE id_menu_item = ?
       AND business_id = ?
  `;
    let errored = false;

    updates.forEach(({ id_menu_item, price }) => {
        db.query(sql, [price, id_menu_item, businessId], err => {
            if (err) {
                console.error('Failed update', id_menu_item, err);
                errored = true;
            }
        });
    });

    if (errored) {
        return res.status(500).json({ error: 'Some updates failed' });
    }
    res.json({ success: true });
});

// finally start the server
app.listen(3007, () => {
    console.log('Server running on http://localhost:3007');
});

// DELETE één menu-item
app.delete('/api/menu-items/:id', isAuthenticated, (req, res) => {
    const businessId   = req.session.user.id;
    const menuItemId   = Number(req.params.id);

    const sql = `
    DELETE FROM menu_items
    WHERE id_menu_item = ?
      AND business_id  = ?
  `;
    db.query(sql, [menuItemId, businessId], (err, result) => {
        if (err) {
            console.error('Fout bij verwijderen menu_item:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Item niet gevonden of geen rechten' });
        }
        res.json({ success: true });
    });
});

// 1. Haal alle bestaande products op (voor autocomplete)
app.get('/api/products', isAuthenticated, (req, res) => {
    const sql = `
    SELECT id_product, name, brand, id_category, id_subcategory
    FROM products
    ORDER BY name
  `;
    db.query(sql, (err, rows) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(rows);
    });
});

// 2. Haal alle categories op (dropdown)
app.get('/api/categories', isAuthenticated, (req, res) => {
    db.query(
        'SELECT id_category, category_name FROM categories ORDER BY category_name',
        (err, rows) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json(rows);
        }
    );
});

// 3. Haal alle subcategories op (dropdown, filter je later client-side)
app.get('/api/subcategories', isAuthenticated, (req, res) => {
    db.query(
        'SELECT id_subcat, id_category, subcat_name FROM subcategories ORDER BY subcat_name',
        (err, rows) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json(rows);
        }
    );
});

// 4. Voeg een nieuw menu_item toe
app.post('/api/menu-items', isAuthenticated, (req, res) => {
    const businessId = req.session.user.id;
    const { product_id, price } = req.body;
    const sql = `
    INSERT INTO menu_items (business_id, product_id, price)
    VALUES (?, ?, ?)
  `;
    db.query(sql, [businessId, product_id, price], (err, result) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ success: true, insertId: result.insertId });
    });
});
