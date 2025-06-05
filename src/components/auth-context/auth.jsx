// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import {jwtDecode} from "jwt-decode";
import api from "../../api/apì";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const [pilot, setPilot] = useState(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                return { id: decoded.id, email: decoded.email, permissions: [] };
            } catch (error) {
                console.error('Invalid token:', error);
                return null;
            }
        }
        return null;
    });

    useEffect(() => {
        const fetchPilotData = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await api.get('/auth/me');
                    setPilot({
                        ...response.data.pilot,
                        permissions: response.data.pilot.permissions || [],
                    });
                    setIsAuthenticated(true);
                } catch (error) {
                    console.error('Failed to fetch pilot data:', error);
                    localStorage.removeItem('token');
                    setIsAuthenticated(false);
                    setPilot(null);
                    window.location.href = '/login';
                }
            }
        };
        fetchPilotData();
    }, []);

    const login = (pilotData, token) => {
        localStorage.setItem('token', token);
        setPilot({
            ...pilotData,
            permissions: pilotData.permissions || [],
        });
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setPilot(null);
        setIsAuthenticated(false);
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, pilot, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => React.useContext(AuthContext);