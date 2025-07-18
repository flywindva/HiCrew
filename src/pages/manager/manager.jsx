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
import React, { useState, useEffect } from "react";
import './manager.scss';
import { Fleet } from "../fleet/fleet";
import { useTranslation } from "react-i18next";
import { ManualReport } from "../manual-report/manual-report";
import { Dispatcher } from "../dispatcher/dispatcher";
import api from "../../api/api";
import {FreeMode} from "../free-mode/free-mode";
import {CharterFlight} from "../charter-flight/charter-flight";

export function Manager() {
    const [selectedButton, setSelectedButton] = useState(null);
    const [config, setConfig] = useState({
        ALLOW_CHARTER: false,
        ALLOW_AUTOMATIC_REPORT: false,
        ALLOW_MANUAL_REPORT: false,
        ALLOW_FREE_MODE: false,
        ALLOW_REGULAR: false,
    });
    const [error, setError] = useState(null);
    const [activeFlight, setActiveFlight] = useState(null);
    const [loading, setLoading] = useState(false);

    const { t } = useTranslation();

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const [charter, automatic, manual, free, regular] = await Promise.all([
                    api.get('/configs/ALLOW_CHARTER'),
                    api.get('/configs/ALLOW_AUTOMATIC_REPORT'),
                    api.get('/configs/ALLOW_MANUAL_REPORT'),
                    api.get('/configs/ALLOW_FREE_MODE'),
                    api.get('/configs/ALLOW_REGULAR'),
                ]);
                setConfig({
                    ALLOW_CHARTER: charter.data.isActive || false,
                    ALLOW_AUTOMATIC_REPORT: automatic.data.isActive || false,
                    ALLOW_MANUAL_REPORT: manual.data.isActive || false,
                    ALLOW_FREE_MODE: free.data.isActive || false,
                    ALLOW_REGULAR: regular.data.isActive || false,
                });
            } catch (error) {
                console.error('Failed to fetch configuration:', error);
                setError(t('config-error-default'));
            }
        };
        fetchConfig();
    }, [t]);

    const fetchActiveFlight = async () => {
        setLoading(true);
        try {
            const response = await api.get('/flights/flight-active');
            if (response?.data && response.data.length > 0) {
                setActiveFlight(response.data[0]);
            } else {
                setActiveFlight(null);
            }
            setError(null);
        } catch (error) {
            console.error('Failed to fetch active flight:', error);
            const errorMessage =
                error.response?.data?.error || error.message || t('failed-to-fetch-active-flight');
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActiveFlight();
        const interval = setInterval(fetchActiveFlight, 30000);
        return () => clearInterval(interval);
    }, [t]);


    const handleCancelFlight = async (flightId) => {
        try {
            await api.delete(`/flights/${flightId}`);
            setActiveFlight(null);
            setError(null);
        } catch (error) {
            console.error('Failed to cancel flight:', error);
            const errorMessage =
                error.response?.data?.error || error.message || t('failed-to-cancel-flight');
            setError(errorMessage);
        }
    };

    const buttonContent = {
        charter: <CharterFlight onFlightSubmit={fetchActiveFlight} />,
        regular: "Schedule and manage regular flights. Confirm your departure airport and fleet availability.",
        manual: <ManualReport />,
        free: <FreeMode onFlightSubmit={fetchActiveFlight} />,
        dispatcher: <Dispatcher />,
        fleet: <Fleet />
    };

    const handleButtonClick = (buttonType) => {
        setSelectedButton(buttonType);
    };

    return (
        <>
            <div className="manager-title">
                <h1>
                    <FontAwesomeIcon icon={faLayerGroup} /> {t('manager-title')}
                </h1>
                <p>{t('manager-description')}</p>
                {error && <p className="error">{error}</p>}
                {loading ? (
                    <p>{t('loading')}</p>
                ) : (
                    <>
                        {activeFlight ? (
                            <>
                            <hr />
                                <div className="active-flight">
                                    <h3>{t('active-flight')}</h3>
                                    <p><strong>{t('callsign')}:</strong> {activeFlight.callsign}</p>
                                    <p><strong>{t('central-aircraft')}:</strong> {activeFlight.aircraft}</p>
                                    <p>
                                        <strong>{t('central-departure')}:</strong> {activeFlight.departure.name} ({activeFlight.departureIcao})
                                    </p>
                                    <p>
                                        <strong>{t('central-arrival')}:</strong> {activeFlight.arrival.name} ({activeFlight.arrivalIcao})
                                    </p>
                                    <p>
                                        <strong>{t('network')}:</strong> {activeFlight.network}
                                    </p>
                                    <p>
                                        <strong>{t('status')}: </strong>
                                        {activeFlight.startFlight === null && activeFlight.closeFlight === null
                                            ? t('pending-to-flight')
                                            : t('in-flight')}
                                    </p>
                                    <button
                                        className="btn danger"
                                        onClick={() => handleCancelFlight(activeFlight.id)}
                                    >
                                        {t('cancel-flight')}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="manager-wrapper">
                                {config.ALLOW_CHARTER && (
                                    <button
                                        className={`btn ${selectedButton === 'charter' ? 'secondary' : ''}`}
                                        onClick={() => handleButtonClick('charter')}
                                    >
                                        <FontAwesomeIcon icon={faPlaneArrival} /> {t('flight-charter')}
                                    </button>
                                )}
                                {config.ALLOW_REGULAR && (
                                    <button
                                        className={`btn ${selectedButton === 'regular' ? 'secondary' : ''}`}
                                        onClick={() => handleButtonClick('regular')}
                                    >
                                        <FontAwesomeIcon icon={faPlaneDeparture} /> {t('flight-regular')}
                                    </button>
                                )}
                                {config.ALLOW_MANUAL_REPORT && (
                                    <button
                                        className={`btn ${selectedButton === 'manual' ? 'secondary' : ''}`}
                                        onClick={() => handleButtonClick('manual')}
                                    >
                                        <FontAwesomeIcon icon={faFilePen} /> {t('manual-report')}
                                    </button>
                                )}
                                {config.ALLOW_REGULAR && (
                                    <button
                                        className={`btn ${selectedButton === 'dispatcher' ? 'secondary' : ''}`}
                                        onClick={() => handleButtonClick('dispatcher')}
                                    >
                                        <FontAwesomeIcon icon={faBusinessTime} /> {t('dispatcher')}
                                    </button>
                                )}
                                {config.ALLOW_FREE_MODE && (
                                    <button
                                        className={`btn ${selectedButton === 'free' ? 'secondary' : ''}`}
                                        onClick={() => handleButtonClick('free')}
                                    >
                                        <FontAwesomeIcon icon={faPlaneCircleXmark} /> {t('free-mode')}
                                    </button>
                                )}
                                <button
                                    className={`btn ${selectedButton === 'fleet' ? 'secondary' : ''}`}
                                    onClick={() => handleButtonClick('fleet')}
                                >
                                    <FontAwesomeIcon icon={faPlaneCircleExclamation} /> {t('fleet')}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
            <div className="manager-content">
                {selectedButton && !activeFlight && <>{buttonContent[selectedButton]}</>}
            </div>
        </>
    );
}