import React, { useState } from "react";
import Icon from '@mdi/react';
import { mdiEye, mdiEyeOff } from '@mdi/js';
import Navbar from './../components/CommonComponents/Navbar';

function LoginPage() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const PasswordInput = () => {
        const [showPassword, setShowPassword] = useState(false);
        const [password, setPassword] = useState('');
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (data.success) {
            alert("Login Successful!");
        } else {
            alert("Login Failed. Check your credentials.");
        }
    };

    return (
        <>
        <Navbar/>   
        <div className="sg_main_container_login_page">
            <div className="sg_login_background_main">
                <div className="sg_login_main_container">
                    <form onSubmit={handleLogin}>
                        <div className="sg_login_title_main_container">
                            <h2 className="sg_logon_title">Hi, Welcome Back</h2>
                            <p className="sg_login_subtitle">Enter your credentials to continue</p>
                        </div>
                        <div className="sg_input_filed_main">
                            <input
                                type="email"
                                placeholder="john.doe@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="sg_login_email_input"
                            />
                            <div className="">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="sg_login_password_input"
                                />
                                <span
                                    className="sg_custom_password_toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <Icon
                                        path={showPassword ? mdiEyeOff : mdiEye}
                                        size={1}
                                        color="black"
                                        title={showPassword ? "Hide password" : "Show password"}
                                    />
                                </span>
                            </div>
                        </div>
                        <div className="sg_login_remember_me">
                            <label>
                                <input type="checkbox" style={{marginRight:5}}/>
                                Remember me
                            </label>
                            <a href="/" className="sg_login_forgot_password">Forgot Password?</a>
                        </div>
                        <button type="submit" className="sg_login_main_button">Login</button>
                        <p className="sg_signup_txt_main">
                            Don’t have an account? <a href="/" className="sg_signup_link">Sign up</a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
        </>
    );
}

export default LoginPage;
