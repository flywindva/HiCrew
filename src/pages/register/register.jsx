import './register.scss';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { register } from '../../api/apì';

export function Register() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        repeatPassword: '',
        birthDate: '',
        ivaoId: '',
        vatsimId: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.repeatPassword) {
            alert("Passwords don't match!");
            return;
        }
        try {
            const response = await register(formData);
            console.log('Registro exitoso:', response.data);
            localStorage.setItem('token', response.data.token);
            window.location.href = '/central';
        } catch (error) {
            console.error('Error en el registro:', error.response?.data?.error);
            alert('Error: ' + (error.response?.data?.error || 'No se pudo registrar'));
        }
    };

    return (
        <div className="container-register">
            <div className="div-img">
                <img src="resources/background-banner.png" alt="Image Register" />
            </div>
            <div className="div-form">
                <h1>Say hi!</h1>
                <h3>to your new adventure</h3>
                <form onSubmit={handleSubmit} className="register-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="firstName">Name</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                placeholder="Enter your name"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastName">Surname</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                placeholder="Enter your surname"
                            />
                        </div>
                    </div>

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
                        <div className="form-group">
                            <label htmlFor="birthDate">Birthday</label>
                            <input
                                type="date"
                                id="birthDate"
                                name="birthDate"
                                value={formData.birthDate}
                                onChange={handleChange}
                                required
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
                        <div className="form-group">
                            <label htmlFor="repeatPassword">Repeat Password</label>
                            <input
                                type="password"
                                id="repeatPassword"
                                name="repeatPassword"
                                value={formData.repeatPassword}
                                onChange={handleChange}
                                required
                                minLength="8"
                                placeholder="Repeat your password"
                            />
                        </div>

                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="ivaoId">IVAO VID</label>
                            <input
                                type="number"
                                id="ivaoId"
                                name="ivaoId"
                                value={formData.ivaoId}
                                onChange={handleChange}
                                placeholder="Enter your IVAO VID"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="vatsimId">VATSIM ID</label>
                            <input
                                type="number"
                                id="vatsimId"
                                name="vatsimId"
                                value={formData.vatsimId}
                                onChange={handleChange}
                                placeholder="Enter your VATSIM ID"
                            />
                        </div>
                    </div>
                    <p><input type={"checkbox"} required/> You accept the <Link to={"/rules"}>airline's rules</Link> when you register.</p>

                    <button type="submit" className="btn">
                        Register
                    </button>
                </form>
                <p>
                    <Link to="/login">Have an account? Log in Here</Link>
                </p>
            </div>
        </div>
    );
}