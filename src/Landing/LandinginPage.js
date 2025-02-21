import React from 'react';
import "./LandingPage.css";

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
                <p className="login-title">OrderBilly</p>

                <div className="login-section">
                    <h3>Login <span>your account</span></h3>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" placeholder="email" />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" placeholder="password" />
                    </div>

                    <button className="login-btn">Login</button>
                </div>

                <div className="register-section">
                    <h3>Register <span>your business</span></h3>
                    <button className="register-btn">Get Started</button>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
