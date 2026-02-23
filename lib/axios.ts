import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// API Configuration
interface ApiConfig {
    baseURL: string;
    timeout: number;
    retryAttempts: number;
    retryDelay: number;
}

const config: ApiConfig = {
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000',
    timeout: 30000, // 30 seconds
    retryAttempts: 3,
    retryDelay: 1000, // 1 second
};

const api = axios.create({
    baseURL: config.baseURL,
    timeout: config.timeout,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for authentication and logging
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Add authentication token
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token && token !== 'undefined' && token !== 'null') {
                const cleanToken = token.startsWith('Bearer ') ? token.replace('Bearer ', '') : token;
                config.headers.Authorization = `Bearer ${cleanToken}`;
            }
        }

        // Log request details
        console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
            headers: config.headers,
            data: config.data,
            params: config.params,
        });

        return config;
    },
    (error: AxiosError) => {
        console.error('[API Request Error]', error);
        return Promise.reject(error);
    }
);

// Response interceptor for error handling and logging
api.interceptors.response.use(
    (response: AxiosResponse) => {
        // Log successful responses
        console.log(`[API Response] ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`, {
            data: response.data,
            status: response.status,
        });
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean; _retryCount?: number };

        // Log error details
        console.error(`[API Error] ${error.response?.status} ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url}`, {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
        });

        // Handle authentication errors
        if (error.response?.status === 401 && typeof window !== 'undefined') {
            console.error('Unauthorized (401) - redirecting to login');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
            return Promise.reject(error);
        }

        // Implement retry logic for network errors and 5xx errors
        if (
            originalRequest &&
            !originalRequest._retry &&
            (error.code === 'NETWORK_ERROR' || 
             error.code === 'ECONNABORTED' ||
             (error.response?.status && error.response.status >= 500))
        ) {
            originalRequest._retryCount = originalRequest._retryCount || 0;
            
            if (originalRequest._retryCount < config.retryAttempts) {
                originalRequest._retry = true;
                originalRequest._retryCount++;
                
                console.log(`[API Retry] Attempt ${originalRequest._retryCount}/${config.retryAttempts} for ${originalRequest.method?.toUpperCase()} ${originalRequest.url}`);
                
                // Wait before retrying
                await new Promise(resolve => setTimeout(resolve, config.retryDelay * originalRequest._retryCount!));
                
                return api(originalRequest);
            }
        }

        return Promise.reject(error);
    }
);

// Export the configured axios instance
export default api;

// Export configuration for potential use elsewhere
export { config as apiConfig };

// Export types for use in other files
export type { ApiConfig };
