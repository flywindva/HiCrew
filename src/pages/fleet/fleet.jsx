import {useState} from "react";
import {faPlaneCircleExclamation} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const initialFleet = [
    { airline: "Thor", aircraft: "A320", reg: "EC-THR", name: "Tenerife", status: "Block" },
    { airline: "Thor", aircraft: "B737", reg: "EC-FLY", name: "Mallorca", status: "Active" },
    { airline: "Thor", aircraft: "A330", reg: "EC-SKY", name: "Gran Canaria", status: "Maintenance" },
];

export function Fleet(){
    const [fleet, setFleet] = useState(initialFleet);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

    const sortTable = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }

        const sortedData = [...fleet].sort((a, b) => {
            if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
            if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
            return 0;
        });

        setFleet(sortedData);
        setSortConfig({ key, direction });
    };

    const getSortIndicator = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === "asc" ? " ↑" : " ↓";
        }
        return "";
    };

    return (
        <div className="view-model">
            <h2><FontAwesomeIcon icon={faPlaneCircleExclamation} /> Fleet</h2>
            <div className="table-container">
                <table className="pilot-table">
                    <thead>
                    <tr>
                        <th onClick={() => sortTable("airline")}>
                            Airline {getSortIndicator("airline")}
                        </th>
                        <th onClick={() => sortTable("aircraft")}>
                            Aircraft {getSortIndicator("aircraft")}
                        </th>
                        <th onClick={() => sortTable("reg")}>
                            Reg {getSortIndicator("reg")}
                        </th>
                        <th onClick={() => sortTable("name")}>
                            Name {getSortIndicator("name")}
                        </th>
                        <th onClick={() => sortTable("status")}>
                            Status {getSortIndicator("status")}
                        </th>
                        <th>Info</th>
                    </tr>
                    </thead>
                    <tbody>
                    {fleet.map((aircraft, index) => (
                        <tr key={index} className={"background-change"}>
                            <td>{aircraft.airline}</td>
                            <td>{aircraft.aircraft}</td>
                            <td>{aircraft.reg}</td>
                            <td>{aircraft.name}</td>
                            <td>{aircraft.status}</td>
                            <td>
                                <button className="btn">See Info</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}