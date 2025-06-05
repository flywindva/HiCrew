import {
    faBusinessTime,
    faFilePen,
    faLayerGroup,
    faPlaneArrival,
    faPlaneCircleExclamation,
    faPlaneCircleXmark,
    faPlaneDeparture
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import {Profile} from "../profile/profile";
import './manager.scss'
import {Fleet} from "../fleet/fleet";

export function Manager() {
    const [selectedButton, setSelectedButton] = useState(null);

    const buttonContent = {
        charter: <Profile />,
        regular: "Schedule and manage regular flights. Confirm your departure airport and fleet availability.",
        manual: "Submit a manual flight report. Include all necessary details for accurate logging.",
        free: "Enter free mode to explore flights without restrictions. No fleet or airport requirements.",
        dispatcher: "Access dispatcher tools to coordinate flights and manage schedules.",
        fleet: <Fleet />
    };

    const handleButtonClick = (buttonType) => {
        setSelectedButton(buttonType);
    };

    return (
        <>
            <div className="manager-title">
                <h1><FontAwesomeIcon icon={faLayerGroup} /> Manager</h1>
                <p>Here you can manage the flights you are going to make with this airline. Remember that you need fleet and that you must be at the departure airport for charter and scheduled flights.</p>
                <div className="manager-wrapper">
                    <button
                        className={`btn ${selectedButton === 'charter' ? 'secondary' : ''}`}
                        onClick={() => handleButtonClick('charter')}
                    >
                        <FontAwesomeIcon icon={faPlaneArrival}/> Flight Charter
                    </button>
                    <button
                        className={`btn ${selectedButton === 'regular' ? 'secondary' : ''}`}
                        onClick={() => handleButtonClick('regular')}
                    >
                        <FontAwesomeIcon icon={faPlaneDeparture}/> Flight Regular
                    </button>
                    <button
                        className={`btn ${selectedButton === 'manual' ? 'secondary' : ''}`}
                        onClick={() => handleButtonClick('manual')}
                    >
                        <FontAwesomeIcon icon={faFilePen}/> Manual Report
                    </button>
                    <button
                        className={`btn ${selectedButton === 'dispatcher' ? 'secondary' : ''}`}
                        onClick={() => handleButtonClick('dispatcher')}
                    >
                        <FontAwesomeIcon icon={faBusinessTime}/> Dispatcher
                    </button>
                    <button
                        className={`btn ${selectedButton === 'free' ? 'secondary' : ''}`}
                        onClick={() => handleButtonClick('free')}
                    >
                        <FontAwesomeIcon icon={faPlaneCircleXmark}/> Free Mode
                    </button>
                    <button
                        className={`btn ${selectedButton === 'fleet' ? 'secondary' : ''}`}
                        onClick={() => handleButtonClick('fleet')}
                    >
                        <FontAwesomeIcon icon={faPlaneCircleExclamation}/> Fleet
                    </button>
                </div>
            </div>
            <div className="manager-content">
                {selectedButton && <>{buttonContent[selectedButton]}</>}
            </div>
        </>
    );
}