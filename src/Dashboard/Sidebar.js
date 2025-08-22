// Sidebar.js
import React from 'react';
import './Sidebar.css';

const Sidebar = ({ onSelectionChange, selectedOption }) => {
    const handleClick = (id) => {
        onSelectionChange(id);
    };

    return (
        <nav className="sidebar">
            <div className="sidebar-header">Billy</div>
            <ul className="sidebar-list">
                <li
                    className={`sidebar-list-item ${selectedOption === 'stats' ? 'active' : ''}`}
                    onClick={() => handleClick('stats')}
                >
                    Stats
                </li>
                <li
                    className={`sidebar-list-item ${selectedOption === 'wrapped' ? 'active' : ''}`}
                    onClick={() => handleClick('wrapped')}
                >
                    Wrapped
                </li>
                <li
                    className={`sidebar-list-item ${selectedOption === 'to-add' ? 'active' : ''}`}
                    onClick={() => handleClick('to-add')}
                >
                    To add
                </li>
                <li
                    className={`sidebar-list-item ${selectedOption === 'to-remove' ? 'active' : ''}`}
                    onClick={() => handleClick('to-remove')}
                >
                    To remove
                </li>
                <li
                    className={`sidebar-list-item ${selectedOption === 'to-reprice' ? 'active' : ''}`}
                    onClick={() => handleClick('to-reprice')}
                >
                    To reprice
                </li>
                <li
                    className={`sidebar-list-item ${selectedOption === 'edit-menu' ? 'active' : ''}`}
                    onClick={() => handleClick('edit-menu')}
                >
                    Edit menu
                </li>
            </ul>
            <div className="sidebar-footer">Footer Content</div>
        </nav>
    );
};

export default Sidebar;
