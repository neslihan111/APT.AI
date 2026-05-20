import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000';

export const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// For now, service files will return mock data directly instead of calling this api.
// When ready, uncomment backend calls in services.
