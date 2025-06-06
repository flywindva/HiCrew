import React, { useContext } from 'react';
import './banner.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { AuthContext } from '../auth-context/auth';
import { Role } from '../auth-context/role';
import { useTranslation } from 'react-i18next';

const Banner = () => {
    const { t } = useTranslation();
    const { isAuthenticated } = useContext(AuthContext);

    return (
        <div className="banner">
            <img
                className="banner-background"
                alt={t('title')}
                src="/resources/background-banner.png"
            />
            <div className="banner-content">
                <h2 className="banner-subtitle">{t('welcome')}</h2>
                <h1 className="banner-title">{t('title')}</h1>
                <h3 className="banner-slogan">{t('slogan')}</h3>
                <div className="banner-buttons">
                    {isAuthenticated ? (
                        <>
                            <Link className="btn" to="/profile">
                                {t('profile')}
                            </Link>
                            <Role has="ADMIN">
                                <Link className="btn" to="/admin">
                                    {t('admin-dashboard')}
                                </Link>
                            </Role>
                        </>
                    ) : (
                        <>
                            <Link className="btn" to="/login">
                                {t('login')}
                            </Link>
                            <Link className="btn" to="/register">
                                {t('join-now')}
                            </Link>
                        </>
                    )}
                </div>
            </div>

            <div className="banner-info-box">
                <p>{t('info')}</p>
                {isAuthenticated ? (
                    <Link className="btn secondary" to="/manager">
                        {t('manager')} <FontAwesomeIcon icon={faArrowRight} />
                    </Link>
                ) : (
                    <Link className="btn secondary" to="/register">
                        {t('join-now')} <FontAwesomeIcon icon={faArrowRight} />
                    </Link>
                )}
                <svg
                    className="corner-effect corner-down-left"
                    data-name="Layer 2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 29 27.5"
                >
                    <path className="cls-1" d="M29,0c0,15.19-12.31,27.5-27.5,27.5h27.5V0Z" />
                    <path className="cls-1" d="M0,27.46v.04h1.5c-.5,0-1-.02-1.5-.04Z" />
                </svg>
                <svg
                    className="corner-effect corner-up-right"
                    data-name="Layer 2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 29 27.5"
                >
                    <path className="cls-1" d="M29,0c0,15.19-12.31,27.5-27.5,27.5h27.5V0Z" />
                    <path className="cls-1" d="M0,27.46v.04h1.5c-.5,0-1-.02-1.5-.04Z" />
                </svg>
            </div>
        </div>
    );
};

export default Banner;