import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./events.scss";
import api from "../../api/apì";

export function Events() {
    const { t, i18n } = useTranslation();
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                const response = await api.get("/events");
                if (response?.data) {
                    const allEvents = response.data;
                    const currentLang = i18n.language.toUpperCase();
                    console.log("Current language:", currentLang);

                    const mappedEvents = allEvents.map((event) => ({
                        id: event.id,
                        image: event.banner || "/resources/background-banner.png",
                        open_date: event.time_event_start,
                        name: event.text,
                        description: event.description,
                        lang: event.lang,
                    }));

                    let filteredEvents = mappedEvents.filter(
                        (event) => event.lang?.toUpperCase() === currentLang
                    );

                    if (filteredEvents.length === 0) {
                        filteredEvents = mappedEvents.filter(
                            (event) => event.lang?.toUpperCase() === "EN"
                        );
                        console.log("Fallback to EN:", filteredEvents);
                    }

                    if (filteredEvents.length === 0 && mappedEvents.length > 0) {
                        const availableLangs = [
                            ...new Set(mappedEvents.map((event) => event.lang?.toUpperCase())),
                        ].filter(Boolean);
                        if (availableLangs.length > 0) {
                            filteredEvents = mappedEvents.filter(
                                (event) => event.lang?.toUpperCase() === availableLangs[0]
                            );
                            console.log("Fallback to first available language:", filteredEvents);
                        }
                    }

                    setEvents(filteredEvents);
                    setError(null);
                } else {
                    throw new Error(t("failed-to-fetch-events"));
                }
            } catch (error) {
                console.error(t("failed-to-fetch-events"), {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status,
                    headers: error.response?.headers,
                });
                const errorMessage =
                    error.response?.data?.error ||
                    error.message ||
                    t("failed-to-fetch-events");
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, [t, i18n.language]);

    const getTimeIndicator = (openDate) => {
        const currentDate = new Date();
        const eventDate = new Date(openDate);

        const diffInMs = eventDate - currentDate;
        const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInDays <= 0) {
            return t("today");
        }
        return t("in-days").replace('{count}', diffInDays);
    };

    const formatDate = (openDate) => {
        const eventDate = new Date(openDate);

        const day = eventDate.getUTCDate();
        const suffixes = ["th", "st", "nd", "rd"];
        const suffix =
            day % 10 <= 3 && day % 100 !== 11 && day % 100 !== 12 && day % 100 !== 13
                ? suffixes[day % 10]
                : suffixes[0];

        const months = [
            t("january"),
            t("february"),
            t("march"),
            t("april"),
            t("may"),
            t("june"),
            t("july"),
            t("august"),
            t("september"),
            t("october"),
            t("november"),
            t("december"),
        ];
        const month = months[eventDate.getUTCMonth()];

        const hours = String(eventDate.getUTCHours()).padStart(2, "0");
        const minutes = String(eventDate.getUTCMinutes()).padStart(2, "0");
        const time = `${hours}:${minutes}z`;

        return t("date-format").replace('{day}', day).replace('{suffix}', suffix).replace('{month}', month).replace('{time}', time);
    };

    const handleEventClick = (event) => {
        setSelectedEvent(event);
    };

    const handleBackClick = () => {
        setSelectedEvent(null);
    };

    return (
        <div className="events-container">
            {loading ? (
                <p>{t("loading")}</p>
            ) : error ? (
                <p className="error-message">{error}</p>
            ) : selectedEvent ? (
                <div className="event-detail">
                    <button className="btn" onClick={handleBackClick}>
                        {t("back-to-events")}
                    </button>
                    <div className="event-detail-container">
                        <div className="event-image">
                            <img
                                src={selectedEvent.image}
                                alt={selectedEvent.name}
                                loading="lazy"
                                onError={(e) => {
                                    e.target.src = "/resources/background-banner.png";
                                }}
                            />
                        </div>
                        <div className="event-content">
                            <h2>{selectedEvent.name}</h2>
                            <p className="date">{formatDate(selectedEvent.open_date)}</p>
                            <p className="time-indicator">
                                {getTimeIndicator(selectedEvent.open_date)}
                            </p>
                            <p className="description">{selectedEvent.description}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <h2>
                        <FontAwesomeIcon icon={faCalendar} /> {t("events-title")}
                    </h2>
                    <div className="banner-events">
                        {t("events-banner-text")}
                    </div>
                    <div className="events-list">
                        {events.length === 0 ? (
                            <p>{t("no-events-found")}</p>
                        ) : (
                            events.map((event) => (
                                <div
                                    className="event"
                                    key={event.id}
                                    onClick={() => handleEventClick(event)}
                                >
                                    <div className="event-image">
                                        <img
                                            src={event.image}
                                            alt={event.name}
                                            loading="lazy"
                                            onError={(e) => {
                                                e.target.src = "/resources/background-banner.png";
                                            }}
                                        />
                                        <span className="time-indicator">
                                            {getTimeIndicator(event.open_date)}
                                        </span>
                                    </div>
                                    <div className="event-details">
                                        <h3>{event.name}</h3>
                                        <h6>{formatDate(event.open_date)}</h6>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
    );
}