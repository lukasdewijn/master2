import React from 'react';
import './PrijsOptimalisatie.css';
import wrappedData from './wrappedData.json';

const PrijsOptimalisatie = () => {
    // Haal de data voor wrapped6 uit de JSON
    const data = wrappedData.wrapped6;

    // Controleer of data correct is geladen
    if (!data || !data.items) {
        console.error("Data ontbreekt of is ongeldig:", data);
        return <h1>Geen data beschikbaar voor Prijs Optimalisatie</h1>;
    }

    // Gebruik de data uit de JSON
    const { title, subtitle, items } = data;

    // Beperk het aantal items tot maximaal 5
    const limitedItems = items.slice(0, 5);

    // Array met kleuren voor de items
    const colors = [
        "prijs-optimalisatie-item-1", // Sandy brown
        "prijs-optimalisatie-item-2", // Ivory
        "prijs-optimalisatie-item-3", // Light cyan
        "prijs-optimalisatie-item-4", // Jordy blue
        "prijs-optimalisatie-item-5", // Bice blue
    ];

    return (
        <div className="page-container">
            <div className="prijs-optimalisatie-container">
                <h1 className="prijs-optimalisatie-title">{title}</h1>
                <p className="prijs-optimalisatie-subtitle">{subtitle}</p>
                <div className="prijs-optimalisatie-items-container">
                    {limitedItems.map((item, index) => (
                        <div
                            key={index}
                            className={`prijs-optimalisatie-item ${colors[index % colors.length]}`}
                        >
                            <span className="prijs-optimalisatie-item-name">{item.name}</span>
                            <div className="prijs-optimalisatie-price-details">
                                <div className="current-price-details">
                                    <span className="prijs-optimalisatie-current-price">{item.currentPrice}</span>
                                    <p>Jouw prijs</p>
                                </div>
                                <span className="prijs-optimalisatie-arrow">→</span>
                                <div className="current-price-details">
                                    <span className="prijs-optimalisatie-new-price">{item.newPrice}</span>
                                    <p>Nieuwe prijs</p>
                                </div>
                                <div className="current-price-details">
                                    <span className="prijs-optimalisatie-extra-per-month">{item.extraPerMonth}</span>
                                    <p>Extra winst</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    <br/><br/><br/><br/><br/><br/>
                </div>
            </div>
        </div>
    );
};

export default PrijsOptimalisatie;
