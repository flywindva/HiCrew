import '../register/register.scss';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import {useTranslation} from "react-i18next";

export function Forgot() {
    const { t } = useTranslation();
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
        console.log(t('forgot-form-submitted'), formData);
    };

    return (
        <div className="container-register">
            <div className="div-img">
                <img src="resources/background-banner.png" alt={t('forgot-image-alt')} />
            </div>
            <div className="div-form">
                <h1>{t('forgot-title')}</h1>
                <h3>{t('forgot-subtitle')}</h3>
                <form onSubmit={handleSubmit} className="register-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="email">{t('forgot-email-label')}</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder={t('forgot-email-placeholder')}
                            />
                        </div>

                    </div>

                    <button type="submit" className="btn">
                        {t('forgot-button')}
                    </button>
                </form>
                <p>
                    <Link to="/register">{t('forgot-signup-prompt')}</Link>
                </p>
            </div>
        </div>
    );
}