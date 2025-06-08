import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { Role } from '../../components/auth-context/role';
import api from "../../api/apì";

export function PermissionManager() {
    const [pilots, setPilots] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [selectedPilotId, setSelectedPilotId] = useState(null);
    const [pilotPermissions, setPilotPermissions] = useState([]);
    const [error, setError] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedPermissionIds, setSelectedPermissionIds] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [pilotRes, permRes] = await Promise.all([
                    api.get('/pilots/authenticated'),
                    api.get('/permissions'),
                ]);
                setPilots(pilotRes.data || []);
                setPermissions(permRes.data || []);
                setError(null);
            } catch (error) {
                console.error('Failed to fetch data:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status,
                });
                setError(error.response?.data?.error || 'Failed to fetch pilots or permissions');
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (selectedPilotId) {
            const fetchPilotPermissions = async () => {
                try {
                    const response = await api.get(`/permissions/${selectedPilotId}/permissions`);
                    setPilotPermissions(response.data || []);
                    setError(null);
                } catch (error) {
                    console.error('Failed to fetch pilot permissions:', {
                        message: error.message,
                        response: error.response?.data,
                        status: error.response?.status,
                    });
                    setError(error.response?.data?.error || 'Failed to fetch pilot permissions');
                }
            };
            fetchPilotPermissions();
        } else {
            setPilotPermissions([]);
        }
    }, [selectedPilotId]);

    const toggleAddForm = () => {
        setShowAddForm(!showAddForm);
        setSelectedPermissionIds([]);
        setError(null);
    };

    const handlePermissionChange = (permissionId) => {
        setSelectedPermissionIds((prev) =>
            prev.includes(permissionId)
                ? prev.filter((id) => id !== permissionId)
                : [...prev, permissionId]
        );
    };

    const handleAddPermissions = async (e) => {
        e.preventDefault();
        if (!selectedPilotId) {
            setError('Please select a pilot');
            return;
        }
        if (selectedPermissionIds.length === 0) {
            setError('Please select at least one permission');
            return;
        }
        try {
            const response = await api.post(`/permissions/${selectedPilotId}/permissions`, {
                permissionIds: selectedPermissionIds,
            });
            setPilotPermissions(response.data.permissions);
            alert('Permissions added successfully');
            toggleAddForm();
        } catch (error) {
            console.error('Failed to add permissions:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
            });
            setError(error.response?.data?.error || 'Failed to add permissions');
        }
    };

    // Remove permission from pilot
    const handleRemovePermission = async (permissionId) => {
        if (!window.confirm('Are you sure you want to remove this permission?')) return;
        try {
            const response = await api.delete(`/permissions/${selectedPilotId}/permissions`, {
                data: { permissionIds: [permissionId] },
            });
            setPilotPermissions(response.data.permissions);
            alert('Permission removed successfully');
        } catch (error) {
            console.error('Failed to remove permission:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
            });
            setError(error.response?.data?.error || 'Failed to remove permission');
        }
    };

    return (
        <div className="view-model">
            <h2>Permission Manager</h2>
            {error && <p className="error-message">{error}</p>}
            <Role has="ADMIN">
                <div>
                    <h3>Select Pilot</h3>
                    <select
                        className="pilot-select"
                        value={selectedPilotId || ''}
                        onChange={(e) => setSelectedPilotId(e.target.value ? parseInt(e.target.value) : null)}
                    >
                        <option value="">Select a pilot</option>
                        {pilots.map((pilot) => (
                            <option key={pilot.id} value={pilot.id}>
                                {pilot.callsign} | {pilot.firstName} {pilot.lastName}
                            </option>
                        ))}
                    </select>
                </div>
                {selectedPilotId && (
                    <>
                        <p>
                            <button
                                className={`btn ${showAddForm ? 'secondary' : ''}`}
                                onClick={toggleAddForm}
                            >
                                <FontAwesomeIcon icon={faCirclePlus}/>{' '}
                                {showAddForm ? 'Cancel' : 'Add Permissions'}
                            </button>
                        </p>
                        {showAddForm && (
                            <div className="permission-form">
                                <h3>Add Permissions</h3>
                                {error && <p className="error-message">{error}</p>}
                                <form onSubmit={handleAddPermissions}>
                                    {permissions.map((perm) => (
                                        <div key={perm.id}>
                                            <input
                                                type="checkbox"
                                                id={`perm-${perm.id}`}
                                                checked={selectedPermissionIds.includes(perm.id)}
                                                disabled={pilotPermissions.some((p) => p.id === perm.id)}
                                                onChange={() => handlePermissionChange(perm.id)}
                                            />
                                            <label htmlFor={`perm-${perm.id}`}>
                                                {perm.name} ({perm.description || 'No description'})
                                            </label>
                                        </div>
                                    ))}
                                    <button type="submit" className="btn">
                                        Add Selected Permissions
                                    </button>
                                </form>
                            </div>
                        )}
                        <h3>Permissions for {pilots.find((p) => p.id === selectedPilotId)?.firstName || 'Pilot'}</h3>
                        <div className="table-container">
                            <table className="pilot-table">
                                <thead>
                                <tr>
                                    <th>#ID</th>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Created At</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {pilotPermissions.length === 0 ? (
                                    <tr className={"background-change"}>
                                        <td colSpan="5">No permissions assigned.</td>
                                    </tr>
                                ) : (
                                    pilotPermissions.map((perm) => (
                                        <tr key={perm.id} className={"background-change"}>
                                            <td>{perm.id}</td>
                                            <td>{perm.name}</td>
                                            <td>{perm.description || 'No description'}</td>
                                            <td>{new Date(perm.createdAt).toLocaleString()}</td>
                                            <td>
                                                <button
                                                    className="btn danger"
                                                    onClick={() => handleRemovePermission(perm.id)}
                                                >
                                                    <FontAwesomeIcon icon={faTrashCan}/>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </Role>
        </div>
    );
}