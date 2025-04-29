import React, {useEffect, useState} from 'react';
import './navbar.scss';
import { Link } from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faChartSimple,
    faGlobe,
    faMapLocationDot, faMoon,
    faScaleBalanced, faSun,
    faUsers
} from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
    const [theme, setTheme] = useState('light');
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        document.body.setAttribute('data-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
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
                    <Link to="/central"><FontAwesomeIcon icon={faMapLocationDot} /> Central</Link>
                    <Link to="/pilots"><FontAwesomeIcon icon={faUsers} /> Pilots</Link>
                    <Link to="/rules"><FontAwesomeIcon icon={faScaleBalanced} /> Rules</Link>
                    <Link to="/stats"><FontAwesomeIcon icon={faChartSimple} /> Stats</Link>
                    <Link to="#" onClick={toggleTheme}>
                        <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} />
                    </Link>
                    <Link to="#"><FontAwesomeIcon icon={faGlobe} /></Link>
                </div>
                <div className="navbar-login">
                    <Link to="/login">Login</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
