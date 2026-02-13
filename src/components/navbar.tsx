'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useTranslation, LANGUAGES, Language } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
    LayoutDashboard,
    Image,
    Send,
    CreditCard,
    User,
    LogOut,
    Palette,
    Upload,
    Globe,
    Shield,
    Languages,
    CalendarDays,
} from 'lucide-react';

export function Navbar() {
    const { user, profile, signOut } = useAuth();
    const { t, language, setLanguage } = useTranslation();
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    const navLinks = [
        { href: '/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
        { href: '/templates', label: t('nav.templates'), icon: Palette },
        { href: '/media', label: t('nav.media'), icon: Upload },
        { href: '/posts', label: t('nav.posts'), icon: Send },
        { href: '/schedule', label: 'Schedule', icon: CalendarDays },
        { href: '/social-accounts', label: t('nav.social_accounts'), icon: Globe },
        { href: '/subscription', label: t('nav.subscription'), icon: CreditCard },
    ];

    const initials = profile?.name
        ? profile.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
        : 'VK';

    if (!user) return null;

    return (
        <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
                {/* Logo */}
                <Link href="/dashboard" className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg vck-gradient shadow-lg">
                        <span className="text-sm font-bold text-white">V</span>
                    </div>
                    <div className="hidden sm:block">
                        <span className="text-lg font-bold bg-gradient-to-r from-[#1a237e] to-[#c62828] bg-clip-text text-transparent">
                            VCK Social
                        </span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                    ? 'bg-primary text-primary-foreground shadow-md'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                    }`}
                            >
                                <link.icon className="h-4 w-4" />
                                {link.label}
                            </Link>
                        );
                    })}
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-3">
                    {/* Language Toggle */}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="hidden sm:flex items-center gap-1.5 text-xs"
                        onClick={() => setLanguage(language === 'ta' ? 'en' : 'ta')}
                    >
                        <Languages className="h-3.5 w-3.5" />
                        {LANGUAGES[language === 'ta' ? 'en' : 'ta']}
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                                <Avatar className="h-9 w-9 border-2 border-primary/30">
                                    <AvatarImage src={profile?.profile_photo_url || undefined} alt={profile?.name || 'User'} />
                                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <div className="px-3 py-2">
                                <p className="text-sm font-semibold">{profile?.name || 'Member'}</p>
                                <p className="text-xs text-muted-foreground">{profile?.email || user?.email}</p>
                            </div>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/profile" className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    {t('nav.profile')}
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/media" className="flex items-center gap-2">
                                    <Image className="h-4 w-4" />
                                    {t('nav.media')}
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/social-accounts" className="flex items-center gap-2">
                                    <Globe className="h-4 w-4" />
                                    {t('nav.social_accounts')}
                                </Link>
                            </DropdownMenuItem>
                            {/* Language Toggle in dropdown for mobile */}
                            <DropdownMenuItem
                                onClick={() => setLanguage(language === 'ta' ? 'en' : 'ta')}
                                className="flex items-center gap-2 sm:hidden"
                            >
                                <Languages className="h-4 w-4" />
                                {language === 'ta' ? 'English' : 'தமிழ்'}
                            </DropdownMenuItem>
                            {(profile?.role === 'admin' || profile?.role === 'coordinator') && (
                                <DropdownMenuItem asChild>
                                    <Link href="/admin" className="flex items-center gap-2">
                                        <Shield className="h-4 w-4" />
                                        {t('nav.admin_panel')}
                                    </Link>
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={signOut} className="text-destructive focus:text-destructive">
                                <LogOut className="h-4 w-4 mr-2" />
                                {t('nav.sign_out')}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Mobile Menu */}
                    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                        <SheetTrigger asChild className="md:hidden">
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-72">
                            <div className="flex flex-col gap-2 mt-8">
                                {navLinks.map((link) => {
                                    const isActive = pathname === link.href;
                                    return (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setMobileOpen(false)}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${isActive
                                                ? 'bg-primary text-primary-foreground'
                                                : 'text-muted-foreground hover:bg-muted'
                                                }`}
                                        >
                                            <link.icon className="h-5 w-5" />
                                            {link.label}
                                        </Link>
                                    );
                                })}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    );
}
