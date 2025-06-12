import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { Role } from '../../components/auth-context/role';
import api from "../../api/api";

export function AirportManager() {
    const [airports, setAirports] = useState([]);
    const [error, setError] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({
        icao: '',
        iata: '',
        name: '',
        country: '',
        latitude: '',
        longitude: '',
        altitude: '',
    });
    const [editingAirport, setEditingAirport] = useState(null);

    useEffect(() => {
        const fetchAirports = async () => {
            try {
                const response = await api.get('/airports');
                if (response?.data?.data) {
                    setAirports(response.data.data); // Access .data.data
                } else {
                    throw new Error('No data received from server');
                }
                setError(null);
            } catch (error) {
                console.error('Failed to fetch airports:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status,
                });
                const errorMessage =
                    error.response?.data?.error ||
                    error.message ||
                    'Failed to fetch airports';
                setError(errorMessage);
            }
        };
        fetchAirports();
    }, []);

    const toggleCreateForm = () => {
        setShowCreateForm(!showCreateForm);
        setFormData({
            icao: '',
            iata: '',
            name: '',
            country: '',
            latitude: '',
            longitude: '',
            altitude: '',
        });
        setEditingAirport(null);
        setError(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { icao, iata, name, country, latitude, longitude, altitude } = formData;

        if (!icao || !name || !country || !latitude || !longitude) {
            setError('ICAO, name, country, latitude, and longitude are required');
            return;
        }
        if (icao.length !== 4) {
            setError('ICAO must be exactly 4 characters');
            return;
        }
        if (iata && iata.length !== 3) {
            setError('IATA must be exactly 3 characters or empty');
            return;
        }
        if (name.length > 100) {
            setError('Name must be 100 characters or less');
            return;
        }
        if (country.length > 100) {
            setError('Country must be 100 characters or less');
            return;
        }
        const latitudeNum = parseFloat(latitude);
        if (isNaN(latitudeNum) || latitudeNum < -90 || latitudeNum > 90) {
            setError('Latitude must be a number between -90 and 90');
            return;
        }
        const longitudeNum = parseFloat(longitude);
        if (isNaN(longitudeNum) || longitudeNum < -180 || longitudeNum > 180) {
            setError('Longitude must be a number between -180 and 180');
            return;
        }
        const altitudeNum = altitude ? parseInt(altitude) : null;
        if (altitude && (isNaN(altitudeNum) || !Number.isInteger(altitudeNum))) {
            setError('Altitude must be an integer or empty');
            return;
        }

        try {
            const payload = {
                iata: iata || null,
                name,
                country,
                latitude: latitudeNum,
                longitude: longitudeNum,
                altitude: altitudeNum,
            };
            if (editingAirport) {
                const response = await api.patch(`/airports/${editingAirport.icao}`, payload);
                setAirports(
                    airports.map((airport) =>
                        airport.icao === editingAirport.icao ? response.data.airport : airport
                    )
                );
                alert('Airport updated successfully');
            } else {
                // Include icao for POST
                payload.icao = icao;
                const response = await api.post('/airports', payload);
                setAirports([...airports, response.data.airport]);
                alert('Airport created successfully');
            }
            toggleCreateForm();
        } catch (error) {
            console.error('Failed to save airport:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
            });
            const errorMessage =
                error.response?.data?.error ||
                error.message ||
                'Failed to save airport';
            setError(errorMessage);
        }
    };

    const startEditing = (airport) => {
        setEditingAirport(airport);
        setFormData({
            icao: airport.icao,
            iata: airport.iata || '',
            name: airport.name,
            country: airport.country,
            latitude: airport.latitude.toString(),
            longitude: airport.longitude.toString(),
            altitude: airport.altitude ? airport.altitude.toString() : '',
        });
        setShowCreateForm(true);
        setError(null);
    };

    const handleDelete = async (icao) => {
        if (window.confirm('Are you sure you want to delete this airport?')) {
            try {
                await api.delete(`/airports/${icao}`);
                setAirports(airports.filter((airport) => airport.icao !== icao));
                alert('Airport deleted successfully');
            } catch (error) {
                console.error('Failed to delete airport:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status,
                });
                const errorMessage =
                    error.response?.data?.error ||
                    error.message ||
                    'Failed to delete airport';
                setError(errorMessage);
            }
        }
    };

    return (
        <div className="view-model">
            <h2>Airport Manager</h2>
            <Role has="OPERATIONS_MANAGER">
                <p>
                    <button
                        className={`btn ${showCreateForm ? 'secondary' : ''}`}
                        onClick={toggleCreateForm}
                    >
                        <FontAwesomeIcon icon={faCirclePlus} />{' '}
                        {showCreateForm ? 'Cancel' : 'Create Airport'}
                    </button>
                </p>
                {showCreateForm && (
                    <div className="airport-form">
                        <h3>{editingAirport ? 'Edit Airport' : 'Create Airport'}</h3>
                        {error && <p className="error-message">{error}</p>}
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label>ICAO:</label>
                                <input
                                    type="text"
                                    name="icao"
                                    value={formData.icao}
                                    onChange={handleInputChange}
                                    required
                                    maxLength={4}
                                    placeholder="Enter 4-character ICAO code"
                                    disabled={!!editingAirport} // Disable during edit
                                />
                            </div>
                            <div>
                                <label>IATA (optional):</label>
                                <input
                                    type="text"
                                    name="iata"
                                    value={formData.iata}
                                    onChange={handleInputChange}
                                    maxLength={3}
                                    placeholder="Enter 3-character IATA code or leave empty"
                                />
                            </div>
                            <div>
                                <label>Name:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    maxLength={100}
                                    placeholder="Enter airport name (max 100 characters)"
                                />
                            </div>
                            <div>
                                <label>Country:</label>
                                <input
                                    type="text"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    required
                                    maxLength={100}
                                    placeholder="Enter country (max 100 characters)"
                                />
                            </div>
                            <div>
                                <label>Latitude:</label>
                                <input
                                    type="number"
                                    name="latitude"
                                    value={formData.latitude}
                                    onChange={handleInputChange}
                                    required
                                    step="any"
                                    min={-90}
                                    max={90}
                                    placeholder="Enter latitude (-90 to 90)"
                                />
                            </div>
                            <div>
                                <label>Longitude:</label>
                                <input
                                    type="number"
                                    name="longitude"
                                    value={formData.longitude}
                                    onChange={handleInputChange}
                                    required
                                    step="any"
                                    min={-180}
                                    max={180}
                                    placeholder="Enter longitude (-180 to 180)"
                                />
                            </div>
                            <div>
                                <label>Altitude (ft, optional):</label>
                                <input
                                    type="number"
                                    name="altitude"
                                    value={formData.altitude}
                                    onChange={handleInputChange}
                                    placeholder="Enter altitude in feet or leave empty"
                                />
                            </div>
                            <button type="submit" className="btn">
                                {editingAirport ? 'Update Airport' : 'Create Airport'}
                            </button>
                        </form>
                    </div>
                )}
                <div className="table-container">
                    <table className="pilot-table">
                        <thead>
                        <tr>
                            <th>ICAO</th>
                            <th>IATA</th>
                            <th>Name</th>
                            <th>Country</th>
                            <th>Latitude</th>
                            <th>Longitude</th>
                            <th>Altitude (ft)</th>
                            <th>Created At</th>
                            <th>Updated At</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {airports.length === 0 ? (
                            <tr className="background-change">
                                <td colSpan="10">No airports found.</td>
                            </tr>
                        ) : (
                            airports.map((airport, index) => (
                                <tr key={index} className="background-change">
                                    <td>{airport.icao}</td>
                                    <td>{airport.iata || 'N/A'}</td>
                                    <td>{airport.name}</td>
                                    <td>{airport.country}</td>
                                    <td>{airport.latitude}</td>
                                    <td>{airport.longitude}</td>
                                    <td>{airport.altitude || 'N/A'}</td>
                                    <td>{new Date(airport.createdAt).toLocaleString()}</td>
                                    <td>{new Date(airport.updatedAt).toLocaleString()}</td>
                                    <td>
                                        <button className="btn" onClick={() => startEditing(airport)}>
                                            <FontAwesomeIcon icon={faPenToSquare} />
                                        </button>
                                        <button
                                            className="btn danger"
                                            onClick={() => handleDelete(airport.icao)}
                                        >
                                            <FontAwesomeIcon icon={faTrashCan} />
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