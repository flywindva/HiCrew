import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { Role } from '../../components/auth-context/role';
import api from "../../api/api";

export function FleetManager() {
    const [fleets, setFleets] = useState([]);
    const [aircrafts, setAircrafts] = useState([]);
    const [airlines, setAirlines] = useState([]);
    const [ranks, setRanks] = useState([]);
    const [error, setError] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({
        aircraftId: '',
        airlineId: '',
        name: '',
        reg: '',
        state: '',
        life: '',
        rankId: '',
    });
    const [editingFleet, setEditingFleet] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fleetResponse = await api.get('/fleet');
                if (fleetResponse?.data) {
                    setFleets(fleetResponse.data);
                } else {
                    throw new Error('No fleet data received from server');
                }

                const aircraftResponse = await api.get('/aircraft');
                if (aircraftResponse?.data) {
                    setAircrafts(aircraftResponse.data);
                } else {
                    throw new Error('No aircraft data received from server');
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

    const toggleCreate = () => {
        setShowCreateForm(!showCreateForm);
        setFormData({
            aircraftId: '',
            airlineId: '',
            name: '',
            state: '',
            reg: '',
            life: '',
            rankId: '',
        });
        setEditingFleet(null);
        setError(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { aircraftId, airlineId, name, reg, state, life, rankId } = formData;

        if (!aircraftId || !airlineId || !name || !reg || !state || !life) {
            setError('Aircraft, airline, name, registration, state, and life are required');
            return;
        }
        if (name.length > 100) {
            setError('Name must be 100 characters or less');
            return;
        }
        if (state.length > 50) {
            setError('State must be 50 characters or less');
            return;
        }
        const lifeNum = parseInt(life);
        if (isNaN(lifeNum) || lifeNum < 0 || lifeNum > 100) {
            setError('Life must be an integer between 0 and 100');
            return;
        }
        const aircraftIdNum = parseInt(aircraftId);
        if (isNaN(aircraftIdNum)) {
            setError('Invalid aircraft selection');
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
                aircraftId: aircraftIdNum,
                airlineId: airlineIdNum,
                name,
                state,
                reg,
                life: lifeNum,
                rankId: rankIdNum,
            };
            if (editingFleet) {
                const response = await api.patch(`/fleet/${editingFleet.id}`, payload);
                setFleets(
                    fleets.map((fleet) => (fleet.id === editingFleet.id ? response.data.fleet : fleet))
                );
                alert('Fleet unit updated successfully');
            } else {
                const response = await api.post('/fleet', payload);
                setFleets([...fleets, response.data.fleet]);
                alert('Fleet unit created successfully');
            }
            toggleCreate();
        } catch (error) {
            console.error('Failed to save fleet unit:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
            });
            const errorMessage =
                error.response?.data?.error ||
                error.message ||
                'Failed to save fleet unit';
            setError(errorMessage);
        }
    };

    const startEditing = (fleet) => {
        setEditingFleet(fleet);
        setFormData({
            aircraftId: fleet.aircraftId.toString(),
            airlineId: fleet.airlineId.toString(),
            name: fleet.name,
            reg: fleet.reg,
            state: fleet.state,
            life: fleet.life.toString(),
            rankId: fleet.rankId ? fleet.rankId.toString() : '',
        });
        setShowCreateForm(true);
        setError(null);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this fleet unit?')) {
            try {
                await api.delete(`/fleet/${id}`);
                setFleets(fleets.filter((fleet) => fleet.id !== id));
                alert('Fleet unit deleted successfully');
            } catch (error) {
                console.error('Failed to delete fleet unit:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status,
                });
                const errorMessage =
                    error.response?.data?.error ||
                    error.message ||
                    'Failed to delete fleet unit';
                setError(errorMessage);
            }
        }
    };

    return (
        <div className="view-model">
            <h2>Fleet Manager</h2>
            <Role has="OPERATIONS_MANAGER">
                <p>
                    <button
                        className={`btn ${showCreateForm ? 'secondary' : ''}`}
                        onClick={toggleCreate}
                    >
                        <FontAwesomeIcon icon={faCirclePlus} /> {showCreateForm ? 'Cancel' : 'Create Fleet Unit'}
                    </button>
                </p>
                {showCreateForm && (
                    <div className="fleet-form">
                        <h3>{editingFleet ? 'Edit Fleet Unit' : 'Create Fleet Unit'}</h3>
                        {error && <p className="error-message">{error}</p>}
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label>Aircraft:</label>
                                <select
                                    name="aircraftId"
                                    value={formData.aircraftId}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select an aircraft</option>
                                    {aircrafts.map((aircraft) => (
                                        <option key={aircraft.id} value={aircraft.id}>
                                            {aircraft.icao} - {aircraft.manufacturer}
                                        </option>
                                    ))}
                                </select>
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
                                <label>Name:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    maxLength={100}
                                    placeholder="Enter fleet name (max 100 characters)"
                                />
                            </div>
                            <div>
                                <label>Registration:</label>
                                <input
                                    type="text"
                                    name="reg"
                                    value={formData.reg}
                                    onChange={handleInputChange}
                                    required
                                    maxLength={6}
                                    minLength={6}
                                    placeholder="Enter registration (6 characters)"
                                />
                            </div>
                            <div>
                                <label>State:</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleInputChange}
                                    required
                                    maxLength={50}
                                    placeholder="Enter state (max 50 characters)"
                                />
                            </div>
                            <div>
                                <label>Life (%):</label>
                                <input
                                    type="number"
                                    name="life"
                                    value={formData.life}
                                    onChange={handleInputChange}
                                    required
                                    min={0}
                                    max={100}
                                    placeholder="Enter life (0-100)"
                                />
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
                                {editingFleet ? 'Update Fleet Unit' : 'Create Fleet Unit'}
                            </button>
                        </form>
                    </div>
                )}
                <div className="table-container">
                    <table className="pilot-table">
                        <thead>
                        <tr>
                            <th>#ID</th>
                            <th>Aircraft</th>
                            <th>Airline</th>
                            <th>Name</th>
                            <th>Registration</th>
                            <th>State</th>
                            <th>Life (%)</th>
                            <th>Rank</th>
                            <th>Created At</th>
                            <th>Updated At</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {fleets.length === 0 ? (
                            <tr className="background-change">
                                <td colSpan="11">No fleet units found.</td>
                            </tr>
                        ) : (
                            fleets.map((fleet, index) => (
                                <tr key={index} className="background-change">
                                    <td>{fleet.id}</td>
                                    <td>{fleet.aircraft ? `${fleet.aircraft.icao}` : 'N/A'}</td>
                                    <td>{fleet.airline ? fleet.airline.name : 'N/A'}</td>
                                    <td>{fleet.name}</td>
                                    <td>{fleet.reg}</td>
                                    <td>{fleet.state}</td>
                                    <td>{fleet.life}</td>
                                    <td>{fleet.rankId ? ranks.find((rank) => rank.id === fleet.rankId)?.name || 'N/A' : 'None'}</td>
                                    <td>{new Date(fleet.createdAt).toLocaleString()}</td>
                                    <td>{new Date(fleet.updatedAt).toLocaleString()}</td>
                                    <td>
                                        <button className="btn" onClick={() => startEditing(fleet)}>
                                            <FontAwesomeIcon icon={faPenToSquare}/>
                                        </button>
                                        <button className="btn danger" onClick={() => handleDelete(fleet.id)}>
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