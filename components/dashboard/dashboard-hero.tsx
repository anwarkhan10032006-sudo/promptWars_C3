import React from 'react';
import { Leaf } from 'lucide-react';
import { cn } from '../../lib/utils';
import { ImpactStoryCard } from '../storytelling/impact-story-card';

interface DashboardHeroProps {
  animatedFootprint: string | number;
  monthlyDelta: number;
  forecastedFootprint: number;
  b1: number;
}

export const DashboardHero = React.memo(({ animatedFootprint, monthlyDelta, forecastedFootprint, b1 }: DashboardHeroProps) => {
  return (
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
          <span className="font-bold text-text-primary font-tabular">~{forecastedFootprint.toFixed(0)} kg CO2e</span>
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
  );
});

DashboardHero.displayName = 'DashboardHero';
