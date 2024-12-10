import React from 'react';
import './Specialiteit.css';
import wrappedData from './wrappedData.json';

const Specialiteit = () => {
    // Haal de data voor wrapped8 uit de JSON
    const data = wrappedData.wrapped8;

    // Controleer of de data correct is geladen
    if (!data || !data.topItems || !data.bottomItems) {
        console.error("Data ontbreekt of is ongeldig voor Wrapped 8:", data);
        return <h1>Geen data beschikbaar voor Specialiteit</h1>;
    }

    // Gebruik de data uit de JSON
    const { title, subtitle, topItems, bottomItems } = data;

    // Beperk het aantal top- en bottomitems tot maximaal 3
    const maxItems = 3;
    const limitedTopItems = topItems.slice(0, maxItems);
    const limitedBottomItems = bottomItems.slice(0, maxItems);

    return (
        <div className="specialiteit-container">
            <div className="titel-container">
                <h1 className="specialiteit-titel">{title}</h1>
                <p className="specialiteit-subtitle">{subtitle}</p>
            </div>

            <div className="specialiteit-items-container">
                {/* Topitems Sectie */}
                <p className="specialiteit-section-description">
                    Deze bieren scoren bovengemiddeld in populariteit, vergeleken met andere café's.
                </p>
                <div className="specialiteit-items">
                    {limitedTopItems.map((item, index) => (
                        <div key={index} className={`bier-item bier-item-${index + 1}`}>
                            {item.name}
                        </div>
                    ))}
                </div>

                <div className="spacer1"></div>

                {/* Bottomitems Sectie */}
                <p className="specialiteit-section-description">
                    Deze bieren scoren ondergemiddeld in populariteit, vergeleken met andere café's.
                </p>
                <div className="specialiteit-items">
                    {limitedBottomItems.map((item, index) => (
                        <div key={index} className={`bier-item bier-item-${index + 4}`}>
                            {item.name}
                        </div>
                    ))}
                </div>
                <div className="spacer2"></div>
            </div>
        </div>
    );
};

export default Specialiteit;
