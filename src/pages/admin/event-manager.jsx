import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { Role } from "../../components/auth-context/role";
import api from "../../api/api";

export function EventManager() {
    const [events, setEvents] = useState([]);
    const [error, setError] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({
        time_event_start: '',
        time_event_end: '',
        open_view_date: '',
        close_view_date: '',
        text: '',
        description: '',
        banner: '',
        points: '',
        lang: '',
    });
    const [editingEvent, setEditingEvent] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await api.get('/events/all');
                if (response?.data) {
                    setEvents(response.data);
                } else {
                    throw new Error('No data received from server');
                }
                setError(null);
            } catch (error) {
                console.error('Failed to fetch events:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status,
                });
                const errorMessage =
                    error.response?.data?.error ||
                    error.message ||
                    'Failed to fetch all events';
                setError(errorMessage);
            }
        };
        fetchEvents();
    }, []);

    const toggleCreate = () => {
        setShowCreateForm(!showCreateForm);
        setFormData({
            time_event_start: '',
            time_event_end: '',
            open_view_date: '',
            close_view_date: '',
            text: '',
            description: '',
            banner: '',
            points: '',
            lang: '',
        });
        setEditingEvent(null);
        setError(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (new Date(formData.time_event_end) <= new Date(formData.time_event_start)) {
            setError('Event end date must be after start date');
            return;
        }
        if (new Date(formData.close_view_date) <= new Date(formData.open_view_date)) {
            setError('Close view date must be after open view date');
            return;
        }

        if (isNaN(formData.points) || formData.points < 0) {
            setError('Points must be a non-negative number');
            return;
        }

        try {
            const payload = {
                time_event_start: new Date(formData.time_event_start).toISOString(),
                time_event_end: new Date(formData.time_event_end).toISOString(),
                open_view_date: new Date(formData.open_view_date).toISOString(),
                close_view_date: new Date(formData.close_view_date).toISOString(),
                text: formData.text,
                description: formData.description,
                banner: formData.banner,
                points: parseInt(formData.points),
                lang: formData.lang,
            };

            if (editingEvent) {
                const response = await api.patch(`/events/${editingEvent.id}`, payload);
                setEvents(events.map((event) => (event.id === editingEvent.id ? response.data.event : event)));
                alert('Event updated successfully');
            } else {
                const response = await api.post('/events', payload);
                setEvents([...events, response.data.event]);
                alert('Event created successfully');
            }
            toggleCreate();
        } catch (error) {
            console.error('Failed to save event:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
            });
            const errorMessage =
                error.response?.data?.error ||
                error.message ||
                'Failed to save event';
            setError(errorMessage);
        }
    };

    const startEditing = (event) => {
        setEditingEvent(event);
        setFormData({
            time_event_start: new Date(event.time_event_start).toISOString().slice(0, 16),
            time_event_end: new Date(event.time_event_end).toISOString().slice(0, 16),
            open_view_date: new Date(event.open_view_date).toISOString().slice(0, 16),
            close_view_date: new Date(event.close_view_date).toISOString().slice(0, 16),
            text: event.text,
            description: event.description,
            banner: event.banner,
            points: event.points.toString(),
            lang: event.lang,
        });
        setShowCreateForm(true);
        setError(null);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await api.delete(`/events/${id}`);
                setEvents(events.filter((event) => event.id !== id));
                alert('Event deleted successfully');
            } catch (error) {
                console.error('Failed to delete event:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status,
                });
                const errorMessage =
                    error.response?.data?.error ||
                    error.message ||
                    'Failed to delete event';
                setError(errorMessage);
            }
        }
    };

    return (
        <div className="view-model">
            <h2>Events Manager</h2>
            <Role has="EVENT_MANAGER">
                <p>
                    <button
                        className={`btn ${showCreateForm ? 'secondary' : ''}`}
                        onClick={toggleCreate}
                    >
                        <FontAwesomeIcon icon={faCirclePlus} /> {showCreateForm ? 'Cancel' : 'Create Event'}
                    </button>
                </p>
                {showCreateForm && (
                    <div className="event-form">
                        <h3>{editingEvent ? 'Edit Event' : 'Create Event'}</h3>
                        {error && <p className="error-message">{error}</p>}
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label>Start Date & Time:</label>
                                <input
                                    type="datetime-local"
                                    name="time_event_start"
                                    value={formData.time_event_start}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>End Date & Time:</label>
                                <input
                                    type="datetime-local"
                                    name="time_event_end"
                                    value={formData.time_event_end}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Open View Date & Time:</label>
                                <input
                                    type="datetime-local"
                                    name="open_view_date"
                                    value={formData.open_view_date}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Close View Date & Time:</label>
                                <input
                                    type="datetime-local"
                                    name="close_view_date"
                                    value={formData.close_view_date}
                                    onChange={handleInputChange}
                                    required
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
                                    placeholder="Enter event text (max 1024 characters)"
                                />
                            </div>
                            <div>
                                <label>Description:</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                    maxLength={2048}
                                    placeholder="Enter event description (max 2048 characters)"
                                />
                            </div>
                            <div>
                                <label>Banner URL:</label>
                                <input
                                    type="text"
                                    name="banner"
                                    value={formData.banner}
                                    onChange={handleInputChange}
                                    required
                                    maxLength={255}
                                    placeholder="Enter banner URL (max 255 characters)"
                                />
                            </div>
                            <div>
                                <label>Points:</label>
                                <input
                                    type="number"
                                    name="points"
                                    value={formData.points}
                                    onChange={handleInputChange}
                                    required
                                    min={0}
                                    placeholder="Enter points (non-negative)"
                                />
                            </div>
                            <div>
                                <label>Language (e.g., en, es):</label>
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
                            <button type="submit" className="btn">
                                {editingEvent ? 'Update Event' : 'Create Event'}
                            </button>
                        </form>
                    </div>
                )}
                <div className="table-container">
                    <table className="pilot-table">
                        <thead>
                        <tr>
                            <th>#ID</th>
                            <th>Text</th>
                            <th>Description</th>
                            <th>Start</th>
                            <th>End</th>
                            <th>Open View</th>
                            <th>Close View</th>
                            <th>Points</th>
                            <th>Language</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {events.length === 0 ? (
                            <tr className={"background-change"}>
                                <td colSpan="11">No events found.</td>
                            </tr>
                        ) : (
                            events.map((event, index) => (
                                <tr key={index} className="background-change">
                                    <td>{event.id}</td>
                                    <td>{event.text}</td>
                                    <td>{event.description}</td>
                                    <td>{new Date(event.time_event_start).toLocaleString()}</td>
                                    <td>{new Date(event.time_event_end).toLocaleString()}</td>
                                    <td>{new Date(event.open_view_date).toLocaleString()}</td>
                                    <td>{new Date(event.close_view_date).toLocaleString()}</td>
                                    <td>{event.points}</td>
                                    <td>{event.lang}</td>
                                    <td>
                                        <button className="btn" onClick={() => startEditing(event)}>
                                            <FontAwesomeIcon icon={faPenToSquare} />
                                        </button>
                                        <button className="btn danger" onClick={() => handleDelete(event.id)}>
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