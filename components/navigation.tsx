'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '../lib/utils';
import { 
  LayoutDashboard, CalendarRange, MessageSquare, ListChecks, 
  RefreshCw, Award, Target, LineChart, FileText, Settings, 
  Sparkles, Leaf, X, LogOut, CheckSquare2
} from 'lucide-react';

interface NavigationProps {
  children: React.ReactNode;
  userProfile?: { id: string; full_name: string; is_demo?: boolean } | null;
}

export function Navigation({ children, userProfile }: NavigationProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [showBanner, setShowBanner] = useState(true);

  // Auto-detect demo mode explicitly from database flag
  const isDemo = userProfile?.is_demo || userProfile?.id === 'default-session';

  const menuItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Track Emissions', href: '/track', icon: CalendarRange },
    { label: 'AI Copilot', href: '/copilot', icon: MessageSquare },
    { label: 'Recommendations', href: '/recommendations', icon: Sparkles },
    { label: 'Carbon Twin', href: '/carbon-twin', icon: RefreshCw },
    { label: 'Missions', href: '/missions', icon: ListChecks },
    { label: 'Weekly Reports', href: '/reports', icon: FileText },
    { label: 'Habit Tracker', href: '/habits', icon: CheckSquare2 },
    { label: 'Challenges', href: '/challenges', icon: Award },
    { label: 'Goals', href: '/goals', icon: Target },
    { label: 'Analytics', href: '/insights', icon: LineChart },
    { label: 'Settings', href: '/settings', icon: Settings },
    { label: 'A11y & Evaluation', href: '/evaluation', icon: FileText }
  ];

  // Mobile footer menu shortcuts (max 5)
  const mobileShortcuts = [
    { label: 'Home', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Track', href: '/track', icon: CalendarRange },
    { label: 'Copilot', href: '/copilot', icon: MessageSquare },
    { label: 'Missions', href: '/missions', icon: ListChecks },
    { label: 'Twin', href: '/carbon-twin', icon: RefreshCw }
  ];

  const handleExitDemo = () => {
    // Redirect to signup
    router.push('/signup');
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col justify-between">
      
      {/* Demo Banner */}
      {isDemo && showBanner && (
        <div className="bg-gradient-to-r from-accent to-amber-600 text-accent-foreground text-xs py-2.5 px-6 flex items-center justify-between sticky top-0 z-50 shadow-sm">
          <div className="flex items-center space-x-2">
            <span className="bg-accent-foreground text-accent font-bold text-[9px] px-1.5 py-0.5 rounded uppercase">Demo Mode</span>
            <span className="font-semibold">Preloaded data active. Actions are ephemeral and isolated.</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleExitDemo}
              className="bg-accent-foreground text-accent hover:opacity-90 font-bold px-3 py-1 rounded text-[10px] cursor-pointer"
            >
              Sign Up to Save Data
            </button>
            <button onClick={() => setShowBanner(false)} className="hover:opacity-80 cursor-pointer">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-1 relative">
        
        {/* DESKTOP SIDEBAR NAVIGATION (hidden < 1024px) */}
        <aside className="hidden lg:flex flex-col justify-between w-64 bg-surface border-r border-border h-screen sticky top-0 p-5 z-40">
          <div className="space-y-6">
            
            {/* Logo */}
            <div className="flex items-center space-x-2.5 px-2">
              <div className="p-1.5 bg-primary rounded-lg text-white">
                <Leaf className="h-5 w-5" />
              </div>
              <span className="font-extrabold font-display text-lg tracking-tight text-text-primary">VERDANCE</span>
            </div>

            {/* Menu List */}
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors',
                      isActive 
                        ? 'bg-primary/10 text-primary border border-primary/20' 
                        : 'text-text-secondary hover:bg-surface-elevated hover:text-text-primary'
                    )}
                  >
                    <Icon className="h-4.5 w-4.5 flex-shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Footer User Profiles info */}
          <div className="pt-4 border-t border-border flex items-center justify-between">
            <div className="truncate">
              <span className="text-[10px] text-text-muted block font-semibold uppercase tracking-wider">Active Session</span>
              <span className="text-xs font-bold text-text-primary truncate block">{userProfile?.full_name || 'Guest User'}</span>
            </div>
            <Link href="/" className="p-2 text-text-muted hover:text-danger rounded-lg cursor-pointer" aria-label="Sign Out">
              <LogOut className="h-4 w-4" />
            </Link>
          </div>
        </aside>

        {/* MAIN DISPLAY PAGE WRAPPER */}
        <main className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-0">
          <div className="flex-1 p-6 md:p-10 max-w-5xl w-full mx-auto space-y-8">
            {children}
          </div>
        </main>

        {/* MOBILE FOOTER TAB BAR (hidden >= 768px) */}
        <nav className="fixed bottom-0 left-0 right-0 lg:hidden bg-surface/90 backdrop-blur-md border-t border-border h-16 flex items-center justify-around z-40 px-4 shadow-lg">
          {mobileShortcuts.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center flex-1 py-1 text-center focus:outline-none',
                  isActive ? 'text-primary' : 'text-text-secondary'
                )}
              >
                <Icon className={cn('h-5 w-5', isActive && 'stroke-[2.5]')} />
                <span className="text-[9px] font-bold mt-1 tracking-tight capitalize">{item.label}</span>
              </Link>
            );
          })}
        </nav>

      </div>
    </div>
  );
}
