import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from './layoutOnboarding';
import './Belangrijker.css';
import { useOnboarding } from './OnboardingContext';
import axios from 'axios';

const Belangrijker3 = () => {
    const navigate = useNavigate();
    const { onboardingData, updateOnboardingData } = useOnboarding();
    const [selectedOption, setSelectedOption] = useState(onboardingData.belangrijker3 || null);

    const options = [
        "<<< Veel belangrijker",
        "<< Belangrijker",
        "< Beetje belangrijker",
        "Even belangrijk",
        "Beetje belangrijker >",
        "Belangrijker >>",
        "Veel belangrijker >>>"
    ];

    const handleNext = async () => {
        if (selectedOption === null) {
            alert("Gelieve een optie te selecteren.");
            return;
        }

        // Update the final field in context
        updateOnboardingData('belangrijker3', options[selectedOption]);

        // Now we have all fields in `onboardingData`. Let's send it to the server.
        try {
            console.log("Final Onboarding Data:", { ...onboardingData, belangrijker3: options[selectedOption] });

            // Make a POST request to your backend
            const response = await axios.post('/api/complete-onboarding', {
                ...onboardingData,
                belangrijker3: options[selectedOption]
            });

            // If successful, you can navigate to a success page or do something else
            console.log('Data saved:', response.data);
            navigate('/onboarding-complete'); // Or any other success route
        } catch (error) {
            console.error('Error saving data:', error);
            alert('Er is een fout opgetreden bij het opslaan van de data.');
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
