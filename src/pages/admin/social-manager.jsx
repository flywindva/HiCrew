import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { Role } from '../../components/auth-context/role';
import api from "../../api/apì";


export function SocialManager() {
    const [socialNetworks, setSocialNetworks] = useState([]);
    const [error, setError] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({
        icon: '',
        url: '',
        name: ''
    });
    const [editingSocialNetwork, setEditingSocialNetwork] = useState(null);

    // Fetch social networks on component mount
    useEffect(() => {
        const fetchSocialNetworks = async () => {
            try {
                const response = await api.get('/social-networks');
                if (response?.data) {
                    setSocialNetworks(response.data);
                } else {
                    throw new Error('No data received from server');
                }
                setError(null);
            } catch (error) {
                console.error('Failed to fetch social networks:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status,
                    headers: error.response?.headers,
                });
                const errorMessage =
                    error.response?.data?.error ||
                    error.message ||
                    'Failed to fetch social networks';
                setError(errorMessage);
            }
        };
        fetchSocialNetworks();
    }, []);

    const toggleCreate = () => {
        setShowCreateForm(!showCreateForm);
        setFormData({ icon: '', url: '', name: '' });
        setEditingSocialNetwork(null);
        setError(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                icon: formData.icon,
                url: formData.url,
                name: formData.name,
            };
            if (editingSocialNetwork) {
                const response = await api.patch(`/social-networks/${editingSocialNetwork.id}`, payload);
                setSocialNetworks(
                    socialNetworks.map((sn) =>
                        sn.id === editingSocialNetwork.id ? response.data.socialNetwork : sn
                    )
                );
                alert('Social network updated successfully');
            } else {
                const response = await api.post('/social-networks', payload);
                setSocialNetworks([response.data.socialNetwork, ...socialNetworks]);
                alert('Social network created successfully');
            }
            toggleCreate();
        } catch (error) {
            console.error('Failed to save social network:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                headers: error.response?.headers,
            });
            const errorMessage =
                error.response?.data?.error ||
                error.message ||
                'Failed to save social network';
            setError(errorMessage);
        }
    };

    const startEditing = (socialNetwork) => {
        setEditingSocialNetwork(socialNetwork);
        setFormData({
            icon: socialNetwork.icon,
            url: socialNetwork.url,
            name: socialNetwork.name,
        });
        setShowCreateForm(true);
        setError(null);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this social network?')) {
            try {
                await api.delete(`/social-networks/${id}`);
                setSocialNetworks(socialNetworks.filter((sn) => sn.id !== id));
                alert('Social network deleted successfully');
            } catch (error) {
                console.error('Failed to delete social network:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status,
                    headers: error.response?.headers,
                });
                const errorMessage =
                    error.response?.data?.error ||
                    error.message ||
                    'Failed to delete social network';
                setError(errorMessage);
            }
        }
    };

    return (
        <div className="view-model">
            <h2>Social Network Admin</h2>
            {error && <p className="error-message">{error}</p>}
            <Role has="SOCIAL_MANAGER">
                <p>
                    <button
                        className={`btn ${showCreateForm ? 'secondary' : ''}`}
                        onClick={toggleCreate}
                    >
                        <FontAwesomeIcon icon={faCirclePlus} /> {showCreateForm ? 'Cancel' : 'Create Social Network'}
                    </button>
                </p>
                {showCreateForm && (
                    <div className="social-network-form">
                        <h3>{editingSocialNetwork ? 'Edit Social Network' : 'Create Social Network'}</h3>
                        {error && <p className="error-message">{error}</p>}
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label>Icon (e.g., twitter, youtube, discord...):</label>
                                <input
                                    type="text"
                                    name="icon"
                                    value={formData.icon}
                                    onChange={handleInputChange}
                                    required
                                    maxLength={255}
                                    placeholder="Enter icon URL or class (max 255 characters)"
                                />
                            </div>
                            <div>
                                <label>URL:</label>
                                <input
                                    type="url"
                                    name="url"
                                    value={formData.url}
                                    onChange={handleInputChange}
                                    required
                                    maxLength={255}
                                    placeholder="Enter social network URL (max 255 characters)"
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
                                    placeholder="Enter social network name (max 100 characters)"
                                />
                            </div>
                            <button type="submit" className="btn">
                                {editingSocialNetwork ? 'Update Social Network' : 'Create Social Network'}
                            </button>
                        </form>
                    </div>
                )}
                <div className="table-container">
                    <table className="pilot-table">
                        <thead>
                        <tr>
                            <th>#ID</th>
                            <th>Icon</th>
                            <th>URL</th>
                            <th>Name</th>
                            <th>Created At</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {socialNetworks.length === 0 ? (
                            <tr className={"background-change"}>
                                <td colSpan="6">No social networks found.</td>
                            </tr>
                        ) : (
                            socialNetworks.map((sn) => (
                                <tr key={sn.id} className={"background-change"}>
                                    <td>{sn.id}</td>
                                    <td>{sn.icon}</td>
                                    <td>
                                        <a href={sn.url} target="_blank" rel="noopener noreferrer">
                                            {sn.url}
                                        </a>
                                    </td>
                                    <td>{sn.name}</td>
                                    <td>{new Date(sn.createdAt).toLocaleString()}</td>
                                    <td>
                                        <button className="btn" onClick={() => startEditing(sn)}>
                                            <FontAwesomeIcon icon={faPenToSquare} />
                                        </button>
                                        <button className="btn danger" onClick={() => handleDelete(sn.id)}>
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