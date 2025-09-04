import axios from 'axios';
import {globalVariables} from "../config";

const API_URL = globalVariables.API_URL;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const register = (data) =>
    api.post('/auth/register', data);

export const login = (data) =>
    api.post('/auth/login', data);

export const getPilots = () =>{
    const token = localStorage.getItem('token');
    const endpoint = token ? '/pilots/authenticated' : '/pilots';
    return api.get(endpoint);
}

export const forgotPassword = (data) =>
    api.post('/auth/forgot-password', data);

export const resetPassword = (data) =>
    api.post('/auth/reset-password', data);

export default api;