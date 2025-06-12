import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { Role } from '../../components/auth-context/role';
import api from '../../api/api';

export function MedalUserManager() {
    const [pilots, setPilots] = useState([]);
    const [medals, setMedals] = useState([]);
    const [selectedPilotId, setSelectedPilotId] = useState(null);
    const [pilotMedals, setPilotMedals] = useState([]);
    const [error, setError] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedMedalIds, setSelectedMedalIds] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [pilotRes, medalRes] = await Promise.all([
                    api.get('/pilots/authenticated'),
                    api.get('/medals'),
                ]);
                setPilots(pilotRes.data || []);
                setMedals(medalRes.data || []);
                setError(null);
            } catch (error) {
                console.error('Failed to fetch data:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status,
                });
                setError(error.response?.data?.error || 'Failed to fetch pilots or medals');
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (selectedPilotId) {
            const fetchPilotMedals = async () => {
                try {
                    const response = await api.get(`/pilot-medals/pilot/${selectedPilotId}`);
                    setPilotMedals(response.data || []);
                    setError(null);
                } catch (error) {
                    console.error('Failed to fetch pilot medals:', {
                        message: error.message,
                        response: error.response?.data,
                        status: error.response?.status,
                        url: `/pilot-medals/pilot/${selectedPilotId}`,
                    });
                    setError(error.response?.data?.error || 'Failed to fetch pilot medals');
                }
            };
            fetchPilotMedals();
        } else {
            setPilotMedals([]);
        }
    }, [selectedPilotId]);

    const toggleAddForm = () => {
        setShowAddForm(!showAddForm);
        setSelectedMedalIds([]);
        setError(null);
    };

    const handleMedalChange = (medalId) => {
        setSelectedMedalIds((prev) =>
            prev.includes(medalId)
                ? prev.filter((id) => id !== medalId)
                : [...prev, medalId]
        );
    };

    const handleAddMedals = async (e) => {
        e.preventDefault();
        if (!selectedPilotId) {
            setError('Please select a pilot');
            return;
        }
        if (selectedMedalIds.length === 0) {
            setError('Please select at least one medal');
            return;
        }
        try {
            for (const medalId of selectedMedalIds) {
                await api.post('/pilot-medals', {
                    pilotId: parseInt(selectedPilotId),
                    medalId,
                });
            }
            const response = await api.get(`/pilot-medals/pilot/${selectedPilotId}`);
            setPilotMedals(response.data);
            alert('Medals added successfully');
            toggleAddForm();
        } catch (error) {
            console.error('Failed to add medals:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
            });
            setError(error.response?.data?.error || 'Failed to add medals');
        }
    };

    const handleRemoveMedal = async (medalId) => {
        if (!window.confirm('Are you sure you want to remove this medal?')) return;
        try {
            await api.delete(`/pilot-medals/${selectedPilotId}/${medalId}`);
            const response = await api.get(`/pilot-medals/pilot/${selectedPilotId}`);
            setPilotMedals(response.data);
            alert('Medal removed successfully');
        } catch (error) {
            console.error('Failed to remove medal:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
            });
            setError(error.response?.data?.error || 'Failed to remove medal');
        }
    };

    return (
        <div className="view-model">
            <h2>Pilot Medal Manager</h2>
            {error && <p className="error-message">{error}</p>}
            <Role has="USER_MANAGER">
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
                                <FontAwesomeIcon icon={faCirclePlus} />{' '}
                                {showAddForm ? 'Cancel' : 'Add Medals'}
                            </button>
                        </p>
                        {showAddForm && (
                            <div className="medal-form">
                                <h3>Add Medals</h3>
                                {error && <p className="error-message">{error}</p>}
                                <form onSubmit={handleAddMedals}>
                                    {medals.map((medal) => (
                                        <div key={medal.id}>
                                            <input
                                                type="checkbox"
                                                id={`medal-${medal.id}`}
                                                checked={selectedMedalIds.includes(medal.id)}
                                                disabled={pilotMedals.some((pm) => pm.medalId === medal.id)}
                                                onChange={() => handleMedalChange(medal.id)}
                                            />
                                            <label htmlFor={`medal-${medal.id}`}>
                                                {medal.text}{' '}
                                                <img
                                                    src={medal.img}
                                                    alt={medal.text}
                                                    style={{ width: '30px', height: 'auto', verticalAlign: 'middle' }}
                                                />
                                            </label>
                                        </div>
                                    ))}
                                    <button type="submit" className="btn">
                                        Add Selected Medals
                                    </button>
                                </form>
                            </div>
                        )}
                        <h3>Medals for {pilots.find((p) => p.id === selectedPilotId)?.firstName || 'Pilot'}</h3>
                        <div className="table-container">
                            <table className="pilot-table">
                                <thead>
                                <tr>
                                    <th>Pilot ID</th>
                                    <th>Image</th>
                                    <th>Text</th>
                                    <th>Medal ID</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {pilotMedals.length === 0 ? (
                                    <tr className="background-change">
                                        <td colSpan="5">No medals assigned.</td>
                                    </tr>
                                ) : (
                                    pilotMedals.map((pilotMedal, index) => (
                                        <tr key={index} className="background-change">
                                            <td>{pilotMedal.pilotId}</td>
                                            <td>
                                                <img
                                                    src={pilotMedal.medal.img}
                                                    alt={pilotMedal.medal.text}
                                                    style={{ width: '50px', height: 'auto' }}
                                                />
                                            </td>
                                            <td>{pilotMedal.medal.text}</td>
                                            <td>{pilotMedal.medalId}</td>
                                            <td>
                                                <button
                                                    className="btn danger"
                                                    onClick={() => handleRemoveMedal(pilotMedal.medalId)}
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
                    </>
                )}
            </Role>
        </div>
    );
}