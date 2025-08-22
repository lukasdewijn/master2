import React from 'react';
import TopTemplate from './TopTemplate';
import wrappedData from './wrappedData.json';

const StijgersEten = () => {
    // Haal de data voor "StijgersEten" uit de JSON
    const data = wrappedData.wrapped5;

    // Controleer of de data correct is geladen
    if (!data || !data.topItems || !data.bottomItems) {
        console.error("Data ontbreekt of is ongeldig voor StijgersEten:", data);
        return <h1>Geen data beschikbaar voor StijgersEten</h1>;
    }

    // Gebruik de data uit de JSON
    const { topTitle, topSubtitle, topItems, bottomTitle, bottomSubtitle, bottomItems } = data;

    return (
        <TopTemplate
            topTitle={topTitle}
            topSubtitle={topSubtitle}
            topItems={topItems}
            bottomTitle={bottomTitle}
            bottomSubtitle={bottomSubtitle}
            bottomItems={bottomItems}
        />
    );
};

export default StijgersEten;
