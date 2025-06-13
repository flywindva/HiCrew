import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import api from '../../api/api';

export function DeleteAccount() {
    const { t } = useTranslation();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await api.get('/auth/me');
                const pilot = response?.data?.pilot;
                if (pilot) {
                    setUser(pilot);
                    setError(null);
                } else {
                    throw new Error(t('failed-to-fetch-user'));
                }
            } catch (error) {
                console.error(t('failed-to-fetch-user'), {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status,
                    headers: error.response?.headers,
                });
                const errorMessage =
                    error.response?.data?.error ||
                    error.message ||
                    t('failed-to-fetch-user');
                setError(errorMessage);
            }
        };

        fetchUserData();
    }, [t]);

    const handleDelete = async (e) => {
        e.preventDefault();
        if (!confirmDelete) {
            setConfirmDelete(true);
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await api.delete('/auth/delete-me');
            setSuccess(response.data.message);
            setUser(null);
            setConfirmDelete(false);
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        } catch (error) {
            console.error(t('failed-to-delete-account'), {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                headers: error.response?.headers,
            });
            const errorMessage =
                error.response?.data?.error ||
                error.message ||
                t('failed-to-delete-account');
            setError(errorMessage);
            setConfirmDelete(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="view-model left">
            <h2>
                <FontAwesomeIcon icon={faTrashCan} /> {t('delete-account-title')}
            </h2>
            <p>{t('delete-account-description')}</p>
            {user ? (
                <div className="user-info">
                    <p>
                        {t('user-name')}: <strong>{user.firstName} {user.lastName}</strong>
                    </p>
                    <p>
                        {t('user-email')}: <strong>{user.email}</strong>
                    </p>
                    <p>
                        {t('callsign')}: <strong>{user.callsign || 'N/A'}</strong>
                    </p>
                </div>
            ) : (
                <p className="error-message">{t('no-user-data')}</p>
            )}
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            <div className="delete-account-form">
                <form onSubmit={handleDelete}>
                    {confirmDelete && (
                        <p className="confirmation-message">
                            {t('confirm-delete-message')}
                        </p>
                    )}
                    <button
                        type="submit"
                        className="btn danger"
                        disabled={loading || !user}
                    >
                        {loading
                            ? t('deleting')
                            : confirmDelete
                                ? t('confirm-delete-button')
                                : t('delete-account-button')}
                    </button>
                </form>
                {confirmDelete && (
                    <button
                        className="btn secondary"
                        onClick={() => setConfirmDelete(false)}
                        disabled={loading}
                    >
                        {t('cancel')}
                    </button>
                )}
            </div>
        </div>
    );
}