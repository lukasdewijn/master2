import React from 'react';
import TopTemplate from './TopTemplate';
import wrappedData from './wrappedData.json';

const TopverkopersDrank = () => {
    const data = wrappedData.wrapped2;

    // Fallback als data niet beschikbaar is
    if (!data || !data.topItems || !data.bottomItems) {
        console.log("Wrapped2 Data:", wrappedData.wrapped2);

        return <h1>Data ontbreekt of is ongeldig voor Wrapped 2</h1>;

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

export default TopverkopersDrank;
