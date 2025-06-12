import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { Role } from '../../components/auth-context/role';
import api from "../../api/api";

export function SimulatorManager() {
    const [simulators, setSimulators] = useState([]);
    const [error, setError] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        logo: '',
    });
    const [editingSimulator, setEditingSimulator] = useState(null);

    useEffect(() => {
        const fetchSimulators = async () => {
            try {
                const response = await api.get('/simulators');
                if (response?.data) {
                    setSimulators(response.data);
                } else {
                    throw new Error('No data received from server');
                }
                setError(null);
            } catch (error) {
                console.error('Failed to fetch simulators:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status,
                });
                const errorMessage =
                    error.response?.data?.error ||
                    error.message ||
                    'Failed to fetch simulators';
                setError(errorMessage);
            }
        };
        fetchSimulators();
    }, []);

    const toggleCreate = () => {
        setShowCreateForm(!showCreateForm);
        setFormData({
            name: '',
            logo: '',
        });
        setEditingSimulator(null);
        setError(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.logo) {
            setError('Name and logo are required');
            return;
        }
        if (formData.name.length > 100) {
            setError('Name must be 100 characters or less');
            return;
        }
        if (formData.logo.length > 255) {
            setError('Logo must be 255 characters or less');
            return;
        }

        try {
            const payload = {
                name: formData.name,
                logo: formData.logo,
            };
            if (editingSimulator) {
                const response = await api.patch(`/simulators/${editingSimulator.id}`, payload);
                setSimulators(
                    simulators.map((sim) => (sim.id === editingSimulator.id ? response.data.simulator : sim))
                );
                alert('Simulator updated successfully');
            } else {
                const response = await api.post('/simulators', payload);
                setSimulators([...simulators, response.data.simulator]);
                alert('Simulator created successfully');
            }
            toggleCreate();
        } catch (error) {
            console.error('Failed to save simulator:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
            });
            const errorMessage =
                error.response?.data?.error ||
                error.message ||
                'Failed to save simulator';
            setError(errorMessage);
        }
    };

    const startEditing = (simulator) => {
        setEditingSimulator(simulator);
        setFormData({
            name: simulator.name,
            logo: simulator.logo,
        });
        setShowCreateForm(true);
        setError(null);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this simulator?')) {
            try {
                await api.delete(`/simulators/${id}`);
                setSimulators(simulators.filter((sim) => sim.id !== id));
                alert('Simulator deleted successfully');
            } catch (error) {
                console.error('Failed to delete simulator:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status,
                });
                const errorMessage =
                    error.response?.data?.error ||
                    error.message ||
                    'Failed to delete simulator';
                setError(errorMessage);
            }
        }
    };

    return (
        <div className="view-model">
            <h2>Simulator Manager</h2>
            <Role has="OPERATIONS_MANAGER">
                <p>
                    <button
                        className={`btn ${showCreateForm ? 'secondary' : ''}`}
                        onClick={toggleCreate}
                    >
                        <FontAwesomeIcon icon={faCirclePlus} /> {showCreateForm ? 'Cancel' : 'Create Simulator'}
                    </button>
                </p>
                {showCreateForm && (
                    <div className="simulator-form">
                        <h3>{editingSimulator ? 'Edit Simulator' : 'Create Simulator'}</h3>
                        {error && <p className="error-message">{error}</p>}
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label>Name:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    maxLength={100}
                                    placeholder="Enter simulator name (max 100 characters)"
                                />
                            </div>
                            <div>
                                <label>Logo URL:</label>
                                <input
                                    type="text"
                                    name="logo"
                                    value={formData.logo}
                                    onChange={handleInputChange}
                                    required
                                    maxLength={255}
                                    placeholder="Enter logo URL (max 255 characters)"
                                />
                            </div>
                            <button type="submit" className="btn">
                                {editingSimulator ? 'Update Simulator' : 'Create Simulator'}
                            </button>
                        </form>
                    </div>
                )}
                <div className="table-container">
                    <table className="pilot-table">
                        <thead>
                        <tr>
                            <th>#ID</th>
                            <th>Name</th>
                            <th>Logo</th>
                            <th>Created At</th>
                            <th>Updated At</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {simulators.length === 0 ? (
                            <tr className="background-change">
                                <td colSpan="6">No simulators found.</td>
                            </tr>
                        ) : (
                            simulators.map((sim, index) => (
                                <tr key={index} className="background-change">
                                    <td>{sim.id}</td>
                                    <td>{sim.name}</td>
                                    <td>
                                        <a href={sim.logo} target="_blank" rel="noopener noreferrer">
                                            {sim.logo}
                                        </a>
                                    </td>
                                    <td>{new Date(sim.createdAt).toLocaleString()}</td>
                                    <td>{new Date(sim.updatedAt).toLocaleString()}</td>
                                    <td>
                                        <button className="btn" onClick={() => startEditing(sim)}>
                                            <FontAwesomeIcon icon={faPenToSquare} />
                                        </button>
                                        <button className="btn danger" onClick={() => handleDelete(sim.id)}>
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