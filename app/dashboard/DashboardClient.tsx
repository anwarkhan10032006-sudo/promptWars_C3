'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { 
  UserProfile, ActivityLog, Goal, Habit, Persona, CarbonTwinProjection, Mission, MissionWeek, Category, Recommendation 
} from '../../types';
import { Dialog } from '../../components/ui/dialog';
import { ActivityLogForm } from '../../components/forms/activity-log-form';
import { DonutChart } from '../../components/charts/donut-chart';
import { LineChart } from '../../components/charts/line-chart';
import { RecommendationCard } from '../../components/cards/recommendation-card';
import { PersonaCard } from '../../components/persona/persona-card';
import { useAnimatedNumber } from '../../lib/hooks';
import { forecastNext30DayFootprint, partitionLogsInto30DayBlocks } from '../../lib/emissions';
import { quickLogActivity, completeHabitAction, toggleMissionActionItem } from './actions';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '../../lib/utils';

// Import extracted layout components
import { DashboardBanner } from '../../components/dashboard/dashboard-banner';
import { DashboardHero } from '../../components/dashboard/dashboard-hero';
import { DashboardMissions } from '../../components/dashboard/dashboard-missions';

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

  // 1. Calculate Monthly Footprint Total (rolling 30d blocks)
  const [b1, b2, b3] = useMemo(() => partitionLogsInto30DayBlocks(logs), [logs]);
  const animatedFootprint = useAnimatedNumber(b1);

  // Calculate percentage change WoW/MoM
  const monthlyDelta = useMemo(() => {
    return b2 > 0 ? Number(((b1 - b2) / b2 * 100).toFixed(1)) : 0;
  }, [b1, b2]);

  // 2. Forecast Footprint (rolling 90d moving average)
  const forecast = useMemo(() => forecastNext30DayFootprint(logs), [logs]);

  // 3. Category Breakdown Data
  const getCategoryTotal = useCallback((cat: Category) => {
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    return logs
      .filter(l => l.category === cat && new Date(l.occurred_at).getTime() >= thirtyDaysAgo)
      .reduce((sum, l) => sum + Number(l.computed_emissions_kgco2e), 0);
  }, [logs]);

  const donutData = useMemo(() => [
    { name: 'Transportation', value: getCategoryTotal('transportation'), color: 'var(--category-transportation)' },
    { name: 'Electricity', value: getCategoryTotal('electricity'), color: 'var(--category-electricity)' },
    { name: 'Food', value: getCategoryTotal('food'), color: 'var(--category-food)' },
    { name: 'Shopping', value: getCategoryTotal('shopping'), color: 'var(--category-shopping)' },
    { name: 'Flights', value: getCategoryTotal('flights'), color: 'var(--category-flights)' }
  ], [getCategoryTotal]);

  // 4. Line Chart Historical + Forecast Data
  const lineData = useMemo(() => [
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
  ], [b1, b2, b3, forecast]);

  // 5. Active Mission week calculations
  const currentWeek = useMemo(() => missionWeeks.find(w => w.status === 'active'), [missionWeeks]);
  
  const activeRecommendations = useMemo((): Recommendation[] => [
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
  ], [profile.id, currentWeek]);

  // "Today's top move" is the highest-ranked recommendation
  const topMove = useMemo(() => activeRecommendations[0], [activeRecommendations]);

  const handleQuickLogClick = useCallback((cat: Category) => {
    setSelectedQuickCategory(cat);
    setIsLogOpen(true);
  }, []);

  const handleLogSubmit = useCallback(async (values: { category: Category; subcategory: string; quantity: number; occurred_at: string; }) => {
    await quickLogActivity(values);
    setIsLogOpen(false);
  }, []);

  const handleToggleMissionActionItem = useCallback(async (weekId: string, isPrimary: boolean, completed: boolean) => {
    await toggleMissionActionItem(weekId, isPrimary, completed);
  }, []);

  const handleCompleteHabit = useCallback(async (habitId: string) => {
    await completeHabitAction(habitId);
  }, []);

  const handleAcceptTopMove = useCallback(() => {
    alert(`Action accepted! Unlocks a Habit tracker for "${topMove.action_title}".`);
  }, [topMove]);

  return (
    <div className="space-y-8 pb-10">
      
      {/* Top Banner: Welcome & Quick Log Shortcuts */}
      <DashboardBanner 
        profileName={profile.full_name} 
        onQuickLogClick={handleQuickLogClick} 
      />

      {/* Hero Footprint Value Block */}
      <DashboardHero 
        animatedFootprint={animatedFootprint}
        monthlyDelta={monthlyDelta}
        forecastedFootprint={forecast.forecasted}
        b1={b1}
      />

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
                onAccept={handleAcceptTopMove}
              />
            </div>
          )}

        </div>

      </div>

      {/* Bottom Grid: Active Mission Checklist vs Streak Habits */}
      <DashboardMissions 
        currentWeek={currentWeek}
        activeRecommendations={activeRecommendations}
        habits={habits}
        onToggleMissionActionItem={handleToggleMissionActionItem}
        onCompleteHabit={handleCompleteHabit}
      />

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
