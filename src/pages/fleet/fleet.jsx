import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlaneCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import api from '../../api/api';

export function Fleet() {
    const { t } = useTranslation();
    const [fleet, setFleet] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [selectedAircraft, setSelectedAircraft] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFleet = async () => {
            setLoading(true);
            try {
                const response = await api.get('/fleet/');
                if (response?.data) {
                    setFleet(response.data);
                    setError(null);
                } else {
                    throw new Error(t('failed-to-fetch-fleet'));
                }
            } catch (error) {
                console.error(t('failed-to-fetch-fleet'), {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status,
                });
                const errorMessage =
                    error.response?.data?.error || error.message || t('failed-to-fetch-fleet');
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchFleet();
    }, [t]);

    const sortTable = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }

        const sortedData = [...fleet].sort((a, b) => {
            // Handle nested properties (e.g., airline.name, aircraft.icao)
            const valueA = key.includes('.') ? key.split('.').reduce((obj, k) => obj?.[k], a) : a[key];
            const valueB = key.includes('.') ? key.split('.').reduce((obj, k) => obj?.[k], b) : b[key];

            if (valueA < valueB) return direction === 'asc' ? -1 : 1;
            if (valueA > valueB) return direction === 'asc' ? 1 : -1;
            return 0;
        });

        setFleet(sortedData);
        setSortConfig({ key, direction });
    };

    const getSortIndicator = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
        }
        return '';
    };

    const handleShowInfo = (aircraft) => {
        setSelectedAircraft(aircraft);
    };

    const handleCloseModal = () => {
        setSelectedAircraft(null);
    };

    return (
        <>

            {error && <p className="error-message">{error}</p>}
            {loading ? (
                <p>{t('loading')}</p>
            ) : (
                <div className="view-model">
                    <h2>
                        <FontAwesomeIcon icon={faPlaneCircleExclamation}/> {t('fleet')}
                    </h2>
                    <div className="table-container">
                        <table className="pilot-table">
                            <thead>
                            <tr>
                                <th onClick={() => sortTable('airline.name')}>
                                    {t('profile-airline')} {getSortIndicator('airline.name')}
                                </th>
                                <th onClick={() => sortTable('aircraft.icao')}>
                                    {t('profile-logbook-aircraft')} {getSortIndicator('aircraft.icao')}
                                </th>
                                <th onClick={() => sortTable('reg')}>
                                    {t('reg')} {getSortIndicator('reg')}
                                </th>
                                <th onClick={() => sortTable('name')}>
                                    {t('user-name')} {getSortIndicator('name')}
                                </th>
                                <th onClick={() => sortTable('state')}>
                                    {t('status')} {getSortIndicator('state')}
                                </th>
                                <th>{t('info-see')}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {fleet.map((item) => (
                                <tr key={item.id} className="background-change">
                                    <td>{item.airline.name}</td>
                                    <td>{item.aircraft.icao}</td>
                                    <td>{item.reg}</td>
                                    <td>{item.name}</td>
                                    <td>{item.state}</td>
                                    <td>
                                        <button
                                            className="btn"
                                            onClick={() => handleShowInfo(item.aircraft)}
                                        >
                                            {t('see-info')}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            {selectedAircraft && (
                <div className="view-model left">
                <div className="modal">
                    <div className="modal-content">
                    <h3>{t('aircraft-details')}</h3>
                        <p>
                            <strong>{t('icao')}:</strong> {selectedAircraft.icao}
                        </p>
                        <p>
                            <strong>{t('manufacturer')}:</strong> {selectedAircraft.manufacturer}
                        </p>
                        <p>
                            <strong>{t('range')}:</strong> {selectedAircraft.range} {t('nm')}
                        </p>
                        <p>
                            <strong>{t('max-passengers')}:</strong> {selectedAircraft.max_passengers}
                        </p>
                        {selectedAircraft.img && (
                            <div>
                                <strong>{t('image')}:</strong>
                                <br />
                                <img
                                    src={selectedAircraft.img}
                                    alt={`${selectedAircraft.icao} aircraft`}
                                    style={{ maxWidth: '300px', maxHeight: '200px' }}
                                />
                            </div>
                        )}
                        <button className="btn close-btn" onClick={handleCloseModal}>
                            {t('close')}
                        </button>
                    </div>
                </div>
                </div>
            )}
        </>
    );
}