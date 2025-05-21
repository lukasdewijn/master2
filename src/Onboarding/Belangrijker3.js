import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from './layoutOnboarding';
import './Belangrijker.css';
import { useOnboarding } from './OnboardingContext';

const Belangrijker3 = () => {
    const navigate = useNavigate();
    const { onboardingData, updateOnboardingData } = useOnboarding();
    const [selectedOption, setSelectedOption] = useState(onboardingData.belangrijker3 ?? null);

    const options = [
        "<<< Veel belangrijker",
        "<< Belangrijker",
        "< Beetje belangrijker",
        "Even belangrijk",
        "Beetje belangrijker >",
        "Belangrijker >>",
        "Veel belangrijker >>>"
    ];

    const handleNext = () => {
        if (selectedOption === null) {
            alert("Gelieve een optie te selecteren.");
            return;
        }

        // Update de laatste field in de context
        updateOnboardingData('belangrijker3', options[selectedOption]);

        // Direct navigeren naar de “Welkom” pagina
        navigate('/welcome');
    };

    return (
        <Layout title="Wat is er belangrijker voor u?" progress={60}>
            <div className="belangrijker-container">
                <div className="belangrijker-labels">
                    <h2>Winst</h2>
                    <h2>Huidige klanten tevreden houden</h2>
                </div>
                <div className="belangrijker-options-container">
                    {options.map((option, idx) => (
                        <button
                            key={idx}
                            className={`belangrijker-option-button ${selectedOption === idx ? "selected" : ""}`}
                            onClick={() => setSelectedOption(idx)}
                        >
                            {option}
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

export default Belangrijker3;
