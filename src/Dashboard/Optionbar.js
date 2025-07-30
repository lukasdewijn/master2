// ===== Optionbar.js =====
import React from 'react';
import './Optionbar.css';
import {
    segmentOptions,
    highlightOptions,
    seasonOptions,
    locationOptions
} from './Icons/optionbarOptions';

// Grouped option arrays with keys and titles
const optionCategories = [
    { key: 'segments', title: 'Segments', options: segmentOptions },
    { key: 'highlights', title: 'Highlights', options: highlightOptions },
    { key: 'seasons', title: 'Seasons', options: seasonOptions },
    { key: 'locations', title: 'Location Produced', options: locationOptions }
];

/**
 * Controlled filter sidebar
 * Props:
 *  - filters: {
 *      segments: Set<number>,
 *      highlights: Set<number>,
 *      seasons: Set<number>,
 *      locations: Set<number>
 *    }
 *  - onChange: (newFilters) => void
 */
export default function Optionbar({ filters, onChange }) {
    const toggleOption = (groupKey, id) => {
        const updated = new Set(filters[groupKey]);
        if (updated.has(id)) updated.delete(id);
        else updated.add(id);
        onChange({ ...filters, [groupKey]: updated });
    };

    return (
        <nav className="optionbar-container">
            <h3 className="optionbar-title">Filters & Categories</h3>
            <div className="optionbar-scrollable">
                {optionCategories.map((grp, idx) => (
                    <div key={grp.key} className="optionbar-group">
                        {idx > 0 && <hr className="optionbar-divider" />}
                        <h4 className="optionbar-group-title">{grp.title}</h4>
                        <ul className="optionbar-list">
                            {grp.options.map(opt => (
                                <li key={opt.id} className="option-item">
                                    <input
                                        type="checkbox"
                                        id={`${grp.key}-${opt.id}`}
                                        checked={filters[grp.key].has(opt.id)}
                                        onChange={() => toggleOption(grp.key, opt.id)}
                                    />
                                    <label htmlFor={`${grp.key}-${opt.id}`} className="option-label">
                                        <img src={opt.icon} alt={opt.label} className="option-icon" />
                                        {grp.key === 'seasons' ? `Popular in ${opt.label}` : opt.label}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </nav>
    );
}
