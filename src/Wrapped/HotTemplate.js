import React from 'react';
import './HotTemplate.css';

const HotTemplate = ({ title, subtitle, menuItems }) => {
    // Beperk het aantal items tot maximaal 3
    const limitedMenuItems = menuItems.slice(0, 3);

    return (
        <div className="hot-container">
            <div className="hot-title-container">
                <h1>{title}</h1>
                <h2>{subtitle}</h2>
            </div>
            {limitedMenuItems.map((item, index) => (
                <div key={index} className="hot-item">
                    <div className="hot-item-info">
                        <div className="hot-item-name">{item.name}</div>
                        <div className="hot-item-description">{item.description}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default HotTemplate;
