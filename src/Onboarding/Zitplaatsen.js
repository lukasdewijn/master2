import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from './layoutOnboarding';
import './Zitplaatsen.css';
import { useOnboarding } from './OnboardingContext'; // Import the context hook

const Zitplaatsen = () => {
    const navigate = useNavigate();
    const { onboardingData, updateOnboardingData } = useOnboarding(); // Destructure context
    const [selectedOption, setSelectedOption] = useState(onboardingData.zitplaatsen || null); // Initialize with context value

    const options = ["1-10", "11-30", "31-50", "51-100", "101-200", "200+"];

    const handleNext = () => {
        if (selectedOption !== null) {
            // Update the context with the selected option
            updateOnboardingData('zitplaatsen', options[selectedOption]);

            // Log the updated onboarding data
            console.log('Updated Onboarding Data:', { ...onboardingData, zitplaatsen: options[selectedOption] });

            // Navigate to the next page
            navigate('/kenmerken');
        } else {
            alert("Gelieve een optie te selecteren."); // Notify the user if no option is selected
        }
    };

    return (
        <Layout title="Zitplaatsen" progress={40}>
            <div className="zitplaatsen-container">
                <h1 style={{ marginBottom: '5rem' }}>Hoeveel zitplaatsen heeft uw zaak?</h1>
                <div className="zitplaatsen-options-container">
                    {options.map((option, index) => (
                        <button
                            key={index}
                            className={`zitplaatsen-option-button ${selectedOption === index ? "selected" : ""}`}
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

export default Zitplaatsen;
