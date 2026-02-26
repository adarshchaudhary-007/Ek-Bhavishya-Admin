'use client';

import { Menu, User, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/theme-toggle';
import { GlobalSearch } from '@/components/layout/GlobalSearch';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Sidebar } from './Sidebar';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface HeaderProps {
    onMobileMenuOpen?: () => void;
}

export function Header({ }: HeaderProps) {
    const { user, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const router = useRouter();

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center gap-4">
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="md:hidden">
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-72">
                        <Sidebar isMobile onCloseMobile={() => setMobileMenuOpen(false)} />
                    </SheetContent>
                </Sheet>

                <div className="hidden md:flex relative w-full items-center">
                    {/* Breadcrumbs or Title could go here */}
                </div>
            </div>

            <div className="flex items-center gap-4">
                <GlobalSearch />

                <ModeToggle />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full ring-2 ring-transparent hover:ring-primary/20 transition-all">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={user?.avatar} alt={user?.name || 'User'} />
                                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                    {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{user?.name || 'Admin User'}</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {user?.email || 'admin@example.com'}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                            className="cursor-pointer"
                            onSelect={(e) => {
                                e.preventDefault()
                                router.push('/admin/profile')
                            }}
                        >
                            <User className="mr-2 h-4 w-4" />
                            Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                            className="cursor-pointer"
                            onSelect={(e) => {
                                e.preventDefault()
                                router.push('/admin/profile')
                            }}
                        >
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                            className="text-destructive focus:text-destructive cursor-pointer" 
                            onClick={logout}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
