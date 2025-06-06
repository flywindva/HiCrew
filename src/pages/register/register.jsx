import './register.scss';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { register } from '../../api/apì';
import {useTranslation} from "react-i18next";

export function Register() {
    const { t } = useTranslation();
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
            alert(t('register-error-password-mismatch'));
            return;
        }
        try {
            const response = await register(formData);
            console.log(t('register-success'), response.data);
            localStorage.setItem('token', response.data.token);
            window.location.href = '/central';
        } catch (error) {
            const errorMessage = error.response?.data?.error || t('register-error-default');
            console.error(t('register-error-prefix'), errorMessage);
            alert(`${t('register-error-prefix')} ${errorMessage}`);
        }
    };

    return (
        <div className="container-register">
            <div className="div-img">
                <img src="resources/background-banner.png" alt={t('register-image-alt')} />
            </div>
            <div className="div-form">
                <h1>Say hi!</h1>
                <h3>to your new adventure</h3>
                <form onSubmit={handleSubmit} className="register-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="firstName">{t('register-first-name-label')}</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                placeholder={t('register-first-name-placeholder')}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastName">{t('register-last-name-label')}</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                placeholder={t('register-last-name-placeholder')}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="email">{t('register-email-label')}</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder={t('register-email-placeholder')}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="birthDate">{t('register-birth-date-label')}</label>
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
                            <label htmlFor="password">{t('register-password-label')}</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength="8"
                                placeholder={t('register-password-placeholder')}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="repeatPassword">{t('register-repeat-password-label')}</label>
                            <input
                                type="password"
                                id="repeatPassword"
                                name="repeatPassword"
                                value={formData.repeatPassword}
                                onChange={handleChange}
                                required
                                minLength="8"
                                placeholder={t('register-repeat-password-placeholder')}
                            />
                        </div>

                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="ivaoId">{t('register-ivao-id-label')}</label>
                            <input
                                type="number"
                                id="ivaoId"
                                name="ivaoId"
                                value={formData.ivaoId}
                                onChange={handleChange}
                                placeholder={t('register-ivao-id-placeholder')}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="vatsimId">{t('register-vatsim-id-label')}</label>
                            <input
                                type="number"
                                id="vatsimId"
                                name="vatsimId"
                                value={formData.vatsimId}
                                onChange={handleChange}
                                placeholder={t('register-vatsim-id-placeholder')}
                            />
                        </div>
                    </div>
                    <p><input type={"checkbox"} required/> <span
                        dangerouslySetInnerHTML={{ __html: t('register-rules-accept') }}
                    />
                    </p>

                    <button type="submit" className="btn">
                        {t('register-button')}
                    </button>
                </form>
                <p>
                    <Link to="/login">{t('register-login-prompt')}</Link>
                </p>
            </div>
        </div>
    );
}