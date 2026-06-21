'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '../components/ui/button';
import { Leaf, Sparkles, Compass, ArrowRight, Smartphone, Eye, LayoutDashboard, Zap } from 'lucide-react';
import { RecommendationCard } from '../components/cards/recommendation-card';
import { Recommendation } from '../types';
import { cn } from '../lib/utils';

export default function MarketingPage() {
  const [showTeaserFuture, setShowTeaserFuture] = useState(false);

  // Mock sample recommendation for the live interactive landing page demo
  const sampleRecommendation: Recommendation = {
    id: 'sample-rec-community-solar',
    user_id: 'marketing-visitor',
    category: 'electricity',
    action_title: 'Opt-in to Community Solar',
    action_description: 'Enroll in your local clean energy community solar program to offset grid electricity.',
    predicted_impact_kgco2e_per_month: 75,
    effort_score: 2,
    confidence_score: 0.95,
    status: 'active',
    generated_at: new Date().toISOString(),
    expires_at: new Date().toISOString(),
    rationale_text: 'Based on your electricity usage, enrolling in community solar replaces coal-heavy grid production with certified solar tariffs, yielding high emissions reduction.',
    rationale_data_points: {
      grid_intensity_region: 'US-MW',
      average_monthly_kwh: 520,
      carbon_savings_rate: '0.52 kg/kWh'
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text-primary flex flex-col justify-between selection:bg-primary/20">
      
      {/* Header Navigation */}
      <header className="border-b border-border bg-surface/75 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-primary rounded-lg text-white">
              <Leaf className="h-5 w-5" />
            </div>
            <span className="font-extrabold font-display text-xl tracking-tight text-text-primary">VERDANCE</span>
          </div>
          <div className="flex items-center space-x-3">
            <Link href="/login" className="text-xs font-semibold text-text-secondary hover:text-text-primary px-3 py-2 rounded-lg">
              Log In
            </Link>
            <Link href="/signup">
              <Button variant="primary" size="sm">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-16 md:py-24 space-y-24">
        
        {/* Core Value Prop Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5 fill-primary" />
              <span>AI Sustainability Copilot</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold font-display leading-[1.05] tracking-tight text-text-primary">
              Your Personal Path to <br />
              <span className="text-primary bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">Net Zero Carbon</span>
            </h1>

            <p className="text-base md:text-lg text-text-secondary leading-relaxed max-w-xl">
              VERDANCE blends deterministic carbon metrics with conversational AI to analyze your activities, forecast your trajectory, and build custom 30-day missions. 
            </p>

            {/* CTAs with EQUAL visual prominence */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/demo" className="flex-1 sm:flex-initial">
                <Button variant="accent" size="lg" className="w-full shadow-md font-bold text-base hover:scale-[1.01]">
                  Try Demo Experience
                </Button>
              </Link>
              <Link href="/signup" className="flex-1 sm:flex-initial">
                <Button variant="primary" size="lg" className="w-full shadow-md font-bold text-base hover:scale-[1.01]">
                  Sign Up Now
                </Button>
              </Link>
            </div>
            
            <p className="text-[11px] text-text-muted italic">
              *Try Demo lets you explore preseeded personas instantly with no email or credit card required.
            </p>
          </div>

          {/* Right Side: Interactive Recommendation Demo Card */}
          <div className="lg:col-span-5 bg-surface border border-border p-6 rounded-3xl shadow-lg relative">
            <span className="absolute -top-3 left-6 bg-primary text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded-md flex items-center space-x-1">
              <Eye className="h-3 w-3 fill-white" />
              <span>Interactive Demo Card</span>
            </span>

            <h3 className="font-display font-bold text-text-primary text-base mb-4">
              Explainable AI Recommendations
            </h3>
            
            <RecommendationCard 
              recommendation={sampleRecommendation}
              onAccept={(id) => alert(`You accepted the demo action: ${id}! This would initialize a Habit tracker or count toward your current Mission Week.`)}
              onDismiss={(id) => alert(`Recommendation ${id} dismissed. The engine will penalize this item and rank other matches higher.`)}
            />
          </div>
        </div>

        {/* Feature Teasers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-surface border border-border p-6 rounded-2xl flex flex-col justify-between space-y-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl w-fit">
              <Compass className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg font-display text-text-primary">AI Persona Engine</h3>
              <p className="text-xs text-text-secondary mt-2 leading-relaxed">
                Automatically classifies your carbon profile into 1 of 8 unique personas (like The Hidden Emitter or Frequent Flyer) as your habits shift.
              </p>
            </div>
          </div>

          <div className="bg-surface border border-border p-6 rounded-2xl flex flex-col justify-between space-y-4">
            <div className="p-3 bg-category-food/15 text-category-food rounded-xl w-fit">
              <Smartphone className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg font-display text-text-primary">Impact Storytelling</h3>
              <p className="text-xs text-text-secondary mt-2 leading-relaxed">
                No abstract metrics. We translate raw emissions numbers into relatable equivalents like smartphone charges or car commutes to build connection.
              </p>
            </div>
          </div>

          <div className="bg-surface border border-border p-6 rounded-2xl flex flex-col justify-between space-y-4">
            <div className="p-3 bg-category-electricity/10 text-category-electricity rounded-xl w-fit">
              <LayoutDashboard className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg font-display text-text-primary">Adaptive 30-Day Missions</h3>
              <p className="text-xs text-text-secondary mt-2 leading-relaxed">
                4-week plans dynamically customized to your target goals. Difficulty adjusts automatically depending on your weekly completion rates.
              </p>
            </div>
          </div>
        </div>

        {/* Carbon Twin Teaser Graphic Section */}
        <div className="bg-surface border border-border rounded-3xl p-8 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 lg:max-w-md">
            <div className="inline-flex items-center space-x-1.5 bg-category-flights/10 text-category-flights border border-category-flights/20 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase">
              <Zap className="h-3 w-3 fill-category-flights" />
              <span>Carbon Twin AI</span>
            </div>
            <h3 className="text-2xl font-bold font-display text-text-primary">Project Your Future Self</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Toggle scenarios (Current vs. Moderate vs. Aggressive) and scrub the timeline to watch your Carbon Twin project emissions and cost savings over 3, 6, or 12 months.
            </p>
            <Link href="/demo" className="inline-flex items-center text-xs font-bold text-primary hover:underline group">
              <span>Test the twin inside demo</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Interactive Teaser Mini-View */}
          <div className="bg-surface-elevated border border-border rounded-2xl p-6 w-full max-w-md shadow-inner flex flex-col justify-between space-y-4">
            <div className="flex justify-between items-center text-xs font-semibold text-text-muted">
              <span>Carbon Twin Simulation Preview</span>
              <div className="flex bg-surface border border-border rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => setShowTeaserFuture(false)}
                  className={cn('px-2.5 py-1 rounded text-[10px] cursor-pointer', !showTeaserFuture ? 'bg-slate-200 text-slate-800 font-bold' : 'text-text-muted')}
                >
                  Current You
                </button>
                <button
                  type="button"
                  onClick={() => setShowTeaserFuture(true)}
                  className={cn('px-2.5 py-1 rounded text-[10px] cursor-pointer', showTeaserFuture ? 'bg-primary text-white font-bold' : 'text-text-muted')}
                >
                  Future You
                </button>
              </div>
            </div>

            <div className="p-4 bg-surface border border-border rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Projected Footprint</span>
                <div className="text-3xl font-extrabold font-tabular text-text-primary mt-1">
                  {showTeaserFuture ? '228.0' : '412.0'} <span className="text-xs font-medium text-text-secondary">kg/mo</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Savings</span>
                <div className="text-lg font-bold font-tabular text-primary mt-1">
                  {showTeaserFuture ? '-$82.50/mo' : '$0.00/mo'}
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* Footer Section */}
      <footer className="border-t border-border bg-surface py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-text-secondary font-medium">
          <div className="flex items-center space-x-2">
            <div className="p-1 bg-primary rounded text-white">
              <Leaf className="h-4.5 w-4.5" />
            </div>
            <span className="font-bold text-text-primary">VERDANCE Copilot © 2026</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link href="/terms" className="hover:underline">Terms of Service</Link>
            <Link href="/evaluation" className="hover:underline text-primary font-bold">PromptWars Mapping</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
