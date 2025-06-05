import "./notams.scss";
import {faNewspaper} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useEffect, useState} from "react";
import api from "../../api/apì";

export function Notams() {
    const [notams, setNotams] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNotams = async () => {
            try {
                const response = await api.get('/notams');
                if (response?.data) {
                    setNotams(response.data);
                } else {
                    throw new Error('No data received from server');
                }
                setError(null);
            } catch (error) {
                console.error('Failed to fetch NOTAMs:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status,
                    headers: error.response?.headers,
                });
                const errorMessage =
                    error.response?.data?.error ||
                    error.message ||
                    'Failed to fetch active NOTAMs';
                setError(errorMessage);
            }
        };
        fetchNotams();
    }, []);

    const formatDateRange = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);

        const formatDate = (date) => {
            const day = String(date.getUTCDate()).padStart(2, '0');
            const month = String(date.getUTCMonth() + 1).padStart(2, '0');
            const year = date.getUTCFullYear();
            return `${day}/${month}/${year}`;
        };

        return `${formatDate(start)} - ${formatDate(end)}`;
    };

    const getStatus = (startDate, endDate) => {
        const currentDate = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);

        return currentDate >= start && currentDate <= end ? 'Active' : 'Expired';
    };

    return (
        <>
            <h2>
                <FontAwesomeIcon icon={faNewspaper} /> NOTAMS
            </h2>
            {error && <p className="error-message">{error}</p>}
            <div className="notams-list">
                {notams.length === 0 ? (
                    <p>No active NOTAMs found.</p>
                ) : (
                    notams.map((notam) => (
                        <div className="notam" key={notam.id}>
                            <h3>{notam.title}</h3>
                            <h5>{formatDateRange(notam.active_date, notam.desactivate_date)}</h5>
                            <p className={`status ${getStatus(notam.active_date, notam.desactivate_date).toLowerCase()}`}>
                                {getStatus(notam.active_date, notam.desactivate_date)}
                            </p>
                            <p>{notam.text}</p>
                        </div>
                    ))
                )}
            </div>
        </>
    );
}