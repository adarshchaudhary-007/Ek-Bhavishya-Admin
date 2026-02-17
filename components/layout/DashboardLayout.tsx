'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        console.log('DashboardLayout: Auth Status', { loading, isAuthenticated });
        if (!loading && !isAuthenticated) {
            console.warn('DashboardLayout: Not authenticated, redirecting to /login');
            router.push('/login');
        }
    }, [loading, isAuthenticated, router]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            {/* Desktop Sidebar */}
            <div className="hidden border-r md:block">
                <Sidebar isCollapsed={isCollapsed} toggleCollapse={toggleCollapse} />
            </div>

            {/* Main Content */}
            <div className="flex flex-1 flex-col">
                <Header />
                <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
