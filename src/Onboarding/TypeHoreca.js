import { useNavigate } from "react-router-dom";
import Layout from "./layoutOnboarding";
import React, { useState } from "react";
import { useOnboarding } from "./OnboardingContext"; // Import the custom context hook
import "./TypeHoreca.css";

const TypeHoreca = () => {
    const navigate = useNavigate();
    const [selectedOption, setSelectedOption] = useState(null);
    const { onboardingData, updateOnboardingData } = useOnboarding(); // Use the onboarding context

    const options = [
        "Restaurants",
        "Café",
        "Bars en Lounges",
        "Nachtleven en entertainment",
        "Cafetaria's en eetgelegenheden",
        "Fast Food",
        "Hotelgerelateerde horeca",
        "Andere"
    ];

    const handleNext = () => {
        if (selectedOption !== null) {
            const selectedType = options[selectedOption];
            updateOnboardingData("typeHoreca", selectedType); // Save the selected option in the context
            console.clear();
            console.log('%cOnboarding Data Summary:', 'color: green; font-size: 16px; font-weight: bold;');
            console.table({ ...onboardingData, typeHoreca: selectedType }); // Log updated data
        }
        navigate('/zitplaatsen'); // Proceed to the next step
    };

    return (
        <Layout title="Type Horeca" progress={30}>
            <div className="type-horeca-container">
                <h1 style={{ marginBottom: '5rem' }}>Welke van deze opties past het best bij uw zaak</h1>
                <div className="options-container">
                    {options.map((option, index) => (
                        <button
                            key={index}
                            className={`option-button ${selectedOption === index ? "selected" : ""}`}
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

export default TypeHoreca;
