import React from 'react';
import './PrijsVergelijking.css';
import wrappedData from './wrappedData.json';

const PrijsVergelijking = () => {
    // Haal de data voor wrapped7 uit de JSON
    const data = wrappedData.wrapped7;

    // Controleer of data correct is geladen
    if (!data || !data.items) {
        console.error("Data ontbreekt of is ongeldig:", data);
        return <h1>Geen data beschikbaar voor Prijs Vergelijking</h1>;
    }

    // Gebruik de data uit de JSON
    const { title, subtitle, items } = data;

    // Beperk het aantal items tot maximaal 10
    const limitedItems = items.slice(0, 10);

    // Array met kleurklassen
    const colorClasses = [
        "prijs-vergelijken-item-1", // Sandy brown
        "prijs-vergelijken-item-2", // Ivory
        "prijs-vergelijken-item-3", // Light cyan
        "prijs-vergelijken-item-4", // Jordy blue
        "prijs-vergelijken-item-5"  // Bice blue
    ];

    const generateDescription = (comparison) => {
        const amount = comparison.match(/[+-]?\s?€\d+,\d+/); // Extract "+ €0,30" or "- €0,20"
        if (!amount) return null;

        if (comparison.includes("+")) {
            return `Dit product is ${amount[0]} duurder dan gemiddeld in vergelijkbare zaken.`;
        } else {
            return `Dit product is ${amount[0]} goedkoper dan gemiddeld in vergelijkbare zaken.`;
        }
    };

    return (
        <div className="page-container">
            <div className="prijs-vergelijken-container">
                <h1 className="prijs-vergelijken-title">{title}</h1>
                <p className="prijs-vergelijken-subtitle">{subtitle}</p>
                <div className="prijs-vergelijken-items-container">
                    {limitedItems.map((item, index) => (
                        <div
                            key={index}
                            className={`prijs-vergelijken-item ${
                                colorClasses[index % colorClasses.length] // Herhaal kleuren
                            }`}
                        >
                            <div className="prijs-vergelijken-item-content">
                                <span className="prijs-vergelijken-item-name">{item.name}</span>
                                <span className="prijs-vergelijken-comparison">{item.comparison}</span>
                            </div>
                            {/* Beschrijving alleen voor het eerste item */}
                            {index === 0 && (
                                <p className="prijs-vergelijken-description">
                                    {generateDescription(item.comparison)}
                                </p>
                            )}
                        </div>
                    ))}
                    <br/><br/><br/><br/>
                </div>

            </div>

        </div>
    );
};

export default PrijsVergelijking;
