import React from 'react';
import './footer.scss';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDiscord, faFacebook, faInstagram, faTwitch, faXTwitter, faYoutube} from "@fortawesome/free-brands-svg-icons";
import {Link} from "react-router-dom";

const Footer = () => {
    return (
        <footer>
            <div className="container-footer left">By HiCrew!</div>
            <div className="container-footer">
                <a href={"#"} target={"_blank"}><FontAwesomeIcon icon={faInstagram}/></a>
                <a href={"#"} target={"_blank"}><FontAwesomeIcon icon={faDiscord}/></a>
                <a href={"#"} target={"_blank"}><FontAwesomeIcon icon={faFacebook}/></a>
                <a href={"#"} target={"_blank"}><FontAwesomeIcon icon={faTwitch}/></a>
                <a href={"#"} target={"_blank"}><FontAwesomeIcon icon={faXTwitter}/></a>
                <a href={"#"} target={"_blank"}><FontAwesomeIcon icon={faYoutube}/></a>
                | <Link to={"/privacy-policy"}>Privacy policy</Link>
            </div>
            <div className="container-footer right">2025 ©HiCrew</div>
        </footer>
    );
};

export default Footer;
