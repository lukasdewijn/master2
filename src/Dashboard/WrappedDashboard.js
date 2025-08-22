// src/Dashboard/WrappedDashboard.js
import React, { useState } from 'react';
import HotForYou from '../Wrapped/HotForYou';
import PrijsOptimalisatie from '../Wrapped/PrijsOptimalisatie';
import StijgersDrank from "../Wrapped/StijgersDrank";
import PrijsVergelijking from "../Wrapped/PrijsVergelijking";
import TopverkopersDrank from "../Wrapped/TopverkopersDrank";
import HotForNextSeason from "../Wrapped/HotForNextSeason";
import "./WrappedDashboard.css";

const WrappedDashboard = () => {
    const sections = [
        <HotForYou key="hotForYou" />,
        <PrijsOptimalisatie key="prijsOpt" />,
        <StijgersDrank key="stijgersDrank" />,
        <PrijsVergelijking key="prijsVerg" />,
        <TopverkopersDrank key="topDrank" />,
        <HotForNextSeason key="hotNext" />
    ];

    const ITEMS_PER_PAGE = 3;
    const pageCount = Math.ceil(sections.length / ITEMS_PER_PAGE);
    const [page, setPage] = useState(0);

    const prev = () =>
        setPage(p => (p === 0 ? pageCount - 1 : p - 1));
    const next = () =>
        setPage(p => (p === pageCount - 1 ? 0 : p + 1));

    // bepaal welke drie secties zichtbaar zijn
    const start = page * ITEMS_PER_PAGE;
    const visible = sections.slice(start, start + ITEMS_PER_PAGE);

    return (
        <div className="wrapped-dashboard">
            <button className="carousel-btn left" onClick={prev}>‹</button>
            <div className="phone-emulator">
                {visible.map((SectionComponent, i) => (
                    <React.Fragment key={i}>
                        {SectionComponent}
                    </React.Fragment>
                ))}
            </div>
            <button className="carousel-btn right" onClick={next}>›</button>
        </div>
    );
};

export default WrappedDashboard;
