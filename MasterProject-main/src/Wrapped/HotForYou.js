import React from 'react';
import HotTemplate from './HotTemplate';
import wrappedData from './wrappedData.json';

const HotForYou = () => {
    // Haal de data voor 'wrapped9' of een ander JSON-key uit de JSON
    const data = wrappedData.wrapped9;

    // Controleer of data correct is geladen
    if (!data || !data.menuItems) {
        console.error("Data ontbreekt of is ongeldig voor Hot For You:", data);
        return <h1>Geen data beschikbaar voor Hot For You</h1>;
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

export default HotForYou;
