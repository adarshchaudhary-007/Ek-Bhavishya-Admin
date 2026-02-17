import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/admin';

const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            let token = localStorage.getItem('token');
            if (token && token !== 'undefined') {
                // Remove 'Bearer ' if it's already in the token to avoid duplication
                if (token.startsWith('Bearer ')) {
                    token = token.replace('Bearer ', '');
                }
                config.headers.Authorization = `Bearer ${token}`;
                console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, {
                    authHeader: config.headers.Authorization,
                    tokenLength: token.length
                });
            } else {
                console.log(`API Request: ${config.method?.toUpperCase()} ${config.url} (No token or invalid)`);
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && typeof window !== 'undefined') {
            console.error('Unauthorized (401) received:', {
                url: error.config?.url,
                status: error.response?.status,
                data: error.response?.data
            });

            // Only redirect if NOT on login page already
            if (!window.location.pathname.includes('/login')) {
                console.warn('Clearing session and redirecting to login in 3 seconds...');
                // Optional: Show toast here if you want
                localStorage.removeItem('token');
                localStorage.removeItem('user');

                // Add delay to allow viewing logs
                setTimeout(() => {
                    window.location.href = '/login';
                }, 3000);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
