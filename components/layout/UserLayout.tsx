'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Menu,
  Home,
  BookOpen,
  Users,
  MessageSquare,
  Phone,
  Heart,
  ShoppingCart,
  BarChart3,
  LogOut,
  Settings,
  Moon,
  Sun,
  Bell,
} from 'lucide-react';
import { useTheme } from 'next-themes';

interface UserLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/astrologers', label: 'Astrologers', icon: Users },
  { href: '/courses', label: 'Courses', icon: BookOpen },
  { href: '/chat', label: 'Chat', icon: MessageSquare },
  { href: '/calls', label: 'Calls', icon: Phone },
  { href: '/remedies', label: 'Remedies', icon: Heart },
  { href: '/shop', label: 'Shop', icon: ShoppingCart },
  { href: '/wallet', label: 'Wallet', icon: BarChart3 },
  { href: '/notifications', label: 'Notifications', icon: Bell },
];

export default function UserLayout({ children }: UserLayoutProps) {
  const { user, logout, role } = useAuth();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && role && role !== 'user') {
      router.push(role === 'admin' ? '/admin' : '/login');
    }
  }, [role, isMounted, router]);

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  if (!isMounted) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      <aside className="hidden border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 md:flex md:w-64 md:flex-col">
        <div className="border-b border-slate-200 p-6 dark:border-slate-800">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-emerald-600 font-bold text-white">
              EB
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white">Ek Bhavishya</span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 rounded-lg px-4 py-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-slate-200 p-4 dark:border-slate-800">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 font-semibold text-white">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                {user?.name || 'User'}
              </p>
              <p className="truncate text-xs text-slate-500">{user?.email || 'user@example.com'}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full justify-start gap-2" onClick={handleLogout}>
            <LogOut size={16} />
            Logout
          </Button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-4 md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <div className="mb-4 border-b border-slate-200 p-4 dark:border-slate-800">
                  <Link href="/dashboard" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-emerald-600 font-bold text-white">
                      EB
                    </div>
                    <span className="text-lg font-bold">Ek Bhavishya</span>
                  </Link>
                </div>
                <nav className="space-y-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 rounded-lg px-4 py-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                      >
                        <Icon size={20} />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </Button>

            <Button variant="ghost" size="icon" asChild>
              <Link href="/notifications">
                <Bell size={20} />
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <Settings size={16} className="mr-2" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings size={16} className="mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut size={16} className="mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
