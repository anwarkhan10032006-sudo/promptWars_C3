import { Category, ActivityLog, Goal } from '../types';

// Scoring Weights
export const WEIGHTS = {
  impact: 0.5,
  feasibility: 0.3,
  goal: 0.2
};

export interface CandidateAction {
  ruleId: string;
  category: Category;
  action_title: string;
  action_description: string;
  predicted_impact_kgco2e_per_month: number;
  effort_score: number; // 1-5
  confidence_score: number; // 0-1
  rationale_template: string;
  checkMatch: (logs: ActivityLog[], goals: Goal[], profile: any) => boolean;
}

// Rules Table (18 rules across 5 categories)
export const RECOMMENDATION_RULES: CandidateAction[] = [
  // 1. Transportation
  {
    ruleId: 'rule-ev-swap',
    category: 'transportation',
    action_title: 'Transition to an Electric Vehicle',
    action_description: 'Replace commute driving in your petrol vehicle with an electric vehicle.',
    predicted_impact_kgco2e_per_month: 120,
    effort_score: 4,
    confidence_score: 0.90,
    rationale_template: 'Based on your weekly driving of {quantity} km in a petrol car, switching to an EV would reduce emissions by 120 kg CO2e per month.',
    checkMatch: (logs) => {
      const petrolLogs = logs.filter(l => l.category === 'transportation' && l.subcategory === 'Petrol Car');
      const totalKm = petrolLogs.reduce((sum, l) => sum + Number(l.quantity), 0);
      return totalKm > 150; // High weekly commute driving
    }
  },
  {
    ruleId: 'rule-transit-days',
    category: 'transportation',
    action_title: 'Transit Commute 2 Days/Week',
    action_description: 'Take public transit (bus or light rail) for your commute two days a week.',
    predicted_impact_kgco2e_per_month: 35,
    effort_score: 2,
    confidence_score: 0.85,
    rationale_template: 'Your regular driving of {quantity} km could be optimized. Swapping 2 days/week with bus or rail saves 35 kg CO2e per month.',
    checkMatch: (logs) => {
      const petrolLogs = logs.filter(l => l.category === 'transportation' && l.subcategory === 'Petrol Car');
      const totalKm = petrolLogs.reduce((sum, l) => sum + Number(l.quantity), 0);
      return totalKm > 40;
    }
  },
  {
    ruleId: 'rule-bike-walk',
    category: 'transportation',
    action_title: 'Bicycle or Walk Short Trips',
    action_description: 'Swap short car trips under 3 km with walking or cycling.',
    predicted_impact_kgco2e_per_month: 15,
    effort_score: 1,
    confidence_score: 0.95,
    rationale_template: 'Since you commute shorter distances of {quantity} km, walking or cycling for local errands can shave off 15 kg CO2e monthly.',
    checkMatch: (logs) => {
      const transLogs = logs.filter(l => l.category === 'transportation');
      const totalKm = transLogs.reduce((sum, l) => sum + Number(l.quantity), 0);
      return totalKm > 0 && totalKm <= 20; // Short commutes only
    }
  },
  {
    ruleId: 'rule-carpool-work',
    category: 'transportation',
    action_title: 'Carpool to Work',
    action_description: 'Share your commute driving with a coworker or neighbor heading the same way.',
    predicted_impact_kgco2e_per_month: 25,
    effort_score: 2,
    confidence_score: 0.80,
    rationale_template: 'Sharing commutes for your weekly {quantity} km travel splits your transit footprint in half, saving 25 kg CO2e/month.',
    checkMatch: (logs) => {
      const petrolLogs = logs.filter(l => l.category === 'transportation' && l.subcategory === 'Petrol Car');
      const totalKm = petrolLogs.reduce((sum, l) => sum + Number(l.quantity), 0);
      return totalKm > 80;
    }
  },

  // 2. Electricity
  {
    ruleId: 'rule-led-lights',
    category: 'electricity',
    action_title: 'Upgrade to LED Bulbs',
    action_description: 'Replace remaining incandescent bulbs in high-use household fixtures with LEDs.',
    predicted_impact_kgco2e_per_month: 12,
    effort_score: 1,
    confidence_score: 0.98,
    rationale_template: 'Based on your apartment/home electricity usage of {quantity} kWh, converting to LED lightbulbs will easily save 12 kg CO2e per month.',
    checkMatch: (logs) => {
      const elecLogs = logs.filter(l => l.category === 'electricity');
      const totalKwh = elecLogs.reduce((sum, l) => sum + Number(l.quantity), 0);
      return totalKwh > 100;
    }
  },
  {
    ruleId: 'rule-thermostat-setback',
    category: 'electricity',
    action_title: 'Lower Thermostat 2°F at Night',
    action_description: 'Lower your home heating thermostat setpoint by 2°F during winter sleeping hours.',
    predicted_impact_kgco2e_per_month: 28,
    effort_score: 1,
    confidence_score: 0.92,
    rationale_template: 'Based on your natural gas heating use, setting back temperatures at night saves 28 kg CO2e monthly.',
    checkMatch: (logs) => {
      return logs.some(l => l.category === 'electricity' && l.subcategory === 'Natural Gas Heating');
    }
  },
  {
    ruleId: 'rule-smart-power-strips',
    category: 'electricity',
    action_title: 'Install Smart Power Strips',
    action_description: 'Use smart strips to automatically shut off standby power to media systems and home office devices.',
    predicted_impact_kgco2e_per_month: 10,
    effort_score: 2,
    confidence_score: 0.90,
    rationale_template: 'Eliminating phantom loads for your residential load profile cuts about 10 kg CO2e per month.',
    checkMatch: (logs) => {
      const elecLogs = logs.filter(l => l.category === 'electricity' && l.subcategory === 'Grid Electricity');
      const totalKwh = elecLogs.reduce((sum, l) => sum + Number(l.quantity), 0);
      return totalKwh > 200;
    }
  },
  {
    ruleId: 'rule-community-solar',
    category: 'electricity',
    action_title: 'Opt-in to Community Solar',
    action_description: 'Enroll in a local community solar program to offset grid electricity with clean power.',
    predicted_impact_kgco2e_per_month: 75,
    effort_score: 2,
    confidence_score: 0.88,
    rationale_template: 'Subscribing your {quantity} kWh load to local solar replaces carbon-intensive grid fuels, saving 75 kg CO2e/month.',
    checkMatch: (logs, goals, profile) => {
      return profile && ['US-NW', 'US-NE', 'US-MW', 'US-CA'].includes(profile.electricity_grid_region);
    }
  },

  // 3. Food
  {
    ruleId: 'rule-meatless-monday',
    category: 'food',
    action_title: 'Adopt Meatless Mondays',
    action_description: 'Commit to fully vegetarian or vegan food for one day each week.',
    predicted_impact_kgco2e_per_month: 15,
    effort_score: 2,
    confidence_score: 0.90,
    rationale_template: 'Trading meat-heavy meals for plant-based ingredients one day a week saves approximately 15 kg CO2e monthly.',
    checkMatch: (logs) => {
      const foodLogs = logs.filter(l => l.category === 'food' && (l.subcategory.includes('Meat') || l.subcategory.includes('Flexitarian')));
      return foodLogs.length > 5;
    }
  },
  {
    ruleId: 'rule-poultry-swap',
    category: 'food',
    action_title: 'Swap Red Meat for Poultry',
    action_description: 'Replace beef or lamb portions with chicken, pork, or fish.',
    predicted_impact_kgco2e_per_month: 32,
    effort_score: 2,
    confidence_score: 0.85,
    rationale_template: 'Red meat has a high carbon intensity. Swapping beef for chicken/pork cuts your food footprint by 32 kg CO2e per month.',
    checkMatch: (logs) => {
      return logs.some(l => l.category === 'food' && l.subcategory.includes('Meat-Heavy'));
    }
  },
  {
    ruleId: 'rule-vegan-days',
    category: 'food',
    action_title: 'Go Vegan 3 Days/Week',
    action_description: 'Choose fully plant-based, dairy-free meals three days a week.',
    predicted_impact_kgco2e_per_month: 25,
    effort_score: 3,
    confidence_score: 0.88,
    rationale_template: 'Based on your vegetarian diet logs, taking the step to fully vegan meals 3 days a week offsets 25 kg CO2e/month.',
    checkMatch: (logs) => {
      return logs.some(l => l.category === 'food' && l.subcategory.includes('Vegetarian'));
    }
  },
  {
    ruleId: 'rule-meal-planning',
    category: 'food',
    action_title: 'Meal Planning to Reduce Waste',
    action_description: 'Plan weekly meals and buy groceries strictly matching recipes to reduce food waste.',
    predicted_impact_kgco2e_per_month: 10,
    effort_score: 1,
    confidence_score: 0.95,
    rationale_template: 'Reducing kitchen waste by planning household shopping offsets 10 kg CO2e monthly.',
    checkMatch: () => true // Always candidate
  },

  // 4. Shopping
  {
    ruleId: 'rule-thrift-clothes',
    category: 'shopping',
    action_title: 'Shop Secondhand & Thrift',
    action_description: 'Source clothing and household goods from thrift stores instead of buying new.',
    predicted_impact_kgco2e_per_month: 15,
    effort_score: 2,
    confidence_score: 0.90,
    rationale_template: 'Your discretionary retail logging shows potential. Thrifting saves raw materials, offsetting 15 kg CO2e/month.',
    checkMatch: (logs) => {
      const shopLogs = logs.filter(l => l.category === 'shopping');
      const spend = shopLogs.reduce((sum, l) => sum + Number(l.quantity), 0);
      return spend > 100;
    }
  },
  {
    ruleId: 'rule-avoid-packaging',
    category: 'shopping',
    action_title: 'Avoid Single-Use Packaging',
    action_description: 'Buy dry goods in bulk and avoid plastic-packaged consumer items.',
    predicted_impact_kgco2e_per_month: 6,
    effort_score: 2,
    confidence_score: 0.92,
    rationale_template: 'Avoiding single-use grocery packaging trims about 6 kg CO2e monthly.',
    checkMatch: () => true
  },
  {
    ruleId: 'rule-repair-items',
    category: 'shopping',
    action_title: 'Repair Before Buying New',
    action_description: 'Mend clothes, fix electronics, or repair furniture instead of buying replacements.',
    predicted_impact_kgco2e_per_month: 18,
    effort_score: 3,
    confidence_score: 0.85,
    rationale_template: 'Mending items extends product lifespans and prevents replacement carbon, saving 18 kg CO2e monthly.',
    checkMatch: (logs) => {
      const shopLogs = logs.filter(l => l.category === 'shopping' && !l.subcategory.includes('Thrift'));
      return shopLogs.length > 3;
    }
  },

  // 5. Flights
  {
    ruleId: 'rule-rail-swap',
    category: 'flights',
    action_title: 'Rail for Regional Trips',
    action_description: 'Take high-speed rail instead of short regional flights under 500 km.',
    predicted_impact_kgco2e_per_month: 120,
    effort_score: 3,
    confidence_score: 0.90,
    rationale_template: 'Your flights history indicates short trips. Taking high-speed rail instead of regional flights saves 120 kg CO2e/month.',
    checkMatch: (logs) => {
      return logs.some(l => l.category === 'flights' && l.subcategory.includes('Short-haul'));
    }
  },
  {
    ruleId: 'rule-video-conf',
    category: 'flights',
    action_title: 'Substitute Travel with Video Calls',
    action_description: 'Swap one long-distance business or personal flight per year with video meetings.',
    predicted_impact_kgco2e_per_month: 200,
    effort_score: 3,
    confidence_score: 0.95,
    rationale_template: 'Replacing one long-haul flight with video conferencing removes a massive 200 kg CO2e per month on average.',
    checkMatch: (logs) => {
      const flightLogs = logs.filter(l => l.category === 'flights');
      return flightLogs.length >= 2;
    }
  },
  {
    ruleId: 'rule-offset-flight',
    category: 'flights',
    action_title: 'Offset flight emissions',
    action_description: 'Purchase verified carbon offsets for flights you must take.',
    predicted_impact_kgco2e_per_month: 80,
    effort_score: 1,
    confidence_score: 0.80,
    rationale_template: 'Since you take flights, buying verified offsets neutralizes about 80 kg CO2e per month.',
    checkMatch: (logs) => {
      return logs.some(l => l.category === 'flights');
    }
  }
];

