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
                <h1 className="toptemp-title">{topTitle}</h1>
                <h2 className="toptemp-subtitle">{topSubtitle}</h2>
                <div className="item-list">
                    {topItems.length > 0 ? (
                        topItems.map((item, index) => (
                            <div key={index} className={`item-${index + 1}`}>
                                <span className="item-name">{item.name}</span>
                                {/* Alleen 'verkocht' tonen als de titel niet 'Stijgers' is */}
                                {item.extra && <span className="item-sales">{item.extra}</span>}

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
                    <h1 className="toptemp-title">{bottomTitle}</h1>
                    <h2 className="toptemp-subtitle">{bottomSubtitle}</h2>
                    <div className="item-list">
                        {bottomItems.length > 0 ? (
                            bottomItems.map((item, index) => (
                                <div key={index} className={`bottom-item item-${index + 1}`}>
                                    <span className="item-name">{item.name}</span>
                                    {item.extra && <span className="item-sales">{item.extra}</span>}

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
