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
import { Profile } from "../profile/profile";
import './manager.scss';
import { Fleet } from "../fleet/fleet";
import { useTranslation } from "react-i18next";
import { ManualReport } from "../manual-report/manual-report";
import { Dispatcher } from "../dispatcher/dispatcher";
import api from "../../api/api";
import {FreeMode} from "../free-mode/free-mode";

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

    const buttonContent = {
        charter: "Schedule and manage regular flights. Confirm your departure airport and fleet availability.",
        regular: "Schedule and manage regular flights. Confirm your departure airport and fleet availability.",
        manual: <ManualReport />,
        free: <FreeMode />,
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
            </div>
            <div className="manager-content">
                {selectedButton && <>{buttonContent[selectedButton]}</>}
            </div>
        </>
    );
}