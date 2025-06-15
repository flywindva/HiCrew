import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import api from '../../api/api';

export function ChangePosition() {
    const { t } = useTranslation();
    const [airports, setAirports] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAirport, setSelectedAirport] = useState(null);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Fetch user data (current location)
                const userResponse = await api.get('/auth/me');
                const pilot = userResponse?.data?.pilot;
                if (pilot?.location) {
                    setCurrentLocation(pilot.location);
                }
            } catch (error) {
                console.error(t('failed-to-fetch-user'), {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status,
                });
                const errorMessage =
                    error.response?.data?.error || error.message || t('failed-to-fetch-user');
                setError(errorMessage);
            }
        };

        fetchUserData();
    }, [t]);

    useEffect(() => {
        const fetchAirports = async () => {
            try {
                // Fetch airports based on search term
                const airportsResponse = await api.get(`/airports${searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : ''}`);
                if (airportsResponse?.data?.data) {
                    setAirports(airportsResponse.data.data);
                    setError(null);
                } else {
                    throw new Error(t('failed-to-fetch-airports'));
                }
            } catch (error) {
                console.error(t('failed-to-fetch-airports'), {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status,
                });
                const errorMessage =
                    error.response?.data?.error || error.message || t('failed-to-fetch-airports');
                setError(errorMessage);
            }
        };

        // Debounce search to avoid excessive API calls
        const timeoutId = setTimeout(fetchAirports, searchTerm ? 300 : 0);
        return () => clearTimeout(timeoutId);
    }, [searchTerm, t]);

    const handleAirportSelect = (airport) => {
        setSelectedAirport(airport);
        setSearchTerm(`${airport.name} (${airport.icao})`);
        setAirports([]); // Clear suggestions after selection
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedAirport) {
            setError(t('select-airport-error'));
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await api.post('/hubs/change-location', {
                locationIcao: selectedAirport.icao,
            });
            setSuccess(response.data.message);
            setCurrentLocation(response.data.pilot.location);
            setSelectedAirport(null);
            setSearchTerm('');
        } catch (error) {
            console.error(t('failed-to-change-location'), {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
            });
            const errorMessage =
                error.response?.data?.error || error.message || t('failed-to-change-location');
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="view-model left">
            <h2>
                <FontAwesomeIcon icon={faMapMarkerAlt} /> {t('change-position-title')}
            </h2>
            <p>{t('change-position-description')}</p>
            {currentLocation && (
                <p className="current-location">
                    {t('current-location')}: <strong>{currentLocation.name} ({currentLocation.icao})</strong>
                </p>
            )}
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            <div className="change-position-form">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="airportSearch">{t('select-airport-label')}</label>
                        <input
                            id="airportSearch"
                            type="text"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setSelectedAirport(null); // Reset selection when typing
                            }}
                            placeholder={t('select-airport-placeholder')}
                            disabled={loading}
                            className="form-control"
                            aria-label={t('select-airport-label')}
                        />
                        {airports.length > 0 && (
                            <ul className="airport-suggestions">
                                {airports.map((airport) => (
                                    <li
                                        key={airport.icao}
                                        onClick={() => handleAirportSelect(airport)}
                                        className="airport-suggestion-item"
                                    >
                                        {airport.name} ({airport.icao})
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="btn submit-btn"
                        disabled={loading || !selectedAirport}
                    >
                        {loading ? t('changing') : t('change-position-button')}
                    </button>
                </form>
            </div>
        </div>
    );
}