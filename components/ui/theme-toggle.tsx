'use client';

import React, { useState, useEffect } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { cn } from '../../lib/utils';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setMounted(true);
      // Simple mock logic for UI purposes
      const stored = localStorage.getItem('verdance-theme');
      if (stored === 'light' || stored === 'dark') {
        setTheme(stored);
      }
    });
    return () => cancelAnimationFrame(handle);
  }, []);

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    if (newTheme === 'system') {
      localStorage.removeItem('verdance-theme');
      document.documentElement.classList.remove('dark');
    } else {
      localStorage.setItem('verdance-theme', newTheme);
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex bg-bg border border-border p-1 rounded-full w-fit">
      <button
        onClick={() => handleThemeChange('light')}
        className={cn(
          "p-2 rounded-full transition-colors",
          theme === 'light' ? "bg-surface shadow-sm text-primary" : "text-text-muted hover:text-text-primary"
        )}
      >
        <Sun className="h-4 w-4" />
      </button>
      <button
        onClick={() => handleThemeChange('system')}
        className={cn(
          "p-2 rounded-full transition-colors",
          theme === 'system' ? "bg-surface shadow-sm text-primary" : "text-text-muted hover:text-text-primary"
        )}
      >
        <Monitor className="h-4 w-4" />
      </button>
      <button
        onClick={() => handleThemeChange('dark')}
        className={cn(
          "p-2 rounded-full transition-colors",
          theme === 'dark' ? "bg-surface shadow-sm text-primary" : "text-text-muted hover:text-text-primary"
        )}
      >
        <Moon className="h-4 w-4" />
      </button>
    </div>
  );
}
