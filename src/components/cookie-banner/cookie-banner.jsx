import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './cookie-banner.scss';
import {useTranslation} from "react-i18next";
import i18n from "i18next";

export function CookieBanner() {
    const { t } = useTranslation();
    const [isVisible, setIsVisible] = useState(false);

    const bannerVariables = {
        COMPANY_NAME: 'HiCrew',
        COOKIE_POLICY_LINK: '/cookie-policy',
    };

    useEffect(() => {
        const hasConsented = localStorage.getItem('cookieConsent');
        if (!hasConsented) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookieConsent', 'accepted');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="cookie-banner">
            <div className="cookie-banner-content">
                <p>
                    {t('cookie-banner-message', {
                        companyName: bannerVariables.COMPANY_NAME,
                        cookiePolicyLink: bannerVariables.COOKIE_POLICY_LINK,
                    }).replace('{companyName}', bannerVariables.COMPANY_NAME)}
                    <Link to={bannerVariables.COOKIE_POLICY_LINK}>
                        {t('cookie-policy')}
                    </Link>.
                </p>
                <button onClick={handleAccept} className="btn secondary">
                    {t('cookie-banner-accept')}
                </button>
            </div>
        </div>
    );
}