import './central.scss';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faArrowRight,
    faHouse,
    faMapLocationDot,
    faPaperPlane,
    faRankingStar
} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";
import Map from "../../components/map/map"
import {useContext, useEffect, useState} from "react";
import {ThemeContext} from "../../components/theme-context/theme-context";
import axios from "axios";
import {AuthContext} from "../../components/auth-context/auth";
import {useTranslation} from "react-i18next";
import api from "../../api/api";
import {BannerInfo} from "../../components/banner-info/banner-info";
import {globalVariables} from "../../config";

const useInterval = (callback, delay) => {
    useEffect(() => {
        const intervalId = setInterval(callback, delay);
        return () => clearInterval(intervalId);
    }, [callback, delay]);
};

export function Central() {
    const { t } = useTranslation();
    const { theme } = useContext(ThemeContext);
    const [ivaoFlights, setIvaoFlights] = useState([]);
    const [vatsimFlights, setVatsimFlights] = useState([]);
    const { isAuthenticated } = useContext(AuthContext);
    const [pilot, setPilot] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isAuthenticated) {
            const fetchPilotData = async () => {
                try {
                    const response = await api.get('/auth/me', {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    });
                    if (response?.data?.pilot) {
                        setPilot(response.data.pilot);
                        setError(null);
                    } else {
                        throw new Error(t('failed-to-fetch-pilot'));
                    }
                } catch (error) {
                    console.error(t('failed-to-fetch-pilot'), {
                        message: error.message,
                        response: error.response?.data,
                        status: error.response?.status,
                        headers: error.response?.headers,
                    });
                    const errorMessage =
                        error.response?.data?.error || error.message || t('failed-to-fetch-pilot');
                    setError(errorMessage);
                } finally {
                    setLoading(false);
                }
            };
            fetchPilotData();
        } else {
            setLoading(false);
        }
    }, [t, isAuthenticated]);

    const fetchIvaoData = async () => {
        try {
            const response = await axios.get('https://api.ivao.aero/v2/tracker/whazzup');
            const pilots = response.data.clients.pilots || [];

            const filteredFlights = pilots
                .filter(pilot => pilot.callsign && pilot.callsign.startsWith(globalVariables.OACI))
                .map(pilot => ({
                    callsign: pilot.callsign || "N/A",
                    aircraft: pilot.flightPlan?.aircraftId || "N/A",
                    departure: pilot.flightPlan?.departureId || "N/A",
                    arrival: pilot.flightPlan?.arrivalId || "N/A",
                    network: "IVAO",
                    state: pilot.lastTrack?.onGround ? "On Ground" : "Enroute"
                }));

            setIvaoFlights(filteredFlights);
        } catch (error) {
            console.error(t('central-error-ivao'), error);
        }
    };

    const fetchVatsimData = async () => {
        try {
            const response = await axios.get('https://data.vatsim.net/v3/vatsim-data.json');
            const pilots = response.data.pilots || [];

            const filteredFlights = pilots
                .filter(pilot => pilot.callsign && pilot.callsign.startsWith(globalVariables.OACI))
                .map(pilot => ({
                    callsign: pilot.callsign || "N/A",
                    aircraft: pilot.flight_plan?.aircraft
                        ? pilot.flight_plan.aircraft.split('/')[0]
                        : "N/A",
                    departure: pilot.flight_plan?.departure || "N/A",
                    arrival: pilot.flight_plan?.arrival || "N/A",
                    network: "VATSIM",
                    state: pilot.groundspeed < 50 ? "On Ground" : "Enroute"
                }));

            setVatsimFlights(filteredFlights);
        } catch (error) {
            console.error(t('central-error-vatsim'), error);
        }
    };

    useEffect(() => {
        fetchIvaoData();
        fetchVatsimData();
    }, []);

    useInterval(() => {
        fetchIvaoData();
        fetchVatsimData();
    }, 30000);

    const combinedFlights = [...ivaoFlights, ...vatsimFlights].sort((a, b) =>
        a.callsign.localeCompare(b.callsign)
    );

    if (loading) return <div>{t('loading')}</div>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <>
            {isAuthenticated && (<>
            {!pilot?.airline &&( <BannerInfo titleKey="important" messageKey="banner-no-airline" />)}
            {!pilot?.hub &&(<BannerInfo titleKey="important" messageKey="banner-no-hub" />)}
            </>)}
            <div className="central-content">
                {isAuthenticated ? (<>
                    <div className="location container">
                        <div className="text-wrapper">
                            <h2>{pilot?.locationIcao || t('not-available')}</h2>
                            <p>{t('profile-location')}</p>
                        </div>
                        <div className="icon-text">
                            <FontAwesomeIcon icon={faMapLocationDot}/>
                        </div>
                    </div>
                    <div className="airline container">
                        <div className="text-wrapper">
                            <h2>{pilot?.airline?.name || t('not-available')}</h2>
                            <p>{t('profile-airline')}</p>
                        </div>
                        <div className="icon-text">
                            <FontAwesomeIcon icon={faPaperPlane}/>
                        </div>
                    </div>
                    <div className="rank container">
                        <div className="text-wrapper">
                            <h2>{pilot?.rank?.name || t('not-available')}</h2>
                            <p>{t('profile-rank')}</p>
                        </div>
                        <div className="icon-text">
                            <FontAwesomeIcon icon={faRankingStar}/>
                        </div>
                    </div>
                    <div className="hub container">
                        <div className="text-wrapper">
                            <h2>{pilot?.hub?.airport.icao || t('not-available')}</h2>
                            <p>{t('profile-hub')}</p>
                        </div>
                        <div className="icon-text">
                            <FontAwesomeIcon icon={faHouse}/>
                        </div>
                    </div>
                </>) : (
                    <>
                        <div className="publi container">
                            <img src={"resources/ad-banner.png"} alt={t('central-ad-banner-alt')}/>
                        </div>
                    </>
                )}
                <div className="map container">
                    <Map theme={theme}/>
                </div>
                <div className="banner-ad container">
                    <div className="text-wrapper">
                        <h2>{isAuthenticated ? t('central-archive') : t('central-fly-easy')}</h2>
                        <p>{isAuthenticated ? t('central-archive-desc') : t('central-fly-easy-desc')}</p>
                        {isAuthenticated && (
                            <Link to="/archive" className="external">
                                <FontAwesomeIcon icon={faArrowRight}/>
                            </Link>
                        )}
                    </div>
                </div>
                <div className="events container">
                    <img alt={"Event Banner"} src={"/resources/event-banner.png"} alt={t('central-events-banner-alt')} />
                    <Link to={"/events"} className={"external"}><FontAwesomeIcon icon={faArrowRight}/></Link>
                </div>
                <div className="notams container">
                    <div className="text-wrapper">
                        <h2>{t('central-notams')}</h2>
                        <p>{t('central-notams-desc')}</p>
                    </div>
                    <Link to={"/notams"} className={"external"}><FontAwesomeIcon icon={faArrowRight}/></Link>
                </div>
                <div className="live-flight container">
                    <div className="table-container">
                        <table className="flight-table">
                            <thead>
                            <tr>
                                <th>{t('central-callsign')}</th>
                                <th>{t('central-aircraft')}</th>
                                <th>{t('central-departure')}</th>
                                <th>{t('central-arrival')}</th>
                                <th>{t('central-network')}</th>
                                <th>{t('central-state')}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {combinedFlights.length > 0 ? (
                                combinedFlights.map((flight, index) => (
                                    <tr key={index} className={index % 2 === 0 ? "even" : "odd"}>
                                        <td>{flight.callsign}</td>
                                        <td>{flight.aircraft}</td>
                                        <td>{flight.departure}</td>
                                        <td>{flight.arrival}</td>
                                        <td>{flight.network}</td>
                                        <td>{flight.state}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} style={{textAlign: 'center'}}>
                                        {t('central-no-flights')}
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}