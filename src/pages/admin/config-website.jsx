import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { Role } from "../../components/auth-context/role";
import api from "../../api/apì";

export function ConfigWebsite() {
    const [configs, setConfigs] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchConfigs = async () => {
            try {
                const response = await api.get('/configs');
                if (response?.data) {
                    setConfigs(response.data);
                } else {
                    throw new Error('No data received from server');
                }
                setError(null);
            } catch (error) {
                console.error('Failed to fetch configurations:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status,
                });
                const errorMessage =
                    error.response?.data?.error ||
                    error.message ||
                    'Failed to fetch configurations';
                setError(errorMessage);
            }
        };
        fetchConfigs();
    }, []);

    const handleToggleActive = async (config) => {
        try {
            const response = await api.patch(`/configs/${config.name}`, {
                isActive: !config.isActive,
            });
            setConfigs(
                configs.map((c) =>
                    c.name === config.name ? response.data.config : c
                )
            );
            alert('Configuration updated successfully');
        } catch (error) {
            console.error('Failed to update configuration:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
            });
            const errorMessage =
                error.response?.data?.error ||
                error.message ||
                'Failed to update configuration';
            setError(errorMessage);
        }
    };

    return (
        <div className="view-model">
            <h2>Website Configuration</h2>
            <Role has="ADMIN">
                {error && <p className="error-message">{error}</p>}
                <div className="table-container">
                    <table className="pilot-table">
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Active</th>
                            <th>Updated At</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {configs.length === 0 ? (
                            <tr className="background-change">
                                <td colSpan="5">No configurations found.</td>
                            </tr>
                        ) : (
                            configs.map((config, index) => (
                                <tr key={index} className="background-change">
                                    <td>{config.name}</td>
                                    <td>{config.description || 'N/A'}</td>
                                    <td>{config.isActive ? '✔' : '✘'}</td>
                                    <td>{new Date(config.updatedAt).toLocaleString()}</td>
                                    <td>
                                        <button
                                            className="btn"
                                            onClick={() => handleToggleActive(config)}
                                        >
                                            <FontAwesomeIcon icon={faPenToSquare} />
                                            {config.isActive ? ' Deactivate' : ' Activate'}
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