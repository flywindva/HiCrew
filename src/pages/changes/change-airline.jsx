import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlane } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import api from "../../api/api";

export function ChangeAirline() {
    const { t } = useTranslation();
    const [airlines, setAirlines] = useState([]);
    const [selectedAirline, setSelectedAirline] = useState('');
    const [currentAirline, setCurrentAirline] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        const fetchAirlines = async () => {
            try {
                const response = await api.get('/airlines');
                if (response?.data) {
                    const joinableAirlines = response.data.filter((airline) => airline.can_join);
                    setAirlines(joinableAirlines);
                    setError(null);
                } else {
                    throw new Error(t('failed-to-fetch-airlines'));
                }
            } catch (error) {
                console.error(t('failed-to-fetch-airlines'), {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status,
                    headers: error.response?.headers,
                });
                const errorMessage =
                    error.response?.data?.error || error.message || t('failed-to-fetch-airlines');
                setError(errorMessage);
            }
        };

        const fetchCurrentAirline = async () => {
            try {
                const response = await api.get('/auth/me');
                if (response?.data?.pilot?.airline) {
                    setCurrentAirline(response.data.pilot.airline);
                }
            } catch (error) {
                console.error(t('failed-to-fetch-current-airline'), {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status,
                    headers: error.response?.headers,
                });
            }
        };

        fetchAirlines();
        fetchCurrentAirline();
    }, [t]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedAirline) {
            setError(t('select-airline-error'));
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await api.post('/airlines/change-airline', {
                airlineId: parseInt(selectedAirline),
            });
            setSuccess(response.data.message);
            setCurrentAirline(response.data.pilotAirline.airline);
            setSelectedAirline('');
        } catch (error) {
            console.error(t('failed-to-change-airline'), {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                headers: error.response?.headers,
            });
            const errorMessage =
                error.response?.data?.error || error.message || t('failed-to-change-airline');
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="view-model left">
            <h2>
                <FontAwesomeIcon icon={faPlane} /> {t('change-airline-title')}
            </h2>
            <p>{t('change-airline-description')}</p>
            {currentAirline && (
                <p className="current-airline">
                    {t('current-airline')}: <strong>{currentAirline.name}</strong>
                </p>
            )}
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            <div className="change-airline-form">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="airlineSelect">{t('select-airline-label')}</label>
                        <select
                            id="airlineSelect"
                            value={selectedAirline}
                            onChange={(e) => setSelectedAirline(e.target.value)}
                            disabled={loading}
                            className="form-control"
                            aria-label={t('select-airline-label')}
                        >
                            <option value="">{t('select-airline-placeholder')}</option>
                            {airlines.length === 0 ? (
                                <option disabled>{t('no-airlines-available')}</option>
                            ) : (
                                airlines.map((airline) => (
                                    <option key={airline.id} value={airline.id}>
                                        {airline.name}
                                    </option>
                                ))
                            )}
                        </select>
                    </div>
                    <button type="submit" className="btn submit-btn" disabled={loading}>
                        {loading ? t('changing') : t('change-airline-button')}
                    </button>
                </form>
            </div>
        </div>
    );
}