import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import api from "../../api/api";
import {Role} from "../../components/auth-context/role";

export function NotamsManager() {
    const [notams, setNotams] = useState([]);
    const [error, setError] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        text: '',
        lang: '',
        active_date: '',
        desactivate_date: '',
    });
    const [editingNotam, setEditingNotam] = useState(null);

    useEffect(() => {
        const fetchNotams = async () => {
            try {
                const response = await api.get('/notams/all');
                if (response?.data) {
                    setNotams(response.data);
                } else {
                    throw new Error('No data received from server');
                }
                setError(null);
            } catch (error) {
                console.error('Failed to fetch NOTAMs:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status,
                });
                const errorMessage =
                    error.response?.data?.error ||
                    error.message ||
                    'Failed to fetch all NOTAMs';
                setError(errorMessage);
            }
        };
        fetchNotams();
    }, []);

    const toggleCreate = () => {
        setShowCreateForm(!showCreateForm);
        setFormData({
            title: '',
            text: '',
            lang: '',
            active_date: '',
            desactivate_date: '',
        });
        setEditingNotam(null);
        setError(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (new Date(formData.desactivate_date) <= new Date(formData.active_date)) {
            setError('Deactivation date must be after active date');
            return;
        }
        try {
            const payload = {
                title: formData.title,
                text: formData.text,
                lang: formData.lang,
                active_date: new Date(formData.active_date).toISOString(),
                desactivate_date: new Date(formData.desactivate_date).toISOString(),
            };
            if (editingNotam) {
                const response = await api.patch(`/notams/${editingNotam.id}`, payload);
                setNotams(notams.map((notam) => (notam.id === editingNotam.id ? response.data.notam : notam)));
                alert('NOTAM updated successfully');
            } else {
                const response = await api.post('/notams', payload);
                setNotams([...notams, response.data.notam]);
                alert('NOTAM created successfully');
            }
            toggleCreate();
        } catch (error) {
            console.error('Failed to save NOTAM:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
            });
            const errorMessage =
                error.response?.data?.error ||
                error.message ||
                'Failed to save NOTAM';
            setError(errorMessage);
        }
    };

    const startEditing = (notam) => {
        setEditingNotam(notam);
        setFormData({
            title: notam.title,
            text: notam.text,
            lang: notam.lang,
            active_date: new Date(notam.active_date).toISOString().slice(0, 16),
            desactivate_date: new Date(notam.desactivate_date).toISOString().slice(0, 16),
        });
        setShowCreateForm(true);
        setError(null);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this NOTAM?')) {
            try {
                await api.delete(`/notams/${id}`);
                setNotams(notams.filter((notam) => notam.id !== id));
                alert('NOTAM deleted successfully');
            } catch (error) {
                console.error('Failed to delete NOTAM:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status,
                });
                const errorMessage =
                    error.response?.data?.error ||
                    error.message ||
                    'Failed to delete NOTAM';
                setError(errorMessage);
            }
        }
    };

    return (
        <div className="view-model">
            <h2>NOTAMS Manager</h2>
            <Role has="NOTAMS_MANAGER">
                <p>
                    <button
                        className={`btn ${showCreateForm ? 'secondary' : ''}`}
                        onClick={toggleCreate}
                    >
                        <FontAwesomeIcon icon={faCirclePlus} /> {showCreateForm ? 'Cancel' : 'Create NOTAM'}
                    </button>
                </p>
                {showCreateForm && (
                    <div className="notam-form">
                        <h3>{editingNotam ? 'Edit NOTAM' : 'Create NOTAM'}</h3>
                        {error && <p className="error-message">{error}</p>}
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label>Title:</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                    maxLength={255}
                                    placeholder="Enter NOTAM title (max 255 characters)"
                                />
                            </div>
                            <div>
                                <label>Text:</label>
                                <textarea
                                    name="text"
                                    value={formData.text}
                                    onChange={handleInputChange}
                                    required
                                    maxLength={1024}
                                    placeholder="Enter NOTAM text (max 1024 characters)"
                                />
                            </div>
                            <div>
                                <label>Language (e.g., EN, ES):</label>
                                <input
                                    type="text"
                                    name="lang"
                                    value={formData.lang}
                                    onChange={handleInputChange}
                                    required
                                    maxLength={4}
                                    placeholder="Enter language code (max 4 characters)"
                                />
                            </div>
                            <div>
                                <label>Active Date & Time:</label>
                                <input
                                    type="datetime-local"
                                    name="active_date"
                                    value={formData.active_date}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Deactivation Date & Time:</label>
                                <input
                                    type="datetime-local"
                                    name="desactivate_date"
                                    value={formData.desactivate_date}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn">
                                {editingNotam ? 'Update NOTAM' : 'Create NOTAM'}
                            </button>
                        </form>
                    </div>
                )}
                <div className="table-container">
                    <table className="pilot-table">
                        <thead>
                        <tr>
                            <th>#ID</th>
                            <th>Title</th>
                            <th>Text</th>
                            <th>Active</th>
                            <th>Close</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {notams.length === 0 ? (
                            <tr className={"background-change"}>
                                <td colSpan="6">No NOTAMs found.</td>
                            </tr>
                        ) : (
                            notams.map((notam, index) => (
                                <tr key={index} className={"background-change"}>
                                    <td>{notam.id}</td>
                                    <td>{notam.title}</td>
                                    <td>{notam.text}</td>
                                    <td>{new Date(notam.active_date).toLocaleString()}</td>
                                    <td>{new Date(notam.desactivate_date).toLocaleString()}</td>
                                    <td>
                                        <button className="btn" onClick={() => startEditing(notam)}>
                                            <FontAwesomeIcon icon={faPenToSquare}/>
                                        </button>
                                        <button className="btn danger" onClick={() => handleDelete(notam.id)}>
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