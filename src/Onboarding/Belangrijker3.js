import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from './layoutOnboarding';
import './Belangrijker.css'; // Create a CSS file based on Zitplaatsen.css
import { useOnboarding } from './OnboardingContext'; // Import the context hook

const Belangrijker3 = () => {
    const navigate = useNavigate();
    const { onboardingData, updateOnboardingData } = useOnboarding(); // Use context
    const [selectedOption, setSelectedOption] = useState(onboardingData.belangrijker3 || null); // Initialize state with context

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
        if (selectedOption !== null) {
            // Update context with the selected option
            updateOnboardingData('belangrijker3', options[selectedOption]);

            // Log the updated data
            console.log('Updated Onboarding Data:', { ...onboardingData, belangrijker3: options[selectedOption] });

            // Navigate to the next page
            navigate('/next-page'); // Replace with your actual next page route
        } else {
            alert("Gelieve een optie te selecteren."); // Notify the user if no option is selected
        }
    };

    return (
        <Layout title="Wat is er belangrijker voor u?" progress={60}>
            <div className="belangrijker-container">
                <div className="belangrijker-labels">
                    <h2>Winst</h2>
                    <h2>Huidige klanten tevreden houden</h2>
                </div>
                <div className="belangrijker-options-container">
                    {options.map((option, index) => (
                        <button
                            key={index}
                            className={`belangrijker-option-button ${selectedOption === index ? "selected" : ""}`}
                            onClick={() => setSelectedOption(index)}
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
