import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopWorstSellers from './TopWorstSellers';
import './Layout.css';
import '../index.css';

const Layout = ({ children }) => {
    const [selectedOption, setSelectedOption] = useState('stats');

    return (
        <div className="layout-container">
            <Sidebar
                selectedOption={selectedOption}
                onSelectionChange={setSelectedOption}
            />

            <div className="main-content">
                {/* TEMP: show which sidebar option is active */}
                <div style={{ marginBottom: '1rem', fontWeight: 'bold' }}>
                    Selected: {selectedOption}
                </div>
                <TopWorstSellers selectedOption={selectedOption} />
                {children}
            </div>
        </div>
    );
};

export default Layout;

