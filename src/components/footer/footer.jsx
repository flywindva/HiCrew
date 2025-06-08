import React, {useEffect, useState} from 'react';
import './footer.scss';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faAndroid, faApple,
    faBluesky,
    faDiscord,
    faFacebook, faGithub,
    faInstagram, faLinkedin, faSteam, faTelegram, faTiktok, faTrello,
    faTwitch, faWhatsapp,
    faXTwitter,
    faYoutube
} from "@fortawesome/free-brands-svg-icons";
import {Link} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {globalVariables} from "../../config";
import api from "../../api/apì";

const iconMap = {
    instagram: faInstagram,
    discord: faDiscord,
    facebook: faFacebook,
    twitch: faTwitch,
    twitter: faXTwitter,
    youtube: faYoutube,
    bluesky: faBluesky,
    linkedin: faLinkedin,
    github: faGithub,
    tiktok: faTiktok,
    android: faAndroid,
    apple: faApple,
    whatsapp: faWhatsapp,
    telegram: faTelegram,
    steam: faSteam,
    trello: faTrello,
};

const Footer = () => {
    const { t } = useTranslation();
    const [socialNetworks, setSocialNetworks] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSocialNetworks = async () => {
            try {
                const response = await api.get('/social-networks');
                if (response?.data) {
                    setSocialNetworks(response.data);
                } else {
                    throw new Error('No data received from server');
                }
                setError(null);
            } catch (error) {
                console.error('Failed to fetch social networks:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status,
                    headers: error.response?.headers,
                });
                setError(error.message || 'Failed to fetch social networks');
            }
        };
        fetchSocialNetworks();
    }, []);

    return (
        <footer>
            <div className="container-footer left">{t('made')} <a href={"https://diazro.me/hicrew"} target={"_blank"} rel="noreferrer">HiCrew!</a></div>
            <div className="container-footer">
                {error && <span className="error-message">{error}</span>}
                {socialNetworks.length === 0 && !error ? (
                    <></>
                ) : (
                    socialNetworks.map((social) => {
                        const iconKey = social.icon.toLowerCase();
                        const icon = iconMap[iconKey];
                        if (!icon) {
                            console.warn(`No FontAwesome icon found for social network: ${social.name}`);
                            return null;
                        }
                        return (
                            <a
                                key={social.id}
                                href={social.url}
                                target="_blank"
                                rel="noreferrer"
                                title={social.name}
                            >
                                <FontAwesomeIcon icon={icon} />
                            </a>
                        );
                    })
                )}
                | <Link to={"/privacy-policy"}>{t('privacy-policy.name')}</Link>
            </div>
            <div className="container-footer right">{new Date().getFullYear()} ©{globalVariables.COMPANY_NAME}</div>
        </footer>
    );
};

export default Footer;
