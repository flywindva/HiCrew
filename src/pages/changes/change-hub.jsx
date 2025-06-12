import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import api from "../../api/api";


export function ChangeHub() {
    const { t } = useTranslation();
    const [hubs, setHubs] = useState([]);
    const [selectedHub, setSelectedHub] = useState('');
    const [currentHub, setCurrentHub] = useState(null);
    const [currentAirline, setCurrentAirline] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch user data (airline and current hub)
                const userResponse = await api.get('/auth/me');
                const pilot = userResponse?.data?.pilot;
                if (pilot?.airline) {
                    setCurrentAirline(pilot.airline);
                }
                if (pilot?.hub) {
                    setCurrentHub(pilot.hub);
                }

                // Fetch all hubs
                const hubsResponse = await api.get('/hubs');
                if (hubsResponse?.data) {
                    // Filter hubs by current airline if airline exists
                    const filteredHubs = pilot?.airline
                        ? hubsResponse.data.filter((hub) => hub.airlineId === pilot.airline.id)
                        : [];
                    setHubs(filteredHubs);
                    setError(null);
                } else {
                    throw new Error(t('failed-to-fetch-hubs'));
                }
            } catch (error) {
                console.error(t('failed-to-fetch-hubs'), {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status,
                    headers: error.response?.headers,
                });
                const errorMessage =
                    error.response?.data?.error || error.message || t('failed-to-fetch-hubs');
                setError(errorMessage);
            }
        };

        fetchData();
    }, [t]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedHub) {
            setError(t('select-hub-error'));
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await api.post('/hubs/change-hub', {
                hubId: parseInt(selectedHub),
            });
            setSuccess(response.data.message);
            setCurrentHub(response.data.pilotHub.hub);
            setSelectedHub('');
        } catch (error) {
            console.error(t('failed-to-change-hub'), {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                headers: error.response?.headers,
            });
            const errorMessage =
                error.response?.data?.error || error.message || t('failed-to-change-hub');
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="view-model left">
            <h2>
                <FontAwesomeIcon icon={faMapMarkerAlt} /> {t('change-hub-title')}
            </h2>
            <p>{t('change-hub-description')}</p>
            {currentAirline ? (
                <p className="current-airline">
                    {t('current-airline')}: <strong>{currentAirline.name}</strong>
                </p>
            ) : (
                <p className="error-message">{t('no-airline-assigned')}</p>
            )}
            {currentHub && (
                <p className="current-hub">
                    {t('current-hub')}: <strong>{currentHub.airport.name} ({currentHub.airport.icao})</strong>
                </p>
            )}
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            <div className="change-hub-form">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="hubSelect">{t('select-hub-label')}</label>
                        <select
                            id="hubSelect"
                            value={selectedHub}
                            onChange={(e) => setSelectedHub(e.target.value)}
                            disabled={loading || !currentAirline}
                            className="form-control"
                            aria-label={t('select-hub-label')}
                        >
                            <option value="">{t('select-hub-placeholder')}</option>
                            {hubs.length === 0 ? (
                                <option disabled>{t('no-hubs-available')}</option>
                            ) : (
                                hubs.map((hub) => (
                                    <option key={hub.id} value={hub.id}>
                                        {hub.airport.name} ({hub.airport.icao})
                                    </option>
                                ))
                            )}
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="btn submit-btn"
                        disabled={loading || !currentAirline}
                    >
                        {loading ? t('changing') : t('change-hub-button')}
                    </button>
                </form>
            </div>
        </div>
    );
}