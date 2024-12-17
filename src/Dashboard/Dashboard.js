import React, { useState } from 'react';
import Layout from './Layout'; // Import the reusable Layout component

const Dashboard = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Function to update the selected category
    const handleSelectionChange = (selection) => {
        setSelectedCategory(selection); // Update state with the selected category
    };

    return (
        <Layout onSelectionChange={handleSelectionChange}>
            <div>

            </div>
        </Layout>
    );
};

export default Dashboard;
