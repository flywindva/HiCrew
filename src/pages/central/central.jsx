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

const useInterval = (callback, delay) => {
    useEffect(() => {
        const intervalId = setInterval(callback, delay);
        return () => clearInterval(intervalId);
    }, [callback, delay]);
};

export function Central() {
    const { theme } = useContext(ThemeContext);
    const [ivaoFlights, setIvaoFlights] = useState([]);
    const [vatsimFlights, setVatsimFlights] = useState([]);

    const fetchIvaoData = async () => {
        try {
            const response = await axios.get('https://api.ivao.aero/v2/tracker/whazzup');
            const pilots = response.data.clients.pilots || [];

            const filteredFlights = pilots
                .filter(pilot => pilot.callsign && pilot.callsign.startsWith("IBE"))
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
            console.error('Error fetching IVAO flight data:', error);
        }
    };

    const fetchVatsimData = async () => {
        try {
            const response = await axios.get('https://data.vatsim.net/v3/vatsim-data.json');
            const pilots = response.data.pilots || [];

            const filteredFlights = pilots
                .filter(pilot => pilot.callsign && pilot.callsign.startsWith("IBE"))
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
            console.error('Error fetching VATSIM flight data:', error);
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

    return (
        <>
            <div className="central-content">
                <div className="location container">
                    <div className="text-wrapper">
                        <h2>LEBL</h2>
                        <p>Location</p>
                    </div>
                    <div className="icon-text">
                        <FontAwesomeIcon icon={faMapLocationDot}/>
                    </div>
                </div>
                <div className="airline container">
                    <div className="text-wrapper">
                    <h2>THR</h2>
                        <p>Airline</p>
                    </div>
                    <div className="icon-text">
                        <FontAwesomeIcon icon={faPaperPlane}/>
                    </div>
                </div>
                <div className="rank container">
                    <div className="text-wrapper">
                        <h2>Capatain</h2>
                        <p>Rank</p>
                    </div>
                    <div className="icon-text">
                        <FontAwesomeIcon icon={faRankingStar}/>
                    </div>
                </div>
                <div className="hub container">
                    <div className="text-wrapper">
                    <h2>GCXO</h2>
                        <p>HUB</p>
                    </div>
                    <div className="icon-text">
                        <FontAwesomeIcon icon={faHouse}/>
                    </div>
                </div>
                <div className="map container">
                    <Map theme={theme} />
                </div>
                <div className="banner-ad container">Banner</div>
                <div className="events container">
                    <img alt={"Event Banner"} src={"/resources/background-banner.png"}/>
                    <Link to={"/events"} className={"external"}><FontAwesomeIcon icon={faArrowRight} /></Link>
                </div>
                <div className="notams container">
                    <div className="text-wrapper">
                        <h2>NOTAMS</h2>
                        <p>See the last news</p>
                    </div>
                    <Link to={"/notams"} className={"external"}><FontAwesomeIcon icon={faArrowRight}/></Link>
                </div>
                <div className="live-flight container">
                    <div className="table-container">
                        <table className="flight-table">
                            <thead>
                            <tr>
                                <th>Callsign</th>
                                <th>Aircraft</th>
                                <th>Departure</th>
                                <th>Arrival</th>
                                <th>Network</th>
                                <th>State</th>
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
                                    <td colSpan={6} style={{ textAlign: 'center' }}>
                                        No flights available
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