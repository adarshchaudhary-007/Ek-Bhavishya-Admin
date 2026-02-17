'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Users,
    Star,
    Store,
    GraduationCap,
    BookOpen,
    Bell,
    Phone,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

const sidebarItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/astrologers', label: 'Astrologers', icon: Star },
    { href: '/admin/sellers', label: 'Sellers', icon: Store },
    { href: '/admin/courses', label: 'Courses', icon: GraduationCap },
    { href: '/admin/admin-courses', label: 'Admin Courses', icon: BookOpen },
    { href: '/admin/notices', label: 'Notices', icon: Bell },
    { href: '/admin/calls', label: 'Calls & Reports', icon: Phone },
];

interface SidebarProps {
    className?: string;
    isCollapsed?: boolean;
    toggleCollapse?: () => void;
    isMobile?: boolean; // If true, ignore collapse state and show full width (handling done by Sheet)
    onCloseMobile?: () => void;
}

export function Sidebar({ className, isCollapsed = false, toggleCollapse, isMobile, onCloseMobile }: SidebarProps) {
    const pathname = usePathname();
    const { logout } = useAuth();

    return (
        <div
            className={cn(
                'relative flex h-full flex-col border-r bg-card transition-all duration-300',
                isCollapsed ? 'w-16' : 'w-64',
                className
            )}
        >
            {!isMobile && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -right-3 top-6 z-10 h-6 w-6 rounded-full border bg-background shadow-md hover:bg-muted"
                    onClick={toggleCollapse}
                >
                    {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
                </Button>
            )}

            <div className={cn('flex h-16 items-center border-b px-4', isCollapsed ? 'justify-center' : 'justify-start gap-2')}>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <Star className="h-4 w-4 text-primary fill-primary" />
                </div>
                {!isCollapsed && <span className="font-bold text-lg tracking-tight">Ek Bhavishya</span>}
            </div>

            <div className="flex-1 overflow-auto py-4">
                <nav className="grid gap-1 px-2">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={isMobile ? onCloseMobile : undefined}
                                className={cn(
                                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted',
                                    isActive ? 'bg-primary/10 text-primary hover:bg-primary/20' : 'text-muted-foreground',
                                    isCollapsed && 'justify-center px-2'
                                )}
                                title={isCollapsed ? item.label : undefined}
                            >
                                <item.icon className="h-4 w-4" />
                                {!isCollapsed && <span>{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="border-t p-4">
                <Button
                    variant="ghost"
                    className={cn('w-full justify-start gap-2 text-muted-foreground hover:text-destructive', isCollapsed && 'justify-center px-0')}
                    onClick={logout}
                    title={isCollapsed ? "Logout" : undefined}
                >
                    <LogOut className="h-4 w-4" />
                    {!isCollapsed && <span>Logout</span>}
                </Button>
            </div>
        </div>
    );
}
