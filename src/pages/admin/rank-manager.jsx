import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { Role } from '../../components/auth-context/role';
import api from "../../api/apì";

export function RankManager() {
    const [ranks, setRanks] = useState([]);
    const [error, setError] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        img: '',
        hours: '',
    });
    const [editingRank, setEditingRank] = useState(null);

    useEffect(() => {
        const fetchRanks = async () => {
            try {
                const response = await api.get('/ranks');
                if (response?.data) {
                    setRanks(response.data);
                } else {
                    throw new Error('No data received from server');
                }
                setError(null);
            } catch (error) {
                console.error('Failed to fetch ranks:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status,
                });
                const errorMessage =
                    error.response?.data?.error ||
                    error.message ||
                    'Failed to fetch ranks';
                setError(errorMessage);
            }
        };
        fetchRanks();
    }, []);

    const toggleCreate = () => {
        setShowCreateForm(!showCreateForm);
        setFormData({
            name: '',
            img: '',
            hours: '',
        });
        setEditingRank(null);
        setError(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, img, hours } = formData;

        if (!name || !img || !hours) {
            setError('Name, image URL, and hours are required');
            return;
        }
        if (name.length > 100) {
            setError('Name must be 100 characters or less');
            return;
        }
        if (img.length > 255) {
            setError('Image URL must be 255 characters or less');
            return;
        }
        const hoursNum = parseInt(hours);
        if (isNaN(hoursNum) || hoursNum < 0) {
            setError('Hours must be a non-negative integer');
            return;
        }

        try {
            const payload = {
                name,
                img,
                hours: hoursNum,
            };
            if (editingRank) {
                const response = await api.patch(`/ranks/${editingRank.id}`, payload);
                setRanks(
                    ranks.map((rank) => (rank.id === editingRank.id ? response.data.rank : rank))
                );
                alert('Rank updated successfully');
            } else {
                const response = await api.post('/ranks', payload);
                setRanks([...ranks, response.data.rank]);
                alert('Rank created successfully');
            }
            toggleCreate();
        } catch (error) {
            console.error('Failed to save rank:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
            });
            const errorMessage =
                error.response?.data?.error ||
                error.message ||
                'Failed to save rank';
            setError(errorMessage);
        }
    };

    const startEditing = (rank) => {
        setEditingRank(rank);
        setFormData({
            name: rank.name,
            img: rank.img,
            hours: rank.hours.toString(),
        });
        setShowCreateForm(true);
        setError(null);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this rank?')) {
            try {
                await api.delete(`/ranks/${id}`);
                setRanks(ranks.filter((rank) => rank.id !== id));
                alert('Rank deleted successfully');
            } catch (error) {
                console.error('Failed to delete rank:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status,
                });
                const errorMessage =
                    error.response?.data?.error ||
                    error.message ||
                    'Failed to delete rank';
                setError(errorMessage);
            }
        }
    };

    return (
        <div className="view-model">
            <h2>Rank Manager</h2>
            <Role has="USER_MANAGER">
                <p>
                    <button
                        className={`btn ${showCreateForm ? 'secondary' : ''}`}
                        onClick={toggleCreate}
                    >
                        <FontAwesomeIcon icon={faCirclePlus} /> {showCreateForm ? 'Cancel' : 'Create Rank'}
                    </button>
                </p>
                {showCreateForm && (
                    <div className="rank-form">
                        <h3>{editingRank ? 'Edit Rank' : 'Create Rank'}</h3>
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
                                    placeholder="Enter rank name (max 100 characters)"
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
                            <div>
                                <label>Hours:</label>
                                <input
                                    type="number"
                                    name="hours"
                                    value={formData.hours}
                                    onChange={handleInputChange}
                                    required
                                    min={0}
                                    placeholder="Enter required hours"
                                />
                            </div>
                            <button type="submit" className="btn">
                                {editingRank ? 'Update Rank' : 'Create Rank'}
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
                            <th>Image</th>
                            <th>Hours</th>
                            <th>Created At</th>
                            <th>Updated At</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {ranks.length === 0 ? (
                            <tr className="background-change">
                                <td colSpan="7">No ranks found.</td>
                            </tr>
                        ) : (
                            ranks.map((rank, index) => (
                                <tr key={index} className="background-change">
                                    <td>{rank.id}</td>
                                    <td>{rank.name}</td>
                                    <td>
                                        <a href={rank.img} target="_blank" rel="noopener noreferrer">
                                            {rank.img}
                                        </a>
                                    </td>
                                    <td>{rank.hours}</td>
                                    <td>{new Date(rank.createdAt).toLocaleString()}</td>
                                    <td>{new Date(rank.updatedAt).toLocaleString()}</td>
                                    <td>
                                        <button className="btn" onClick={() => startEditing(rank)}>
                                            <FontAwesomeIcon icon={faPenToSquare} />
                                        </button>
                                        <button className="btn danger" onClick={() => handleDelete(rank.id)}>
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