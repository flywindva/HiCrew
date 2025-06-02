import { useState } from "react";
import "./events.scss";

const eventsData = [
    {
        id: 1,
        image: "",
        open_date: "2025-06-02T15:00:00Z",
        name: "Iran's Online Day",
        description: "Join us for Iran's Online Day, a full day of flying and air traffic control activities across Iranian airspace. Expect busy skies and exciting challenges!",
    },

];

const getTimeIndicator = (openDate) => {
    const currentDate = new Date();
    const eventDate = new Date(openDate);

    const diffInMs = eventDate - currentDate;
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays <= 0) {
        return "Today";
    }
    return `In ${diffInDays} ${diffInDays === 1 ? "day" : "days"}`;
};

const formatDate = (openDate) => {
    const eventDate = new Date(openDate);

    const day = eventDate.getUTCDate();
    const suffixes = ["th", "st", "nd", "rd"];
    const suffix = day % 10 <= 3 && day % 100 !== 11 && day % 100 !== 12 && day % 100 !== 13 ? suffixes[day % 10] : suffixes[0];

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const month = months[eventDate.getUTCMonth()];

    const hours = String(eventDate.getUTCHours()).padStart(2, "0");
    const minutes = String(eventDate.getUTCMinutes()).padStart(2, "0");
    const time = `${hours}:${minutes}z`;

    return `${day}${suffix} ${month}, starting ${time}`;
};

export function Events() {
    const [selectedEvent, setSelectedEvent] = useState(null);

    const handleEventClick = (event) => {
        setSelectedEvent(event);
    };

    const handleBackClick = () => {
        setSelectedEvent(null);
    };

    return (
        <div className="events-container">
            {selectedEvent ? (
                <div className="event-detail">
                    <button className="btn" onClick={handleBackClick}>
                        Back to Events
                    </button>
                    <div className="event-detail-container">
                        <div className="event-image">
                            <img src={selectedEvent.image} alt={selectedEvent.name} />
                        </div>
                        <div className="event-content">
                            <h2>{selectedEvent.name}</h2>
                            <p className="date">{formatDate(selectedEvent.open_date)}</p>
                            <p className="time-indicator">{getTimeIndicator(selectedEvent.open_date)}</p>
                            <p className="description">{selectedEvent.description}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <h2>Events</h2>
                    <div className="banner-events">
                        Every day we strive to enhance our airline's experience by bringing events from our community.
                    </div>
                    <div className="events-list">
                        {eventsData.map((event) => (
                            <div
                                className="event"
                                key={event.id}
                                onClick={() => handleEventClick(event)}
                            >
                                <div className="event-image">
                                    <img src={event.image} alt={event.name} />
                                    <span className="time-indicator">{getTimeIndicator(event.open_date)}</span>
                                </div>
                                <div className="event-details">
                                    <h3>{event.name}</h3>
                                    <h6>{formatDate(event.open_date)}</h6>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}