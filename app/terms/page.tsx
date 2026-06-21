import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Leaf } from 'lucide-react';

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="text-xs text-text-muted">Last updated: June 21, 2026</p>

          <section className="space-y-3">
            <h2 className="text-lg font-bold font-display text-text-primary">1. Acceptable Use</h2>
            <p className="text-xs text-text-secondary leading-relaxed">
              VERDANCE is an educational tool designed to model personal carbon footprint metrics. Every carbon conversion and cost savings calculation relies on deterministic factors and statistical averages; projections represent estimates only.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold font-display text-text-primary">2. AI Gateway Constraints</h2>
            <p className="text-xs text-text-secondary leading-relaxed">
              The AI Sustainability Copilot conversational gateway uses Claude to personalize suggestions and explain metrics. Rate limits apply to mutations and AI chat queries to prevent cost abuse. Users must not exploit, flood, or bypass these endpoints.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold font-display text-text-primary">3. Disclaimer of Warranties</h2>
            <p className="text-xs text-text-secondary leading-relaxed">
              VERDANCE and its calculations are provided {"\"as-is\""}. We do not offer professional financial, utility, medical, or investment advice. Recommendations (e.g. EV swaps, solar community subscriptions) should be verified by the user against local conditions.
            </p>
          </section>
        </article>

      </div>
    </div>
  );
}
