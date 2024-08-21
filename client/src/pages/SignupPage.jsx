import React, { useState }  from "react";
import Navbar from './../components/CommonComponents/Navbar';

function SignupPage() {

        const [formData, setFormData] = useState({
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            password: '',
            confirmPassword: '',
            agreeToTerms: false,
        });

        const handleChange = (e) => {
            const { name, value, type, checked } = e.target;
            setFormData({
                ...formData,
                [name]: type === 'checkbox' ? checked : value,
            });
        };

        const handleSubmit = (e) => {
            e.preventDefault();
            console.log('Form Data Submitted:', formData);
        };

        return (
            <div>
                <Navbar/>
                <div className="sg_signup_page_main_container">
                    <div className="sg_signup_page_form_container">
                        <h2 className="sg_signup_page_title">Sign up</h2>
                        <p className="sg_signup_page_subtitle">Enter your credentials to continue</p>
                        <form onSubmit={handleSubmit}>
                            <div className="sg_signup_page_input_group">
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="First Name"
                                    className="sg_signup_page_input"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                />
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Last Name"
                                    className="sg_signup_page_input"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="sg_signup_page_input_group">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    className="sg_signup_page_input"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                <input
                                    type="text"
                                    name="phoneNumber"
                                    placeholder="Phone Number"
                                    className="sg_signup_page_input"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="sg_signup_page_input_passwoard">
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    className="sg_signup_page_input"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    className="sg_signup_page_input"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="sg_signup_page_checkbox_container">
                                <input
                                    type="checkbox"
                                    name="agreeToTerms"
                                    id="terms"
                                    className="sg_signup_page_checkbox"
                                    checked={formData.agreeToTerms}
                                    onChange={handleChange}
                                />
                                <label htmlFor="terms" className="sg_signup_page_terms">
                                    I agree to all the <span className="sg_signup_page_terms_link">Terms</span> and <span className="sg_signup_page_terms_link">Privacy Policies</span>
                                </label>
                            </div>
                            <button type="submit" className="sg_signup_page_button">Create account</button>
                            <p className="sg_signup_page_login_text">Already have an account? <a href="#" className="sg_signup_page_login_link">Login</a></p>
                        </form>
                    </div>
                </div>
            </div>);
    }

    export default SignupPage;
