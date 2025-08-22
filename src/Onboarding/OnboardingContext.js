import React, { createContext, useContext, useState } from 'react';

// Create the context
const OnboardingContext = createContext();

// Hook to use the context
export const useOnboarding = () => useContext(OnboardingContext);

// Provider component
export const OnboardingProvider = ({ children }) => {
    const [onboardingData, setOnboardingData] = useState({}); // Store all onboarding data

    // Update function to dynamically update fields
    const updateOnboardingData = (key, value) => {
        setOnboardingData((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    return (
        <OnboardingContext.Provider value={{ onboardingData, updateOnboardingData }}>
            {children}
        </OnboardingContext.Provider>
    );
};
