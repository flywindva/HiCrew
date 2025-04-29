import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './cookie-banner.scss';

export function CookieBanner() {
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
                    {bannerVariables.COMPANY_NAME} uses browser local storage to save your preferences for dark mode and language settings. We do not use cookies or tracking technologies. Learn more in our{' '}
                    <Link to={bannerVariables.COOKIE_POLICY_LINK}>Cookie Policy</Link>.
                </p>
                <button onClick={handleAccept} className="btn secondary">
                    Accept
                </button>
            </div>
        </div>
    );
}