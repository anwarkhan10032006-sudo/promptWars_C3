'use client';

import React, { useState } from 'react';
import { Scenario, CarbonTwinProjection } from '../../types';
import { useAnimatedNumber } from '../../lib/hooks';
import { cn, formatCurrency } from '../../lib/utils';
import { TrendingDown, ShieldAlert, Award, DollarSign, ListChecks, ArrowLeftRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { TwinComparisonTable } from './twin-comparison-table';

interface TwinSplitScreenProps {
  projections: CarbonTwinProjection[];
  selectedScenario: Scenario;
  months: 3 | 6 | 12;
  narrativeText: string;
  className?: string;
}

export function TwinSplitScreen({ projections, selectedScenario, months, narrativeText, className }: TwinSplitScreenProps) {
  const [activeMobileTab, setActiveMobileTab] = useState<'current' | 'future'>('current');
  const [showTableMode, setShowTableMode] = useState(false);

  // Find projections for current and selected future scenarios
  const currentProj = projections.find(p => p.scenario === 'current_trajectory');
  const selectedProj = projections.find(p => p.scenario === selectedScenario);

  // Extract baseline
  const baselineEmissions = currentProj ? currentProj.baseline_monthly_kgco2e : 0;

  // Extract values based on selected months
  const getEmissionsForMonth = (proj: CarbonTwinProjection | undefined) => {
    if (!proj) return 0;
    if (months === 3) return Number(proj.month_3_kgco2e || 0);
    if (months === 6) return Number(proj.month_6_kgco2e || 0);
    return Number(proj.month_12_kgco2e || 0);
  };

  const currentVal = getEmissionsForMonth(currentProj);
  const futureVal = getEmissionsForMonth(selectedProj);

  // Animate numbers
  const animatedCurrentVal = useAnimatedNumber(currentVal);
  const animatedFutureVal = useAnimatedNumber(futureVal);
  const animatedBaseline = useAnimatedNumber(baselineEmissions);
  
  const animatedScore = useAnimatedNumber(selectedProj?.sustainability_score || 0);
  const animatedReduction = useAnimatedNumber(selectedProj ? ((baselineEmissions - futureVal) / (baselineEmissions || 1)) * 100 : 0);
  const animatedSavings = useAnimatedNumber(selectedProj?.estimated_cost_savings || 0);

  // Scenario gradients and styles
  const scenarioStyles = {
    current_trajectory: {
      accent: 'border-slate-300 dark:border-slate-700',
      gradient: 'from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800',
      text: 'text-slate-600 dark:text-slate-400',
      button: 'bg-scenario-current'
    },
    moderate: {
      accent: 'border-lime-400 dark:border-lime-700',
      gradient: 'from-lime-50/50 to-emerald-50/30 dark:from-lime-950/20 dark:to-emerald-950/10',
      text: 'text-lime-600 dark:text-lime-400',
      button: 'bg-scenario-moderate'
    },
    aggressive: {
      accent: 'border-emerald-500 dark:border-emerald-800',
      gradient: 'from-emerald-100/50 to-teal-50/30 dark:from-emerald-950/30 dark:to-teal-950/10',
      text: 'text-emerald-600 dark:text-emerald-400',
      button: 'bg-scenario-aggressive'
    }
  };

  const style = scenarioStyles[selectedScenario];

  return (
    <div className={cn('w-full flex flex-col space-y-6', className)}>
      {/* Mode Selector / A11y Table Toggle */}
      <div className="flex justify-between items-center w-full">
        <h4 className="text-sm font-semibold text-text-muted flex items-center space-x-2">
          <ArrowLeftRight className="h-4 w-4" />
          <span>Carbon Twin AI Sandbox</span>
        </h4>
        <button
          onClick={() => setShowTableMode(!showTableMode)}
          className="text-xs font-semibold text-primary border border-primary/30 px-3 py-1.5 rounded-lg hover:bg-primary/5 focus:outline-none cursor-pointer"
        >
          {showTableMode ? 'Interactive View' : 'Compare as Data Table'}
        </button>
      </div>

      {!showTableMode ? (
        <>
          {/* Mobile Navigation Tab Strip (<768px only) */}
          <div className="flex md:hidden bg-surface-elevated p-1 rounded-xl border border-border">
            <button
              onClick={() => setActiveMobileTab('current')}
              className={cn(
                'flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors cursor-pointer',
                activeMobileTab === 'current' ? 'bg-surface text-text-primary shadow-sm font-bold' : 'text-text-secondary'
              )}
            >
              Current You
            </button>
            <button
              onClick={() => setActiveMobileTab('future')}
              className={cn(
                'flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors cursor-pointer',
                activeMobileTab === 'future' ? 'bg-surface text-text-primary shadow-sm font-bold' : 'text-text-secondary'
              )}
            >
              Future You ({selectedScenario === 'moderate' ? 'Mod' : selectedScenario === 'aggressive' ? 'Agg' : 'Current'})
            </button>
          </div>

          {/* Twin Display Panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            
            {/* Panel 1: Current You (Hidden on mobile if Future tab is active) */}
            <div className={cn(
              'bg-surface border border-border p-6 rounded-2xl flex flex-col justify-between shadow-sm relative overflow-hidden transition-all duration-300',
              activeMobileTab === 'current' ? 'block' : 'hidden md:flex'
            )}>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">Current Trajectory</span>
                <h3 className="text-2xl font-bold font-display text-text-primary mt-1">Current You</h3>
                <p className="text-sm text-text-secondary mt-2">Based on your rolling average emissions with no behavioral adjustments.</p>
                
                {/* Large Emission Value Display */}
                <div className="mt-6 p-6 bg-surface-elevated border border-border rounded-xl">
                  <span className="text-xs font-medium text-text-secondary">Projected Footprint</span>
                  <div className="text-4xl font-extrabold font-tabular text-text-primary mt-1">
                    {animatedCurrentVal} <span className="text-sm font-medium text-text-secondary">kg CO2e/mo</span>
                  </div>
                  <div className="text-[11px] text-text-muted mt-2">
                    Baseline: {animatedBaseline} kg CO2e/month
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-border flex items-center space-x-3 text-text-secondary">
                <ShieldAlert className="h-5 w-5 text-scenario-current" />
                <span className="text-xs font-medium">Standard trajectory misses the {months}-month footprint reduction target.</span>
              </div>
            </div>

            {/* Panel 2: Future You (Hidden on mobile if Current tab is active) */}
            <motion.div 
              animate={{ borderColor: selectedScenario === 'current_trajectory' ? 'var(--color-border)' : 'transparent' }}
              className={cn(
                'bg-surface border border-border p-6 rounded-2xl flex flex-col justify-between shadow-sm relative overflow-hidden transition-all duration-300',
                activeMobileTab === 'future' ? 'block' : 'hidden md:flex',
                selectedScenario !== 'current_trajectory' && `border-2 bg-gradient-to-br ${style.gradient} ${style.accent}`
              )}
            >
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <span className={cn('text-xs font-bold uppercase tracking-wider', style.text)}>
                      {selectedScenario === 'moderate' ? 'Moderate Improvement' : selectedScenario === 'aggressive' ? 'Aggressive Reduction' : 'Static Scenario'}
                    </span>
                    <h3 className="text-2xl font-bold font-display text-text-primary mt-1">Future You</h3>
                  </div>
                  {/* Sustainability Score Badge */}
                  <div className="bg-surface border border-border px-3 py-1.5 rounded-lg flex flex-col items-center">
                    <span className="text-[9px] font-bold text-text-muted uppercase">Eco Score</span>
                    <span className="text-lg font-bold font-tabular text-primary">{animatedScore}/100</span>
                  </div>
                </div>

                <p className="text-sm text-text-secondary mt-2">
                  {selectedScenario === 'current_trajectory' 
                    ? 'Projections assuming you make zero behavior adjustments.'
                    : `Projected footprint with adoption of target recommendations.`}
                </p>

                {/* Projection metric block */}
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="bg-surface border border-border p-4 rounded-xl">
                    <span className="text-[10px] font-semibold text-text-muted uppercase">Footprint</span>
                    <div className="text-2xl font-bold font-tabular text-text-primary mt-1">
                      {animatedFutureVal} <span className="text-xs font-medium text-text-secondary">kg</span>
                    </div>
                  </div>
                  <div className="bg-surface border border-border p-4 rounded-xl">
                    <span className="text-[10px] font-semibold text-text-muted uppercase">Reduction</span>
                    <div className="text-2xl font-bold font-tabular text-text-primary mt-1 text-primary">
                      {animatedReduction}%
                    </div>
                  </div>
                </div>

                {/* AI Comparative Narrative */}
                <div className="mt-6 bg-surface border border-border/80 p-4 rounded-xl">
                  <div className="flex items-center space-x-2 text-xs font-semibold text-primary mb-1">
                    <TrendingDown className="h-4 w-4" />
                    <span>AI Narrative Outlook</span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">{narrativeText}</p>
                </div>
              </div>

              {/* Bottom savings info */}
              <div className="mt-6 pt-5 border-t border-border/60 grid grid-cols-2 gap-4 text-xs font-medium text-text-secondary">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-category-electricity" />
                  <div>
                    <span className="block text-[10px] text-text-muted uppercase font-semibold">Cost Savings</span>
                    <span className="font-bold text-text-primary">{formatCurrency(animatedSavings)}/mo</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-category-food" />
                  <div>
                    <span className="block text-[10px] text-text-muted uppercase font-semibold">Goal Probability</span>
                    <span className="font-bold text-text-primary">{(selectedProj?.goal_achievement_probability || 0) * 100}%</span>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>

          {/* Key Habit Changes list */}
          {selectedScenario !== 'current_trajectory' && selectedProj && selectedProj.key_habit_changes?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface border border-border p-5 rounded-2xl shadow-sm"
            >
              <h4 className="text-sm font-bold text-text-primary font-display flex items-center space-x-2 mb-3">
                <ListChecks className="h-4 w-4 text-primary" />
                <span>Required Habit Shifts for this Scenario</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-text-secondary">
                {selectedProj.key_habit_changes.map((habit, idx) => (
                  <div key={idx} className="flex items-center space-x-2 bg-surface-elevated border border-border/40 p-2.5 rounded-lg">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                    <span>{habit}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </>
      ) : (
        <TwinComparisonTable projections={projections} months={months} />
      )}
    </div>
  );
}
