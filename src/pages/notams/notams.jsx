import "./notams.scss";
import {faNewspaper} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const notamsData = [
    {
        id: 1,
        title: "Runway Closure at LEBL",
        start_date: "2025-05-01T00:00:00Z",
        end_date: "2025-06-15T23:59:59Z",
        description: "Runway 07L/25R at LEBL will be closed for maintenance. Expect delays and use alternate runways.",
    },
    {
        id: 2,
        title: "Temporary Airspace Restriction over LEZL",
        start_date: "2025-06-01T00:00:00Z",
        end_date: "2025-06-03T23:59:59Z",
        description: "Temporary airspace restriction due to military exercise. Check NOTAM for affected altitudes and times.",
    },
    {
        id: 3,
        title: "Navigation Aid Outage at LEMD",
        start_date: "2025-05-15T00:00:00Z",
        end_date: "2025-05-30T23:59:59Z",
        description: "VOR/DME at LEMD will be out of service. Pilots are advised to use alternate navigation aids.",
    },
];

const formatDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const formatDate = (date) => {
        const day = String(date.getUTCDate()).padStart(2, "0");
        const month = String(date.getUTCMonth() + 1).padStart(2, "0");
        const year = date.getUTCFullYear();
        return `${day}/${month}/${year}`;
    };

    return `${formatDate(start)} - ${formatDate(end)}`;
};

const getStatus = (startDate, endDate) => {
    const currentDate = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (currentDate >= start && currentDate <= end) {
        return "Active";
    }
    return "Expired";
};

export function Notams() {
    return (
        <>
            <h2><FontAwesomeIcon icon={faNewspaper} /> NOTAMS</h2>
            <div className="notams-list">
                {notamsData.map((notam) => (
                    <div className="notam" key={notam.id}>
                        <h3>{notam.title}</h3>
                        <h5>{formatDateRange(notam.start_date, notam.end_date)}</h5>
                        <p className={`status ${getStatus(notam.start_date, notam.end_date).toLowerCase()}`}>
                            {getStatus(notam.start_date, notam.end_date)}
                        </p>
                        <p>{notam.description}</p>
                    </div>
                ))}
            </div>
        </>
    );
}