import './register.scss';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export function Register() {
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        email: '',
        password: '',
        repeatPassword: '',
        birthday: '',
        ivaoVid: '',
        vatsimId: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.repeatPassword) {
            alert("Passwords don't match!");
            return;
        }
        console.log('Form submitted:', formData);
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
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Enter your name"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="surname">Surname</label>
                            <input
                                type="text"
                                id="surname"
                                name="surname"
                                value={formData.surname}
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
                            <label htmlFor="birthday">Birthday</label>
                            <input
                                type="date"
                                id="birthday"
                                name="birthday"
                                value={formData.birthday}
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
                            <label htmlFor="ivaoVid">IVAO VID</label>
                            <input
                                type="number"
                                id="ivaoVid"
                                name="ivaoVid"
                                value={formData.ivaoVid}
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