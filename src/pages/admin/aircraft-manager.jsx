import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { Role } from '../../components/auth-context/role';
import api from "../../api/api";

export function AircraftManager() {
    const [aircrafts, setAircrafts] = useState([]);
    const [error, setError] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({
        icao: '',
        manufacturer: '',
        range: '',
        max_passengers: '',
        img: '',
    });
    const [editingAircraft, setEditingAircraft] = useState(null);

    useEffect(() => {
        const fetchAircrafts = async () => {
            try {
                const response = await api.get('/aircraft');
                if (response?.data) {
                    setAircrafts(response.data);
                } else {
                    throw new Error('No data received from server');
                }
                setError(null);
            } catch (error) {
                console.error('Failed to fetch aircraft:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status,
                });
                const errorMessage =
                    error.response?.data?.error ||
                    error.message ||
                    'Failed to fetch aircraft';
                setError(errorMessage);
            }
        };
        fetchAircrafts();
    }, []);

    const toggleCreate = () => {
        setShowCreateForm(!showCreateForm);
        setFormData({
            icao: '',
            manufacturer: '',
            range: '',
            max_passengers: '',
            img: '',
        });
        setEditingAircraft(null);
        setError(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { icao, manufacturer, range, max_passengers, img } = formData;

        if (!icao || !manufacturer || !range || !max_passengers || !img) {
            setError('All fields are required');
            return;
        }
        if (icao.length !== 4) {
            setError('ICAO must be exactly 4 characters');
            return;
        }
        if (manufacturer.length > 100) {
            setError('Manufacturer must be 100 characters or less');
            return;
        }
        const rangeNum = parseInt(range);
        if (isNaN(rangeNum) || rangeNum < 0) {
            setError('Range must be a non-negative integer');
            return;
        }
        const maxPassengersNum = parseInt(max_passengers);
        if (isNaN(maxPassengersNum) || maxPassengersNum < 0) {
            setError('Max passengers must be a non-negative integer');
            return;
        }
        if (img.length > 255) {
            setError('Image URL must be 255 characters or less');
            return;
        }

        try {
            const payload = {
                icao,
                manufacturer,
                range: rangeNum,
                max_passengers: maxPassengersNum,
                img,
            };
            if (editingAircraft) {
                const response = await api.patch(`/aircraft/${editingAircraft.id}`, payload);
                setAircrafts(
                    aircrafts.map((aircraft) =>
                        aircraft.id === editingAircraft.id ? response.data.aircraft : aircraft
                    )
                );
                alert('Aircraft updated successfully');
            } else {
                const response = await api.post('/aircraft', payload);
                setAircrafts([...aircrafts, response.data.aircraft]);
                alert('Aircraft created successfully');
            }
            toggleCreate();
        } catch (error) {
            console.error('Failed to save aircraft:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
            });
            const errorMessage =
                error.response?.data?.error ||
                error.message ||
                'Failed to save aircraft';
            setError(errorMessage);
        }
    };

    const startEditing = (aircraft) => {
        setEditingAircraft(aircraft);
        setFormData({
            icao: aircraft.icao,
            manufacturer: aircraft.manufacturer,
            range: aircraft.range.toString(),
            max_passengers: aircraft.max_passengers.toString(),
            img: aircraft.img,
        });
        setShowCreateForm(true);
        setError(null);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this aircraft?')) {
            try {
                await api.delete(`/aircraft/${id}`);
                setAircrafts(aircrafts.filter((aircraft) => aircraft.id !== id));
                alert('Aircraft deleted successfully');
            } catch (error) {
                console.error('Failed to delete aircraft:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status,
                });
                const errorMessage =
                    error.response?.data?.error ||
                    error.message ||
                    'Failed to delete aircraft';
                setError(errorMessage);
            }
        }
    };

    return (
        <div className="view-model">
            <h2>Aircraft Manager</h2>
            <Role has="OPERATIONS_MANAGER">
                <p>
                    <button
                        className={`btn ${showCreateForm ? 'secondary' : ''}`}
                        onClick={toggleCreate}
                    >
                        <FontAwesomeIcon icon={faCirclePlus} /> {showCreateForm ? 'Cancel' : 'Create Aircraft'}
                    </button>
                </p>
                {showCreateForm && (
                    <div className="aircraft-form">
                        <h3>{editingAircraft ? 'Edit Aircraft' : 'Create Aircraft'}</h3>
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
                                />
                            </div>
                            <div>
                                <label>Manufacturer:</label>
                                <input
                                    type="text"
                                    name="manufacturer"
                                    value={formData.manufacturer}
                                    onChange={handleInputChange}
                                    required
                                    maxLength={100}
                                    placeholder="Enter manufacturer (max 100 characters)"
                                />
                            </div>
                            <div>
                                <label>Range (nm):</label>
                                <input
                                    type="number"
                                    name="range"
                                    value={formData.range}
                                    onChange={handleInputChange}
                                    required
                                    min={0}
                                    placeholder="Enter range in nautical miles"
                                />
                            </div>
                            <div>
                                <label>Max Passengers:</label>
                                <input
                                    type="number"
                                    name="max_passengers"
                                    value={formData.max_passengers}
                                    onChange={handleInputChange}
                                    required
                                    min={0}
                                    placeholder="Enter maximum passengers"
                                />
                            </div>
                            <div>
                                <label>Image URL:</label>
                                <input
                                    type="text"
                                    name="img"
                                    value={formData.img}
                                    onChange={handleInputChange}
                                    required
                                    maxLength={255}
                                    placeholder="Enter image URL (max 255 characters)"
                                />
                            </div>
                            <button type="submit" className="btn">
                                {editingAircraft ? 'Update Aircraft' : 'Create Aircraft'}
                            </button>
                        </form>
                    </div>
                )}
                <div className="table-container">
                    <table className="pilot-table">
                        <thead>
                        <tr>
                            <th>#ID</th>
                            <th>ICAO</th>
                            <th>Manufacturer</th>
                            <th>Range (nm)</th>
                            <th>Max Passengers</th>
                            <th>Image</th>
                            <th>Created At</th>
                            <th>Updated At</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {aircrafts.length === 0 ? (
                            <tr className="background-change">
                                <td colSpan="9">No aircraft found.</td>
                            </tr>
                        ) : (
                            aircrafts.map((aircraft, index) => (
                                <tr key={index} className="background-change">
                                    <td>{aircraft.id}</td>
                                    <td>{aircraft.icao}</td>
                                    <td>{aircraft.manufacturer}</td>
                                    <td>{aircraft.range}</td>
                                    <td>{aircraft.max_passengers}</td>
                                    <td>
                                        <a href={aircraft.img} target="_blank" rel="noopener noreferrer">
                                            {aircraft.img}
                                        </a>
                                    </td>
                                    <td>{new Date(aircraft.createdAt).toLocaleString()}</td>
                                    <td>{new Date(aircraft.updatedAt).toLocaleString()}</td>
                                    <td>
                                        <button className="btn" onClick={() => startEditing(aircraft)}>
                                            <FontAwesomeIcon icon={faPenToSquare} />
                                        </button>
                                        <button className="btn danger" onClick={() => handleDelete(aircraft.id)}>
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