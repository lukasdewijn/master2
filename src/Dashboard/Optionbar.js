// Optionbar.js
import React from 'react';
import './Optionbar.css';
import {
    segmentOptions,
    locationOptions,
    seasonOptions,
    highlightOptions
} from './Icons/optionbarOptions';

// Grouped option arrays with titles
const optionCategories = [
    { title: 'Segments', options: segmentOptions },
    { title: 'Highlights', options: highlightOptions },
    { title: 'Seasons', options: seasonOptions },
    { title: 'Location Produced', options: locationOptions },
];

const Optionbar = () => {
    return (
        <div className="optionbar-container">
            <h3 className="optionbar-title">Filters & Categories</h3>

            {/* Scrollable wrapper starts here */}
            <div className="optionbar-scrollable">
                {optionCategories.map((category, idx) => (
                    <div key={category.title} className="optionbar-group">
                        {idx > 0 && <hr className="optionbar-divider" />}
                        <ul className="optionbar-list">
                            {category.options.map((option) => (
                                <li key={option.id} className="option-item">
                                    <input
                                        type="checkbox"
                                        id={option.id}
                                        defaultChecked={option.checked}
                                    />
                                    <label htmlFor={option.id} className="option-label">
                                        <img
                                            src={option.icon}
                                            alt={`${option.label} icon`}
                                            className="option-icon"
                                        />
                                        {option.label}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            {/* Scrollable wrapper ends here */}
        </div>
    );
};

export default Optionbar;