// Pure scoring function
export function scoreRecommendation(
  action: CandidateAction,
  activeGoals: Goal[],
  dismissedRecently: boolean
): number {
  const impact = action.predicted_impact_kgco2e_per_month;
  const effort = action.effort_score;
  
  // Goal alignment: bonus if action category aligns with active goals
  let goalAlignmentBonus = 0;
  const hasGoalCategory = activeGoals.some(g => {
    // If the goal target corresponds to reducing emissions overall, or in this specific category
    return g.status === 'on_track' || g.status === 'at_risk';
  });
  if (hasGoalCategory) {
    goalAlignmentBonus = 1.5; // Alignment bonus
  }

  const dismissedPenalty = dismissedRecently ? 3.0 : 0.0;

  const score = (impact * WEIGHTS.impact) 
              + ((6 - effort) * WEIGHTS.feasibility) 
              + (goalAlignmentBonus * WEIGHTS.goal) 
              - dismissedPenalty;

  return Number(score.toFixed(2));
}

// Generate, score, and rank recommendations
export function getRankedRecommendations(
  logs: ActivityLog[],
  goals: Goal[],
  profile: any,
  dismissedIds: string[] = []
): Array<Omit<CandidateAction, 'checkMatch' | 'rationale_template'> & { score: number; rationale: string }> {
  
  // Find matching candidates
  const matchingCandidates = RECOMMENDATION_RULES.filter(rule => 
    rule.checkMatch(logs, goals, profile)
  );

  // Score them
  const scored = matchingCandidates.map(rule => {
    const isDismissed = dismissedIds.includes(rule.ruleId);
    const score = scoreRecommendation(rule, goals, isDismissed);
    
    // Inject quantities in rationale template for traceability
    const categoryLogs = logs.filter(l => l.category === rule.category);
    const quantity = categoryLogs.length > 0 ? categoryLogs[0].quantity : 0;
    const rationale = rule.rationale_template.replace('{quantity}', String(quantity));

    return {
      ruleId: rule.ruleId,
      category: rule.category,
      action_title: rule.action_title,
      action_description: rule.action_description,
      predicted_impact_kgco2e_per_month: rule.predicted_impact_kgco2e_per_month,
      effort_score: rule.effort_score,
      confidence_score: rule.confidence_score,
      score,
      rationale
    };
  });

  // Rank by score descending
  return scored.sort((a, b) => b.score - a.score);
}
