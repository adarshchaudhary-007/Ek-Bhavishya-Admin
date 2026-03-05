'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminUser, LoginCredentials, AuthResponse } from '@/types';
import api from '@/lib/axios';

export type UserRole = 'user' | 'astrologer' | 'admin' | 'seller';

interface AuthContextType {
    user: AdminUser | null;
    loading: boolean;
    role: UserRole | null;
    loginAdmin: (credentials: LoginCredentials) => Promise<void>;
    loginUser: (credentials: LoginCredentials) => Promise<void>;
    login: (credentials: LoginCredentials, role?: UserRole) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    refreshToken: () => Promise<void>;
    hasToken: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AdminUser | null>(null);
    const [role, setRole] = useState<UserRole | null>(null);
    const [loading, setLoading] = useState(true);
    const [hasToken, setHasToken] = useState(false);
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
                const storedRole = (localStorage.getItem('role') as UserRole) || null;

                setHasToken(!!token && token !== 'undefined' && token !== 'null');

                if (token && token !== 'undefined' && token !== 'null') {
                    // Check if token is expired
                    if (isTokenExpired(token)) {
                        console.log('Token expired, clearing auth data');
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        localStorage.removeItem('role');
                        setUser(null);
                        setRole(null);
                        setLoading(false);
                        return;
                    }

                    // Restore user from localStorage
                    if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
                        const userData = JSON.parse(storedUser);
                        setUser(userData);
                        setRole(storedRole);
                        console.log('Auth restored from localStorage:', userData, 'Role:', storedRole);
                    }
                } else {
                    console.log('No valid token found');
                }
            } catch (error) {
                console.error('Auth initialization failed:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('role');
                setUser(null);
                setRole(null);
            } finally {
                setLoading(false);
            }
        }

        initializeAuth();
    }, []);

    // Login function for admin using admin API
    const loginAdmin = async (credentials: LoginCredentials): Promise<void> => {
        try {
            setLoading(true);
            const response = await api.post<AuthResponse>('/api/v1/admin/login', credentials);

            if (response.data.success) {
                const { token, admin } = response.data;
                
                // Store auth data
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(admin));
                localStorage.setItem('role', 'admin');
                
                // Update state
                setUser(admin);
                setRole('admin');
                setHasToken(true);
                
                console.log('Admin login successful:', admin);
                
                // Redirect to admin dashboard
                router.push('/admin');
            } else {
                throw new Error('Login failed: Invalid response');
            }
        } catch (error: any) {
            console.error('Admin login error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Login function for user using user API
    const loginUser = async (credentials: LoginCredentials): Promise<void> => {
        try {
            setLoading(true);
            const response = await api.post<any>('/api/v1/user/login', credentials);

            if (response.data.success || response.data.token) {
                const token = response.data.token;
                const userData = response.data.user || response.data;
                const userRole = response.data.user?.role || 'user';
                
                // Store auth data
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(userData));
                localStorage.setItem('role', userRole);
                
                // Update state
                setUser(userData);
                setRole(userRole as UserRole);
                setHasToken(true);
                
                console.log('User login successful:', userData);
                
                // Redirect to user dashboard
                router.push('/dashboard');
            } else {
                throw new Error('Login failed: Invalid response');
            }
        } catch (error: any) {
            console.error('User login error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Generic login function that auto-detects role
    const login = async (credentials: LoginCredentials, role?: UserRole): Promise<void> => {
        // If role is explicitly provided, use that endpoint
        if (role === 'admin') {
            return loginAdmin(credentials);
        } else if (role === 'user') {
            return loginUser(credentials);
        }
        
        // Otherwise, try admin first, then fall back to user
        try {
            await loginAdmin(credentials);
        } catch (adminError: any) {
            // If admin login fails, try user login
            console.log('Admin login failed, trying user login...');
            try {
                await loginUser(credentials);
            } catch (userError: any) {
                // Both failed, throw the user error
                throw userError;
            }
        }
    };

    // Logout function
    const logout = (): void => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        setUser(null);
        setRole(null);
        setHasToken(false);
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
        role,
        login,
        loginAdmin,
        loginUser,
        logout,
        isAuthenticated: !!user,
        refreshToken,
        hasToken,
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
