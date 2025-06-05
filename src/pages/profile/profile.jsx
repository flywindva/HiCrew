import {
    faAward,
    faClock, faGears,
    faHandPeace,
    faHouse, faJetFighter,
    faMapLocationDot,
    faPaperPlane,
    faPlaneDeparture,
    faRankingStar, faReceipt, faStar
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import "./profile.scss"
import {Link} from "react-router-dom";

export function Profile(){
    return (<>
            <div className="profile">
                <h1>Hi, <span>Alejandro</span> <FontAwesomeIcon icon={faHandPeace}/></h1>
                <div className="profile-content">
                    <div className="container-profile">
                        <div className="text-wrapper">
                            <h2>LEBL</h2>
                            <p>Location</p>
                        </div>
                        <div className="icon-text">
                            <FontAwesomeIcon icon={faMapLocationDot}/>
                        </div>
                    </div>
                    <div className="container-profile">
                        <div className="text-wrapper">
                            <h2>THR</h2>
                            <p>Airline</p>
                        </div>
                        <div className="icon-text">
                            <FontAwesomeIcon icon={faPaperPlane}/>
                        </div>
                    </div>
                    <div className="container-profile">
                        <div className="text-wrapper">
                            <h2>Capatain</h2>
                            <p>Rank</p>
                        </div>
                        <div className="icon-text">
                            <FontAwesomeIcon icon={faRankingStar}/>
                        </div>
                    </div>
                    <div className="container-profile">
                        <div className="text-wrapper">
                            <h2>GCXO</h2>
                            <p>HUB</p>
                        </div>
                        <div className="icon-text">
                            <FontAwesomeIcon icon={faHouse}/>
                        </div>
                    </div>
                    <div className="container-profile">
                        <div className="text-wrapper">
                            <h2>123</h2>
                            <p>Flights</p>
                        </div>
                        <div className="icon-text">
                            <FontAwesomeIcon icon={faPlaneDeparture}/>
                        </div>
                    </div>
                    <div className="container-profile">
                        <div className="text-wrapper">
                            <h2>12h00m</h2>
                            <p>Hours</p>
                        </div>
                        <div className="icon-text">
                            <FontAwesomeIcon icon={faClock}/>
                        </div>
                    </div>
                    <div className="container-profile">
                        <div className="text-wrapper">
                            <h2>666</h2>
                            <p>Points</p>
                        </div>
                        <div className="icon-text">
                            <FontAwesomeIcon icon={faStar}/>
                        </div>
                    </div>
                    <div className="container-profile">
                        <div className="text-wrapper">
                            <h2>A32N</h2>
                            <p>Most used aircraft</p>
                        </div>
                        <div className="icon-text">
                            <FontAwesomeIcon icon={faJetFighter}/>
                        </div>
                    </div>
                </div>
                <div className={"profile-module"}>
                    <h3><FontAwesomeIcon icon={faGears} /> Options</h3>
                    <div className={"button-list"}>
                        <Link to={"/change-position"} className={"btn"}>Change Position</Link>
                        <Link to={"/change-hub"} className={"btn"}>Change HUB</Link>
                        <Link to={"/change-airline"} className={"btn"}>Change Airline</Link>
                        <Link to={"/acars"} className={"btn"}>ACARS</Link>
                        <Link to={"/delete-account"} className={"btn danger"}>Delete Account</Link></div>
                </div>
                <div className={"profile-module"}>
                    <h3><FontAwesomeIcon icon={faAward}/> Awards</h3>
                    <p>Test</p>
                </div>
                <div className={"profile-module"}>
                    <h3><FontAwesomeIcon icon={faReceipt}/> Logbook</h3>
                    <div className="table-container">
                        <table className="pilot-table">
                            <thead>
                            <tr>
                                <th>
                                    Callsign
                                </th>
                                <th>
                                    Aircraft
                                </th>
                                <th>
                                    Departure
                                </th>
                                <th>
                                    Arrival
                                </th>
                                <th>
                                    Start
                                </th>
                                <th>
                                    End
                                </th>
                                <th>
                                    Network
                                </th>
                                <th>
                                    Time
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr className={"logbook"}>
                                <td>a</td>
                                <td>b</td>
                                <td>c</td>
                                <td>d</td>
                                <td>e</td>
                                <td>f</td>
                                <td>e</td>
                                <td>g</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}