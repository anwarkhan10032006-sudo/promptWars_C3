'use client';

import React, { useState } from 'react';
import { 
  UserProfile, ActivityLog, Goal, Habit, Persona, CarbonTwinProjection, Mission, MissionWeek, Category, Recommendation 
} from '../../types';
import { Button } from '../../components/ui/button';
import { Dialog } from '../../components/ui/dialog';
import { ActivityLogForm } from '../../components/forms/activity-log-form';
import { DonutChart } from '../../components/charts/donut-chart';
import { LineChart } from '../../components/charts/line-chart';
import { RecommendationCard } from '../../components/cards/recommendation-card';
import { HabitCard } from '../../components/cards/habit-card';
import { PersonaCard } from '../../components/persona/persona-card';
import { ImpactStoryCard } from '../../components/storytelling/impact-story-card';
import { useAnimatedNumber } from '../../lib/hooks';
import { forecastNext30DayFootprint, partitionLogsInto30DayBlocks } from '../../lib/emissions';
import { quickLogActivity, completeHabitAction, toggleMissionActionItem } from './actions';
import { 
  Plus, Navigation as CommuteIcon, 
  Lightbulb, Apple, ShoppingBag, Plane, ArrowRight, Leaf
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '../../lib/utils';

interface DashboardClientProps {
  profile: UserProfile;
  logs: ActivityLog[];
  goals: Goal[];
  habits: Habit[];
  persona: Persona | null;
  projections: CarbonTwinProjection[];
  activeMission?: Mission;
  missionWeeks?: MissionWeek[];
}

export function DashboardClient({
  profile,
  logs,
  habits,
  persona,
  projections,
  missionWeeks = []
}: DashboardClientProps) {
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [selectedQuickCategory, setSelectedQuickCategory] = useState<Category>('transportation');

  // 1. Calculate Monthly Footprint Total (rolling 30d)
  const [b1, b2, b3] = partitionLogsInto30DayBlocks(logs);
  const animatedFootprint = useAnimatedNumber(b1);

  // Calculate percentage change WoW/MoM
  const monthlyDelta = b2 > 0 ? Number(((b1 - b2) / b2 * 100).toFixed(1)) : 0;

  // 2. Forecast Footprint (rolling 90d moving average)
  const forecast = forecastNext30DayFootprint(logs);

  // 3. Category Breakdown Data
  const getCategoryTotal = (cat: Category) => {
    return logs
      .filter(l => l.category === cat && new Date(l.occurred_at) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
      .reduce((sum, l) => sum + Number(l.computed_emissions_kgco2e), 0);
  };

  const donutData = [
    { name: 'Transportation', value: getCategoryTotal('transportation'), color: 'var(--category-transportation)' },
    { name: 'Electricity', value: getCategoryTotal('electricity'), color: 'var(--category-electricity)' },
    { name: 'Food', value: getCategoryTotal('food'), color: 'var(--category-food)' },
    { name: 'Shopping', value: getCategoryTotal('shopping'), color: 'var(--category-shopping)' },
    { name: 'Flights', value: getCategoryTotal('flights'), color: 'var(--category-flights)' }
  ];

  // 4. Line Chart Historical + Forecast Data
  const lineData = [
    { date: '60d ago', actual: Number(b3.toFixed(1)) },
    { date: '30d ago', actual: Number(b2.toFixed(1)) },
    { 
      date: 'Current Month', 
      actual: Number(b1.toFixed(1)), 
      forecast: Number(b1.toFixed(1)),
      lowerBound: Number(b1.toFixed(1)), 
      upperBound: Number(b1.toFixed(1)) 
    },
    { 
      date: 'Forecast (Next 30d)', 
      forecast: Number(forecast.forecasted.toFixed(1)),
      lowerBound: Number(forecast.lowerBound.toFixed(1)),
      upperBound: Number(forecast.upperBound.toFixed(1))
    }
  ];

  // 5. Active Mission week calculations
  const currentWeek = missionWeeks.find(w => w.status === 'active');
  
  // Try to find the recommendation items linked to the current week
  // For demo consistency, we can match from seeds or build sample recommendations
  const activeRecommendations: Recommendation[] = [
    {
      id: currentWeek?.primary_recommendation_id || 'sample-p-id',
      user_id: profile.id,
      category: 'transportation' as const,
      action_title: 'Bicycle or Walk Short Trips',
      action_description: 'Replace driving for local errands under 3 km.',
      predicted_impact_kgco2e_per_month: 15,
      effort_score: 1,
      confidence_score: 0.95,
      status: 'active' as const,
      generated_at: new Date().toISOString(),
      expires_at: new Date().toISOString(),
      rationale_text: 'Thrifting reduces new fabrics manufacturing carbon impact.',
      rationale_data_points: {}
    },
    {
      id: currentWeek?.secondary_recommendation_id || 'sample-s-id',
      user_id: profile.id,
      category: 'food' as const,
      action_title: 'Adopt Meatless Mondays',
      action_description: 'Commit to fully vegetarian ingredients one day a week.',
      predicted_impact_kgco2e_per_month: 12,
      effort_score: 2,
      confidence_score: 0.90,
      status: 'active' as const,
      generated_at: new Date().toISOString(),
      expires_at: new Date().toISOString(),
      rationale_text: 'Thrifting reduces new fabrics manufacturing carbon impact.',
      rationale_data_points: {}
    }
  ];

  // "Today's top move" is the highest-ranked recommendation
  const topMove = activeRecommendations[0];

  const handleQuickLogClick = (cat: Category) => {
    setSelectedQuickCategory(cat);
    setIsLogOpen(true);
  };

  const handleLogSubmit = async (values: { category: Category; subcategory: string; quantity: number; occurred_at: string; }) => {
    await quickLogActivity(values);
    setIsLogOpen(false);
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* Top Banner: Welcome & Quick Log Shortcuts */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 bg-surface border border-border p-6 rounded-2xl shadow-xs">
        <div>
          <h1 className="text-2xl font-extrabold font-display text-text-primary tracking-tight">
            Hello, {profile.full_name}!
          </h1>
          <p className="text-xs text-text-secondary mt-1">Here is your carbon footprint dashboard for today.</p>
        </div>

        {/* Quick Log Shortcuts */}
        <div className="flex flex-col space-y-2">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Quick Log Shortcut</span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleQuickLogClick('transportation')}
              className="p-2.5 rounded-xl bg-category-transportation/10 text-category-transportation hover:bg-category-transportation/25 cursor-pointer focus:outline-none"
              title="Log Commute"
            >
              <CommuteIcon className="h-4.5 w-4.5" />
            </button>
            <button
              onClick={() => handleQuickLogClick('electricity')}
              className="p-2.5 rounded-xl bg-category-electricity/10 text-category-electricity hover:bg-category-electricity/25 cursor-pointer focus:outline-none"
              title="Log Electricity"
            >
              <Lightbulb className="h-4.5 w-4.5" />
            </button>
            <button
              onClick={() => handleQuickLogClick('food')}
              className="p-2.5 rounded-xl bg-category-food/10 text-category-food hover:bg-category-food/25 cursor-pointer focus:outline-none"
              title="Log Meal"
            >
              <Apple className="h-4.5 w-4.5" />
            </button>
            <button
              onClick={() => handleQuickLogClick('shopping')}
              className="p-2.5 rounded-xl bg-category-shopping/10 text-category-shopping hover:bg-category-shopping/25 cursor-pointer focus:outline-none"
              title="Log Shopping"
            >
              <ShoppingBag className="h-4.5 w-4.5" />
            </button>
            <button
              onClick={() => handleQuickLogClick('flights')}
              className="p-2.5 rounded-xl bg-category-flights/10 text-category-flights hover:bg-category-flights/25 cursor-pointer focus:outline-none"
              title="Log Flight"
            >
              <Plane className="h-4.5 w-4.5" />
            </button>
            
            <Button
              onClick={() => handleQuickLogClick('transportation')}
              variant="primary"
              size="sm"
              className="rounded-xl font-bold text-xs h-10 space-x-1"
            >
              <Plus className="h-4 w-4" />
              <span>Add Entry</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Footprint Value Block */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        {/* Footprint total display */}
        <div className="md:col-span-5 bg-surface border border-border p-6 rounded-2xl shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 opacity-5 text-primary">
            <Leaf className="h-32 w-32" />
          </div>

          <div>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Rolling 30-Day Footprint</span>
            <div className="text-5xl font-extrabold font-tabular text-primary tracking-tight mt-3">
              {animatedFootprint} <span className="text-base font-semibold text-text-secondary">kg CO2e</span>
            </div>
            
            {/* Delta Indicator */}
            {monthlyDelta !== 0 && (
              <div className="mt-2.5 flex items-center space-x-1 text-xs">
                <span className={cn(
                  'font-bold px-2 py-0.5 rounded-full font-tabular',
                  monthlyDelta < 0 ? 'bg-category-food/20 text-category-food' : 'bg-accent/20 text-accent'
                )}>
                  {monthlyDelta < 0 ? '' : '+'}{monthlyDelta}%
                </span>
                <span className="text-text-secondary">vs last month</span>
              </div>
            )}
          </div>

          <div className="mt-6 pt-5 border-t border-border flex items-center justify-between text-xs text-text-secondary">
            <span>Forecast next 30d:</span>
            <span className="font-bold text-text-primary font-tabular">~{forecast.forecasted.toFixed(0)} kg CO2e</span>
          </div>
        </div>

        {/* Storytelling Equivalent card */}
        <div className="md:col-span-7 flex flex-col justify-between">
          <ImpactStoryCard 
            kgco2e={b1} 
            label="Footprint Storyteller"
            preferredType="tree_year_absorption"
            className="flex-1"
          />
        </div>
      </div>

      {/* Middle Grid: Charts vs AI Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Line and Donut charts */}
        <div className="lg:col-span-7 space-y-6">
          <LineChart data={lineData} title="Footprint Trajectory & Forecast" />
          <DonutChart data={donutData} title="Emissions Category Breakdown" />
        </div>

        {/* Right Column: Persona, Twin preview, Top Move */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Persona Card */}
          {persona && (
            <PersonaCard personaKey={persona.persona_key} showDetails={false} />
          )}

          {/* Carbon Twin Mini Preview */}
          <div className="bg-surface border border-border p-5 rounded-2xl shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Carbon Twin Preview</span>
              <Link href="/carbon-twin" className="text-xs font-semibold text-primary hover:underline flex items-center space-x-0.5">
                <span>View Full Twin</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold font-tabular">
              {projections.slice(0, 3).map((proj) => {
                const colors = {
                  current_trajectory: 'text-scenario-current',
                  moderate: 'text-scenario-moderate',
                  aggressive: 'text-scenario-aggressive'
                };
                return (
                  <div key={proj.scenario} className="bg-surface-elevated border border-border/40 p-3 rounded-xl">
                    <span className="text-[9px] font-semibold text-text-muted uppercase block mb-1.5 truncate">
                      {proj.scenario === 'current_trajectory' ? 'Current' : proj.scenario === 'moderate' ? 'Moderate' : 'Aggressive'}
                    </span>
                    <span className={cn('text-sm block', colors[proj.scenario])}>
                      {proj.month_12_kgco2e.toFixed(0)} <span className="text-[10px] text-text-secondary font-medium">kg</span>
                    </span>
                    <span className="text-[10px] text-text-secondary mt-1 block">-{proj.reduction_pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Today's Top Move */}
          {topMove && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">{"Today's Top Action"}</span>
              <RecommendationCard 
                recommendation={topMove}
                onAccept={() => alert(`Action accepted! Unlocks a Habit tracker for "${topMove.action_title}".`)}
              />
            </div>
          )}

        </div>

      </div>

      {/* Bottom Grid: Active Mission Checklist vs Streak Habits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        
        {/* Active Mission Week strip */}
        <div className="bg-surface border border-border p-5 rounded-2xl shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-text-primary font-display text-base">Active 30-Day Mission</h3>
            <Link href="/missions" className="text-xs font-semibold text-primary hover:underline">
              Go to Mission Planner
            </Link>
          </div>

          {currentWeek ? (
            <div className="space-y-3">
              <div className="text-xs text-text-secondary">
                You are currently on <span className="font-bold text-text-primary">Week {currentWeek.week_number}</span>. Complete these actions to hit your weekly targets:
              </div>
              
              {/* Mission checkboxes */}
              <div className="space-y-2">
                {[
                  { id: currentWeek.primary_recommendation_id, title: activeRecommendations[0].action_title, isPrimary: true },
                  { id: currentWeek.secondary_recommendation_id, title: activeRecommendations[1].action_title, isPrimary: false }
                ].map((item) => {
                  const isDone = currentWeek.status === 'completed'; // or local check
                  return (
                    <label key={item.id} className="flex items-start space-x-3 p-3 bg-surface-elevated border border-border/40 rounded-xl cursor-pointer select-none">
                      <input 
                        type="checkbox"
                        checked={isDone}
                        onChange={() => toggleMissionActionItem(currentWeek.id, item.isPrimary, !isDone)}
                        className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary accent-primary"
                      />
                      <span className={cn('text-xs font-semibold text-text-primary', isDone && 'line-through text-text-muted')}>
                        {item.title}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-xs text-text-muted">
              No active mission week found. Join a mission to start weekly targets!
            </div>
          )}
        </div>

        {/* Streak habits list */}
        <div className="bg-surface border border-border p-5 rounded-2xl shadow-sm space-y-4">
          <h3 className="font-semibold text-text-primary font-display text-base">Smart Habits & Streaks</h3>
          <div className="space-y-3">
            {habits.slice(0, 3).map((habit) => (
              <HabitCard 
                key={habit.id} 
                habit={habit}
                onComplete={async (id) => {
                  await completeHabitAction(id);
                }}
              />
            ))}
            {habits.length === 0 && (
              <div className="text-center py-6 text-xs text-text-muted">
                No active habits being tracked yet. Accept suggestions to populate your habits lists.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Dialog overlay for logging activity */}
      <Dialog isOpen={isLogOpen} onClose={() => setIsLogOpen(false)} title="Log Carbon Activity">
        <ActivityLogForm 
          defaultCategory={selectedQuickCategory}
          onSubmitSuccess={handleLogSubmit}
        />
      </Dialog>

    </div>
  );
}
