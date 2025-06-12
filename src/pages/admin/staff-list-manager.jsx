import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Role } from '../../components/auth-context/role';
import api from "../../api/api";

export function StaffListManager() {
    const [staffList, setStaffList] = useState([]);
    const [pilots, setPilots] = useState([]);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        pilotId: '',
        nameRolePosition: '',
        priority: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [staffRes, pilotsRes] = await Promise.all([
                    api.get('/staff-list'),
                    api.get('/pilots/authenticated'), // Adjust endpoint if needed
                ]);
                setStaffList(staffRes.data || []);
                setPilots(pilotsRes.data || []);
                setError(null);
            } catch (error) {
                console.error('Failed to fetch data:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status,
                });
                setError(error.response?.data?.error || 'Failed to fetch staff list or pilots');
            }
        };
        fetchData();
    }, []);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'pilotId' || name === 'priority' ? parseInt(value) || '' : value,
        });
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.pilotId || !formData.nameRolePosition || formData.priority === '') {
            setError('All fields are required');
            return;
        }
        if (!Number.isInteger(formData.priority) || formData.priority < 0) {
            setError('Priority must be a non-negative integer');
            return;
        }

        try {
            let response;
            if (editId) {
                response = await api.patch(`/staff-list/${editId}`, {
                    pilotId: formData.pilotId,
                    nameRolePosition: formData.nameRolePosition,
                    priority: formData.priority,
                });
                setStaffList(staffList.map((item) => (item.id === editId ? response.data.staffEntry : item)));
            } else {
                response = await api.post('/staff-list', {
                    pilotId: formData.pilotId,
                    nameRolePosition: formData.nameRolePosition,
                    priority: formData.priority,
                });
                setStaffList([...staffList, response.data.staffEntry]);
            }
            setShowForm(false);
            setFormData({ pilotId: '', nameRolePosition: '', priority: '' });
            setEditId(null);
            setError(null);
            alert(editId ? 'Staff entry updated successfully' : 'Staff entry created successfully');
        } catch (error) {
            console.error('Failed to save staff entry:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
            });
            setError(error.response?.data?.error || 'Failed to save staff entry');
        }
    };

    const handleEdit = (staff) => {
        setFormData({
            pilotId: staff.pilotId,
            nameRolePosition: staff.nameRolePosition,
            priority: staff.priority,
        });
        setEditId(staff.id);
        setShowForm(true);
        setError(null);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this staff entry?')) return;
        try {
            await api.delete(`/staff-list/${id}`);
            setStaffList(staffList.filter((item) => item.id !== id));
            setError(null);
            alert('Staff entry deleted successfully');
        } catch (error) {
            console.error('Failed to delete staff entry:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
            });
            setError(error.response?.data?.error || 'Failed to delete staff entry');
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setFormData({ pilotId: '', nameRolePosition: '', priority: '' });
        setEditId(null);
        setError(null);
    };

    return (
        <div className="view-model">
            <h2>Manage Staff List</h2>
            <Role has="ADMIN">
                {error && <p className="error-message">{error}</p>}
                <button className="btn btn-success" onClick={() => setShowForm(true)}>
                    <FontAwesomeIcon icon={faPlus} /> Add Staff
                </button>
                {showForm && (
                    <div className="form-group">
                        <h3>{editId ? 'Edit Staff Entry' : 'Add Staff Entry'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="pilotId">Pilot</label>
                                <select
                                    id="pilotId"
                                    name="pilotId"
                                    value={formData.pilotId}
                                    onChange={handleFormChange}
                                    required
                                >
                                    <option value="">Select Pilot</option>
                                    {pilots.map((pilot) => (
                                        <option key={pilot.id} value={pilot.id}>
                                            {pilot.firstName} {pilot.lastName} ({pilot.callsign || pilot.id})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="nameRolePosition">Role/Position</label>
                                <input
                                    type="text"
                                    id="nameRolePosition"
                                    name="nameRolePosition"
                                    value={formData.nameRolePosition}
                                    onChange={handleFormChange}
                                    placeholder="e.g., CEO, Flight Director"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="priority">Priority</label>
                                <input
                                    type="number"
                                    id="priority"
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleFormChange}
                                    placeholder="Lower number = higher priority"
                                    min="0"
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-success">
                                {editId ? 'Update' : 'Create'}
                            </button>
                            <button type="button" className="btn btn-danger" onClick={handleCancel}>
                                Cancel
                            </button>
                        </form>
                    </div>
                )}
                <div className="table-container">
                    <table className="pilot-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Pilot</th>
                            <th>Role/Position</th>
                            <th>Priority</th>
                            <th>Created At</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {staffList.length === 0 ? (
                            <tr className="background-change">
                                <td colSpan="6">No staff entries found</td>
                            </tr>
                        ) : (
                            staffList.map((staff) => (
                                <tr key={staff.id} className="background-change">
                                    <td>{staff.id}</td>
                                    <td>
                                        {staff.pilot.firstName} {staff.pilot.lastName} ({staff.pilot.callsign || 'N/A'})
                                    </td>
                                    <td>{staff.nameRolePosition}</td>
                                    <td>{staff.priority}</td>
                                    <td>{new Date(staff.createdAt).toLocaleString()}</td>
                                    <td>
                                        <button
                                            className="btn btn-success"
                                            onClick={() => handleEdit(staff)}
                                            title="Edit"
                                        >
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => handleDelete(staff.id)}
                                            title="Delete"
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
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