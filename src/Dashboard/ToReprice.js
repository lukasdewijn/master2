import React, { useState } from 'react';
import './ToReprice.css';
import Optionbar from "./Optionbar";
import { segmentOptions, locationOptions, seasonOptions, highlightOptions } from './Icons/optionbarOptions';
import pacman from './Icons/pacman.svg'
import pricesens from './Icons/pricesensitivity.svg'
import euro from './Icons/euro.svg'

const ToReprice = () => {

    const allItems = [
        {
            name: 'Bacardi cola',
            currentPrice: 4.20,
            optimalPrice: 4.50,
            minPrice: 4.00,
            maxPrice: 8.00,
            cannibalisationRisk: 'high',
            priceSensitivity: 'medium',
            jouwPrijsIs: 'hoog'
        },
        {
            name: 'Gin tonic',
            currentPrice: 5.80,
            optimalPrice: 5.10,
            minPrice: 4.00,
            maxPrice: 8.00,
            cannibalisationRisk: 'medium',
            priceSensitivity: 'high',
            jouwPrijsIs: 'hoog'
        },
        {
            name: 'Mojito',
            currentPrice: 6.30,
            optimalPrice: 6.00,
            minPrice: 4.00,
            maxPrice: 8.00,
            cannibalisationRisk: 'low',
            priceSensitivity: 'low',
            jouwPrijsIs: 'goed'
        },
        {
            name: 'Pina colada',
            currentPrice: 5.50,
            optimalPrice: 5.10,
            minPrice: 4.00,
            maxPrice: 8.00,
            cannibalisationRisk: 'medium',
            priceSensitivity: 'medium',
            jouwPrijsIs: 'hoog'
        },
        {
            name: 'Tequila sunrise',
            currentPrice: 6.00,
            optimalPrice: 5.80,
            minPrice: 4.00,
            maxPrice: 8.00,
            cannibalisationRisk: 'low',
            priceSensitivity: 'high',
            jouwPrijsIs: 'goed'
        },
        {
            name: 'Caipirinha',
            currentPrice: 6.40,
            optimalPrice: 6.00,
            minPrice: 4.00,
            maxPrice: 8.00,
            cannibalisationRisk: 'low',
            priceSensitivity: 'low',
            jouwPrijsIs: 'goed'
        },
        {
            name: 'Cosmopolitan',
            currentPrice: 6.90,
            optimalPrice: 6.50,
            minPrice: 4.00,
            maxPrice: 8.00,
            cannibalisationRisk: 'medium',
            priceSensitivity: 'medium',
            jouwPrijsIs: 'hoog'
        },
        {
            name: 'Bloody Mary',
            currentPrice: 5.20,
            optimalPrice: 5.10,
            minPrice: 4.00,
            maxPrice: 8.00,
            cannibalisationRisk: 'high',
            priceSensitivity: 'low',
            jouwPrijsIs: 'goed'
        },
        {
            name: 'Mai Tai',
            currentPrice: 5.80,
            optimalPrice: 5.50,
            minPrice: 4.00,
            maxPrice: 8.00,
            cannibalisationRisk: 'medium',
            priceSensitivity: 'medium',
            jouwPrijsIs: 'goed'
        },
        {
            name: 'Dark and Stormy',
            currentPrice: 6.20,
            optimalPrice: 6.00,
            minPrice: 4.00,
            maxPrice: 8.00,
            cannibalisationRisk: 'low',
            priceSensitivity: 'high',
            jouwPrijsIs: 'goed'
        },
        {
            name: 'Screwdriver',
            currentPrice: 4.80,
            optimalPrice: 5.00,
            minPrice: 4.00,
            maxPrice: 8.00,
            cannibalisationRisk: 'high',
            priceSensitivity: 'low',
            jouwPrijsIs: 'laag'
        },
        {
            name: 'Blue Lagoon',
            currentPrice: 5.00,
            optimalPrice: 5.20,
            minPrice: 4.00,
            maxPrice: 8.00,
            cannibalisationRisk: 'medium',
            priceSensitivity: 'medium',
            jouwPrijsIs: 'laag'
        },
        {
            name: 'Old Fashioned',
            currentPrice: 7.00,
            optimalPrice: 6.50,
            minPrice: 4.00,
            maxPrice: 8.00,
            cannibalisationRisk: 'low',
            priceSensitivity: 'low',
            jouwPrijsIs: 'hoog'
        },
        {
            name: 'Manhattan',
            currentPrice: 7.50,
            optimalPrice: 7.00,
            minPrice: 4.00,
            maxPrice: 8.00,
            cannibalisationRisk: 'medium',
            priceSensitivity: 'high',
            jouwPrijsIs: 'hoog'
        },
        {
            name: 'Negroni',
            currentPrice: 6.80,
            optimalPrice: 6.50,
            minPrice: 4.00,
            maxPrice: 8.00,
            cannibalisationRisk: 'medium',
            priceSensitivity: 'medium',
            jouwPrijsIs: 'goed'
        },
        {
            name: 'Cuba Libre',
            currentPrice: 5.90,
            optimalPrice: 5.60,
            minPrice: 4.00,
            maxPrice: 8.00,
            cannibalisationRisk: 'high',
            priceSensitivity: 'low',
            jouwPrijsIs: 'hoog'
        },
        {
            name: 'Tom Collins',
            currentPrice: 5.60,
            optimalPrice: 5.30,
            minPrice: 4.00,
            maxPrice: 8.00,
            cannibalisationRisk: 'low',
            priceSensitivity: 'medium',
            jouwPrijsIs: 'goed'
        },
        {
            name: 'Sidecar',
            currentPrice: 7.20,
            optimalPrice: 6.80,
            minPrice: 4.00,
            maxPrice: 8.00,
            cannibalisationRisk: 'medium',
            priceSensitivity: 'high',
            jouwPrijsIs: 'hoog'
        }
    ];

    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('top'); // "top" or "worst"
    const [selectedIndex, setSelectedIndex] = useState(0);


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

    const segmentClasses = [
        'segment--low',
        'segment--below-optimal',
        'segment--optimal',
        'segment--above-optimal',
        'segment--high'
    ];
    const selectedItem = filteredItems[selectedIndex] || {};
    // Example current price
    const currentPrice = selectedItem.currentPrice?.toFixed(2);
    const optimalPrice = selectedItem.optimalPrice?.toFixed(2);
    const minPrice = optimalPrice*0.35;
    const maxPrice = optimalPrice*2;
    const thresholds = [minPrice.toFixed(2), (optimalPrice*0.5).toFixed(2), (optimalPrice*0.7).toFixed(2),(optimalPrice*1.25).toFixed(2), (optimalPrice*1.5).toFixed(2), optimalPrice*2];
    const segmentWeights = thresholds.slice(1).map((end, idx) => end - thresholds[idx]);
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
                            {segmentWeights.map((w, idx) => (
                                <div
                                    key={idx}
                                    className={`segment ${segmentClasses[idx]}`}
                                    style={{flex: w}}
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
                            <div className="cannibalism-indicator"> {selectedItem.cannibalisationRisk} </div>
                        </div>
                        <div className="pricesens">
                            <img src={pricesens} alt={`${pricesens.label} icon`} className="pricesens-icon"/>
                            <div className="pricesens-label"> Price Sensitivity</div>
                            <div className="pricesens-indicator"> {selectedItem.priceSensitivity} </div>
                        </div>
                        <div className="yourprice">
                            <img src={euro} alt={`${euro.label} icon`} className="euro-icon"/>
                            <div className="yourprice-label"> Your Price</div>
                            <div className="yourprice-indicator"> {selectedItem.jouwPrijsIs} </div>
                        </div>


                    </div>
                </div>

                {/* Items List */}
                <div className="reprice-items-section">
                    <div className="r-list-header">
                        <h2 className="header-title">To Reprice Items</h2>
                        <div className="r-section-order">
                            {[
                                { label: 'Te Hoog ↑', key: 'top' },
                                { label: 'Te Laag ↓', key: 'worst' }
                            ].map(({ label, key }) => (
                                <div
                                    key={key}
                                    className={`order-button ${sortOrder === key ? 'active' : ''}`}
                                    onClick={() => setSortOrder(key)}
                                >
                                    {label}
                                </div>
                            ))}
                        </div>
                        <div className="r-search-bar">
                            <input
                                type="text"
                                placeholder="Search"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <ul className="items-list">
                        {filteredItems.map((item, idx) => (
                            <li
                                key={item.name}
                                className={`item ${selectedIndex === idx ? 'selected' : ''}`}
                                onClick={() => setSelectedIndex(idx)}
                            >
                                <span>{idx + 1}. {item.name}</span>
                                <div className="verandering-prijs">
                                    <div className="lijst-jouw-prijs">
                                        <div>€ {item.currentPrice}</div>
                                        <div>jouw prijs</div>
                                    </div>
                                    <div className="lijst-pijl">&#8594;</div>
                                    <div className="lijst-nieuwe-prijs">
                                        <div>€ {item.optimalPrice}</div>
                                        <div>betere prijs</div>
                                    </div>
                                </div>
                                <div className="lijst-indicator">
                                    <div> Jouw prijs is </div>
                                    <div> {item.jouwPrijsIs}</div>
                                </div>
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
