import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from './layoutOnboarding';
import './ClienteleAnalysis.css';

import { useOnboarding } from './OnboardingContext'; // Import context

import Budgetbewust from '../profielen/Budgetbewust.png';
import Fijnproever from '../profielen/Fijn-proever.png';
import Gezondheidsbewuste from '../profielen/Gezondheidsbewuste.png';
import LocalLover from '../profielen/Local-Lover.png';
import Luxezoeker from '../profielen/Luxezoeker.png';
import Milieubewuste from '../profielen/Milieubewuste.png';
import Traditionalist from '../profielen/Traditionalist.png';
import Trendvolger from '../profielen/Trendvolger.png';

const personas = [
    { name: "Traditionalist", image: Traditionalist },
    { name: "Local-Lover", image: LocalLover },
    { name: "Trendvolger", image: Trendvolger },
    { name: "Budgetbewust", image: Budgetbewust },
    { name: "Fijn-Proever", image: Fijnproever },
    { name: "Gezondheidsbewuste", image: Gezondheidsbewuste },
    { name: "Milieubewuste", image: Milieubewuste },
    { name: "Luxezoeker", image: Luxezoeker },
];

const ClienteleAnalysis = () => {
    const navigate = useNavigate();
    const { onboardingData, updateOnboardingData } = useOnboarding(); // Use context

    const [percentages, setPercentages] = useState(
        onboardingData.personaDistribution ||
        personas.reduce((acc, persona) => {
            acc[persona.name] = 0; // Start all sliders at 0 or use existing data
            return acc;
        }, {})
    );

    const handleSliderChange = (name, value) => {
        setPercentages((prev) => ({
            ...prev,
            [name]: parseInt(value, 10),
        }));
    };

    const handleNext = () => {
        updateOnboardingData('personaDistribution', percentages); // Save data to context
        console.log('Final Onboarding Data:', { ...onboardingData, personaDistribution: percentages });
        navigate('/toerisme'); // Navigate to the next page
    };

    return (
        <Layout title="Clientele analyse" progress={90}>
            <div className="clientele-analysis-container">
                <p className="clientele-analysis-subtitle">Gebruik de schuifregelaars onder elke profielcategorie om het percentage klanten per profiel aan te passen.</p>
                <div className="clientele-grid">
                    {personas.map((persona, index) => (
                        <div key={index} className="clientele-persona-row">
                            <div className="clientele-persona-info">
                                <img src={persona.image} alt={persona.name} className="clientele-persona-image" />
                                <span className="clientele-persona-label">{persona.name}</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={percentages[persona.name]}
                                className="clientele-slider-horizontal"
                                style={{
                                    background: `linear-gradient(to right, #FA954B ${percentages[persona.name]}%, #F9D8B4 ${percentages[persona.name]}%)`,
                                }}
                                onChange={(e) => handleSliderChange(persona.name, e.target.value)}
                            />
                        </div>
                    ))}
                </div>
                <div className="start-button-container">
                    <button className="start-button" onClick={handleNext}>
                        Volgende
                    </button>
                </div>
            </div>
        </Layout>
    );
};

export default ClienteleAnalysis;
