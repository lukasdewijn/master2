import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopWorstSellers from './TopWorstSellers';
import ToReprice from "./ToReprice";
import './Layout.css';
import '../index.css';

// Stub components for demonstration
const WrappedComponent = () => <div><h2>Wrapped Component</h2><p>Coming soon...</p></div>;
const ToAddComponent = () => <div><h2>To Add Component</h2><p>Coming soon...</p></div>;
const ToRemoveComponent = () => <div><h2>To Remove Component</h2><p>Coming soon...</p></div>;
const ToRepriceComponent = () => <div><h2>To Reprice Component</h2><p>This is the reprice view.</p></div>;
const ToPromoteComponent = () => <div><h2>To Promote Component</h2><p>Coming soon...</p></div>;

const Layout = ({ children }) => {
    const [selectedOption, setSelectedOption] = useState('stats');

    // Determine which main component to render
    let MainContent;
    switch (selectedOption) {
        case 'stats':
            MainContent = <TopWorstSellers selectedOption={selectedOption} />;
            break;
        case 'wrapped':
            MainContent = <WrappedComponent />;
            break;
        case 'to-add':
            MainContent = <ToAddComponent />;
            break;
        case 'to-remove':
            MainContent = <ToRemoveComponent />;
            break;
        case 'to-reprice':
            MainContent = <ToReprice selectedOption={selectedOption}/>;
            break;
        case 'to-promote':
            MainContent = <ToPromoteComponent />;
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
                {/* Render the appropriate component based on sidebar selection */}
                {MainContent}
                {children}
            </div>
        </div>
    );
};

export default Layout;
