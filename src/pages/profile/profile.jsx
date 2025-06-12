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
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import i18n from "i18next";
import api from "../../api/api";

export function Profile(){
    const { t } = useTranslation();
    const [pilot, setPilot] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPilotData = async () => {
            try {
                const response = await api.get('/auth/me', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                if (response?.data?.pilot) {
                    const pilotData = response.data.pilot;
                    const currentLang = i18n.language.toUpperCase();

                    let filteredMedals = pilotData.medals || [];
                    if (filteredMedals.length > 0 && filteredMedals[0].lang) {
                        filteredMedals = filteredMedals.filter(
                            (medal) => medal.lang?.toUpperCase() === currentLang
                        );
                        if (filteredMedals.length === 0) {
                            filteredMedals = pilotData.medals.filter(
                                (medal) => medal.lang?.toUpperCase() === 'EN'
                            );
                        }
                        if (filteredMedals.length === 0) {
                            const availableLangs = [
                                ...new Set(pilotData.medals.map((medal) => medal.lang?.toUpperCase())),
                            ].filter(Boolean);
                            if (availableLangs.length > 0) {
                                filteredMedals = pilotData.medals.filter(
                                    (medal) => medal.lang?.toUpperCase() === availableLangs[0]
                                );
                            }
                        }
                    }

                    setPilot({ ...pilotData, medals: filteredMedals });
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
    }, [t, i18n.language]);

    if (loading) return <div>{t('loading')}</div>;
    if (error) return <p className="error-message">{error}</p>;
    if (!pilot) return <div>{t('no-pilot-data')}</div>;

    return (<>
            <div className="profile">
                <h1>{t('profile-greeting')} <span>{pilot.firstName}</span> <FontAwesomeIcon icon={faHandPeace}/></h1>
                <div className="profile-content">
                    <div className="container-profile">
                        <div className="text-wrapper">
                            <h2>{pilot.locationIcao || 'N/A'}</h2>
                            <p>{t('profile-location')}</p>
                        </div>
                        <div className="icon-text">
                            <FontAwesomeIcon icon={faMapLocationDot}/>
                        </div>
                    </div>
                    <div className="container-profile">
                        <div className="text-wrapper">
                            <h2>{pilot.airline?.name || 'N/A'}</h2>
                            <p>{t('profile-airline')}</p>
                        </div>
                        <div className="icon-text">
                            <FontAwesomeIcon icon={faPaperPlane}/>
                        </div>
                    </div>
                    <div className="container-profile">
                        <div className="text-wrapper">
                            <h2>{pilot.rank?.name || 'N/A'}</h2>
                            <p>{t('profile-rank')}</p>
                        </div>
                        <div className="icon-text">
                            <FontAwesomeIcon icon={faRankingStar}/>
                        </div>
                    </div>
                    <div className="container-profile">
                        <div className="text-wrapper">
                            <h2>{pilot.hub?.airport.icao || 'N/A'}</h2>
                            <p>{t('profile-hub')}</p>
                        </div>
                        <div className="icon-text">
                            <FontAwesomeIcon icon={faHouse}/>
                        </div>
                    </div>
                    <div className="container-profile">
                        <div className="text-wrapper">
                            <h2>123</h2>
                            <p>{t('profile-flights')}</p>
                        </div>
                        <div className="icon-text">
                            <FontAwesomeIcon icon={faPlaneDeparture}/>
                        </div>
                    </div>
                    <div className="container-profile">
                        <div className="text-wrapper">
                            <h2>12h00m</h2>
                            <p>{t('profile-hours')}</p>
                        </div>
                        <div className="icon-text">
                            <FontAwesomeIcon icon={faClock}/>
                        </div>
                    </div>
                    <div className="container-profile">
                        <div className="text-wrapper">
                            <h2>{pilot.points || 0}</h2>
                            <p>{t('profile-points')}</p>
                        </div>
                        <div className="icon-text">
                            <FontAwesomeIcon icon={faStar}/>
                        </div>
                    </div>
                    <div className="container-profile">
                        <div className="text-wrapper">
                            <h2>A32N</h2>
                            <p>{t('profile-most-used-aircraft')}</p>
                        </div>
                        <div className="icon-text">
                            <FontAwesomeIcon icon={faJetFighter}/>
                        </div>
                    </div>
                </div>
                <div className={"profile-module"}>
                    <h3><FontAwesomeIcon icon={faGears} />  {t('profile-options')}</h3>
                    <div className={"button-list"}>
                        <Link to="/change-position" className="btn">
                            {t('profile-change-position')}
                        </Link>
                        <Link to="/change-hub" className="btn">
                            {t('profile-change-hub')}
                        </Link>
                        <Link to="/change-airline" className="btn">
                            {t('profile-change-airline')}
                        </Link>
                        <Link to="/acars" className="btn">
                            {t('profile-acars')}
                        </Link>
                        <Link to="/delete-account" className="btn danger">
                            {t('profile-delete-account')}
                        </Link>
                    </div>
                </div>
                <div className={"profile-module"}>
                    <h3><FontAwesomeIcon icon={faAward}/> {t('profile-awards')}</h3>
                    {pilot.medals.length > 0 ? (
                        <div className="awards-list">
                            {pilot.medals.map((medal) => (
                                <div key={medal.id} className="award-item">
                                    <img src={medal.img} alt={medal.text} />
                                    <p>{medal.text}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>{t('no-awards')}</p>
                    )}
                </div>
                <div className={"profile-module"}>
                    <h3><FontAwesomeIcon icon={faReceipt}/> {t('profile-logbook')}</h3>
                    <div className="table-container">
                        <table className="pilot-table">
                            <thead>
                            <tr>
                                <th>{t('profile-logbook-callsign')}</th>
                                <th>{t('profile-logbook-aircraft')}</th>
                                <th>{t('profile-logbook-departure')}</th>
                                <th>{t('profile-logbook-arrival')}</th>
                                <th>{t('profile-logbook-start')}</th>
                                <th>{t('profile-logbook-end')}</th>
                                <th>{t('profile-logbook-network')}</th>
                                <th>{t('profile-logbook-time')}</th>
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