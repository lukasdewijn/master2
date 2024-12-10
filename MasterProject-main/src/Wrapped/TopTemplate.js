import React from 'react';
import './TopTemplate.css';

const TopTemplate = ({
                         topTitle = "Top Items",
                         topSubtitle = "",
                         topItems = [],
                         bottomTitle = "Bottom Items",
                         bottomSubtitle = "",
                         bottomItems = []
                     }) => {
    return (
        <div className="top-template-container">
            {/* Top Section */}
            <div className="section">
                <h1 className="section-title">{topTitle}</h1>
                <h2 className="section-subtitle">{topSubtitle}</h2>
                <div className="item-list">
                    {topItems.length > 0 ? (
                        topItems.map((item, index) => (
                            <div key={index} className={`item item-${index + 1}`}>
                                <span className="item-name">{item.name}</span>
                                {/* Alleen 'verkocht' tonen als de titel niet 'Stijgers' is */}
                                <span className="item-sales">
                                    {item.sales} {topTitle !== "Stijgers" && "verkocht"}
                                </span>
                            </div>
                        ))
                    ) : (
                        <p>Geen topitems beschikbaar.</p>
                    )}
                </div>
            </div>

            {/* Bottom Section */}
            <div className="bottom-template-container">
                <div className="section">
                    <h1 className="section-title">{bottomTitle}</h1>
                    <h2 className="section-subtitle">{bottomSubtitle}</h2>
                    <div className="item-list">
                        {bottomItems.length > 0 ? (
                            bottomItems.map((item, index) => (
                                <div key={index} className={`item bottom-item item-${index + 1}`}>
                                    <span className="item-name">{item.name}</span>
                                    <span className="item-sales">
                                        {item.sales} {topTitle !== "Stijgers" && "verkocht"}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p>Geen bottomitems beschikbaar.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopTemplate;
