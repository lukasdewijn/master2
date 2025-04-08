import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from './layoutOnboarding.js';
import { useOnboarding } from './OnboardingContext';
import './Basisinformatie.css';
import bcrypt from 'bcryptjs';
import axios from 'axios';

const formFields = [
    {
        label: 'Voornaam Manager',
        placeholder: 'Voornaam Manager',
        key: 'manager_first_name',
    },
    {
        label: 'Naam Horecazaak',
        placeholder: 'Naam Horecazaak',
        key: 'horeca_name',
    },
    {
        label: 'E-mail',
        placeholder: 'E-mail',
        key: 'email',
    },
    {
        label: 'Kies een wachtwoord',
        placeholder: 'Wachtwoord',
        key: 'password',
    },
    {
        label: 'Achternaam Manager',
        placeholder: 'Achternaam Manager',
        key: 'manager_last_name',
    },
    {
        label: 'Address',
        placeholder: 'Address',
        key: 'address',
    },
    {
        label: 'Telefoonnummer',
        placeholder: 'Telefoonnummer',
        key: 'phonenumber',
    },
    {
        label: 'Herhaal wachtwoord',
        placeholder: 'Wachtwoord',
        key: 'passwordrepeat',
    },
];

const Basisinformatie = () => {
    const navigate = useNavigate();
    const { onboardingData, updateOnboardingData } = useOnboarding();

    // Keep local state so we only update the context on "Volgende"
    const [formData, setFormData] = useState(() => ({
        manager_first_name: onboardingData.manager_first_name || '',
        manager_last_name: onboardingData.manager_last_name || '',
        horeca_name: onboardingData.horeca_name || '',
        email: onboardingData.email || '',
        password: onboardingData.password || '',
        address: onboardingData.address || '',
        phonenumber: onboardingData.phonenumber || '',
        passwordrepeat: onboardingData.passwordrepeat || '',
    }));

    // Update local form state on keystroke
    const handleChange = (key, value) => {
        setFormData(prev => ({
            ...prev,
            [key]: value,
        }));
    };

    // Validate & hash password, then send data to server on "Volgende"
    const handleNext = async () => {
        console.clear();
        console.log('%cOnboarding Data (before hashing):', 'color: green; font-size: 16px; font-weight: bold;');
        console.table(formData);

        // 1. Check if both password fields match
        if (formData.password !== formData.passwordrepeat) {
            alert('Wachtwoorden matchen niet!');
            return;
        }

        // 2. Hash the password (client-side example)
        const hashedPassword = bcrypt.hashSync(formData.password, 10);

        // 3. Create a final object to store in the context and send to server
        const finalData = {
            ...formData,
            password: hashedPassword,    // replace with hashed password
        };
        // Optionally remove the repeated password field
        delete finalData.passwordrepeat;

        console.log('%cOnboarding Data (after hashing):', 'color: blue; font-size: 16px; font-weight: bold;');
        console.table(finalData);

        // 4. Send the final data to the server via Axios
        try {
            const response = await axios.post('http://localhost:3007/api/complete-onboarding', finalData);
            console.log('Server response:', response.data);
        } catch (error) {
            console.error('Error sending data to server:', error);
            alert('Error sending data to server. Please try again later.');
            return; // stop if there's an error
        }

        // 5. Update the context and navigate to the next step
        updateOnboardingData(null, finalData);
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
