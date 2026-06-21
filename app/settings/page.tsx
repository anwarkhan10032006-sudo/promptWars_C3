import React from 'react';
import { redirect } from 'next/navigation';
import { getSessionId, getUserProfile } from '../../lib/db';
import { Navigation } from '../../components/navigation';
import { Settings } from 'lucide-react';
import { ThemeToggle } from '../../components/ui/theme-toggle';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const sessionId = await getSessionId();
  const userId = `user-${sessionId}`;

  const profile = await getUserProfile(userId);
  if (!profile) {
    redirect('/demo');
  }

  return (
    <Navigation userProfile={profile}>
      <div className="space-y-8 pb-10 max-w-3xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-surface border border-border p-6 rounded-2xl shadow-xs">
          <div>
            <h1 className="text-2xl font-extrabold font-display text-text-primary tracking-tight">
              Settings & Preferences
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              Manage your profile, theme, and data preferences.
            </p>
          </div>
          <div className="p-3 bg-border/50 rounded-xl text-text-muted">
            <Settings className="h-6 w-6" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4 border-b border-border pb-2">Appearance</h3>
            <div className="flex items-center justify-between">
              <div>
                <span className="block font-bold text-text-primary">Theme Override</span>
                <span className="text-xs text-text-secondary">Switch between light and dark mode explicitly.</span>
              </div>
              <ThemeToggle />
            </div>
          </div>

          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4 border-b border-border pb-2">Data Management</h3>
            <div className="text-sm text-text-secondary mb-4">
              If you are in Demo Mode, your data is ephemeral and will clear when you select a new persona.
            </div>
          </div>
        </div>
      </div>
    </Navigation>
  );
}
