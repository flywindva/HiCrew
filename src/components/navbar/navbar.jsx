import React, {useContext, useEffect, useState} from 'react';
import './navbar.scss';
import {Link, useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faChartSimple, faDoorOpen,
    faGlobe, faLayerGroup,
    faMapLocationDot, faMoon,
    faScaleBalanced, faSun,
    faUsers
} from "@fortawesome/free-solid-svg-icons";
import {ThemeContext} from "../theme-context/theme-context";
import {AuthContext} from "../auth-context/auth";
import {useTranslation} from "react-i18next";

const Navbar = () => {
    const { t } = useTranslation();
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [menuOpen, setMenuOpen] = useState(false);
    const { isAuthenticated, logout } = useContext(AuthContext);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleLogout = () => {
        logout();
        window.location.href = '/login';
    };

    return (
        <nav className={`navbar ${menuOpen ? 'open' : ''}`}>
            <div className="navbar-logo">
                <Link to="/">
                    <img className="logo-png" src="/resources/HiCrew.png" alt="Logo Airline"/>
                </Link>
            </div>

            <div className="hamburger" onClick={toggleMenu}>
                {menuOpen ? '✖' : '☰'}
            </div>

            <div className={`navbar-menu ${menuOpen ? 'open' : ''}`}>
                <div className="navbar-nav">
                    {isAuthenticated && (
                        <Link to="/manager"><FontAwesomeIcon icon={faLayerGroup} /> {t('manager')}</Link>
                    )}
                    <Link to="/central"><FontAwesomeIcon icon={faMapLocationDot} /> {t('central')}</Link>
                    <Link to="/pilots"><FontAwesomeIcon icon={faUsers} /> {t('pilots')}</Link>
                    <Link to="/rules"><FontAwesomeIcon icon={faScaleBalanced} /> {t('rules')}</Link>
                    <Link to="/stats"><FontAwesomeIcon icon={faChartSimple} /> {t('stats')}</Link>
                    <Link to="#" onClick={toggleTheme}>
                        <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} />
                    </Link>
                    <Link to="/lang"><FontAwesomeIcon icon={faGlobe} /></Link>
                    {isAuthenticated && (
                        <Link to="#" onClick={handleLogout}>
                            <FontAwesomeIcon icon={faDoorOpen} />
                        </Link>
                    )}
                </div>
                <div className="navbar-login">
                    {isAuthenticated ? (
                        <Link to="/profile">{t('profile')}</Link>
                    ) : (
                        <Link to="/login">{t('login')}</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
