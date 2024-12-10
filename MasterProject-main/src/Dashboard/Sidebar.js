import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar = ({ onSelectionChange }) => {
    const [openMenu, setOpenMenu] = useState(null); // Track which menu is open
    const [selectedItem, setSelectedItem] = useState(null); // Track the selected sub-item

    // Define shared subitems
    const sharedSubItems = [
        { name: 'Top & worst sellers', id: 'top-worst-sellers' },
        { name: 'Gainers & losers', id: 'gainers-losers' },
        { name: 'Trending', id: 'trending' },
        { name: 'Hot for season', id: 'hot-for-season' },
        { name: 'Promotions', id: 'promotions' },
        { name: 'Price comparison', id: 'price-comparison' },
        { name: 'Price optimisation', id: 'price-optimisation' },
        { name: 'Segment sizes', id: 'segment-sizes' },
    ];

    // Use shared subitems for all main menu items
    const menuItems = [
        { name: 'Soft drinks', id: 'soft-drinks', subItems: sharedSubItems },
        { name: 'Hot drinks', id: 'hot-drinks', subItems: sharedSubItems },
        { name: 'Cocktail', id: 'cocktail', subItems: sharedSubItems },
        { name: 'Beer', id: 'beer', subItems: sharedSubItems },
        { name: 'Meals', id: 'meals', subItems: sharedSubItems },
    ];

    const toggleMenu = (index, menuId) => {
        setOpenMenu((prevIndex) => (prevIndex === index ? null : index));
    };

    const handleSubItemClick = (menuId, subItemId) => {
        setSelectedItem({ menuId, subItemId });
        onSelectionChange({ menuId, subItemId }); // Notify parent component of selection change
    };

    return (
        <nav className="sidebar">
            {/* Header */}
            <div className="sidebar-header">Billy</div>

            {/* Menu */}
            <ul className="menu">
                {menuItems.map((item, index) => (
                    <li key={index} className="menu-item">
                        {item.subItems ? (
                            <>
                                {/* Parent menu toggle */}
                                <button
                                    className="menu-toggle"
                                    onClick={() => toggleMenu(index, item.id)}
                                >
                                    {item.name}
                                    <span className="arrow">
                                        {openMenu === index ? 'v' : '>'}
                                    </span>
                                </button>

                                {/* Submenu logic */}
                                {openMenu === index ? (
                                    <ul className="submenu">
                                        {item.subItems.map((subItem, subIndex) => (
                                            <li
                                                key={subIndex}
                                                className={`submenu-item ${
                                                    selectedItem?.menuId === item.id &&
                                                    selectedItem?.subItemId === subItem.id
                                                        ? 'active'
                                                        : ''
                                                }`}
                                                onClick={() =>
                                                    handleSubItemClick(item.id, subItem.id)
                                                }
                                            >
                                                {subItem.name}
                                            </li>
                                        ))}
                                    </ul>
                                ) : selectedItem?.menuId === item.id ? (
                                    <ul className="submenu collapsed">
                                        {/* Only show the active subitem */}
                                        <li className="submenu-item active">
                                            {
                                                item.subItems.find(
                                                    (subItem) =>
                                                        subItem.id === selectedItem.subItemId
                                                )?.name
                                            }
                                        </li>
                                    </ul>
                                ) : null}
                            </>
                        ) : (
                            <a href={item.path}>{item.name}</a>
                        )}
                    </li>
                ))}
            </ul>

            {/* Footer */}
            <div className="sidebar-footer">Footer Content</div>
        </nav>
    );
};

export default Sidebar;
