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

export function Profile(){
    const { t } = useTranslation();
    return (<>
            <div className="profile">
                <h1>{t('profile-greeting')} <span>Alejandro</span> <FontAwesomeIcon icon={faHandPeace}/></h1>
                <div className="profile-content">
                    <div className="container-profile">
                        <div className="text-wrapper">
                            <h2>LEBL</h2>
                            <p>{t('profile-location')}</p>
                        </div>
                        <div className="icon-text">
                            <FontAwesomeIcon icon={faMapLocationDot}/>
                        </div>
                    </div>
                    <div className="container-profile">
                        <div className="text-wrapper">
                            <h2>THR</h2>
                            <p>{t('profile-airline')}</p>
                        </div>
                        <div className="icon-text">
                            <FontAwesomeIcon icon={faPaperPlane}/>
                        </div>
                    </div>
                    <div className="container-profile">
                        <div className="text-wrapper">
                            <h2>Capatain</h2>
                            <p>{t('profile-rank')}</p>
                        </div>
                        <div className="icon-text">
                            <FontAwesomeIcon icon={faRankingStar}/>
                        </div>
                    </div>
                    <div className="container-profile">
                        <div className="text-wrapper">
                            <h2>GCXO</h2>
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
                            <h2>666</h2>
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
                    <p>Test</p>
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