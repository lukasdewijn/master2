import React from 'react';
import Layout from './layoutOnboarding.js';
import './Basisinformatie.css';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from './OnboardingContext';

const Basisinformatie = () => {
    const navigate = useNavigate();
    const { onboardingData, updateOnboardingData } = useOnboarding();

    const handleChange = (key, value) => {
        updateOnboardingData(key, value); // Update the context with key-value pairs
    };

    const handleNext = () => {
        console.clear(); // Clear the console for a cleaner output
        console.log('%cOnboarding Data Summary:', 'color: green; font-size: 16px; font-weight: bold;');
        console.table(onboardingData); // Log the data in a table format for better readability
        navigate('/typehoreca');
    };

    return (
        <Layout title="Contactinformatie" progress={20}>
            <div className="form-container">
                <div className="form-section">
                    <label>Voornaam Manager</label>
                    <input
                        type="text"
                        placeholder="Voornaam Manager"
                        value={onboardingData.managerFirstName || ''}
                        onChange={(e) => handleChange('managerFirstName', e.target.value)}
                    />
                </div>
                <div className="form-section">
                    <label>Achternaam Manager</label>
                    <input
                        type="text"
                        placeholder="Achternaam Manager"
                        value={onboardingData.managerLastName || ''}
                        onChange={(e) => handleChange('managerLastName', e.target.value)}
                    />
                </div>
                <div className="form-section">
                    <label>Naam Horecazaak</label>
                    <input
                        type="text"
                        placeholder="Naam Horecazaak"
                        value={onboardingData.horecaName || ''}
                        onChange={(e) => handleChange('horecaName', e.target.value)}
                    />
                </div>
                <div className="form-section">
                    <label>Adress</label>
                    <input
                        type="text"
                        placeholder="Adress"
                        value={onboardingData.address || ''}
                        onChange={(e) => handleChange('address', e.target.value)}
                    />
                </div>
                <div className="form-section">
                    <label>Telefoonnummer</label>
                    <input
                        type="text"
                        placeholder="Telefoonnummer"
                        value={onboardingData.phone || ''}
                        onChange={(e) => handleChange('phone', e.target.value)}
                    />
                </div>
                <div className="form-section">
                    <label>E-mail</label>
                    <input
                        type="text"
                        placeholder="E-mail"
                        value={onboardingData.email || ''}
                        onChange={(e) => handleChange('email', e.target.value)}
                    />
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

export default Basisinformatie;
