import React, { useState } from 'react';
import './ToReprice.css';
import Optionbar from "./Optionbar";
import { segmentOptions, locationOptions, seasonOptions, highlightOptions } from './Icons/optionbarOptions';
import pacman from './Icons/pacman.svg'
import pricesens from './Icons/pricesensitivity.svg'
import euro from './Icons/euro.svg'

const ToReprice = () => {

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

    // Define price breakpoints
    const priceRanges = [4, 4.5, 5.1, 6, 6.5, 8];
    // Compute relative weights based on range widths
    const segmentWeights = priceRanges.slice(1).map((end, idx) => end - priceRanges[idx]);
    const segmentClasses = [
        'segment--low',
        'segment--below-optimal',
        'segment--optimal',
        'segment--above-optimal',
        'segment--high'
    ];
    // Example current price
    const currentPrice = 6.8;
    const optimalPrice = 5.6;
    const minPrice = priceRanges[0];
    const maxPrice = priceRanges[priceRanges.length - 1];
    const thresholds = priceRanges;
    const positionPercentCurrent = ((currentPrice - minPrice) / (maxPrice - minPrice)) * 100;
    const positionPercentOptimal = ((optimalPrice - minPrice) / (maxPrice - minPrice)) * 100;
    // helper to compute percent
    const toPct = p => ((p - minPrice) / (maxPrice - minPrice)) * 100;

    // dynamic levels only
    const indicatorLevels = {
        cannibalism: 'High',
        priceSensitivity: 'Medium',
        yourPrice: 'Low'
    };

    return (
        <div className="to-reprice-container">

            <div className="centre-content">
                {/* Segment Display */}
                <div className="reprice-section">
                    <h2 className="reprice-title">Price Elasticity</h2>
                    <div className="price-bar-wrapper">
                        {/* show a label at every boundary */}
                        {thresholds.map((t, i) => (
                            <div
                                key={i}
                                className={`price-threshold-label ${i === 0 || i === thresholds.length-1 ? 'end' : ''}`}
                                style={{ left: `calc(${toPct(t)}% - 12px)` }}
                            >
                                €{t}
                            </div>
                        ))}
                        {/* Optimal price indicator */}
                        <div
                            className="price-indicator top"
                            style={{left: `calc(${positionPercentOptimal}% - 8px)`}}
                        />
                        <div className="price-label top" style={{left: `calc(${positionPercentOptimal}% - 8px)`}}>
                            €{optimalPrice} best price
                        </div>

                        {/* Price bar segments */}
                        <div className="price-bar">
                            {segmentWeights.map((weight, idx) => (
                                <div
                                    key={idx}
                                    className={`segment ${segmentClasses[idx]}`}
                                    style={{flex: weight}}
                                />
                            ))}
                        </div>

                        {/* Current price indicator */}
                        <div
                            className="price-indicator bottom"
                            style={{left: `calc(${positionPercentCurrent}% - 8px)`}}
                        />
                        <div className="price-label bottom" style={{left: `calc(${positionPercentCurrent}% - 8px)`}}>
                            €{currentPrice} current price
                        </div>
                    </div>
                    <div className="reprice-indicators">
                        <div className="cannibalism">
                            <img src={pacman} alt={`${pacman.label} icon`} className="pacman-icon"/>
                            <div className="cannibalism-label"> Cannibalism</div>
                            <div className="cannibalism-indicator"> High </div>
                        </div>
                        <div className="pricesens">
                            <img src={pricesens} alt={`${pricesens.label} icon`} className="pricesens-icon"/>
                            <div className="pricesens-label"> Pricesensibilaty</div>
                            <div className="pricesens-indicator"> High </div>
                        </div>
                        <div className="yourprice">
                            <img src={euro} alt={`${euro.label} icon`} className="euro-icon"/>
                            <div className="yourprice-label"> Your Price</div>
                            <div className="yourprice-indicator"> High </div>
                        </div>


                    </div>
                </div>

                {/* Items List */}
                <div className="reprice-items-section">
                    <div className="r-list-header">
                        <h2 className="header-title"> To Reprice Items </h2>
                        <div className="r-section-order">
                            <div className={`order-button ${sortOrder === 'top' ? 'active' : ''}`}
                                 onClick={() => setSortOrder('top')}>
                                Te Hoog ↑
                            </div>
                            <div className={`order-button ${sortOrder === 'worst' ? 'active' : ''}`}
                                onClick={() => setSortOrder('worst')}>
                                Te Laag ↓
                            </div>
                        </div>
                        {/* Search Bar */}
                        <div className="r-search-bar">
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
            <Optionbar title="Segments"/>
        </div>
    );
};

export default ToReprice;
