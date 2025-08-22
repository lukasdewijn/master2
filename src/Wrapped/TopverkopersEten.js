import React from 'react';
import TopTemplate from './TopTemplate';
import wrappedData from './wrappedData.json';

const TopverkopersEten = () => {
    const data = wrappedData.wrapped3; // Data voor wrapped3

    // Fallback als data niet beschikbaar is
    if (!data || !data.topItems || !data.bottomItems) {
        console.log("Wrapped3 Data:", wrappedData.wrapped3);

        return <h1>Data ontbreekt of is ongeldig voor Wrapped 3</h1>;
    }

    return (
        <TopTemplate
            topTitle={data.topTitle}
            topSubtitle={data.topSubtitle}
            topItems={data.topItems}
            bottomTitle={data.bottomTitle}
            bottomSubtitle={data.bottomSubtitle}
            bottomItems={data.bottomItems}
        />
    );
};

export default TopverkopersEten;
