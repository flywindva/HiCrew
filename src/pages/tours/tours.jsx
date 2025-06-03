import {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRoute} from "@fortawesome/free-solid-svg-icons";
import "../events/events.scss"
import "./tours.scss"
import "../list/list.scss"

const eventsData = [
    {
        id: 1,
        image: "",
        open_date: "2025-06-02T15:00:00Z",
        close_date: "2025-08-08T17:00:00Z",
        name: "Iran's Online Day",
        award: "",
        description: "Join us for Iran's Online Day, a full day of flying and air traffic control activities across Iranian airspace. Expect busy skies and exciting challenges!",
    },

];

const tourLegs = [
    { number: "1", departure: "LEMD", arrival: "LEBL", info:"Yes" },
];

const formatDate = (openDate,closeDate) => {
    const tourStartDate = new Date(openDate);
    const tourFinishDate = new Date(closeDate);

    const dayStart = tourStartDate.getUTCDate();
    const endStart = tourFinishDate.getUTCDate();

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    return `${dayStart} ${months[dayStart]} - ${endStart} ${months[endStart]}`;
};

export function Tours() {
    const [selectedTour, setSelectedTour] = useState(null);
    const [tourInfo, setTourInfo] = useState(tourLegs);
    const handleTourClick = (event) => {
        setSelectedTour(event);
    };

    const handleBackClick = () => {
        setSelectedTour(null);
    };

    return (
        <div className="events-container">
            {selectedTour ? (
                <>
                <div className="event-detail">
                    <button className="btn" onClick={handleBackClick}>
                        Back to Tours
                    </button>
                    <div className="event-detail-container">
                        <div className="event-image">
                            <img src={selectedTour.image} alt={selectedTour.name} />
                        </div>
                        <div className="event-content">
                            <h2>{selectedTour.name}</h2>
                            <p className="date">{formatDate(selectedTour.open_date,selectedTour.close_date)}</p>
                            <p className="description">{selectedTour.description}</p>
                            <p className={"tour-award"}>Award: <img src={selectedTour.award} /></p>
                        </div>
                    </div>
                </div>

                <div className="table-container tour-show-list">
                    <table className="pilot-table">
                        <thead>
                        <tr>
                            <th>
                                Number
                            </th>
                            <th>
                                Departure
                            </th>
                            <th>
                                Arrival
                            </th>
                            <th>
                                Info
                            </th>
                            <th>
                                Action
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {tourInfo.map((tour, index) => (
                            <tr key={index} className={index % 2 === 0 ? "even" : "odd"}>
                                <td>{tour.number}</td>
                                <td>{tour.departure}</td>
                                <td>{tour.arrival}</td>
                                <td>{tour.info}</td>
                                <td><a className={"btn"}>Report</a></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                </>
            ) : (
                <>
                    <h2><FontAwesomeIcon icon={faRoute} /> Tours</h2>
                    <div className="banner-events">
                        Here you will find the tours we have for you, and you can get medals in return.
                    </div>
                    <div className="events-list">
                        {eventsData.map((event) => (
                            <div
                                className="event"
                                key={event.id}
                                onClick={() => handleTourClick(event)}
                            >
                                <div className="event-image">
                                    <img src={event.image} alt={event.name} />
                                </div>
                                <div className="event-details">
                                    <h3>{event.name}</h3>
                                    <h6>{formatDate(event.open_date,event.close_date)}</h6>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}