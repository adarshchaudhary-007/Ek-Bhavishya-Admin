'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { User } from '@/types';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [hasToken, setHasToken] = useState(false);
    const router = useRouter();

    useEffect(() => {
        async function checkAuth() {
            const token = localStorage.getItem('token');
            setHasToken(!!token && token !== 'undefined');
            if (token && token !== 'undefined') {
                try {
                    // Debug: Decode token
                    const base64Url = token.split('.')[1];
                    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
                        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                    }).join(''));
                    console.log('Decoded Token:', JSON.parse(jsonPayload));

                    const storedUser = localStorage.getItem('user');
                    if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
                        setUser(JSON.parse(storedUser));
                    }
                } catch (error) {
                    console.error("Auth check failed to parse user data", error);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            } else if (token === 'undefined') {
                console.warn('Invalid "undefined" token found in localStorage, clearing');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
            setLoading(false);
        }
        checkAuth();
    }, []);

    const login = (token: string, userData: any) => {
        console.log('AuthContext: login called', { hasToken: !!token, hasUserData: !!userData });
        localStorage.setItem('token', token);
        if (userData) {
            localStorage.setItem('user', JSON.stringify(userData));
        }
        setUser(userData || null);
        setHasToken(true);
        console.log('AuthContext: State updated, redirecting to /admin');
        router.push('/admin');
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user || hasToken }}>
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
