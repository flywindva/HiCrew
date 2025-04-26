import React from 'react';
import './banner.scss';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRight} from "@fortawesome/free-solid-svg-icons";

const Banner = () => {
    return (
        <div className="banner">
            <img className={"banner-background"} alt={"Img Aircraft"} src={"/resources/background-banner.png"}/>
            <div className="banner-content">
                <h2 className="banner-subtitle">Welcome to</h2>
                <h1 className="banner-title">HiCrew!</h1>
                <h3 className="banner-slogan">Your airline</h3>
                <div className="banner-buttons">
                    <button className="btn">LOGIN</button>
                    <button className="btn">SIGN UP</button>
                </div>
            </div>

            <div className="banner-info-box">
                <p>No acars, is easy only fly, alone or with your friends.</p>
                <button className="btn secondary">JOIN NOW <FontAwesomeIcon icon={faArrowRight}/></button>
                <svg className="corner-effect corner-down-left" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg"
                     viewBox="0 0 29 27.5">
                    <path className="cls-1" d="M29,0c0,15.19-12.31,27.5-27.5,27.5h27.5V0Z"/>
                    <path className="cls-1" d="M0,27.46v.04h1.5c-.5,0-1-.02-1.5-.04Z"/>
                </svg>
                <svg className="corner-effect corner-up-right" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg"
                     viewBox="0 0 29 27.5">
                    <path className="cls-1" d="M29,0c0,15.19-12.31,27.5-27.5,27.5h27.5V0Z"/>
                    <path className="cls-1" d="M0,27.46v.04h1.5c-.5,0-1-.02-1.5-.04Z"/>
                </svg>
            </div>
        </div>
    );
};

export default Banner;
