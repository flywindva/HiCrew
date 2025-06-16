import '../register/register.scss';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {forgotPassword} from "../../api/api";

export function Forgot() {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        email: '',
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setMessage('');
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        setError('');

        try {
            await forgotPassword({ email: formData.email });
            setMessage(t('forgot-success-message'));
            setFormData({ email: '' });
        } catch (err) {
            setError(err.response?.data?.error || t('forgot-error-message'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container-register">
            <div className="div-img">
                <img src="resources/background-banner.png" alt={t('forgot-image-alt')} />
            </div>
            <div className="div-form">
                <h1>{t('forgot-title')}</h1>
                <h3>{t('forgot-subtitle')}</h3>
                {message && <p className="success-message">{message}</p>}
                {error && <p className="error-message">{error}</p>}
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
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn" disabled={isLoading}>
                        {isLoading ? t('forgot-loading') : t('forgot-button')}
                    </button>
                </form>
                <p>
                    <Link to="/register">{t('forgot-signup-prompt')}</Link>
                </p>
            </div>
        </div>
    );
}