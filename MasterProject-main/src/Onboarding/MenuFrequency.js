import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from './layoutOnboarding';
import './MenuFrequency.css';
import { useOnboarding } from './OnboardingContext'; // Import context

const MenuFrequency = () => {
    const navigate = useNavigate();
    const { onboardingData, updateOnboardingData } = useOnboarding(); // Gebruik context
    const [selectedOption, setSelectedOption] = useState(onboardingData.menuFrequency || null);

    const options = ["Elke week", "Elke maand", "Elk seizoen", "Elk half jaar", "Jaarlijks", "Minder dan jaarlijks"];

    const handleNext = () => {
        if (selectedOption !== null) {
            updateOnboardingData('menuFrequency', options[selectedOption]); // Sla de geselecteerde optie op in context
            console.log('Updated Menu Frequency:', options[selectedOption]); // Log de geselecteerde waarde
            console.log('Final Onboarding Data:', { ...onboardingData, menuFrequency: options[selectedOption] }); // Log het volledige onboardingData-object
            navigate('/promoties'); // Ga naar de volgende pagina
        } else {
            alert('Selecteer een optie voordat je doorgaat!'); // Waarschuwing als er geen optie is geselecteerd
        }
    };

    return (
        <Layout title="Hoe vaak past u uw menu aan ongeveer?" progress={50}>
            <div className="menu-frequency-container">
                <div className="menu-frequency-options-container">
                    {options.map((option, index) => (
                        <button
                            key={index}
                            className={`menu-frequency-option-button ${selectedOption === index ? "selected" : ""}`}
                            onClick={() => setSelectedOption(index)}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>
            <div className="start-button-container">
                <button className="start-button" onClick={handleNext}>Volgende</button>
            </div>
        </Layout>
    );
};

export default MenuFrequency;
