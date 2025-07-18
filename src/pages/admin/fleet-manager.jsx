import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { Role } from '../../components/auth-context/role';
import { useTranslation } from 'react-i18next';
import api from '../../api/api';

export function FleetManager() {
    const { t } = useTranslation();
    const [fleets, setFleets] = useState([]);
    const [aircrafts, setAircrafts] = useState([]);
    const [airlines, setAirlines] = useState([]);
    const [ranks, setRanks] = useState([]);
    const [hubs, setHubs] = useState([]);
    const [error, setError] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({
        aircraftId: '',
        airlineId: '',
        name: '',
        reg: '',
        state: '0',
        locationIcao: '',
        hubId: '',
        life: '',
        rankId: '',
    });
    const [editingFleet, setEditingFleet] = useState(null);

    const stateMap = {
        0: t('fleet-state-free'),
        1: t('fleet-state-reserved'),
        2: t('fleet-state-in-flight'),
        3: t('fleet-state-maintenance'),
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fleetResponse = await api.get('/fleet', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                if (fleetResponse?.data) {
                    setFleets(fleetResponse.data);
                } else {
                    throw new Error('No fleet data received from server');
                }

                const aircraftResponse = await api.get('/aircraft', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                if (aircraftResponse?.data) {
                    setAircrafts(aircraftResponse.data);
                } else {
                    throw new Error('No aircraft data received from server');
                }

                const airlineResponse = await api.get('/airlines', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                if (airlineResponse?.data) {
                    setAirlines(airlineResponse.data);
                } else {
                    throw new Error('No airline data received from server');
                }

                const rankResponse = await api.get('/ranks', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                if (rankResponse?.data) {
                    setRanks(rankResponse.data);
                } else {
                    throw new Error('No rank data received from server');
                }

                const hubResponse = await api.get('/hubs', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                if (hubResponse?.data) {
                    setHubs(hubResponse.data);
                } else {
                    throw new Error('No hub data received from server');
                }

                setError(null);
            } catch (error) {
                console.error('Failed to fetch data:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status,
                });
                const errorMessage =
                    error.response?.data?.error ||
                    error.message ||
                    t('failed-to-fetch-data');
                setError(errorMessage);
            }
        };
        fetchData();
    }, [t]);

    const toggleCreate = () => {
        setShowCreateForm(!showCreateForm);
        setFormData({
            aircraftId: '',
            airlineId: '',
            name: '',
            reg: '',
            state: '0',
            locationIcao: '',
            hubId: '',
            life: '',
            rankId: '',
        });
        setEditingFleet(null);
        setError(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { aircraftId, airlineId, name, reg, state, locationIcao, hubId, life, rankId } = formData;

        // Client-side validation
        if (!aircraftId || !airlineId || !name || !reg || state === '' || !locationIcao || !life) {
            setError(t('required-fields'));
            return;
        }
        if (name.length > 100) {
            setError(t('name-too-long'));
            return;
        }
        if (reg.length !== 6) {
            setError(t('reg-length'));
            return;
        }
        const lifeNum = parseInt(life);
        if (isNaN(lifeNum) || lifeNum < 0 || lifeNum > 100) {
            setError(t('invalid-life'));
            return;
        }
        const aircraftIdNum = parseInt(aircraftId);
        if (isNaN(aircraftIdNum)) {
            setError(t('invalid-aircraft'));
            return;
        }
        const airlineIdNum = parseInt(airlineId);
        if (isNaN(airlineIdNum)) {
            setError(t('invalid-airline'));
            return;
        }
        const rankIdNum = rankId ? parseInt(rankId) : null;
        if (rankId && isNaN(rankIdNum)) {
            setError(t('invalid-rank'));
            return;
        }
        const hubIdNum = hubId ? parseInt(hubId) : null;
        if (hubId && isNaN(hubIdNum)) {
            setError(t('invalid-hub'));
            return;
        }
        const icaoRegex = /^[A-Z]{4}$/;
        if (!icaoRegex.test(locationIcao)) {
            setError(t('invalid-icao'));
            return;
        }

        try {
            const payload = {
                aircraftId: aircraftIdNum,
                airlineId: airlineIdNum,
                name,
                reg,
                state: parseInt(state),
                locationIcao: locationIcao.toUpperCase(),
                hubId: hubIdNum,
                life: lifeNum,
                rankId: rankIdNum,
            };
            if (editingFleet) {
                const response = await api.patch(`/fleet/${editingFleet.id}`, payload, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setFleets(
                    fleets.map((fleet) => (fleet.id === editingFleet.id ? response.data.fleet : fleet))
                );
                alert(t('fleet-updated'));
            } else {
                const response = await api.post('/fleet', payload, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setFleets([...fleets, response.data.fleet]);
                alert(t('fleet-created'));
            }
            toggleCreate();
        } catch (error) {
            console.error('Failed to save fleet unit:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
            });
            const errorMessage =
                error.response?.data?.error ||
                error.message ||
                t('failed-to-save-fleet');
            setError(errorMessage);
        }
    };

    const startEditing = (fleet) => {
        setEditingFleet(fleet);
        setFormData({
            aircraftId: fleet.aircraftId.toString(),
            airlineId: fleet.airlineId.toString(),
            name: fleet.name,
            reg: fleet.reg,
            state: fleet.state.toString(),
            locationIcao: fleet.locationIcao,
            hubId: fleet.hubId ? fleet.hubId.toString() : '',
            life: fleet.life.toString(),
            rankId: fleet.rankId ? fleet.rankId.toString() : '',
        });
        setShowCreateForm(true);
        setError(null);
    };

    const handleDelete = async (id) => {
        if (window.confirm(t('confirm-delete'))) {
            try {
                await api.delete(`/fleet/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setFleets(fleets.filter((fleet) => fleet.id !== id));
                alert(t('fleet-deleted'));
            } catch (error) {
                console.error('Failed to delete fleet unit:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status,
                });
                const errorMessage =
                    error.response?.data?.error ||
                    error.message ||
                    t('failed-to-delete-fleet');
                setError(errorMessage);
            }
        }
    };

    return (
        <div className="view-model">
            <h2>{t('fleet-manager')}</h2>
            <Role has="OPERATIONS_MANAGER">
                <p>
                    <button
                        className={`btn ${showCreateForm ? 'secondary' : ''}`}
                        onClick={toggleCreate}
                    >
                        <FontAwesomeIcon icon={faCirclePlus} /> {showCreateForm ? t('cancel') : t('create-fleet-unit')}
                    </button>
                </p>
                {showCreateForm && (
                    <div className="fleet-form">
                        <h3>{editingFleet ? t('edit-fleet-unit') : t('create-fleet-unit')}</h3>
                        {error && <p className="error-message">{error}</p>}
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label>{t('aircraft')}</label>
                                <select
                                    name="aircraftId"
                                    value={formData.aircraftId}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">{t('select-aircraft')}</option>
                                    {aircrafts.map((aircraft) => (
                                        <option key={aircraft.id} value={aircraft.id}>
                                            {aircraft.icao} - {aircraft.manufacturer}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>{t('airline')}</label>
                                <select
                                    name="airlineId"
                                    value={formData.airlineId}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">{t('select-airline')}</option>
                                    {airlines.map((airline) => (
                                        <option key={airline.id} value={airline.id}>
                                            {airline.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>{t('name')}</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    maxLength={100}
                                    placeholder={t('enter-name')}
                                />
                            </div>
                            <div>
                                <label>{t('registration')}</label>
                                <input
                                    type="text"
                                    name="reg"
                                    value={formData.reg}
                                    onChange={handleInputChange}
                                    required
                                    maxLength={6}
                                    minLength={6}
                                    placeholder={t('enter-reg')}
                                />
                            </div>
                            <div>
                                <label>{t('state')}</label>
                                <select
                                    name="state"
                                    value={formData.state}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="0">{t('fleet-state-free')}</option>
                                    <option value="1">{t('fleet-state-reserved')}</option>
                                    <option value="2">{t('fleet-state-in-flight')}</option>
                                    <option value="3">{t('fleet-state-maintenance')}</option>
                                </select>
                            </div>
                            <div>
                                <label>{t('location-icao')}</label>
                                <input
                                    type="text"
                                    name="locationIcao"
                                    value={formData.locationIcao}
                                    onChange={handleInputChange}
                                    required
                                    maxLength={4}
                                    placeholder={t('enter-icao')}
                                />
                            </div>
                            <div>
                                <label>{t('hub')}</label>
                                <select
                                    name="hubId"
                                    value={formData.hubId}
                                    onChange={handleInputChange}
                                >
                                    <option value="">{t('select-hub')}</option>
                                    {hubs.map((hub) => (
                                        <option key={hub.id} value={hub.id}>
                                            {hub.airport.name} ({hub.airport.icao})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>{t('life')}</label>
                                <input
                                    type="number"
                                    name="life"
                                    value={formData.life}
                                    onChange={handleInputChange}
                                    required
                                    min={0}
                                    max={100}
                                    placeholder={t('enter-life')}
                                />
                            </div>
                            <div>
                                <label>{t('rank')}</label>
                                <select
                                    name="rankId"
                                    value={formData.rankId}
                                    onChange={handleInputChange}
                                >
                                    <option value="">{t('select-rank')}</option>
                                    {ranks.map((rank) => (
                                        <option key={rank.id} value={rank.id}>
                                            {rank.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit" className="btn">
                                {editingFleet ? t('update-fleet-unit') : t('create-fleet-unit')}
                            </button>
                        </form>
                    </div>
                )}
                <div className="table-container">
                    <table className="pilot-table">
                        <thead>
                        <tr>
                            <th>#ID</th>
                            <th>{t('aircraft')}</th>
                            <th>{t('airline')}</th>
                            <th>{t('name')}</th>
                            <th>{t('registration')}</th>
                            <th>{t('state')}</th>
                            <th>{t('location')}</th>
                            <th>{t('hub')}</th>
                            <th>{t('life')}</th>
                            <th>{t('rank')}</th>
                            <th>{t('created-at')}</th>
                            <th>{t('updated-at')}</th>
                            <th>{t('actions')}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {fleets.length === 0 ? (
                            <tr className="background-change">
                                <td colSpan="13">{t('no-fleet-units')}</td>
                            </tr>
                        ) : (
                            fleets.map((fleet) => (
                                <tr key={fleet.id} className="background-change">
                                    <td>{fleet.id}</td>
                                    <td>{fleet.aircraft ? `${fleet.aircraft.icao}` : 'N/A'}</td>
                                    <td>{fleet.airline ? fleet.airline.name : 'N/A'}</td>
                                    <td>{fleet.name}</td>
                                    <td>{fleet.reg}</td>
                                    <td>{stateMap[fleet.state] || 'N/A'}</td>
                                    <td>{fleet.location ? `${fleet.location.name} (${fleet.location.icao})` : 'N/A'}</td>
                                    <td>{fleet.hub ? `${fleet.hub.airport.name} (${fleet.hub.airport.icao})` : 'None'}</td>
                                    <td>{fleet.life}</td>
                                    <td>{fleet.rankId ? ranks.find((rank) => rank.id === fleet.rankId)?.name || 'N/A' : 'None'}</td>
                                    <td>{new Date(fleet.createdAt).toLocaleString()}</td>
                                    <td>{new Date(fleet.updatedAt).toLocaleString()}</td>
                                    <td>
                                        <button className="btn" onClick={() => startEditing(fleet)}>
                                            <FontAwesomeIcon icon={faPenToSquare} />
                                        </button>
                                        <button className="btn danger" onClick={() => handleDelete(fleet.id)}>
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