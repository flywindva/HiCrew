import { useEffect, useState } from 'react';
import './list.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faUserTie } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import api, {getPilots} from "../../api/api";

export function PilotList() {
    const { t } = useTranslation();
    const [staff, setStaff] = useState([]);
    const [pilots, setPilots] = useState([]);
    const [staffSortConfig, setStaffSortConfig] = useState({ key: null, direction: 'asc' });
    const [pilotsSortConfig, setPilotsSortConfig] = useState({ key: null, direction: 'asc' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [pilotsRes, staffRes] = await Promise.all([
                    getPilots(),
                    api.get('/staff-list'),
                ]);
                setPilots(pilotsRes.data || []);
                setStaff(staffRes.data || []);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [t]);

    const sortTable = (data, setData, sortConfig, setSortConfig, key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }

        const sortedData = [...data].sort((a, b) => {
            const aValue = key === 'callsign' ? a.pilot.callsign || '' :
                key === 'name' ? `${a.pilot.firstName} ${a.pilot.lastName}` :
                    key === 'position' ? a.nameRolePosition :
                        a[key] || '';
            const bValue = key === 'callsign' ? b.pilot.callsign || '' :
                key === 'name' ? `${b.pilot.firstName} ${b.pilot.lastName}` :
                    key === 'position' ? b.nameRolePosition :
                        b[key] || '';

            if (aValue < bValue) return direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return direction === 'asc' ? 1 : -1;
            return 0;
        });

        setData(sortedData);
        setSortConfig({ key, direction });
    };

    const getSortIndicator = (sortConfig, key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
        }
        return '';
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
                        {staff.length === 0 ? (
                            <tr className="even">
                                <td colSpan="3">{t('no-staff-found')}</td>
                            </tr>
                        ) : (
                            staff.map((member, index) => (
                                <tr key={member.id} className={index % 2 === 0 ? 'even' : 'odd'}>
                                    <td>
                                        {member.pilot.callsign ? (
                                            <>
                                                {member.pilot.callsign}
                                            </>
                                        ) : (
                                            'N/A'
                                        )}
                                    </td>
                                    <td>{member.pilot.firstName}</td>
                                    <td>{member.nameRolePosition}</td>
                                </tr>
                            ))
                        )}
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
                            <th onClick={() => sortTable(pilots, setPilots, pilotsSortConfig, setPilotsSortConfig, 'ivaoId')}>
                                {t('ivao-vid')} {getSortIndicator(pilotsSortConfig, 'ivaoId')}
                            </th>
                            <th onClick={() => sortTable(pilots, setPilots, pilotsSortConfig, setPilotsSortConfig, 'vatsimId')}>
                                {t('vatsim-id')} {getSortIndicator(pilotsSortConfig, 'vatsimId')}
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {pilots.length === 0 ? (
                            <tr className="even">
                                <td colSpan="4">{t('no-pilots-found')}</td>
                            </tr>
                        ) : (
                            pilots.map((pilot, index) => (
                                <tr key={pilot.id} className={index % 2 === 0 ? 'even' : 'odd'}>
                                    <td>
                                        {pilot.callsign ? (
                                            <Link 
                                                to={`/pilot/${pilot.id}`} 
                                                className="callsign-link"
                                            >
                                                {pilot.callsign}
                                            </Link>
                                        ) : (
                                            'N/A'
                                        )}
                                    </td>
                                    <td>{pilot.firstName} {pilot.lastName}</td>
                                    <td>
                                        {pilot.ivaoId ? (
                                            <a
                                                href={`https://ivao.aero/Member.aspx?Id=${pilot.ivaoId}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {pilot.ivaoId}
                                            </a>
                                        ) : (
                                            'N/A'
                                        )}
                                    </td>
                                    <td>
                                        {pilot.vatsimId ? (
                                            <a
                                                href={`https://www.vatsim.net/members/${pilot.vatsimId}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {pilot.vatsimId}
                                            </a>
                                        ) : (
                                            'N/A'
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}