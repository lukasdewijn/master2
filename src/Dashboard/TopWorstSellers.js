import React, { useState } from 'react';
import './TopWorstSellers.css';
import Optionbar from "./Optionbar";
import { segmentOptions, locationOptions, seasonOptions, highlightOptions } from './Icons/optionbarOptions';


const TopWorstSellers = () => {
    const segments = [
        { name: 'Rum-based', value: '12.312' },
        { name: 'Whisky infused', value: '1453' },
        { name: 'Wodka-based', value: '854' },
        { name: 'Gin-based', value: '652' },
    ];

    const allItems = [
        { name: 'Bacardi cola', count: 120 },
        { name: 'Gin tonic', count: 95 },
        { name: 'Mojito', count: 85 },
        { name: 'Whiskey sour', count: 77 },
        { name: 'Espresso martini', count: 63 },
        { name: 'Pina colada', count: 110 },
        { name: 'Tequila sunrise', count: 52 },
        { name: 'Caipirinha', count: 88 },
        { name: 'Cosmopolitan', count: 69 },
        { name: 'Bloody mary', count: 45 },
        { name: 'Mai tai', count: 58 },
        { name: 'Dark and stormy', count: 76 },
        { name: 'Screwdriver', count: 81 },
        { name: 'Blue lagoon', count: 49 },
        { name: 'Old fashioned', count: 130 },
        { name: 'Manhattan', count: 67 },
        { name: 'Negroni', count: 92 },
        { name: 'Cuba libre', count: 60 },
        { name: 'Tom Collins', count: 55 },
        { name: 'Sidecar', count: 72 },
    ];

    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('top'); // "top" or "worst"

    // Sort items based on sortOrder
    const sortedItems = [...allItems].sort((a, b) => {
        if (sortOrder === 'top') {
            return b.count - a.count; // Descending order
        } else {
            return a.count - b.count; // Ascending order
        }
    });

    // Filter items based on searchTerm
    const filteredItems = sortedItems.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="top-worst-container">

            <div className="centre-content">
                {/* Segment Display */}
                <div className="segment-section">
                    <h2 className="section-title">Top & Worst</h2>

                </div>

                {/* Items List */}
                <div className="items-section">
                    <div className="list-header">
                        <div className="header-title">
                            <p>Top & Worst</p>
                            <h2 className="section-title">Cocktail-items</h2>
                        </div>
                        <div className="section-order">
                        <span
                            className={`order-button ${sortOrder === 'top' ? 'active' : ''}`}
                            onClick={() => setSortOrder('top')}
                        >
                            Top sellers ↑
                        </span>
                            <span
                                className={`order-button ${sortOrder === 'worst' ? 'active' : ''}`}
                                onClick={() => setSortOrder('worst')}
                            >
                            Worst sellers ↓
                        </span>
                        </div>
                        {/* Search Bar */}
                        <div className="search-bar">
                            <input
                                type="text"
                                placeholder="Search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <ul className="items-list">
                        {filteredItems.map((item, index) => (
                            <li key={index} className="item">
                            <span>
                                {index + 1}. {item.name}
                            </span>
                                <span className="item-count">{item.count} sold</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <Optionbar title="Segments" />
        </div>
    );
};

export default TopWorstSellers;
