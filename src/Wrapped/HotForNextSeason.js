import React from 'react';
import HotTemplate from './HotTemplate';
import wrappedData from './wrappedData.json';

const HotForNextSeason = () => {
    // Haal de data voor 'wrapped10' of een ander JSON-key uit de JSON
    const data = wrappedData.wrapped10;

    // Controleer of data correct is geladen
    if (!data || !data.menuItems) {
        console.error("Data ontbreekt of is ongeldig voor Hot For Next Season:", data);
        return <h1>Geen data beschikbaar voor Hot For Next Season</h1>;
    }

    // Gebruik de data uit de JSON
    const { title, subtitle, menuItems } = data;

    return (
        <HotTemplate
            title={title}
            subtitle={subtitle}
            menuItems={menuItems}
        />
    );
};

export default HotForNextSeason;
