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
            <ul className="menu">
                <li
                    className={`menu-item ${selectedOption === 'stats' ? 'active' : ''}`}
                    onClick={() => handleClick('stats')}
                >
                    Stats
                </li>
                <li
                    className={`menu-item ${selectedOption === 'wrapped' ? 'active' : ''}`}
                    onClick={() => handleClick('wrapped')}
                >
                    Wrapped
                </li>
                <li
                    className={`menu-item ${selectedOption === 'to-add' ? 'active' : ''}`}
                    onClick={() => handleClick('to-add')}
                >
                    To add
                </li>
                <li
                    className={`menu-item ${selectedOption === 'to-remove' ? 'active' : ''}`}
                    onClick={() => handleClick('to-remove')}
                >
                    To remove
                </li>
                <li
                    className={`menu-item ${selectedOption === 'to-reprice' ? 'active' : ''}`}
                    onClick={() => handleClick('to-reprice')}
                >
                    To reprice
                </li>
                <li
                    className={`menu-item ${selectedOption === 'to-promote' ? 'active' : ''}`}
                    onClick={() => handleClick('to-promote')}
                >
                    To promote
                </li>
            </ul>
            <div className="sidebar-footer">Footer Content</div>
        </nav>
    );
};

export default Sidebar;
