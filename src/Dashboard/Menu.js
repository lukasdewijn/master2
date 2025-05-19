// src/Menu.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Menu.css';

const Menu = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [loading,    setLoading]   = useState(true);
    const [error,      setError]     = useState(null);

    // editMode and a map of draft prices
    const [editMode,   setEditMode]  = useState(false);
    const [priceMap,   setPriceMap]  = useState({});

    // fetch menu
    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const res = await axios.get('http://localhost:3007/api/menu-items', {
                    withCredentials: true
                });
                setMenuItems(res.data);
            } catch (err) {
                console.error(err);
                setError('Kon menu‐items niet laden');
            } finally {
                setLoading(false);
            }
        };
        fetchMenu();
    }, []);

    // whenever we enter editMode, seed priceMap from fetched items
    useEffect(() => {
        if (editMode) {
            const m = {};
            menuItems.forEach(i => {
                m[i.id_menu_item] = i.price;
            });
            setPriceMap(m);
        }
    }, [editMode, menuItems]);

    if (loading) return <p>Loading menu…</p>;
    if (error)   return <p className="error">{error}</p>;

    // handler for changing an input
    const handlePriceChange = (id, raw) => {
        const v = parseFloat(raw);
        if (!isNaN(v)) {
            setPriceMap(pm => ({ ...pm, [id]: v }));
        } else {
            setPriceMap(pm => ({ ...pm, [id]: raw }));
        }
    };

    // Voeg bovenin je component toe:
    const handleCancel = () => {
        setEditMode(false);
        setPriceMap({});
    };

    // Confirm → send updates
    const handleSave = async () => {
        const updates = Object.entries(priceMap)
            .map(([id, price]) => ({
                id_menu_item: Number(id),
                price: Number(price)
            }));
        try {
            await axios.patch(
                'http://localhost:3007/api/menu-items',
                { updates },
                { withCredentials: true }
            );
            // on success, reload fresh data and exit editMode
            const res = await axios.get('http://localhost:3007/api/menu-items', { withCredentials: true });
            setMenuItems(res.data);
            setEditMode(false);
        } catch (err) {
            console.error('Kon prijzen niet opslaan:', err);
            alert('Er ging iets mis bij updaten');
        }
    };

    // group by category
    const grouped = menuItems.reduce((acc, item) => {
        acc[item.category] = acc[item.category] || [];
        acc[item.category].push(item);
        return acc;
    }, {});

    return (
        <div className="menu-container">
            <div className="menu-header">
                {!editMode ? (
                    <button
                        className="edit-save-btn"
                        onClick={() => setEditMode(true)}
                    >
                        Edit
                    </button>
                ) : (
                    <>
                        <button
                            className="edit-save-btn"
                            onClick={handleSave}
                        >
                            Confirm
                        </button>
                        <button
                            className="edit-cancel-btn"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                    </>
                )}
            </div>
            <div className="menu-list-container">
                {Object.entries(grouped).map(([category, items]) => (
                    <section key={category} className="menu-section">
                        <h3 className="menu-category">{category}</h3>

                        <ul className="menu-list">
                            {items.map(i => (
                                <li key={i.id_menu_item} className="menu-item">
                                    <div className="item-name">{i.item_name}</div>
                                    <div className="item-brand">{i.producent}</div>
                                    <div className="item-price">
                                        {editMode
                                            ? (
                                                <div className="price-input-wrapper">
                                                    <span className="currency-symbol">€</span>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        className="menu-item-input"
                                                        value={priceMap[i.id_menu_item]}
                                                        onChange={e => handlePriceChange(i.id_menu_item, e.target.value)}
                                                    />
                                                </div>
                                            )
                                            : `€${ Number(i.price).toFixed(2) }`
                                        }
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>
                ))}
            </div>

        </div>
    );
};

export default Menu;
