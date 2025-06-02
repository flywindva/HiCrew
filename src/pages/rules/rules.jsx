import './rules.scss'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faScaleBalanced} from "@fortawesome/free-solid-svg-icons";
import React from "react";
export function Rules(){
    return (<div className="rules-container">
        <h1><FontAwesomeIcon icon={faScaleBalanced} /> Rules</h1>
        <p>Last Updated: April 28, 2025</p>
    </div>)
}