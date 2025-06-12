import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNewspaper } from '@fortawesome/free-solid-svg-icons';
import api from '../../api/api';
import { useTranslation } from 'react-i18next';
import './notams.scss';

export function Notams() {
    const { t, i18n } = useTranslation();
    const [notams, setNotams] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNotams = async () => {
            try {
                const response = await api.get('/notams');
                if (response?.data) {
                    const allNotams = response.data;
                    const currentLang = i18n.language.toUpperCase();
                    console.log('Current language:', currentLang);

                    let filteredNotams = allNotams.filter((notam) => notam.lang?.toUpperCase() === currentLang);

                    if (filteredNotams.length === 0) {
                        filteredNotams = allNotams.filter((notam) => notam.lang?.toUpperCase() === 'EN');
                        console.log('Fallback to EN:', filteredNotams);
                    }

                    if (filteredNotams.length === 0 && allNotams.length > 0) {
                        const availableLangs = [...new Set(allNotams.map((notam) => notam.lang?.toUpperCase()))].filter(Boolean);
                        if (availableLangs.length > 0) {
                            filteredNotams = allNotams.filter((notam) => notam.lang?.toUpperCase() === availableLangs[0]);
                        }
                        console.log('Fallback to first available language:', filteredNotams);
                    }

                    setNotams(filteredNotams);
                    setError(null);
                } else {
                    throw new Error(t('failed-to-fetch-notams'));
                }
            } catch (error) {
                console.error(t('failed-to-fetch-notams'), {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status,
                    headers: error.response?.headers,
                });
                const errorMessage =
                    error.response?.data?.error || error.message || t('failed-to-fetch-notams');
                setError(errorMessage);
            }
        };
        fetchNotams();
    }, [t, i18n.language]);

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

        return currentDate >= start && currentDate <= end ? t('active') : t('expired');
    };

    return (
        <>
            <h2>
                <FontAwesomeIcon icon={faNewspaper} /> {t('notams-title')}
            </h2>
            {error && <p className="error-message">{error}</p>}
            <div className="notams-list">
                {notams.length === 0 ? (
                    <p>{t('no-notams-found')}</p>
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