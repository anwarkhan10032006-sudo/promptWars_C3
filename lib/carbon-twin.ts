import { Scenario, CarbonTwinProjection, Habit, Goal } from '../types';

export const MODERATE_ADOPTION_RATE = 0.50;

// Configurable sustainability score weights
export const SUSTAINABILITY_SCORE_WEIGHTS = {
  reduction: 0.50,
  breadth: 0.30,
  consistency: 0.20
};

export interface TwinCalculationInput {
  userId: string;
  baselineEmissions: number;
  activeRecommendations: Array<{
    ruleId: string;
    category: string;
    action_title: string;
    predicted_impact_kgco2e_per_month: number;
    effort_score: number;
  }>;
  habits: Habit[];
  goals: Goal[];
}

// Pure function to calculate twin projections
export function computeTwinScenarioProjections(input: TwinCalculationInput): CarbonTwinProjection[] {
  const { userId, baselineEmissions, activeRecommendations, habits, goals } = input;
  
  // Scenarios
  const scenarios: Scenario[] = ['current_trajectory', 'moderate', 'aggressive'];

  // Calculate impacts
  const moderateRecs = activeRecommendations.filter(r => r.effort_score <= 3);
  const moderateMonthlySavings = moderateRecs.reduce((sum, r) => sum + r.predicted_impact_kgco2e_per_month, 0) * MODERATE_ADOPTION_RATE;
  
  const aggressiveMonthlySavings = activeRecommendations.reduce((sum, r) => sum + r.predicted_impact_kgco2e_per_month, 0);

  // Category breadth (number of unique categories in recommendations + habits)
  const uniqueCategories = new Set([
    ...activeRecommendations.map(r => r.category),
    ...habits.map(h => h.category)
  ]);
  const breadthFraction = Math.min(1.0, uniqueCategories.size / 5);

  // Consistency (habit streak strength: max streak capped at 14 days)
  const maxStreak = habits.reduce((max, h) => Math.max(max, h.streak_count), 0);
  const consistencyFraction = Math.min(1.0, maxStreak / 14);

  return scenarios.map(scenario => {
    let savings = 0;
    let habitChanges: string[] = [];
    
    if (scenario === 'moderate') {
      savings = moderateMonthlySavings;
      habitChanges = moderateRecs.map(r => r.action_title);
    } else if (scenario === 'aggressive') {
      savings = aggressiveMonthlySavings;
      habitChanges = activeRecommendations.map(r => r.action_title);
    }

    // Projects (3, 6, 12 months with gradual adoption)
    const month_3_savings = savings * 0.6;
    const month_6_savings = savings * 0.9;
    const month_12_savings = savings;

    const month_3 = Math.max(0, baselineEmissions - month_3_savings);
    const month_6 = Math.max(0, baselineEmissions - month_6_savings);
    const month_12 = Math.max(0, baselineEmissions - month_12_savings);

    const reduction_pct = baselineEmissions > 0 
      ? Number(((baselineEmissions - month_12) / baselineEmissions * 100).toFixed(1))
      : 0;

    // Sustainability score calculation (0 to 100)
    const reductionFactor = Math.min(1.0, (baselineEmissions - month_12) / (baselineEmissions || 1));
    const scoreVal = (reductionFactor * SUSTAINABILITY_SCORE_WEIGHTS.reduction)
                   + (breadthFraction * SUSTAINABILITY_SCORE_WEIGHTS.breadth)
                   + (consistencyFraction * SUSTAINABILITY_SCORE_WEIGHTS.consistency);
    
    const sustainability_score = Math.min(100, Math.max(0, Math.round(scoreVal * 100)));

    // Goal achievement probability mapping
    let goal_achievement_probability = 0.10;
    if (goals.length > 0) {
      const activeGoal = goals[0];
      const targetPct = Number(activeGoal.target_value); // e.g. 15%
      
      if (reduction_pct >= targetPct + 5) {
        goal_achievement_probability = 0.95;
      } else if (reduction_pct >= targetPct - 2) {
        goal_achievement_probability = 0.75;
      } else if (reduction_pct > 0) {
        goal_achievement_probability = 0.40;
      } else {
        goal_achievement_probability = 0.15;
      }
    } else {
      // Default probability if no goal set
      goal_achievement_probability = scenario === 'aggressive' ? 0.90 : scenario === 'moderate' ? 0.60 : 0.25;
    }

    // Cost savings estimation: $0.45 per kg CO2e saved (average electricity/transport cost ratio)
    const estimated_cost_savings = Number((savings * 0.45).toFixed(2));

    return {
      id: `twin-${scenario}-${Math.random().toString(36).substring(2, 9)}`,
      user_id: userId,
      scenario,
      baseline_monthly_kgco2e: Number(baselineEmissions.toFixed(2)),
      month_3_kgco2e: Number(month_3.toFixed(2)),
      month_6_kgco2e: Number(month_6.toFixed(2)),
      month_12_kgco2e: Number(month_12.toFixed(2)),
      reduction_pct,
      sustainability_score,
      goal_achievement_probability,
      estimated_cost_savings,
      key_habit_changes: habitChanges,
      computed_at: new Date().toISOString()
    };
  });
}
