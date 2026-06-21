import { describe, it, expect } from 'vitest';
import { computeTwinScenarioProjections } from '../../lib/carbon-twin';
import { Habit, Goal } from '../../types';

describe('Carbon Twin Projection Engine', () => {
  const mockHabits: Habit[] = [
    {
      id: 'habit-1',
      user_id: 'u1',
      habit_title: 'LED Bulbs',
      category: 'electricity',
      frequency_target: 'daily',
      streak_count: 14, // Capped at 14 for max consistency
      last_completed_at: null,
      linked_emission_savings_kgco2e: 12
    }
  ];

  const mockGoals: Goal[] = [
    {
      id: 'goal-1',
      user_id: 'u1',
      goal_type: 'footprint_reduction_pct',
      target_value: 15,
      target_unit: 'pct',
      start_date: new Date().toISOString(),
      target_date: new Date().toISOString(),
      current_progress: 0,
      status: 'on_track'
    }
  ];

  const mockRecs = [
    {
      ruleId: 'rule-1',
      category: 'electricity',
      action_title: 'Upgrade LED',
      predicted_impact_kgco2e_per_month: 20,
      effort_score: 2 // <= 3, moderate candidate
    },
    {
      ruleId: 'rule-2',
      category: 'transportation',
      action_title: 'Carpool',
      predicted_impact_kgco2e_per_month: 50,
      effort_score: 4 // > 3, aggressive only candidate
    }
  ];

  it('generates three projections scenarios', () => {
    const projections = computeTwinScenarioProjections({
      userId: 'u1',
      baselineEmissions: 200,
      activeRecommendations: mockRecs,
      habits: mockHabits,
      goals: mockGoals
    });

    expect(projections.length).toBe(3);
    const current = projections.find(p => p.scenario === 'current_trajectory');
    const moderate = projections.find(p => p.scenario === 'moderate');
    const aggressive = projections.find(p => p.scenario === 'aggressive');

    expect(current).toBeDefined();
    expect(moderate).toBeDefined();
    expect(aggressive).toBeDefined();
  });

  it('calculates moderate savings based on 50% adoption of effort <= 3 rules', () => {
    const projections = computeTwinScenarioProjections({
      userId: 'u1',
      baselineEmissions: 200,
      activeRecommendations: mockRecs,
      habits: mockHabits,
      goals: mockGoals
    });

    const moderate = projections.find(p => p.scenario === 'moderate')!;
    // Moderate savings = 20 * 0.50 = 10 kg
    // Month 12 value should be baseline - 10 = 190
    expect(moderate.month_12_kgco2e).toBe(190);
    // Cost savings = 10 * 0.45 = $4.50
    expect(moderate.estimated_cost_savings).toBe(4.50);
  });

  it('calculates aggressive savings based on 100% adoption of all rules', () => {
    const projections = computeTwinScenarioProjections({
      userId: 'u1',
      baselineEmissions: 200,
      activeRecommendations: mockRecs,
      habits: mockHabits,
      goals: mockGoals
    });

    const aggressive = projections.find(p => p.scenario === 'aggressive')!;
    // Aggressive savings = 20 + 50 = 70 kg
    // Month 12 value should be baseline - 70 = 130
    expect(aggressive.month_12_kgco2e).toBe(130);
    // Cost savings = 70 * 0.45 = $31.50
    expect(aggressive.estimated_cost_savings).toBe(31.50);
  });
});
