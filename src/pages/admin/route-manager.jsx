import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { Role } from '../../components/auth-context/role';
import api from '../../api/api';

export function RouteManager() {
    const [routes, setRoutes] = useState([]);
    const [aircrafts, setAircrafts] = useState([]);
    const [airlines, setAirlines] = useState([]);
    const [error, setError] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({
        departureIcao: '',
        arrivalIcao: '',
        aircraftId: '',
        aircraftIds: [],
        airlineId: '',
        callsign: '',
    });
    const [editingRoute, setEditingRoute] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const routeResponse = await api.get('/routes', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                if (routeResponse?.data) {
                    setRoutes(routeResponse.data);
                } else {
                    throw new Error('No route data received from server');
                }

                const aircraftResponse = await api.get('/aircraft', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                if (aircraftResponse?.data) {
                    setAircrafts(aircraftResponse.data);
                } else {
                    throw new Error('No aircraft data received from server');
                }

                const airlineResponse = await api.get('/airlines', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                if (airlineResponse?.data) {
                    setAirlines(airlineResponse.data);
                } else {
                    throw new Error('No airline data received from server');
                }

                setError(null);
            } catch (error) {
                console.error('Failed to fetch data:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status,
                });
                const errorMessage =
                    error.response?.data?.error ||
                    error.message ||
                    'Failed to fetch data';
                setError(errorMessage);
            }
        };
        fetchData();
    }, []);

    const toggleCreate = () => {
        setShowCreateForm(!showCreateForm);
        setFormData({
            departureIcao: '',
            arrivalIcao: '',
            aircraftId: '',
            aircraftIds: [],
            airlineId: '',
            callsign: '',
        });
        setEditingRoute(null);
        setError(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value.toUpperCase() }));
    };

    const handleSelectChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleMultipleSelectChange = (e) => {
        const options = Array.from(e.target.options).filter(option => option.selected);
        const values = options.map(option => option.value);
        setFormData((prev) => ({ ...prev, aircraftIds: values }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { departureIcao, arrivalIcao, aircraftId, aircraftIds, airlineId, callsign } = formData;

        if (!departureIcao || !arrivalIcao || (!editingRoute && aircraftIds.length === 0) || (editingRoute && !aircraftId) || !airlineId) {
            setError('All fields are required');
            return;
        }
        const icaoRegex = /^[A-Z]{4}$/;
        if (!icaoRegex.test(departureIcao) || !icaoRegex.test(arrivalIcao)) {
            setError('ICAO must be exactly 4 uppercase letters');
            return;
        }
        if (departureIcao === arrivalIcao) {
            setError('Departure and arrival ICAO cannot be the same');
            return;
        }
        const airlineIdNum = parseInt(airlineId);
        if (isNaN(airlineIdNum)) {
            setError('Invalid airline');
            return;
        }

        try {
            if (editingRoute) {
                const aircraftIdNum = parseInt(aircraftId);
                if (isNaN(aircraftIdNum)) {
                    setError('Invalid aircraft');
                    return;
                }
                const payload = {
                    departureIcao,
                    arrivalIcao,
                    aircraftId: aircraftIdNum,
                    airlineId: airlineIdNum,
                    callsign: callsign || undefined,
                };
                const response = await api.patch(`/routes/${editingRoute.id}`, payload, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setRoutes(
                    routes.map((route) => (route.id === editingRoute.id ? response.data.route : route))
                );
                alert('Route updated');
            } else {
                for (const id of aircraftIds) {
                    const aircraftIdNum = parseInt(id);
                    if (isNaN(aircraftIdNum)) {
                        setError('Invalid aircraft');
                        return;
                    }
                    const payload = {
                        departureIcao,
                        arrivalIcao,
                        aircraftId: aircraftIdNum,
                        airlineId: airlineIdNum,
                        callsign,
                    };
                    const response = await api.post('/routes', payload, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    });
                    setRoutes(prev => [...prev, response.data.route]);
                }
                alert('Routes created');
            }
            toggleCreate();
        } catch (error) {
            console.error('Failed to save route:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
            });
            const errorMessage =
                error.response?.data?.error ||
                error.message ||
                'Failed to save route';
            setError(errorMessage);
        }
    };

    const startEditing = (route) => {
        setEditingRoute(route);
        setFormData({
            departureIcao: route.departureIcao,
            arrivalIcao: route.arrivalIcao,
            aircraftId: route.aircraftId.toString(),
            aircraftIds: [],
            airlineId: route.airlineId.toString(),
            callsign: route.callsign || '',
        });
        setShowCreateForm(true);
        setError(null);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Confirm delete?')) {
            try {
                await api.delete(`/routes/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setRoutes(routes.filter((route) => route.id !== id));
                alert('Route deleted');
            } catch (error) {
                console.error('Failed to delete route:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status,
                });
                const errorMessage =
                    error.response?.data?.error ||
                    error.message ||
                    'Failed to delete route';
                setError(errorMessage);
            }
        }
    };

    return (
        <div className="view-model">
            <h2>Route Manager</h2>
            <Role has="OPERATIONS_MANAGER">
                <p>
                    <button
                        className={`btn ${showCreateForm ? 'secondary' : ''}`}
                        onClick={toggleCreate}
                    >
                        <FontAwesomeIcon icon={faCirclePlus} /> {showCreateForm ? 'Cancel' : 'Create Route'}
                    </button>
                </p>
                {showCreateForm && (
                    <div className="route-form">
                        <h3>{editingRoute ? 'Edit Route' : 'Create Route'}</h3>
                        {error && <p className="error-message">{error}</p>}
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label>Departure ICAO</label>
                                <input
                                    type="text"
                                    name="departureIcao"
                                    value={formData.departureIcao}
                                    onChange={handleInputChange}
                                    required
                                    maxLength={4}
                                    minLength={4}
                                    placeholder="Enter ICAO"
                                />
                            </div>
                            <div>
                                <label>Arrival ICAO</label>
                                <input
                                    type="text"
                                    name="arrivalIcao"
                                    value={formData.arrivalIcao}
                                    onChange={handleInputChange}
                                    required
                                    maxLength={4}
                                    minLength={4}
                                    placeholder="Enter ICAO"
                                />
                            </div>
                            <div>
                                <label>Aircraft</label>
                                {editingRoute ? (
                                    <select
                                        name="aircraftId"
                                        value={formData.aircraftId}
                                        onChange={handleSelectChange}
                                        required
                                    >
                                        <option value="">Select Aircraft</option>
                                        {aircrafts.map((aircraft) => (
                                            <option key={aircraft.id} value={aircraft.id}>
                                                {aircraft.icao} - {aircraft.manufacturer}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <select
                                        name="aircraftIds"
                                        multiple
                                        value={formData.aircraftIds}
                                        onChange={handleMultipleSelectChange}
                                        required
                                    >
                                        {aircrafts.map((aircraft) => (
                                            <option key={aircraft.id} value={aircraft.id}>
                                                {aircraft.icao} - {aircraft.manufacturer}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>
                            <div>
                                <label>Airline</label>
                                <select
                                    name="airlineId"
                                    value={formData.airlineId}
                                    onChange={handleSelectChange}
                                    required
                                >
                                    <option value="">Select Airline</option>
                                    {airlines.map((airline) => (
                                        <option key={airline.id} value={airline.id}>
                                            {airline.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Callsign</label>
                                <input
                                    type="text"
                                    name="callsign"
                                    value={formData.callsign}
                                    onChange={handleInputChange}
                                    required={!editingRoute}
                                    maxLength={8}
                                    placeholder="Enter Callsign (e.g., AAL123)"
                                />
                            </div>
                            <button type="submit" className="btn">
                                {editingRoute ? 'Update Route' : 'Create Route(s)'}
                            </button>
                        </form>
                    </div>
                )}
                <div className="table-container">
                    <table className="pilot-table">
                        <thead>
                        <tr>
                            <th>#ID</th>
                            <th>Departure</th>
                            <th>Arrival</th>
                            <th>Aircraft</th>
                            <th>Airline</th>
                            <th>Callsign</th>
                            <th>Created At</th>
                            <th>Updated At</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {routes.length === 0 ? (
                            <tr className="background-change">
                                <td colSpan="8">No routes</td>
                            </tr>
                        ) : (
                            routes.map((route) => (
                                <tr key={route.id} className="background-change">
                                    <td>{route.id}</td>
                                    <td>{route.departure ? `${route.departure.name} (${route.departure.icao})` : route.departureIcao}</td>
                                    <td>{route.arrival ? `${route.arrival.name} (${route.arrival.icao})` : route.arrivalIcao}</td>
                                    <td>{route.aircraft ? `${route.aircraft.icao} - ${route.aircraft.manufacturer}` : 'N/A'}</td>
                                    <td>{route.airline ? route.airline.name : 'N/A'}</td>
                                    <td>{route.callsign || 'N/A'}</td>
                                    <td>{new Date(route.createdAt).toLocaleString()}</td>
                                    <td>{new Date(route.updatedAt).toLocaleString()}</td>
                                    <td>
                                        <button className="btn" onClick={() => startEditing(route)}>
                                            <FontAwesomeIcon icon={faPenToSquare}/>
                                        </button>
                                        <button className="btn danger" onClick={() => handleDelete(route.id)}>
                                            <FontAwesomeIcon icon={faTrashCan}/>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </Role>
        </div>
    );
}