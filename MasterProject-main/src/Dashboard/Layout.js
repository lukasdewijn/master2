import React from 'react';
import Sidebar from './Sidebar'; // Sidebar component
import './Layout.css';
import '../index.css';

const Layout = ({ children, onSelectionChange }) => {
    return (
        <div className="layout-container">
            {/* Sidebar */}
            <Sidebar onSelectionChange={onSelectionChange} />

            {/* Main Content */}
            <div className="main-content">
                {children} {/* Render wrapped content */}
            </div>

            {/* Filter Bar */}
            <div className="filter-bar">
                <div className="filter-header">Filters</div>
                <ul className="filter-options">
                    <li>
                        <input type="checkbox" id="option1" />
                        <label htmlFor="option1">Option 1</label>
                    </li>
                    <li>
                        <input type="checkbox" id="option2" />
                        <label htmlFor="option2">Option 2</label>
                    </li>
                    <li>
                        <input type="checkbox" id="option3" />
                        <label htmlFor="option3">Option 3</label>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Layout;
