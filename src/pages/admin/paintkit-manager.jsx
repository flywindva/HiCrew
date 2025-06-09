import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { Role } from '../../components/auth-context/role';
import api from "../../api/apì";

export function PaintkitManager() {
    const [paintkits, setPaintkits] = useState([]);
    const [simulators, setSimulators] = useState([]);
    const [aircrafts, setAircrafts] = useState([]);
    const [error, setError] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({
        simulatorId: '',
        url: '',
        aircraftId: '',
        developer: '',
    });
    const [editingPaintkit, setEditingPaintkit] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch paintkits
                const paintkitResponse = await api.get('/paintkits');
                if (paintkitResponse?.data) {
                    setPaintkits(paintkitResponse.data);
                } else {
                    throw new Error('No paintkit data received from server');
                }

                const simulatorResponse = await api.get('/simulators');
                if (simulatorResponse?.data) {
                    setSimulators(simulatorResponse.data);
                } else {
                    throw new Error('No simulator data received from server');
                }

                const aircraftResponse = await api.get('/aircraft');
                if (aircraftResponse?.data) {
                    setAircrafts(aircraftResponse.data);
                } else {
                    throw new Error('No aircraft data received from server');
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
            simulatorId: '',
            url: '',
            aircraftId: '',
            developer: '',
        });
        setEditingPaintkit(null);
        setError(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { simulatorId, url, aircraftId, developer } = formData;

        if (!simulatorId || !url || !aircraftId || !developer) {
            setError('Simulator, URL, aircraft, and developer are required');
            return;
        }
        if (url.length > 255) {
            setError('URL must be 255 characters or less');
            return;
        }
        if (developer.length > 100) {
            setError('Developer must be 100 characters or less');
            return;
        }
        const simulatorIdNum = parseInt(simulatorId);
        if (isNaN(simulatorIdNum)) {
            setError('Invalid simulator selection');
            return;
        }
        const aircraftIdNum = parseInt(aircraftId);
        if (isNaN(aircraftIdNum)) {
            setError('Invalid aircraft selection');
            return;
        }

        try {
            const payload = {
                simulatorId: simulatorIdNum,
                url,
                aircraftId: aircraftIdNum,
                developer,
            };
            if (editingPaintkit) {
                const response = await api.patch(`/paintkits/${editingPaintkit.id}`, payload);
                setPaintkits(
                    paintkits.map((paintkit) =>
                        paintkit.id === editingPaintkit.id ? response.data.paintkit : paintkit
                    )
                );
                alert('Paintkit updated successfully');
            } else {
                const response = await api.post('/paintkits', payload);
                setPaintkits([...paintkits, response.data.paintkit]);
                alert('Paintkit created successfully');
            }
            toggleCreate();
        } catch (error) {
            console.error('Failed to save paintkit:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
            });
            const errorMessage =
                error.response?.data?.error ||
                error.message ||
                'Failed to save paintkit';
            setError(errorMessage);
        }
    };

    const startEditing = (paintkit) => {
        setEditingPaintkit(paintkit);
        setFormData({
            simulatorId: paintkit.simulatorId.toString(),
            url: paintkit.url,
            aircraftId: paintkit.aircraftId.toString(),
            developer: paintkit.developer,
        });
        setShowCreateForm(true);
        setError(null);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this paintkit?')) {
            try {
                await api.delete(`/paintkits/${id}`);
                setPaintkits(paintkits.filter((paintkit) => paintkit.id !== id));
                alert('Paintkit deleted successfully');
            } catch (error) {
                console.error('Failed to delete paintkit:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status,
                });
                const errorMessage =
                    error.response?.data?.error ||
                    error.message ||
                    'Failed to delete paintkit';
                setError(errorMessage);
            }
        }
    };

    return (
        <div className="view-model">
            <h2>Paintkit Manager</h2>
            <Role has="PAINT_MANAGER">
                <p>
                    <button
                        className={`btn ${showCreateForm ? 'secondary' : ''}`}
                        onClick={toggleCreate}
                    >
                        <FontAwesomeIcon icon={faCirclePlus} /> {showCreateForm ? 'Cancel' : 'Create Paintkit'}
                    </button>
                </p>
                {showCreateForm && (
                    <div className="paintkit-form">
                        <h3>{editingPaintkit ? 'Edit Paintkit' : 'Create Paintkit'}</h3>
                        {error && <p className="error-message">{error}</p>}
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label>Simulator:</label>
                                <select
                                    name="simulatorId"
                                    value={formData.simulatorId}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select a simulator</option>
                                    {simulators.map((simulator) => (
                                        <option key={simulator.id} value={simulator.id}>
                                            {simulator.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>URL:</label>
                                <input
                                    type="text"
                                    name="url"
                                    value={formData.url}
                                    onChange={handleInputChange}
                                    required
                                    maxLength={255}
                                    placeholder="Enter paintkit URL (max 255 characters)"
                                />
                            </div>
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
                                <label>Developer:</label>
                                <input
                                    type="text"
                                    name="developer"
                                    value={formData.developer}
                                    onChange={handleInputChange}
                                    required
                                    maxLength={100}
                                    placeholder="Enter developer name (max 100 characters)"
                                />
                            </div>
                            <button type="submit" className="btn">
                                {editingPaintkit ? 'Update Paintkit' : 'Create Paintkit'}
                            </button>
                        </form>
                    </div>
                )}
                <div className="table-container">
                    <table className="pilot-table">
                        <thead>
                        <tr>
                            <th>#ID</th>
                            <th>Simulator</th>
                            <th>URL</th>
                            <th>Aircraft</th>
                            <th>Developer</th>
                            <th>Created At</th>
                            <th>Updated At</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {paintkits.length === 0 ? (
                            <tr className="background-change">
                                <td colSpan="8">No paintkits found.</td>
                            </tr>
                        ) : (
                            paintkits.map((paintkit, index) => (
                                <tr key={index} className="background-change">
                                    <td>{paintkit.id}</td>
                                    <td>
                                        {simulators.find((sim) => sim.id === paintkit.simulatorId)?.name || 'N/A'}
                                    </td>
                                    <td>
                                        <a href={paintkit.url} target="_blank" rel="noopener noreferrer">
                                            {paintkit.url}
                                        </a>
                                    </td>
                                    <td>
                                        {aircrafts.find((aircraft) => aircraft.id === paintkit.aircraftId)?.icao ||
                                            'N/A'}{' '}
                                        -{' '}
                                        {aircrafts.find((aircraft) => aircraft.id === paintkit.aircraftId)
                                            ?.manufacturer || 'N/A'}
                                    </td>
                                    <td>{paintkit.developer}</td>
                                    <td>{new Date(paintkit.createdAt).toLocaleString()}</td>
                                    <td>{new Date(paintkit.updatedAt).toLocaleString()}</td>
                                    <td>
                                        <button className="btn" onClick={() => startEditing(paintkit)}>
                                            <FontAwesomeIcon icon={faPenToSquare} />
                                        </button>
                                        <button className="btn danger" onClick={() => handleDelete(paintkit.id)}>
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