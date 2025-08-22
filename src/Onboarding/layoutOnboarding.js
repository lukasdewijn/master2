import React from 'react';
import './layoutOnboarding.css';
import { useNavigate } from 'react-router-dom';

const Layout = ({ title, children, progress,showFooter = true  }) => {
    const navigate = useNavigate();

    return (
        <div className="layout">
            <header className="layout-header">
                <h1>{title}</h1>
            </header>
            <div className="layout-content-container">

                <main className="layout-content">
                    {children}
                </main>
            </div>
            {showFooter && (
                <footer className="layout-footer">
                    <p className="layout-footer-text" onClick={() => navigate(-1)}>&lt; vorige pagina</p>
                    <div className="progress-bar">
                        <div className="progress" style={{ width: `${progress}%` }}></div>
                    </div>
                </footer>
            )}
        </div>
    );
};

export default Layout;
