// src/Dashboard/WrappedDashboard.js
import React from 'react';
import HotForYou from '../Wrapped/HotForYou';
import "./WrappedDashboard.css";

const WrappedDashboard = () => {
    return (
        <div className="wrapped-dashboard">
            {/* render your HotForYou section */}
            <div className="phone-emulator">
                <HotForYou />
            </div>
        </div>
    );
};

export default WrappedDashboard;
