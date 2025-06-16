import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, Link } from 'react-router-dom';
import { resetPassword } from '../../api/api';
import '../register/register.scss';

export function ResetPassword() {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: '',
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

        if (formData.newPassword !== formData.confirmPassword) {
            setError(t('reset-password-mismatch'));
            setIsLoading(false);
            return;
        }

        try {
            await resetPassword({
                token,
                newPassword: formData.newPassword,
            });
            setMessage(t('reset-password-success'));
            setFormData({ newPassword: '', confirmPassword: '' });
        } catch (err) {
            setError(err.response?.data?.error || t('reset-password-error'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container-register">
            <div className="div-img">
                <img src="resources/background-banner.png" alt={t('reset-password-image-alt')} />
            </div>
            <div className="div-form">
                <h1>{t('reset-password-title')}</h1>
                <h3>{t('reset-password-subtitle')}</h3>
                {message && <p className="success-message">{message}</p>}
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit} className="register-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="newPassword">{t('reset-password-new-label')}</label>
                            <input
                                type="password"
                                id="newPassword"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                required
                                placeholder={t('reset-password-new-placeholder')}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword">{t('reset-password-confirm-label')}</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                placeholder={t('reset-password-confirm-placeholder')}
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn" disabled={isLoading || !token}>
                        {isLoading ? t('reset-password-loading') : t('reset-password-button')}
                    </button>
                </form>
                <p>
                    <Link to="/login">{t('reset-password-login-prompt')}</Link>
                </p>
            </div>
        </div>
    );
}