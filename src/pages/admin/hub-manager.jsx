import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { Role } from '../../components/auth-context/role';
import api from "../../api/apì";

export function HubManager() {
    const [hubs, setHubs] = useState([]);
    const [airlines, setAirlines] = useState([]);
    const [ranks, setRanks] = useState([]);
    const [error, setError] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({
        airportId: '',
        airlineId: '',
        rankId: '',
    });
    const [airportSearch, setAirportSearch] = useState('');
    const [filteredAirports, setFilteredAirports] = useState([]);
    const [editingHub, setEditingHub] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const hubResponse = await api.get('/hubs');
                if (hubResponse?.data) {
                    setHubs(hubResponse.data);
                } else {
                    throw new Error('No hub data received from server');
                }

                const airlineResponse = await api.get('/airlines');
                if (airlineResponse?.data) {
                    setAirlines(airlineResponse.data);
                } else {
                    throw new Error('No airline data received from server');
                }

                const rankResponse = await api.get('/ranks');
                if (rankResponse?.data) {
                    setRanks(rankResponse.data);
                } else {
                    throw new Error('No rank data received from server');
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

    useEffect(() => {
        const fetchAirports = async () => {
            if (airportSearch.length < 2) {
                setFilteredAirports([]);
                return;
            }
            try {
                const response = await api.get(`/airports?search=${encodeURIComponent(airportSearch)}`);
                if (response?.data?.data) {
                    setFilteredAirports(response.data.data);
                } else {
                    setFilteredAirports([]);
                }
            } catch (error) {
                console.error('Failed to search airports:', error);
                setFilteredAirports([]);
            }
        };
        const debounce = setTimeout(fetchAirports, 300);
        return () => clearTimeout(debounce);
    }, [airportSearch]);

    const toggleCreateForm = () => {
        setShowCreateForm(!showCreateForm);
        setFormData({
            airportId: '',
            airlineId: '',
            rankId: '',
        });
        setAirportSearch('');
        setFilteredAirports([]);
        setEditingHub(null);
        setError(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAirportSearchChange = (e) => {
        setAirportSearch(e.target.value);
        setFormData((prev) => ({ ...prev, airportId: '' }));
    };

    const selectAirport = (airport) => {
        setFormData((prev) => ({ ...prev, airportId: airport.icao }));
        setAirportSearch(`${airport.icao} - ${airport.name}`);
        setFilteredAirports([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { airportId, airlineId, rankId } = formData;

        if (!airportId || !airlineId) {
            setError('Airport and airline are required');
            return;
        }
        if (airportId.length !== 4) {
            setError('Airport ICAO code must be exactly 4 characters');
            return;
        }

        const airlineIdNum = parseInt(airlineId);
        if (isNaN(airlineIdNum)) {
            setError('Invalid airline selection');
            return;
        }

        const rankIdNum = rankId ? parseInt(rankId) : null;
        if (rankId && isNaN(rankIdNum)) {
            setError('Invalid rank selection');
            return;
        }

        try {
            const payload = {
                airportId,
                airlineId: airlineIdNum,
                rankId: rankIdNum,
            };
            if (editingHub) {
                const response = await api.patch(`/hubs/${editingHub.id}`, payload);
                setHubs(
                    hubs.map((hub) =>
                        hub.id === editingHub.id ? response.data.hub : hub
                    )
                );
                alert('Hub updated successfully');
            } else {
                const response = await api.post('/hubs', payload);
                setHubs([...hubs, response.data.hub]);
                alert('Hub created successfully');
            }
            toggleCreateForm();
        } catch (error) {
            console.error('Failed to save hub:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
            });
            const errorMessage =
                error.response?.data?.error ||
                error.message ||
                'Failed to save hub';
            setError(errorMessage);
        }
    };

    const startEditing = async (hub) => {
        setEditingHub(hub);
        setFormData({
            airportId: hub.airportId,
            airlineId: hub.airlineId.toString(),
            rankId: hub.rankId ? hub.rankId.toString() : '',
        });

        if (hub.airport) {
            setAirportSearch(`${hub.airport.icao} - ${hub.airport.name}`);
        } else {
            try {
                const airportResponse = await api.get(`/airports?search=${encodeURIComponent(hub.airportId)}`);
                if (airportResponse?.data?.data?.length > 0) {
                    const airport = airportResponse.data.data[0];
                    setAirportSearch(`${airport.icao} - ${airport.name}`);
                } else {
                    setAirportSearch(hub.airportId);
                }
            } catch (error) {
                console.error('Failed to fetch airport details:', error);
                setAirportSearch(hub.airportId);
            }
        }

        setFilteredAirports([]);
        setShowCreateForm(true);
        setError(null);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this hub?')) {
            try {
                await api.delete(`/hubs/${id}`);
                setHubs(hubs.filter((hub) => hub.id !== id));
                alert('Hub deleted successfully');
            } catch (error) {
                console.error('Failed to delete hub:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status,
                });
                const errorMessage =
                    error.response?.data?.error ||
                    error.message ||
                    'Failed to delete hub';
                setError(errorMessage);
            }
        }
    };

    return (
        <div className="view-model">
            <h2>Hub Manager</h2>
            <Role has="OPERATIONS_MANAGER">
                <p>
                    <button
                        className={`btn ${showCreateForm ? 'secondary' : ''}`}
                        onClick={toggleCreateForm}
                    >
                        <FontAwesomeIcon icon={faCirclePlus} />{' '}
                        {showCreateForm ? 'Cancel' : 'Create Hub'}
                    </button>
                </p>
                {showCreateForm && (
                    <div className="fleet-form">
                        <h3>{editingHub ? 'Edit Hub' : 'Create Hub'}</h3>
                        {error && <p className="error-message">{error}</p>}
                        <form onSubmit={handleSubmit}>
                            <div className="airport-search">
                                <label>Airport:</label>
                                <input
                                    type="text"
                                    value={airportSearch}
                                    onChange={handleAirportSearchChange}
                                    placeholder="Search airport by ICAO or name"
                                    required
                                />
                                {filteredAirports.length > 0 && (
                                    <ul className="airport-suggestions">
                                        {filteredAirports.map((airport) => (
                                            <li
                                                key={airport.icao}
                                                onClick={() => selectAirport(airport)}
                                            >
                                                {airport.icao} - {airport.name} ({airport.country})
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div>
                                <label>Airline:</label>
                                <select
                                    name="airlineId"
                                    value={formData.airlineId}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select an airline</option>
                                    {airlines.map((airline) => (
                                        <option key={airline.id} value={airline.id}>
                                            {airline.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Rank (optional):</label>
                                <select
                                    name="rankId"
                                    value={formData.rankId}
                                    onChange={handleInputChange}
                                >
                                    <option value="">None</option>
                                    {ranks.map((rank) => (
                                        <option key={rank.id} value={rank.id}>
                                            {rank.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit" className="btn">
                                {editingHub ? 'Update Hub' : 'Create Hub'}
                            </button>
                        </form>
                    </div>
                )}
                <div className="table-container">
                    <table className="pilot-table">
                        <thead>
                        <tr>
                            <th>#ID</th>
                            <th>Airport</th>
                            <th>Airline</th>
                            <th>Rank</th>
                            <th>Created At</th>
                            <th>Updated At</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {hubs.length === 0 ? (
                            <tr className="background-change">
                                <td colSpan="7">No hubs found.</td>
                            </tr>
                        ) : (
                            hubs.map((hub, index) => (
                                <tr key={index} className="background-change">
                                    <td>{hub.id}</td>
                                    <td>
                                        {hub.airport
                                            ? `${hub.airport.icao} - ${hub.airport.name}`
                                            : hub.airportId}
                                    </td>
                                    <td>{hub.airline ? hub.airline.name : 'N/A'}</td>
                                    <td>
                                        {hub.rankId
                                            ? ranks.find((rank) => rank.id === hub.rankId)?.name || 'N/A'
                                            : 'None'}
                                    </td>
                                    <td>{new Date(hub.createdAt).toLocaleString()}</td>
                                    <td>{new Date(hub.updatedAt).toLocaleString()}</td>
                                    <td>
                                        <button
                                            className="btn"
                                            onClick={() => startEditing(hub)}
                                        >
                                            <FontAwesomeIcon icon={faPenToSquare} />
                                        </button>
                                        <button
                                            className="btn danger"
                                            onClick={() => handleDelete(hub.id)}
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