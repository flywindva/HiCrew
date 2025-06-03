import '../register/register.scss';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import {login} from "../../api/apì";

export function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await login(formData);
            console.log('Sucess:', response.data);
            localStorage.setItem('token', response.data.token);
            window.location.href = '/central';
        } catch (error) {
            console.error('Error:', error.response?.data?.error);
            alert('Error: ' + (error.response?.data?.error || 'Unable to log in'));
        }
    };

    return (
        <div className="container-register">
            <div className="div-img">
                <img src="resources/background-banner.png" alt="Image Register" />
            </div>
            <div className="div-form">
                <h1>Hi again!</h1>
                <h3>your flight awaits you</h3>
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

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength="8"
                                placeholder="Enter your password"
                            />
                        </div>

                    </div>
                    <Link to="/forgot">Forgotten your password?</Link>
                    <button type="submit" className="btn">
                        Login
                    </button>
                </form>
                <p>
                    <Link to="/register">Don't have an account? Sign up for an account.</Link>
                </p>
            </div>
        </div>
    );
}