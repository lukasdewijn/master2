// src/Layout.js
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopWorstSellers from './TopWorstSellers';
import ToReprice from "./ToReprice";
import WrappedDashboard from "./WrappedDashboard";
import Menu from "./Menu";
import './Layout.css';
import '../index.css';
import ToAdd from "./ToAdd";

// Stub components voor de overige opties
const ToAddComponent    = () => <div><h2>To Add Component</h2><p>Coming soon...</p></div>;
const ToRemoveComponent = () => <div><h2>To Remove Component</h2><p>Coming soon...</p></div>;

const Layout = ({ children }) => {
    const [selectedOption, setSelectedOption] = useState('stats');

    let MainContent;
    switch (selectedOption) {
        case 'stats':
            MainContent = <TopWorstSellers />;
            break;
        case 'wrapped':
            MainContent = <WrappedDashboard />;
            break;
        case 'to-add':
            MainContent = <ToAdd />;
            break;
        case 'to-remove':
            MainContent = <ToRemoveComponent />;
            break;
        case 'to-reprice':
            MainContent = <ToReprice />;
            break;
        case 'edit-menu':
            MainContent = <Menu />;
            break;
        default:
            MainContent = <div />;
    }

    return (
        <div className="layout-container">
            <Sidebar
                selectedOption={selectedOption}
                onSelectionChange={setSelectedOption}
            />

            <div className="main-content">
                {MainContent}
                {children}
            </div>
        </div>
    );
};

export default Layout;
