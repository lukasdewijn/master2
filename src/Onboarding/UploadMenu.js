import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from './layoutOnboarding';
import './UploadMenu.css';

const UploadMenu = () => {
    const navigate = useNavigate();
    const [fileName, setFileName] = useState("");

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name);
        }
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file) {
            setFileName(file.name);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    return (
        <Layout title="Upload uw menu" progress={90}>
            <div className="upload-menu-container">
                <div
                    className="upload-box"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                >
                    <input
                        type="file"
                        id="fileInput"
                        className="file-input"
                        onChange={handleFileChange}
                    />
                    <label htmlFor="fileInput" className="upload-label">
                        {fileName || "Klik om te bladeren door bestanden of sleep ze hierheen"}
                    </label>
                </div>
                <div className="start-button-container">
                    <button className="start-button" onClick={() => navigate('/menufrequency')}>Volgende</button>
                </div>
            </div>
        </Layout>
    );
};

export default UploadMenu;
