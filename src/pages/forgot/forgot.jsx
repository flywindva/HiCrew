import '../register/register.scss';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export function Forgot() {
    const [formData, setFormData] = useState({
        email: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
    };

    return (
        <div className="container-register">
            <div className="div-img">
                <img src="resources/background-banner.png" alt="Image Register" />
            </div>
            <div className="div-form">
                <h1>Forgotten your password?</h1>
                <h3>Enter your email address and we will send you a link to reset it.</h3>
                <form onSubmit={handleSubmit} className="register-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="Enter your email"
                            />
                        </div>

                    </div>

                    <button type="submit" className="btn">
                        Send
                    </button>
                </form>
                <p>
                    <Link to="/register">Don't have an account? Sign up for an account.</Link>
                </p>
            </div>
        </div>
    );
}