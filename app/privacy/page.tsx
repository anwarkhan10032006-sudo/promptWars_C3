import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Leaf } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-bg text-text-primary py-12 px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Navigation */}
        <div className="flex justify-between items-center pb-6 border-b border-border">
          <Link href="/" className="inline-flex items-center space-x-2 text-xs font-semibold text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center space-x-2">
            <Leaf className="h-5 w-5 text-primary" />
            <span className="font-bold text-sm tracking-tight">VERDANCE Legal</span>
          </div>
        </div>

        {/* Content */}
        <article className="space-y-6">
          <h1 className="text-3xl font-extrabold font-display tracking-tight text-text-primary">
            Privacy Policy
          </h1>
          <p className="text-xs text-text-muted">Last updated: June 21, 2026</p>

          <section className="space-y-3">
            <h2 className="text-lg font-bold font-display text-text-primary">1. Information We Collect</h2>
            <p className="text-xs text-text-secondary leading-relaxed">
              We collect information you provide directly during onboarding and activity logging, including home type, grid electricity usage, commuting logs, and dietary preferences. In Judge Demo Mode, no personal identifiable information (PII) is collected, and all interactions remain client-side or transient.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold font-display text-text-primary">2. How We Use Your Data</h2>
            <p className="text-xs text-text-secondary leading-relaxed">
              Your carbon metrics, region data, and log inputs are used strictly to calculate carbon emissions, categorize your sustainability persona, project twin scenarios, and structure 30-day missions. We do not sell or monetize your tracking data.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold font-display text-text-primary">3. Data Portability & Rights (GDPR)</h2>
            <p className="text-xs text-text-secondary leading-relaxed">
              In accordance with GDPR standards, users can request a complete download of their data in JSON format or delete their account permanently. These options are accessible under your Account Settings. Account deletion cascade-deletes all associated logs, habit streaks, goals, personas, and mission history.
            </p>
          </section>
        </article>

      </div>
    </div>
  );
}
