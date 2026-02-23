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
    FileText,
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
    { href: '/admin/blogs', label: 'Blogs', icon: FileText },
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
                'fixed left-0 top-0 z-40 flex h-screen flex-col border-r bg-card transition-all duration-300',
                isCollapsed ? 'w-16' : 'w-64',
                isMobile && 'relative',
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

            <div className={cn('flex flex-col h-24 items-center justify-center border-b px-4 bg-[#FEFCE8]', isCollapsed ? 'p-2' : 'p-4')}>
                <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600">
                            <Star className="h-3 w-3 text-white fill-white" />
                        </div>
                        {!isCollapsed && <span className="font-extrabold text-[#059669] text-base tracking-tighter">Ek Bhavishya</span>}
                    </div>
                    {!isCollapsed && <span className="text-[8px] text-[#059669] font-bold mt-0.5 whitespace-nowrap italic">Jo Badal de apke zindagi</span>}
                </div>
            </div>

            <div className="flex-1 overflow-auto py-4">
                <nav className="grid gap-1 px-2">
                    {sidebarItems.map((item) => {
                        // Special handling for dashboard to prevent it from matching all /admin/* routes
                        let isActive = false;

                        if (item.href === '/admin') {
                            // Dashboard is only active when exactly on /admin
                            isActive = pathname === '/admin';
                        } else {
                            // Other items: active when path matches or starts with item.href + '/'
                            isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                        }

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={isMobile ? onCloseMobile : undefined}
                                className={cn(
                                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-200 hover:bg-emerald-50 active:scale-95',
                                    isActive ? 'bg-emerald-600 text-white shadow-emerald-200 shadow-md hover:bg-emerald-700' : 'text-emerald-900/60',
                                    isCollapsed && 'justify-center px-2'
                                )}
                                title={isCollapsed ? item.label : undefined}
                            >
                                <item.icon className={cn("h-4 w-4 transition-colors", isActive ? "text-white" : "text-emerald-600")} />
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
