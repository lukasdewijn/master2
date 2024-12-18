import React from 'react';
import Sidebar from './Sidebar';
import TopWorstSellers from './TopWorstSellers'; // Import nieuw component
import './Layout.css';
import '../index.css';

const Layout = ({ children, onSelectionChange }) => {
    return (
        <div className="layout-container">
            {/* Sidebar */}
            <Sidebar onSelectionChange={onSelectionChange} />

            {/* Main Content */}
            <div className="main-content">
                <TopWorstSellers /> {/* TopWorstSellers zonder props */}
                {children} {/* Render wrapped content */}
            </div>


        </div>
    );
};

export default Layout;
