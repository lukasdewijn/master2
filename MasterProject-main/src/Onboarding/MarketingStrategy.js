import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from './layoutOnboarding';
import './MarketingStrategy.css';
import { useOnboarding } from './OnboardingContext'; // Import context

const MarketingStrategy = () => {
    const navigate = useNavigate();
    const { onboardingData, updateOnboardingData } = useOnboarding(); // Gebruik context
    const [selectedStrategies, setSelectedStrategies] = useState(onboardingData.marketingStrategies || []); // Initialiseer met contextdata of leeg

    const strategies = [
        "Geen Marketing", "Social Media", "E-mail", "Samenwerking met Influencers", "Search Engine Optimalization",
        "Website", "Lokale Evenementen", "Flyers en Drukwerk", "Advertenties op Sociale Media",
        "Samenwerking met Lokale Bedrijven", "Referral Programma", "Seizoensgebonden Acties"
    ];

    const handleStrategyToggle = (strategy) => {
        setSelectedStrategies(prevState =>
            prevState.includes(strategy)
                ? prevState.filter(item => item !== strategy)
                : [...prevState, strategy]
        );
    };

    const handleNext = () => {
        updateOnboardingData('marketingStrategies', selectedStrategies); // Sla geselecteerde strategieën op in de context
        console.log('Updated Marketing Strategies:', selectedStrategies); // Log geselecteerde strategieën
        console.log('Final Onboarding Data:', { ...onboardingData, marketingStrategies: selectedStrategies }); // Log het volledige onboardingData-object
        navigate('/belangrijker1'); // Ga naar de volgende pagina
    };

    return (
        <Layout title="Selecteer alle marketingstrategieën die u momenteel gebruikt of zou willen overwegen." progress={80}>
            <div className="marketing-strategie-container">
                <div className="marketing-strategie-options">
                    {strategies.map((strategy, index) => (
                        <button
                            key={index}
                            className={`strategie-button ${selectedStrategies.includes(strategy) ? "selected" : ""}`}
                            onClick={() => handleStrategyToggle(strategy)}
                        >
                            {strategy}
                        </button>
                    ))}
                </div>
            </div>
            <div className="start-button-container">
                <button className="start-button" onClick={handleNext}>
                    Volgende
                </button>
            </div>
        </Layout>
    );
};

export default MarketingStrategy;
