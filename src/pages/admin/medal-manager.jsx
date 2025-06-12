import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { Role } from '../../components/auth-context/role';
import api from '../../api/api';

export function MedalManager() {
    const [medals, setMedals] = useState([]);
    const [error, setError] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({
        img: '',
        text: '',
    });
    const [editingMedal, setEditingMedal] = useState(null);

    useEffect(() => {
        const fetchMedals = async () => {
            try {
                const response = await api.get('/medals');
                if (response?.data) {
                    setMedals(response.data);
                } else {
                    throw new Error('No medal data received from server');
                }
                setError(null);
            } catch (error) {
                console.error('Failed to fetch medals:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status,
                });
                const errorMessage =
                    error.response?.data?.error ||
                    error.message ||
                    'Failed to fetch medals';
                setError(errorMessage);
            }
        };
        fetchMedals();
    }, []);

    const toggleCreateForm = () => {
        setShowCreateForm(!showCreateForm);
        setFormData({
            img: '',
            text: '',
        });
        setEditingMedal(null);
        setError(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { img, text } = formData;

        if (!img || !text) {
            setError('Image URL and text are required');
            return;
        }
        if (img.length > 255) {
            setError('Image URL must be 255 characters or less');
            return;
        }
        if (text.length > 255) {
            setError('Text must be 255 characters or less');
            return;
        }

        try {
            const payload = { img, text };
            if (editingMedal) {
                const response = await api.patch(`/medals/${editingMedal.id}`, payload);
                setMedals(
                    medals.map((medal) =>
                        medal.id === editingMedal.id ? response.data.medal : medal
                    )
                );
                alert('Medal updated successfully');
            } else {
                const response = await api.post('/medals', payload);
                setMedals([...medals, response.data.medal]);
                alert('Medal created successfully');
            }
            toggleCreateForm();
        } catch (error) {
            console.error('Failed to save medal:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
            });
            const errorMessage =
                error.response?.data?.error ||
                error.message ||
                'Failed to save medal';
            setError(errorMessage);
        }
    };

    const startEditing = (medal) => {
        setEditingMedal(medal);
        setFormData({
            img: medal.img,
            text: medal.text,
        });
        setShowCreateForm(true);
        setError(null);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this medal?')) {
            try {
                await api.delete(`/medals/${id}`);
                setMedals(medals.filter((medal) => medal.id !== id));
                alert('Medal deleted successfully');
            } catch (error) {
                console.error('Failed to delete medal:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status,
                });
                const errorMessage =
                    error.response?.data?.error ||
                    error.message ||
                    'Failed to delete medal';
                setError(errorMessage);
            }
        }
    };

    return (
        <div className="view-model">
            <h2>Medal Manager</h2>
            <Role has="USER_MANAGER">
                <p>
                    <button
                        className={`btn ${showCreateForm ? 'secondary' : ''}`}
                        onClick={toggleCreateForm}
                    >
                        <FontAwesomeIcon icon={faCirclePlus} />{' '}
                        {showCreateForm ? 'Cancel' : 'Create Medal'}
                    </button>
                </p>
                {showCreateForm && (
                    <div className="medal-form">
                        <h3>{editingMedal ? 'Edit Medal' : 'Create Medal'}</h3>
                        {error && <p className="error-message">{error}</p>}
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label>Image URL:</label>
                                <input
                                    type="text"
                                    name="img"
                                    value={formData.img}
                                    onChange={handleInputChange}
                                    placeholder="Enter image URL"
                                    required
                                />
                            </div>
                            <div>
                                <label>Text:</label>
                                <input
                                    type="text"
                                    name="text"
                                    value={formData.text}
                                    onChange={handleInputChange}
                                    placeholder="Enter medal description"
                                    required
                                />
                            </div>
                            <button type="submit" className="btn">
                                {editingMedal ? 'Update Medal' : 'Create Medal'}
                            </button>
                        </form>
                    </div>
                )}
                <div className="table-container">
                    <table className="pilot-table">
                        <thead>
                        <tr>
                            <th>#ID</th>
                            <th>Image</th>
                            <th>Text</th>
                            <th>Created At</th>
                            <th>Updated At</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {medals.length === 0 ? (
                            <tr className="background-change">
                                <td colSpan="6">No medals found.</td>
                            </tr>
                        ) : (
                            medals.map((medal, index) => (
                                <tr key={index} className="background-change">
                                    <td>{medal.id}</td>
                                    <td>
                                        <img
                                            src={medal.img}
                                            alt={medal.text}
                                            style={{ width: '50px', height: 'auto' }}
                                        />
                                    </td>
                                    <td>{medal.text}</td>
                                    <td>{new Date(medal.createdAt).toLocaleString()}</td>
                                    <td>{new Date(medal.updatedAt).toLocaleString()}</td>
                                    <td>
                                        <button
                                            className="btn"
                                            onClick={() => startEditing(medal)}
                                        >
                                            <FontAwesomeIcon icon={faPenToSquare} />
                                        </button>
                                        <button
                                            className="btn danger"
                                            onClick={() => handleDelete(medal.id)}
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