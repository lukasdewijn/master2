import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from './layoutOnboarding';
import './Promoties.css';
import { useOnboarding } from './OnboardingContext'; // Import context

const Promoties = () => {
    const navigate = useNavigate();
    const { onboardingData, updateOnboardingData } = useOnboarding(); // Gebruik context
    const [selectedPromotions, setSelectedPromotions] = useState(onboardingData.promotions || []); // Initialiseer met eerder opgeslagen data of leeg

    const promotions = [
        "Geen Promoties", "Happy Hour", "2+1 Gratis", "Seizoensspecials", "Product van de dag/week",
        "Groepskorting", "Loyaliteitsprogramma", "Social Media Aanbiedingen", "Studentenkorting",
        "Familiekorting", "Lunchdeals", "All-You-Can-Eat", "Gratis Aperitief",
        "Korting op Afhaalmaaltijden", "Eerste Bestelling korting", "Gift/Cadeau"
    ];

    const handlePromotionToggle = (promotion) => {
        setSelectedPromotions(prevState =>
            prevState.includes(promotion)
                ? prevState.filter(item => item !== promotion)
                : [...prevState, promotion]
        );
    };

    const handleNext = () => {
        updateOnboardingData('promotions', selectedPromotions); // Sla de geselecteerde promoties op in de context
        console.log('Updated Promotions:', selectedPromotions); // Log de geselecteerde promoties
        console.log('Final Onboarding Data:', { ...onboardingData, promotions: selectedPromotions }); // Log het volledige onboardingData-object
        navigate('/marketingstrategy'); // Ga naar de volgende pagina
    };

    return (
        <Layout title="Welke type promoties doet u?" progress={70}>
            <div className="promoties-container">
                <div className="promoties-options-container">
                    {promotions.map((promotion, index) => (
                        <button
                            key={index}
                            className={`promotie-button ${selectedPromotions.includes(promotion) ? "selected" : ""}`}
                            onClick={() => handlePromotionToggle(promotion)}
                        >
                            {promotion}
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

export default Promoties;
