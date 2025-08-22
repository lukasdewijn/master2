import React, { useState } from 'react';
import "./LandingPage.css";
import BillyLogo from "../Images/BillyLogo.svg";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const LandingPage = () => {
    const navigate = useNavigate();

    // Local state for login inputs
    const [loginData, setLoginData] = useState({
        email: "",
        password: ""
    });

    // Handler for updating login input state
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setLoginData((prev) => ({
            ...prev,
            [id]: value
        }));
    };

    // Handler when the "Get Started" button is clicked
    const handleGetStarted = () => {
        navigate('/contact');
    };

    // Handler to validate the login credentials
    const handleLogin = async () => {
        try {
            const res = await axios.post('http://localhost:3007/api/login', loginData);
            if (res.data.success) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('business_id', res.data.business_id);
                navigate('/dashboard');
            } else {
                alert('Invalid credentials');
            }
        } catch(err) {
            console.error(err);
            alert('Server error');
        }
    };


    return (
        <div className="container">
            <div className="content">
                <div className="logo">
                    <img src={BillyLogo} alt="Billy Logo" />
                    <span className="logo-text">Billy</span>
                </div>
                <div className="main-text">
                    <div className="text-upper">
                        <h1>Build Your Menu. Boost Your Business.</h1>
                        <br />
                        <p>Discover new products, refine your menu, and optimize sales with data-driven insights.</p>
                    </div>
                    <div className="text-bottom">
                        <h2 className="why-billy">Why choose Billy?</h2>
                        <br />
                        <ul className="features">
                            <li>✔ Get fast sales insights with our season wrapped</li>
                            <li>✔ Discover trendy menu items before your competitors</li>
                            <li>✔ Optimize your menu to boost sales and target your desired audience</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Right Section: Login */}
            <div className="login-container">
                <p className="login-title">OrderBilly</p>

                <div className="login-section">
                    <h3>Login <span>your account</span></h3>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="email"
                            value={loginData.email}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="password"
                            value={loginData.password}
                            onChange={handleInputChange}
                        />
                    </div>

                    <button className="login-btn" onClick={handleLogin}>Login</button>
                </div>

                <div className="register-section">
                    <h3>Register <span>your business</span></h3>
                    <button className="register-btn" onClick={handleGetStarted}>Get Started</button>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
