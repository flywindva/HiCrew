import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Role } from '../../components/auth-context/role';
import api from "../../api/apì";

export function RequestJoinManager() {
    const [requests, setRequests] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await api.get('/request-joins');
                setRequests(response.data || []);
                setError(null);
            } catch (error) {
                console.error('Failed to fetch join requests:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status,
                });
                setError(error.response?.data?.error || 'Failed to fetch join requests');
            }
        };
        fetchRequests();
    }, []);

    const handleStatusUpdate = async (requestId, status) => {
        try {
            const response = await api.patch(`/request-joins/${requestId}`, { status });
            setRequests(requests.map((req) => (req.id === requestId ? response.data.request : req)));
            if (status === 1 && response.data.pilot) {
                alert(`Pilot created for ${response.data.pilot.email}`);
            } else {
                alert(`Request ${status === 1 ? 'approved' : 'rejected'} successfully`);
            }
            setError(null);
        } catch (error) {
            console.error('Failed to update join request:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
            });
            setError(error.response?.data?.error || 'Failed to update join request');
        }
    };

    return (
        <div className="view-model">
            <h2>Manage Join Requests</h2>
            <Role has="USER_MANAGER">
                {error && <p className="error-message">{error}</p>}
                <div className="table-container">
                    <table className="pilot-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>IVAO VID</th>
                            <th>VATSIM VID</th>
                            <th>Birthday</th>
                            <th>Status</th>
                            <th>Created At</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {requests.length === 0 ? (
                            <tr className="background-change">
                                <td colSpan="9">No join requests found</td>
                            </tr>
                        ) : (
                            requests.map((request) => (
                                <tr key={request.id} className="background-change">
                                    <td>{request.id}</td>
                                    <td>{request.name}</td>
                                    <td>{request.email}</td>
                                    <td>{request.id_ivao || 'N/A'}</td>
                                    <td>{request.id_vatsim || 'N/A'}</td>
                                    <td>{new Date(request.birthday).toLocaleDateString()}</td>
                                    <td>
                                        {request.status === 0
                                            ? 'Pending'
                                            : request.status === 1
                                                ? 'Approved'
                                                : 'Rejected'}
                                    </td>
                                    <td>{new Date(request.createdAt).toLocaleString()}</td>
                                    <td>
                                        {request.status === 0 && (
                                            <>
                                                <button
                                                    className="btn success"
                                                    onClick={() => handleStatusUpdate(request.id, 1)}
                                                    title="Approve"
                                                >
                                                    <FontAwesomeIcon icon={faCheck} />
                                                </button>
                                                <button
                                                    className="btn danger"
                                                    onClick={() => handleStatusUpdate(request.id, 2)}
                                                    title="Reject"
                                                >
                                                    <FontAwesomeIcon icon={faTimes} />
                                                </button>
                                            </>
                                        )}
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