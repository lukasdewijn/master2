import React from 'react';
import './Optionbar.css';

const Optionbar = ({ title, options }) => {
    return (
        <div className="optionbar-container">
            <h3 className="optionbar-title">{title}</h3>
            <ul className="optionbar-list">
                {options.map((option, index) => (
                    <li key={index} className="option-item">
                        <input type="checkbox" id={option.id} defaultChecked={option.checked} />
                        <label htmlFor={option.id}>{option.label}</label>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Optionbar;
