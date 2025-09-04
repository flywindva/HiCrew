import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlaneDeparture } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import api from '../../api/api';
import "./regular-flight.scss";

export function RegularFlight({ onFlightSubmit }) {
    const { t } = useTranslation();
    const [userProfile, setUserProfile] = useState(null);
    const [availableFleet, setAvailableFleet] = useState([]);
    const [availableRoutes, setAvailableRoutes] = useState([]);
    const [formData, setFormData] = useState({
        routeId: '',
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
    const [selectedRoute, setSelectedRoute] = useState(null);

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
                        departureIcao: profileResponse.data.pilot.locationIcao || '',
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

                    const routesResponse = await api.get('/routes', {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    });
                    if (routesResponse?.data) {
                        const filteredRoutes = routesResponse.data.filter(
                            (route) => route.departureIcao === profileResponse.data.pilot.locationIcao
                        );
                        setAvailableRoutes(filteredRoutes);
                    } else {
                        throw new Error(t('failed-to-fetch-routes'));
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

        if (name === 'routeId' && value) {
            const selectedRoute = availableRoutes.find((route) => route.id === parseInt(value));
            if (selectedRoute) {
                setSelectedRoute(selectedRoute);
                setFormData((prev) => ({
                    ...prev,
                    departureIcao: selectedRoute.departureIcao,
                    arrivalIcao: selectedRoute.arrivalIcao,
                }));
            }
        }

        if (name === 'fleetId' && value) {
            const selectedFleet = availableFleet.find((fleet) => fleet.id === parseInt(value));
            if (selectedFleet) {
                setFormData((prev) => ({
                    ...prev,
                    aircraft: selectedFleet.aircraft?.icao || '',
                }));
            }
        }
    };

    const handleSelectFlight = (routeId) => {
        const route = availableRoutes.find((r) => r.id === parseInt(routeId));
        if (route) {
            setSelectedRoute(route);
            setFormData((prev) => ({
                ...prev,
                routeId: route.id,
                departureIcao: route.departureIcao,
                arrivalIcao: route.arrivalIcao,
                callsign: userProfile?.callsign || '',
                aircraft: '',
                network: '',
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        const { routeId, fleetId, departureIcao, arrivalIcao, callsign, aircraft, network } = formData;

        const icaoRegex = /^[A-Z]{4}$/;

        if (!routeId || !fleetId || !departureIcao || !arrivalIcao || !callsign || !aircraft) {
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

        // Filter aircraft compatible with the route (assuming aircraftId matches fleet.aircraft.icao)
        const routeAircraft = availableRoutes.find((r) => r.id === parseInt(routeId))?.aircraft?.icao;
        const selectedFleet = availableFleet.find((fleet) => fleet.id === fleetIdNum);
        if (routeAircraft && selectedFleet?.aircraft?.icao !== routeAircraft) {
            setError(t('incompatible-aircraft'));
            setLoading(false);
            return;
        }

        try {
            const response = await api.post(
                '/flights/report/regular', // Assuming a new endpoint for regular flights
                {
                    routeId: parseInt(routeId),
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
            setSuccess(t('flight-reserved'));
            setFormData({
                routeId: '',
                fleetId: '',
                departureIcao: userProfile?.locationIcao || '',
                arrivalIcao: '',
                callsign: userProfile?.callsign || '',
                aircraft: '',
                network: '',
            });
            setSelectedRoute(null);

            const fleetResponse = await api.get('/fleet', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            if (fleetResponse?.data) {
                const filteredFleet = fleetResponse.data.filter(
                    (fleet) =>
                        fleet.locationIcao === userProfile?.locationIcao &&
                        fleet.airlineId === userProfile?.airline?.id &&
                        fleet.state === 0
                );
                setAvailableFleet(filteredFleet);
            }

            if (onFlightSubmit) {
                onFlightSubmit();
            }
        } catch (error) {
            console.error(t('failed-to-reserve-flight'), {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
            });
            const errorMessage =
                error.response?.data?.error || error.message || t('failed-to-reserve-flight');
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="view-model left">
            <h2>
                <FontAwesomeIcon icon={faPlaneDeparture} /> {t('flight-regular')}
            </h2>
            {loading ? (
                <p>{t('loading')}</p>
            ) : error ? (
                <p className="error-message">{error}</p>
            ) : !userProfile?.locationIcao ? (
                <p>{t('no-user-location')}</p>
            ) : availableRoutes.length === 0 ? (
                <p>{t('no-available-routes')}</p>
            ) : availableFleet.length === 0 ? (
                <p>{t('no-available-aircraft')}</p>
            ) : selectedRoute ? (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>{t('route')}</label>
                        <input
                            type="text"
                            value={`${selectedRoute.departureIcao} - ${selectedRoute.arrivalIcao}`}
                            disabled
                        />
                    </div>
                    <div>
                        <label>{t('aircraft')}</label>
                        <select
                            name="fleetId"
                            value={formData.fleetId}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">{t('select-aircraft')}</option>
                            {availableFleet
                                .filter((fleet) => fleet.aircraft?.icao === selectedRoute.aircraft?.icao)
                                .map((fleet) => (
                                    <option key={fleet.id} value={fleet.id}>
                                        {fleet.aircraft.icao} - {fleet.name} ({fleet.reg})
                                    </option>
                                ))}
                        </select>
                    </div>
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
                            disabled
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
                        <FontAwesomeIcon icon={faPlaneDeparture} /> {loading ? t('reserving') : t('reserve-flight')}
                    </button>
                    <button
                        type="button"
                        className="btn secondary"
                        onClick={() => setSelectedRoute(null)}
                    >
                        {t('cancel')}
                    </button>
                </form>
            ) : (
                <div>
                    <h3>{t('available-routes-from', { icao: userProfile?.locationIcao })}</h3>
                    <hr />
                    {Object.entries(
                        availableRoutes.reduce((acc, route) => {
                            const key = `${route.departureIcao}-${route.arrivalIcao}`;
                            if (!acc[key]) acc[key] = [];
                            acc[key].push(route);
                            return acc;
                        }, {})
                    ).map(([key, routes]) => (
                        <div key={key} className="regular-flight">
                            <h3>{routes[0].departureIcao} - {routes[0].arrivalIcao}</h3>
                            <h5>{routes[0].airline?.name || 'N/A'}</h5>
                            <div className="aircraft">
                                {routes
                                    .map((r) => r.aircraft?.icao || 'N/A')
                                    .filter((icao, index, self) => self.indexOf(icao) === index)
                                    .map((icao, index) => (
                                        <p key={index}>{icao}</p>
                                    ))}
                                <div>
                                    <button
                                        className="btn"
                                        onClick={() => handleSelectFlight(routes[0].id)}
                                        disabled={routes.length > 1}
                                    >
                                        {t('select')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}