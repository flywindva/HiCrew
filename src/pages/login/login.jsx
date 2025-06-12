import '../register/register.scss';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import {login} from "../../api/api";
import {useTranslation} from "react-i18next";

export function Login() {
    const { t } = useTranslation();
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
            const errorMessage = error.response?.data?.error || t('login-error-default');
            console.error(t('login-error-prefix'), errorMessage);
            alert(`${t('login-error-prefix')} ${errorMessage}`);
        }
    };

    return (
        <div className="container-register">
            <div className="div-img">
                <img src="resources/background-banner.png" alt={t('login-image-alt')} />
            </div>
            <div className="div-form">
                <h1>{t('login-title')}</h1>
                <h3>{t('login-subtitle')}</h3>
                <form onSubmit={handleSubmit} className="register-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="email">{t('login-email-label')}</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder={t('login-email-placeholder')}
                            />
                        </div>

                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="password">{t('login-password-label')}</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength="8"
                                placeholder={t('login-password-placeholder')}
                            />
                        </div>

                    </div>
                    <Link to="/forgot">{t('login-forgot-password')}</Link>
                    <button type="submit" className="btn">
                        {t('login-button')}
                    </button>
                </form>
                <p>
                    <Link to="/register">{t('login-signup-prompt')}</Link>
                </p>
            </div>
        </div>
    );
}