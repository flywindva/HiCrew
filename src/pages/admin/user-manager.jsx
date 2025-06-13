import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { Role } from '../../components/auth-context/role';
import api from '../../api/api';

export function UserManager() {
    const [pilots, setPilots] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPilots = async () => {
            try {
                const response = await api.get('/pilots/admin');
                if (response?.data) {
                    setPilots(response.data);
                    setError(null);
                } else {
                    throw new Error('No pilot data received from server');
                }
            } catch (error) {
                console.error('Failed to fetch pilots:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status,
                });
                const errorMessage =
                    error.response?.data?.error ||
                    error.message ||
                    'Failed to fetch pilots';
                setError(errorMessage);
            }
        };
        fetchPilots();
    }, []);

    const handleDelete = async (pilotId) => {
        if (window.confirm('Are you sure you want to delete this pilot account?')) {
            try {
                await api.delete(`/auth/delete/${pilotId}`);
                setPilots(pilots.filter((pilot) => pilot.id !== pilotId));
                alert('Pilot account deleted successfully');
            } catch (error) {
                console.error('Failed to delete pilot account:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status,
                });
                const errorMessage =
                    error.response?.data?.error ||
                    error.message ||
                    'Failed to delete pilot account';
                setError(errorMessage);
            }
        }
    };

    return (
        <div className="view-model">
            <h2>User Manager</h2>
            <Role has="USER_MANAGER">
                {error && <p className="error-message">{error}</p>}
                <div className="table-container">
                    <table className="pilot-table">
                        <thead>
                        <tr>
                            <th>#ID</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Callsign</th>
                            <th>IVAO ID</th>
                            <th>VATSIM ID</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {pilots.length === 0 ? (
                            <tr className="background-change">
                                <td colSpan="10">No pilots found.</td>
                            </tr>
                        ) : (
                            pilots.map((pilot) => (
                                <tr key={pilot.id} className="background-change">
                                    <td>{pilot.id}</td>
                                    <td>{pilot.firstName}</td>
                                    <td>{pilot.lastName}</td>
                                    <td>{pilot.email}</td>
                                    <td>{pilot.callsign || 'N/A'}</td>
                                    <td>{pilot.ivaoId || 'N/A'}</td>
                                    <td>{pilot.vatsimId || 'N/A'}</td>
                                    <td>
                                        <button
                                            className="btn danger"
                                            onClick={() => handleDelete(pilot.id)}
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