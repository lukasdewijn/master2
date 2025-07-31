// src/Menu.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Menu.css';

const Menu = () => {
    // bestaande state
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [priceMap, setPriceMap] = useState({});
    const [toDelete, setToDelete] = useState(new Set());

    // state voor “add form”
    const [productsList, setProductsList] = useState([]);
    const [newItem, setNewItem] = useState({
        productId: '',
        name: '',
        brand: '',
        price: ''
    });

    // 1) initial load menu + products
    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [menuRes, prodRes] = await Promise.all([
                    axios.get('http://localhost:3007/api/menu-items',    { withCredentials: true }),
                    axios.get('http://localhost:3007/api/products',      { withCredentials: true })
                ]);
                setMenuItems(menuRes.data);
                const mappedProducts = prodRes.data.map(p => ({
                    ...p,
                    recommendedPrice: (p.low_price && p.high_price) ? (p.low_price + p.high_price) / 2 : null
                }));
                setProductsList(mappedProducts);

            } catch (err) {
                console.error(err);
                setError('Kon data niet laden');
            } finally {
                setLoading(false);
            }
        }
        fetchAll();
    }, []);

    // 2) seed priceMap & reset deletions bij editMode
    useEffect(() => {
        if (editMode) {
            const m = {};
            menuItems.forEach(i => m[i.id_menu_item] = i.price);
            setPriceMap(m);
            setToDelete(new Set());
        }
    }, [editMode, menuItems]);

    if (loading) return <p>Loading…</p>;
    if (error)   return <p className="error">{error}</p>;

    // handlers
    const handlePriceChange = (id, raw) => {
        const v = parseFloat(raw);
        setPriceMap(pm => ({ ...pm, [id]: isNaN(v) ? raw : v }));
    };
    const toggleDelete = id => {
        setToDelete(td => {
            const nxt = new Set(td);
            nxt.has(id) ? nxt.delete(id) : nxt.add(id);
            return nxt;
        });
    };
    const handleCancel = () => {
        setEditMode(false);
        setPriceMap({});
        setToDelete(new Set());
        setNewItem({ productId:'', name:'', brand:'', price:'' });
    };

    // 3) Confirm = eerst DELETE, dan PATCH prijzen
    const handleSave = async () => {
        try {
            // verwijder gemarkeerde items
            for (let id of toDelete) {
                await axios.delete(
                    `http://localhost:3007/api/menu-items/${id}`,
                    { withCredentials: true }
                );
            }
            // update prijzen
            const updates = Object.entries(priceMap)
                .filter(([id]) => !toDelete.has(Number(id)))
                .map(([id, price]) => ({
                    id_menu_item: Number(id),
                    price:        Number(price)
                }));
            if (updates.length) {
                await axios.patch(
                    'http://localhost:3007/api/menu-items',
                    { updates },
                    { withCredentials: true }
                );
            }
            // opnieuw inladen
            const res = await axios.get('http://localhost:3007/api/menu-items', { withCredentials: true });
            setMenuItems(res.data);
            setEditMode(false);
            setToDelete(new Set());
        } catch (err) {
            console.error(err);
            alert('Opslaan mislukt');
        }
    };

    // 4) Nieuwe item toevoegen
    const handleAdd = async e => {
        e.preventDefault();
        try {
            await axios.post(
                'http://localhost:3007/api/menu-items',
                {
                    product_id: newItem.productId,
                    price:      Number(newItem.price)
                },
                { withCredentials: true }
            );
            localStorage.removeItem("wrapped_hot_items");
            localStorage.removeItem("wrapped_next_season");
            const res = await axios.get('http://localhost:3007/api/menu-items', { withCredentials: true });
            setMenuItems(res.data);
            setNewItem({ productId:'', name:'', brand:'', price:'' });
        } catch (err) {
            console.error(err);
            alert('Toevoegen mislukt');
        }
    };

    // groepeer per category
    const grouped = menuItems.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
    }, {});

    return (
        <div className="menu-container">
            {/* ─────── Existing menu ─────── */}
            <div className="menu-header">
                {!editMode ? (
                    <button className="edit-save-btn" onClick={() => setEditMode(true)}>
                        Edit
                    </button>
                ) : (
                    <>
                        <button className="edit-save-btn" onClick={handleSave}>
                            Confirm
                        </button>
                        <button className="edit-cancel-btn" onClick={handleCancel}>
                            Cancel
                        </button>
                    </>
                )}
            </div>
            {/* ────── Add-form (ENKEL als editMode) ────── */}
            {editMode && (
                <form className="add-form" onSubmit={handleAdd}>
                    <h2> Add item: </h2>
                    <input
                        list="products-dl"
                        placeholder="Item naam…"
                        value={newItem.name}
                        onChange={e => {
                            const val = e.target.value;
                            setNewItem(ni => ({...ni, name: val}));
                            const match = productsList.find(p => p.name === val);
                            if (match) {
                                setNewItem(ni => ({
                                    ...ni,
                                    productId: match.id_product,
                                    brand: match.brand
                                }));
                            } else {
                                setNewItem(ni => ({...ni, productId: '', brand: ''}));
                            }
                        }}
                        required
                    />

                    <datalist id="products-dl">  {productsList.map(p => (
                        <option
                            key={p.id_product}
                            value={p.name}
                            // you can also include a label attribute if you want the brand in the dropdown UI
                            label={p.brand}
                        />
                    ))}
                    </datalist>

                    <input
                        type="text"
                        placeholder="Brand"
                        value={newItem.brand}
                        readOnly
                    />

                    <input
                        type="number"
                        step="0.01"
                        placeholder="Prijs"
                        value={newItem.price}
                        onChange={e => setNewItem(ni => ({...ni, price: e.target.value}))}
                        required
                    />

                    {newItem.productId && (
                        <p className="recommended-price">
                            (Aanbevolen prijs: €{(productsList.find(p => p.id_product === newItem.productId)?.recommendedPrice ?? 'n/a')?.toFixed?.(2)})
                        </p>
                    )}

                    <button type="submit" className="add-btn">
                        Voeg toe
                    </button>
                </form>
            )}


            <div className="menu-list-container"
                 style={{
                     maxHeight: editMode
                         ? 'calc(100vh - 17rem)'   // iets kleiner wanneer je het add-form + knoppen ziet
                         : 'calc(100vh - 11rem)'   // de originele hoogte
                 }}>

                {Object.entries(grouped).map(([category, items]) => (
                    <section key={category} className="menu-section">
                        <h3 className="menu-category">{category}</h3>
                        <ul className="menu-list">
                            {items.map(i => {
                                if (editMode && toDelete.has(i.id_menu_item)) return null;
                                return (
                                    <li key={i.id_menu_item} className="menu-item">
                                        {editMode && (
                                            <button
                                                className="delete-marker"
                                                onClick={() => toggleDelete(i.id_menu_item)}
                                                title="Verwijder dit item"
                                            >
                                                ×
                                            </button>
                                        )}
                                        <div className="item-name">{i.item_name}</div>
                                        <div className="item-brand">{i.producent}</div>
                                        <div className="item-price">
                                            {editMode ? (
                                                <div className="price-input-wrapper">
                                                    <span className="currency-symbol">€</span>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        className="menu-item-input"
                                                        value={priceMap[i.id_menu_item] ?? ''}
                                                        onChange={e =>
                                                            handlePriceChange(i.id_menu_item, e.target.value)
                                                        }
                                                    />
                                                </div>
                                            ) : (
                                                `€${Number(i.price).toFixed(2)}`
                                            )}
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </section>
                ))}
            </div>
        </div>
    );
};

export default Menu;
