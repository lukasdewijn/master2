import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from './layoutOnboarding.js';
import { useOnboarding } from './OnboardingContext';
import './Basisinformatie.css';

const formFields = [
    {
        label: 'Voornaam Manager',
        placeholder: 'Voornaam Manager',
        key: 'managerFirstName',
    },
    {
        label: 'Naam Horecazaak',
        placeholder: 'Naam Horecazaak',
        key: 'horecaName',
    },
    {
        label: 'E-mail',
        placeholder: 'E-mail',
        key: 'email',
    },
    {
        label: 'Kies een wachtwoord',
        placeholder: 'Wachtwoord',
        key: 'wachtwoord',
    },
    {
        label: 'Achternaam Manager',
        placeholder: 'Achternaam Manager',
        key: 'managerLastName',
    },
    {
        label: 'Address',
        placeholder: 'Address',
        key: 'address',
    },
    {
        label: 'Telefoonnummer',
        placeholder: 'Telefoonnummer',
        key: 'phone',
    },
    {
        label: 'Herhaal wachtwoord',
        placeholder: 'Wachtwoord',
        key: 'wachtwoordherhaal',
    },
];

const Basisinformatie = () => {
    const navigate = useNavigate();
    const { onboardingData, updateOnboardingData } = useOnboarding();

    // Initialize local state from context if you want to keep previously entered data.
    // Otherwise, start with an empty object.
    const [formData, setFormData] = useState(() => {
        // This pre-fills fields if user navigates back to this step
        return {
            managerFirstName: onboardingData.managerFirstName || '',
            horecaName: onboardingData.horecaName || '',
            email: onboardingData.email || '',
            wachtwoord: onboardingData.wachtwoord || '',
            managerLastName: onboardingData.managerLastName || '',
            address: onboardingData.address || '',
            phone: onboardingData.phone || '',
            wachtwoordherhaal: onboardingData.wachtwoordherhaal || '',
        };
    });

    // Update local state on each keystroke
    const handleChange = (key, value) => {
        setFormData((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    // Only on "Volgende" do we store everything into the context
    const handleNext = () => {
        console.clear();
        console.log(
            '%cOnboarding Data Summary:',
            'color: green; font-size: 16px; font-weight: bold;'
        );
        console.table(formData);

        // Update the context with all the local data
        updateOnboardingData(null, formData);

        // Then navigate to the next step
        navigate('/typehoreca');
    };

    return (
        <Layout title="Contactinformatie" progress={20}>
            <div className="form-container">
                {formFields.map(({ label, placeholder, key }) => (
                    <div className="form-section" key={key}>
                        <label>{label}</label>
                        <input
                            type="text"
                            placeholder={placeholder}
                            value={formData[key] || ''}
                            onChange={(e) => handleChange(key, e.target.value)}
                        />
                    </div>
                ))}
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
