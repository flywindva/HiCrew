import React from 'react';
import './footer.scss';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDiscord, faFacebook, faInstagram, faTwitch, faXTwitter, faYoutube} from "@fortawesome/free-brands-svg-icons";
import {Link} from "react-router-dom";
import {useTranslation} from "react-i18next";

const Footer = () => {
    const { t } = useTranslation();
    return (
        <footer>
            <div className="container-footer left">{t('made')} HiCrew!</div>
            <div className="container-footer">
                <a href={"#"} target={"_blank"}><FontAwesomeIcon icon={faInstagram}/></a>
                <a href={"#"} target={"_blank"}><FontAwesomeIcon icon={faDiscord}/></a>
                <a href={"#"} target={"_blank"}><FontAwesomeIcon icon={faFacebook}/></a>
                <a href={"#"} target={"_blank"}><FontAwesomeIcon icon={faTwitch}/></a>
                <a href={"#"} target={"_blank"}><FontAwesomeIcon icon={faXTwitter}/></a>
                <a href={"#"} target={"_blank"}><FontAwesomeIcon icon={faYoutube}/></a>
                | <Link to={"/privacy-policy"}>{t('privacy-policy.name')}</Link>
            </div>
            <div className="container-footer right">2025 ©HiCrew</div>
        </footer>
    );
};

export default Footer;
