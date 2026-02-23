'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminUser, LoginCredentials, AuthResponse } from '@/types';
import api from '@/lib/axios';

interface AuthContextType {
    user: AdminUser | null;
    loading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AdminUser | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Check if token is expired
    const isTokenExpired = (token: string): boolean => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                window.atob(base64)
                    .split('')
                    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            const decoded = JSON.parse(jsonPayload);
            const currentTime = Date.now() / 1000;
            return decoded.exp < currentTime;
        } catch (error) {
            console.error('Error decoding token:', error);
            return true;
        }
    };

    // Initialize authentication state
    useEffect(() => {
        async function initializeAuth() {
            try {
                const token = localStorage.getItem('token');
                const storedUser = localStorage.getItem('user');

                if (token && token !== 'undefined' && token !== 'null') {
                    // Check if token is expired
                    if (isTokenExpired(token)) {
                        console.log('Token expired, clearing auth data');
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        setUser(null);
                        setLoading(false);
                        return;
                    }

                    // Restore user from localStorage
                    if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
                        const userData = JSON.parse(storedUser);
                        setUser(userData);
                        console.log('Auth restored from localStorage:', userData);
                    }
                } else {
                    console.log('No valid token found');
                }
            } catch (error) {
                console.error('Auth initialization failed:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setUser(null);
            } finally {
                setLoading(false);
            }
        }

        initializeAuth();
    }, []);

    // Login function using admin API
    const login = async (credentials: LoginCredentials): Promise<void> => {
        try {
            setLoading(true);
            const response = await api.post<AuthResponse>('/api/v1/admin/login', credentials);

            if (response.data.success) {
                const { token, admin } = response.data;
                
                // Store auth data
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(admin));
                
                // Update state
                setUser(admin);
                
                console.log('Login successful:', admin);
                
                // Redirect to admin dashboard
                router.push('/admin');
            } else {
                throw new Error('Login failed: Invalid response');
            }
        } catch (error: any) {
            console.error('Login error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Logout function
    const logout = (): void => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        console.log('User logged out');
        router.push('/login');
    };

    // Refresh token function (placeholder for future implementation)
    const refreshToken = async (): Promise<void> => {
        try {
            // This would be implemented when refresh token endpoint is available
            console.log('Token refresh not implemented yet');
        } catch (error) {
            console.error('Token refresh failed:', error);
            logout();
        }
    };

    // Auto-logout on token expiration
    useEffect(() => {
        const checkTokenExpiration = () => {
            const token = localStorage.getItem('token');
            if (token && token !== 'undefined' && token !== 'null') {
                if (isTokenExpired(token)) {
                    console.log('Token expired, logging out');
                    logout();
                }
            }
        };

        // Check token expiration every minute
        const interval = setInterval(checkTokenExpiration, 60000);
        return () => clearInterval(interval);
    }, []);

    const value: AuthContextType = {
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
        refreshToken,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
