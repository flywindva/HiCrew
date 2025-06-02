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
export function Central() {
    const { theme } = useContext(ThemeContext);

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
                <div className="live-flight container">Flight</div>
            </div>
        </>
    );
}