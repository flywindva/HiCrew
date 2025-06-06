import {useEffect, useState} from "react";
import "./list.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faUserTie } from "@fortawesome/free-solid-svg-icons";
import {getPilots} from "../../api/apì";
import {useTranslation} from "react-i18next";

const initialStaff = [
    { callsign: "IB001", name: "Carlos Sánchez", position: "CEO" },
    { callsign: "IB002", name: "María López", position: "Operations Manager" },
    { callsign: "IB003", name: "Javier Ruiz", position: "Training Coordinator" },
];

const initialPilots = [
    { callsign: "IB123", name: "Juan Pérez", ivaoVid: "123456", vatsimId: "654321" },
    { callsign: "IB456", name: "Ana García", ivaoVid: "789012", vatsimId: "210987" },
    { callsign: "IB789", name: "Pedro López", ivaoVid: "345678", vatsimId: "876543" },
];

export function PilotList() {
    const { t } = useTranslation();
    const [staff, setStaff] = useState(initialStaff);
    const [pilots, setPilots] = useState(initialPilots);
    const [staffSortConfig, setStaffSortConfig] = useState({ key: null, direction: "asc" });
    const [pilotsSortConfig, setPilotsSortConfig] = useState({ key: null, direction: "asc" });

    useEffect(() => {
        const fetchPilots = async () => {
            try {
                const response = await getPilots();
                setPilots(response.data);
            } catch (error) {
                console.error(t('error-fetching-pilots'), error);
            }
        };
        fetchPilots();
    }, []);

    const sortTable = (data, setData, sortConfig, setSortConfig, key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }

        const sortedData = [...data].sort((a, b) => {
            if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
            if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
            return 0;
        });

        setData(sortedData);
        setSortConfig({ key, direction });
    };

    const getSortIndicator = (sortConfig, key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === "asc" ? " ↑" : " ↓";
        }
        return "";
    };

    return (
        <>
            <div className="pilot-list">
                <h2>
                    <FontAwesomeIcon icon={faUserTie} /> {t('staff-list')}
                </h2>
                <div className="table-container">
                    <table className="pilot-table">
                        <thead>
                        <tr>
                            <th onClick={() => sortTable(staff, setStaff, staffSortConfig, setStaffSortConfig, 'callsign')}>
                                {t('callsign')} {getSortIndicator(staffSortConfig, 'callsign')}
                            </th>
                            <th onClick={() => sortTable(staff, setStaff, staffSortConfig, setStaffSortConfig, 'name')}>
                                {t('name')} {getSortIndicator(staffSortConfig, 'name')}
                            </th>
                            <th onClick={() => sortTable(staff, setStaff, staffSortConfig, setStaffSortConfig, 'position')}>
                                {t('position')} {getSortIndicator(staffSortConfig, 'position')}
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {staff.map((member, index) => (
                            <tr key={index} className={index % 2 === 0 ? "even" : "odd"}>
                                <td>{member.callsign}</td>
                                <td>{member.name}</td>
                                <td>{member.position}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="pilot-list">
                <h2>
                    <FontAwesomeIcon icon={faUsers} /> {t('pilots-list')}
                </h2>
                <div className="table-container">
                    <table className="pilot-table">
                        <thead>
                        <tr>
                            <th onClick={() => sortTable(pilots, setPilots, pilotsSortConfig, setPilotsSortConfig, 'callsign')}>
                                {t('callsign')} {getSortIndicator(pilotsSortConfig, 'callsign')}
                            </th>
                            <th onClick={() => sortTable(pilots, setPilots, pilotsSortConfig, setPilotsSortConfig, 'name')}>
                                {t('name')} {getSortIndicator(pilotsSortConfig, 'name')}
                            </th>
                            <th onClick={() => sortTable(pilots, setPilots, pilotsSortConfig, setPilotsSortConfig, 'ivaoVid')}>
                                {t('ivao-vid')} {getSortIndicator(pilotsSortConfig, 'ivaoVid')}
                            </th>
                            <th onClick={() => sortTable(pilots, setPilots, pilotsSortConfig, setPilotsSortConfig, 'vatsimId')}>
                                {t('vatsim-id')} {getSortIndicator(pilotsSortConfig, 'vatsimId')}
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {pilots.map((pilot, index) => (
                            <tr key={index} className={index % 2 === 0 ? "even" : "odd"}>
                                <td>{pilot.callsign}</td>
                                <td>{pilot.firstName} {pilot.lastName}</td>
                                <td>
                                    <a
                                        href={`https://ivao.aero/Member.aspx?Id=${pilot.ivaoId}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {pilot.ivaoId}
                                    </a>
                                </td>
                                <td>
                                <a
                                        href={`https://www.vatsim.net/members/${pilot.vatsimId}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {pilot.vatsimId}
                                    </a>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}