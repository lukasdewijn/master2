import React, { useState } from 'react';
import "./LandingPage.css"
const LandingPage = () => {
    return (
        <div className="container">
            <div className="content">
                <div className="logo">
                    <img src="logo.svg" alt="Billy Logo" />
                    <span className="logo-text">Billy</span>
                </div>
                <h1>Build Your Menu. Boost Your Business.</h1>
                <p>Discover new products, refine your menu, and optimize sales with data-driven insights.</p>

                <h2>Why choose Billy?</h2>
                <ul className="features">
                    <li>✔ Get fast sales insights with our season wrapped</li>
                    <li>✔ Discover trendy menu items before your competitors</li>
                    <li>✔ Optimize your menu to boost sales and target your desired audience</li>
                </ul>
            </div>

            {/* Right Section: Login */}
            <div className="login-container">
                <h2 className="login-title">OrderBilly</h2>

                <div className="login-section">
                    <h3>Login <span>your account</span></h3>
                    <br/><br/>
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" placeholder="email" />

                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" placeholder="password" />

                    <button className="login-btn">Login</button>
                </div>
                <br/><br/><br/>
                <div className="register-section">
                    <h3>Register <span>your business</span></h3>
                    <br/>
                    <button className="register-btn">Get Started</button>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
