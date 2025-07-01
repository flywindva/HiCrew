import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCheck, faTimes, faTrashCan} from '@fortawesome/free-solid-svg-icons';
import { Role } from '../../components/auth-context/role';
import api from '../../api/api';

export function FlightManager() {
    const [flights, setFlights] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPendingFlights = async () => {
            try {
                const response = await api.get('/flights/pending');
                if (response?.data) {
                    const filteredFlights = response.data.filter(
                        (flight) => flight.startFlight && flight.closeFlight
                    );
                    setFlights(filteredFlights);
                    setError(null);
                } else {
                    throw new Error('No flight data received from server');
                }
            } catch (error) {
                console.error('Failed to fetch pending flights:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status,
                });
                const errorMessage =
                    error.response?.data?.error ||
                    error.message ||
                    'Failed to fetch pending flights';
                setError(errorMessage);
            }
        };
        fetchPendingFlights();
    }, []);

    const handleStatusChange = async (flightId, status, comment = '') => {
        try {
            const confirmMessage = status === 2
                ? 'Are you sure you want to accept this flight?'
                : 'Are you sure you want to reject this flight?';

            if (window.confirm(confirmMessage)) {
                await api.put(`/flights/${flightId}/status`, { status, comment });
                setFlights(flights.filter((flight) => flight.id !== flightId));
                alert(`Flight ${status === 2 ? 'accepted' : 'rejected'} successfully`);
            }
        } catch (error) {
            console.error(`Failed to ${status === 2 ? 'accept' : 'reject'} flight:`, {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
            });
            const errorMessage =
                error.response?.data?.error ||
                error.message ||
                `Failed to ${status === 2 ? 'accept' : 'reject'} flight`;
            setError(errorMessage);
        }
    };


    return (
        <div className="view-model">
            <h2>Flight Manager</h2>
            <Role has="VALIDATOR_MANAGER">
                {error && <p className="error-message">{error}</p>}
                <div className="table-container">
                    <table className="pilot-table">
                        <thead>
                        <tr>
                            <th>#ID</th>
                            <th>Pilot</th>
                            <th>Aircraft</th>
                            <th>Departure</th>
                            <th>Arrival</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Type</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {flights.length === 0 ? (
                            <tr className="background-change">
                                <td colSpan="9">No pending flights found.</td>
                            </tr>
                        ) : (
                            flights.map((flight) => (
                                <tr key={flight.id} className="background-change">
                                    <td>{flight.id}</td>
                                    <td>{`${flight.pilot.firstName} (${flight.pilot.callsign || 'N/A'})`}</td>
                                    <td>{flight.aircraft}</td>
                                    <td>{`${flight.departure.icao} (${flight.departure.name})`}</td>
                                    <td>{`${flight.arrival.icao} (${flight.arrival.name})`}</td>
                                    <td>{new Date(flight.startFlight).toLocaleString()}</td>
                                    <td>{new Date(flight.closeFlight).toLocaleString()}</td>
                                    <td>
                                        {flight.type === 1
                                            ? 'Manual'
                                            : flight.type === 2
                                                ? 'Regular'
                                                : flight.type === 3
                                                    ? 'Charter'
                                                    : flight.type === 4
                                                        ? 'ACARS'
                                                        : 'Free Mode'}
                                    </td>
                                    <td>
                                        <button
                                            className="btn"
                                            onClick={() => handleStatusChange(flight.id, 2)}
                                            title="Accept flight"
                                        >
                                            <FontAwesomeIcon icon={faCheck}/>
                                        </button>
                                        <button
                                            className="btn danger"
                                            onClick={() => handleStatusChange(flight.id, 3)}
                                            title="Reject flight"
                                        >
                                            <FontAwesomeIcon icon={faTimes}/>
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