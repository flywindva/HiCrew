import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { Role } from '../../components/auth-context/role';
import api from "../../api/apì";

export function AirlineManager() {
    const [airlines, setAirlines] = useState([]);
    const [error, setError] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        logo: '',
        tail: '',
        can_join: false,
    });
    const [editingAirline, setEditingAirline] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch airlines
                const airlineResponse = await api.get('/airlines');
                if (airlineResponse?.data) {
                    setAirlines(airlineResponse.data);
                } else {
                    throw new Error('No airline data received from server');
                }
                setError(null);
            } catch (error) {
                console.error('Failed to fetch airlines:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status,
                });
                const errorMessage =
                    error.response?.data?.error ||
                    error.message ||
                    'Failed to fetch airlines';
                setError(errorMessage);
            }
        };
        fetchData();
    }, []);

    const toggleCreate = () => {
        setShowCreateForm(!showCreateForm);
        setFormData({
            name: '',
            logo: '',
            tail: '',
            can_join: false,
        });
        setEditingAirline(null);
        setError(null);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, logo, tail, can_join } = formData;

        // Validaciones
        if (!name || !logo || !tail || can_join === undefined) {
            setError('Name, logo, tail, and can_join are required');
            return;
        }
        if (name.length > 100) {
            setError('Name must be 100 characters or less');
            return;
        }
        if (logo.length > 255) {
            setError('Logo URL must be 255 characters or less');
            return;
        }
        if (tail.length > 255) {
            setError('Tail URL must be 255 characters or less');
            return;
        }
        if (typeof can_join !== 'boolean') {
            setError('Can Join must be a boolean');
            return;
        }

        try {
            const payload = {
                name,
                logo,
                tail,
                can_join,
            };
            if (editingAirline) {
                const response = await api.patch(`/airlines/${editingAirline.id}`, payload);
                setAirlines(
                    airlines.map((airline) =>
                        airline.id === editingAirline.id ? response.data.airline : airline
                    )
                );
                alert('Airline updated successfully');
            } else {
                const response = await api.post('/airlines', payload);
                setAirlines([...airlines, response.data.airline]);
                alert('Airline created successfully');
            }
            toggleCreate();
        } catch (error) {
            console.error('Failed to save airline:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
            });
            const errorMessage =
                error.response?.data?.error ||
                error.message ||
                'Failed to save airline';
            setError(errorMessage);
        }
    };

    const startEditing = (airline) => {
        setEditingAirline(airline);
        setFormData({
            name: airline.name,
            logo: airline.logo,
            tail: airline.tail,
            can_join: airline.can_join,
        });
        setShowCreateForm(true);
        setError(null);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this airline?')) {
            try {
                await api.delete(`/airlines/${id}`);
                setAirlines(airlines.filter((airline) => airline.id !== id));
                alert('Airline deleted successfully');
            } catch (error) {
                console.error('Failed to delete airline:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status,
                });
                const errorMessage =
                    error.response?.data?.error ||
                    error.message ||
                    'Failed to delete airline';
                setError(errorMessage);
            }
        }
    };

    return (
        <div className="view-model">
            <h2>Airline Manager</h2>
            <Role has="OPERATIONS_MANAGER">
                <p>
                    <button
                        className={`btn ${showCreateForm ? 'secondary' : ''}`}
                        onClick={toggleCreate}
                    >
                        <FontAwesomeIcon icon={faCirclePlus} />{' '}
                        {showCreateForm ? 'Cancel' : 'Create Airline'}
                    </button>
                </p>
                {showCreateForm && (
                    <div className="fleet-form">
                        <h3>{editingAirline ? 'Edit Airline' : 'Create Airline'}</h3>
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
                                    placeholder="Enter airline name (max 100 characters)"
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
                            <div>
                                <label>Tail URL:</label>
                                <input
                                    type="text"
                                    name="tail"
                                    value={formData.tail}
                                    onChange={handleInputChange}
                                    required
                                    maxLength={255}
                                    placeholder="Enter tail URL (max 255 characters)"
                                />
                            </div>
                            <div>
                                <label>
                                    <input
                                        type="checkbox"
                                        name="can_join"
                                        checked={formData.can_join}
                                        onChange={handleInputChange}
                                    />
                                    Can Join
                                </label>
                            </div>
                            <button type="submit" className="btn">
                                {editingAirline ? 'Update Airline' : 'Create Airline'}
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
                            <th>Tail</th>
                            <th>Can Join</th>
                            <th>Created At</th>
                            <th>Updated At</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {airlines.length === 0 ? (
                            <tr className="background-change">
                                <td colSpan="8">No airlines found.</td>
                            </tr>
                        ) : (
                            airlines.map((airline, index) => (
                                <tr key={index} className="background-change">
                                    <td>{airline.id}</td>
                                    <td>{airline.name}</td>
                                    <td>
                                        <a href={airline.logo} target="_blank" rel="noopener noreferrer">
                                            View Logo
                                        </a>
                                    </td>
                                    <td>
                                        <a href={airline.tail} target="_blank" rel="noopener noreferrer">
                                            View Tail
                                        </a>
                                    </td>
                                    <td>{airline.can_join ? 'Yes' : 'No'}</td>
                                    <td>{new Date(airline.createdAt).toLocaleString()}</td>
                                    <td>{new Date(airline.updatedAt).toLocaleString()}</td>
                                    <td>
                                        <button
                                            className="btn"
                                            onClick={() => startEditing(airline)}
                                        >
                                            <FontAwesomeIcon icon={faPenToSquare} />
                                        </button>
                                        <button
                                            className="btn danger"
                                            onClick={() => handleDelete(airline.id)}
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