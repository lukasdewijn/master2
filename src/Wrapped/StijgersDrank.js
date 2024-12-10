import React from 'react';
import TopTemplate from './TopTemplate';
import wrappedData from './wrappedData.json';

const StijgersDrank = () => {
    // Haal de data voor "StijgersDrank" uit de JSON
    const data = wrappedData.wrapped4;

    // Controleer of de data correct is geladen
    if (!data || !data.topItems || !data.bottomItems) {
        console.error("Data ontbreekt of is ongeldig voor StijgersDrank:", data);
        return <h1>Geen data beschikbaar voor StijgersDrank</h1>;
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

export default StijgersDrank;