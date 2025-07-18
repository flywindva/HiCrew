import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlaneCircleExclamation, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import api from '../../api/api';

export function CharterFlight({ onFlightSubmit }) {
    const { t } = useTranslation();
    const [userProfile, setUserProfile] = useState(null);
    const [availableFleet, setAvailableFleet] = useState([]);
    const [formData, setFormData] = useState({
        fleetId: '',
        departureIcao: '',
        arrivalIcao: '',
        callsign: '',
        aircraft: '',
        network: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const stateMap = {
        0: t('fleet-state-free'),
        1: t('fleet-state-reserved'),
        2: t('fleet-state-in-flight'),
        3: t('fleet-state-maintenance'),
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const profileResponse = await api.get('/auth/me', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                if (profileResponse?.data?.pilot) {
                    setUserProfile(profileResponse.data.pilot);
                    setFormData((prev) => ({
                        ...prev,
                        departureIcao: profileResponse.data.pilot.hub?.airport?.icao || '',
                        callsign: profileResponse.data.pilot.callsign || '',
                    }));

                    const fleetResponse = await api.get('/fleet', {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    });

                    if (fleetResponse?.data) {
                        const filteredFleet = fleetResponse.data.filter(
                            (fleet) =>
                                fleet.locationIcao === profileResponse.data.pilot.locationIcao &&
                                fleet.airlineId === profileResponse.data.pilot.airlineId &&
                                fleet.state === 0
                        );
                        setAvailableFleet(filteredFleet);
                    } else {
                        throw new Error(t('failed-to-fetch-fleet'));
                    }
                    setError(null);
                } else {
                    throw new Error(t('failed-to-fetch-profile'));
                }
            } catch (error) {
                console.error(t('failed-to-fetch-data'), {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status,
                });
                const errorMessage =
                    error.response?.data?.error || error.message || t('failed-to-fetch-data');
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [t]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (name === 'fleetId' && value) {
            const selectedFleet = availableFleet.find((fleet) => fleet.id === parseInt(value));
            if (selectedFleet) {
                setFormData((prev) => ({
                    ...prev,
                    aircraft: selectedFleet.aircraft?.icao || '',
                    departureIcao: selectedFleet.locationIcao || '',
                }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        const { fleetId, departureIcao, arrivalIcao, callsign, aircraft, network } = formData;

        const icaoRegex = /^[A-Z]{4}$/;

        if (!fleetId || !departureIcao || !arrivalIcao || !callsign || !aircraft) {
            setError(t('required-fields'));
            setLoading(false);
            return;
        }

        if (!icaoRegex.test(departureIcao) || !icaoRegex.test(arrivalIcao)) {
            setError(t('invalid-icao'));
            setLoading(false);
            return;
        }

        const fleetIdNum = parseInt(fleetId);
        if (isNaN(fleetIdNum) || !availableFleet.find((fleet) => fleet.id === fleetIdNum)) {
            setError(t('invalid-fleet'));
            setLoading(false);
            return;
        }

        try {
            const response = await api.post(
                '/flights/report/charter',
                {
                    fleetId: fleetIdNum,
                    departureIcao: departureIcao.toUpperCase(),
                    arrivalIcao: arrivalIcao.toUpperCase(),
                    callsign,
                    aircraft,
                    network: network || null,
                },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                }
            );
            setSuccess(t('flight-created'));
            setFormData({
                fleetId: '',
                departureIcao: userProfile?.hub?.airport?.icao || '',
                arrivalIcao: '',
                callsign: userProfile?.callsign || '',
                aircraft: '',
                network: '',
            });

            const fleetResponse = await api.get('/fleet', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            if (fleetResponse?.data) {
                const filteredFleet = fleetResponse.data.filter(
                    (fleet) =>
                        fleet.locationIcao === userProfile?.hub?.airport?.icao &&
                        fleet.airlineId === userProfile?.airline?.id &&
                        fleet.state === 0
                );
                setAvailableFleet(filteredFleet);
            }

            if (onFlightSubmit) {
                onFlightSubmit();
            }
        } catch (error) {
            console.error(t('failed-to-create-flight'), {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
            });
            const errorMessage =
                error.response?.data?.error || error.message || t('failed-to-create-flight');
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="view-model left">
            <h2>
                <FontAwesomeIcon icon={faPlaneCircleExclamation} /> {t('charter-flight')}
            </h2>
            {loading ? (
                <p>{t('loading')}</p>
            ) : error ? (
                <p className="error-message">{error}</p>
            ) : !userProfile?.locationIcao ? (
                <p>{t('no-user-location')}</p>
            ) : availableFleet.length === 0 ? (
                <p>{t('no-available-aircraft')}</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>{t('aircraft')}</label>
                        <select
                            name="fleetId"
                            value={formData.fleetId}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">{t('select-aircraft')}</option>
                            {availableFleet.map((fleet) => (
                                <option key={fleet.id} value={fleet.id}>
                                    {fleet.aircraft.icao} - {fleet.name} ({fleet.reg})
                                </option>
                            ))}
                        </select>
                    </div>
                    {formData.fleetId && (
                        <>
                            <div>
                                <label>{t('departure-icao')}</label>
                                <input
                                    type="text"
                                    name="departureIcao"
                                    value={formData.departureIcao}
                                    onChange={handleInputChange}
                                    required
                                    placeholder={t('enter-icao')}
                                    maxLength={4}
                                    disabled
                                />
                            </div>
                            <div>
                                <label>{t('arrival-icao')}</label>
                                <input
                                    type="text"
                                    name="arrivalIcao"
                                    value={formData.arrivalIcao}
                                    onChange={handleInputChange}
                                    required
                                    placeholder={t('enter-icao')}
                                    maxLength={4}
                                />
                            </div>
                            <div>
                                <label>{t('callsign')}</label>
                                <input
                                    type="text"
                                    name="callsign"
                                    value={formData.callsign}
                                    onChange={handleInputChange}
                                    required
                                    placeholder={t('enter-callsign')}
                                    maxLength={8}
                                />
                            </div>
                            <div>
                                <label>{t('aircraft-type')}</label>
                                <input
                                    type="text"
                                    name="aircraft"
                                    value={formData.aircraft}
                                    onChange={handleInputChange}
                                    required
                                    placeholder={t('enter-aircraft-type')}
                                    disabled
                                />
                            </div>
                            <div>
                                <label>{t('network')}</label>
                                <select
                                    name="network"
                                    value={formData.network}
                                    onChange={handleInputChange}
                                >
                                    <option value="">{t('select-network')}</option>
                                    <option value="IVAO">{t('ivao')}</option>
                                    <option value="VATSIM">{t('vatsim')}</option>
                                </select>
                            </div>
                            {success && <p className="success-message">{success}</p>}
                            {error && <p className="error-message">{error}</p>}
                            <button type="submit" className="btn" disabled={loading}>
                                <FontAwesomeIcon icon={faPaperPlane}/> {loading ? t('submitting') : t('submit-flight')}
                            </button>
                        </>
                    )}
                </form>
            )}
        </div>
    );
}