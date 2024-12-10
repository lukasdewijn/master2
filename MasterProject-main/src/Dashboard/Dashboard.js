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
                <h1>
                    Welcome to {selectedCategory ? selectedCategory.menuId : 'the Dashboard'}
                </h1>
                {selectedCategory?.subItemId && (
                    <p>
                        Currently viewing: {selectedCategory.subItemId.replace(/-/g, ' ')}
                    </p>
                )}
                {!selectedCategory && (
                    <p>Select a category from the sidebar to get started!</p>
                )}
            </div>
        </Layout>
    );
};

export default Dashboard;
