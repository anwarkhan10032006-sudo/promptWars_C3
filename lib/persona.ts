import { PersonaKey, ActivityLog, Persona } from '../types';

export interface PersonaClassifierInput {
  userId: string;
  accountAgeDays: number;
  householdSize: number;
  logs: ActivityLog[];
  rolling30dEmissions: Record<string, number>;
  monthlyHistory: Array<{
    month: string;
    emissions: number;
    categories: Record<string, number>;
  }>;
}

// Ordered rules table metadata
export const PERSONA_METADATA = {
  green_starter: {
    name: 'The Green Starter',
    icon: 'Compass',
    color: '#10b981', // Emerald
    description: 'You are just beginning your climate footprint reduction journey. With low initial emissions, small changes make a big relative impact!',
    strengths: ['Low baseline emissions', 'Open to transit/cycling options'],
    opportunity_areas: ['Discretionary shopping choices', 'Adopting a more plant-based diet'],
    suggested_first_mission: 'Eco Commuter Kickoff'
  },
  climate_champion: {
    name: 'The Climate Champion',
    icon: 'Shield',
    color: '#0f6e4f', // Deep emerald
    description: 'You are leading by example, maintaining a highly optimized, low-emissions lifestyle with consistent monthly reductions.',
    strengths: ['Excellent habit consistency', 'Very low overall footprint', 'Eco-friendly transit choices'],
    opportunity_areas: ['Advocacy and cohort leadership', 'Addressing tiny remaining margins'],
    suggested_first_mission: 'Zero Waste Hero'
  },
  frequent_flyer: {
    name: 'The Frequent Flyer',
    icon: 'Plane',
    color: '#0891b2', // Cyan
    description: 'A large portion of your footprint is driven by air travel. Reducing flight frequencies or opting for high-speed rail will yield your biggest carbon wins.',
    strengths: ['Efficient residential profile', 'High potential for offset impact'],
    opportunity_areas: ['High flight emissions', 'Commutes to airport via taxi/rideshare'],
    suggested_first_mission: 'Flight Offset & Reduction'
  },
  daily_driver: {
    name: 'The Daily Driver',
    icon: 'Car',
    color: '#2563eb', // Blue
    description: 'Daily commuting in a combustion vehicle represents your largest carbon footprint category. Swapping to transit or carpooling will significantly lower your impact.',
    strengths: ['Predictable daily commute data', 'Clear pathways to optimize transit'],
    opportunity_areas: ['High petrol car commuting emissions', 'Low transit utilization'],
    suggested_first_mission: 'Bicycle Commuter Kickoff'
  },
  hidden_emitter: {
    name: 'The Hidden Emitter',
    icon: 'EyeOff',
    color: '#7c3aed', // Purple
    description: 'Your overall footprint is low, but you have a single disproportionately high category (like electricity or meat consumption) that spikes your numbers.',
    strengths: ['Low overall average emissions', 'Strong performance in most areas'],
    opportunity_areas: ['Single-category emission spikes', 'Vampire loads or red meat consumption'],
    suggested_first_mission: 'Meatless Mondays'
  },
  energy_explorer: {
    name: 'The Energy Explorer',
    icon: 'Zap',
    color: '#e2a33b', // Warm Amber
    description: 'Household utility bills are your largest source of emissions, but you are actively exploring community solar and energy efficiency upgrades to trim the fat.',
    strengths: ['Proactive home tariff updates', 'Improving utility trends'],
    opportunity_areas: ['High baseline grid electricity use', 'Vampire loads and heating'],
    suggested_first_mission: 'Energy Efficiency Blitz'
  },
  household_optimizer: {
    name: 'The Household Optimizer',
    icon: 'Users',
    color: '#ec4899', // Pink
    description: 'Managing emissions for a multi-person household means bulk food prep, smart heating controls, and shared resources are your highest leverage levers.',
    strengths: ['Collaborative household efforts', 'Bulk purchase optimizations'],
    opportunity_areas: ['High utility usage', 'Bulk food waste risks'],
    suggested_first_mission: 'Energy Efficiency Blitz'
  },
  conscious_commuter: {
    name: 'The Conscious Commuter',
    icon: 'Leaf',
    color: '#64748b', // Slate
    description: 'You maintain a balanced, conscious lifestyle with no major category spikes. Small adjustments across all categories will keep you moving forward.',
    strengths: ['Balanced carbon profile', 'No major single-category spikes'],
    opportunity_areas: ['Finding final efficiency margins in shopping/food'],
    suggested_first_mission: 'Meatless Mondays'
  }
};

/**
 * Pure engine classifying the user into one of 8 distinct archetypes.
 * 
 * Rules Precedence Hierarchy:
 * 1. Green Starter (Age < 14 days)
 * 2. Climate Champion (3+ consecutive months of carbon footprint reduction >= 10%)
 * 3. Frequent Flyer (flights YTD >= 3 and flights share > 40%)
 * 4. Daily Driver (transportation share > 50% and primary_mode = petrol_car)
 * 5. Hidden Emitter (overall footprint < 250 and has 1+ category > 50%)
 * 6. Energy Explorer (electricity is highest category and trending down >= 2 months)
 * 7. Household Optimizer (household size > 1 and shared resources food/elec improving)
 * 8. Conscious Commuter (Default fallback; balanced carbon profile)
 * 
 * @param input - The detailed metrics including account age, logs, trends, and history.
 * @returns The classified PersonaKey identifier.
 */
export function classifyUserPersona(input: PersonaClassifierInput): PersonaKey {
  const { accountAgeDays, householdSize, logs, rolling30dEmissions, monthlyHistory } = input;

  const totalEmissions = Object.values(rolling30dEmissions).reduce((sum, v) => sum + v, 0);

  // Helper: Get share of category in rolling 30d
  const getShare = (category: string) => {
    if (totalEmissions <= 0) return 0;
    return (rolling30dEmissions[category] || 0) / totalEmissions;
  };

  // Rule 1: New Account (Account age < 14 days)
  if (accountAgeDays < 14) {
    return 'green_starter';
  }

  // Rule 2: Climate Champion (3+ consecutive months of footprint reduction >= 10%)
  if (monthlyHistory.length >= 4) {
    const last3Mo = monthlyHistory.slice(-3);
    const checks = last3Mo.map((hist, idx) => {
      const prevEmissions = idx === 0 
        ? monthlyHistory[monthlyHistory.length - 4].emissions 
        : last3Mo[idx - 1].emissions;
      if (prevEmissions <= 0) return false;
      const reduction = (prevEmissions - hist.emissions) / prevEmissions;
      return reduction >= 0.10; // MoM reduction >= 10%
    });
    if (checks.every(c => c === true)) {
      return 'climate_champion';
    }
  }

  // Rule 3: Frequent Flyer (flights YTD >= 3 and flights share > 40%)
  const longHaulCount = logs.filter(
    l => l.category === 'flights' && l.subcategory.includes('Long-haul')
  ).length;
  if (longHaulCount >= 3 && getShare('flights') > 0.40) {
    return 'frequent_flyer';
  }

  // Rule 4: Daily Driver (transportation share > 50% and primary_mode = petrol_car)
  const petrolCarLogs = logs.filter(l => l.category === 'transportation' && l.subcategory === 'Petrol Car');
  const petrolCarKm = petrolCarLogs.reduce((sum, l) => sum + Number(l.quantity), 0);
  const totalCommuteKm = logs.filter(l => l.category === 'transportation').reduce((sum, l) => sum + Number(l.quantity), 0);
  
  const primaryIsPetrol = totalCommuteKm > 0 && (petrolCarKm / totalCommuteKm) > 0.50;
  if (getShare('transportation') > 0.50 && primaryIsPetrol) {
    return 'daily_driver';
  }

  // Rule 5: Hidden Emitter (overall footprint < 250 and has 1+ disproportionately high category)
  // We check if total emissions is low, but one category is > 50% of the footprint
  const hasSpikeCategory = Object.keys(rolling30dEmissions).some(cat => getShare(cat) > 0.50);
  if (totalEmissions > 0 && totalEmissions < 250 && hasSpikeCategory) {
    return 'hidden_emitter';
  }

  // Rule 6: Energy Explorer (electricity is highest category and trending down >= 2 months)
  const highestCategory = Object.keys(rolling30dEmissions).reduce((a, b) => 
    (rolling30dEmissions[a] || 0) > (rolling30dEmissions[b] || 0) ? a : b, 
    'transportation'
  );
  if (highestCategory === 'electricity' && monthlyHistory.length >= 3) {
    const last2Mo = monthlyHistory.slice(-2);
    const trendDown = last2Mo[1].categories['electricity'] < last2Mo[0].categories['electricity'] &&
                      last2Mo[0].categories['electricity'] < monthlyHistory[monthlyHistory.length - 3].categories['electricity'];
    if (trendDown) {
      return 'energy_explorer';
    }
  }

  // Rule 7: Household Optimizer (household size > 1 and shared resources food/elec improving)
  if (householdSize > 1 && monthlyHistory.length >= 2) {
    const currentShared = (rolling30dEmissions['electricity'] || 0) + (rolling30dEmissions['food'] || 0);
    const prev = monthlyHistory[monthlyHistory.length - 2];
    const prevShared = (prev.categories['electricity'] || 0) + (prev.categories['food'] || 0);
    if (currentShared < prevShared) {
      return 'household_optimizer';
    }
  }

  // Rule 8: Default (Conscious Commuter)
  return 'conscious_commuter';
}

/**
 * Evaluates the user's current persona based on historical activity logs only.
 * This is used for testing and offline profiling of session logs.
 * 
 * @param logs - The array of activity logs.
 * @returns A Persona object resolved with metadata.
 */
export function evaluatePersona(logs: ActivityLog[]): Persona {
  let persona_key: PersonaKey = 'green_starter';

  const longHaulCount = logs.filter(
    l => l.category === 'flights' && l.subcategory.includes('Long-haul')
  ).length;

  const petrolCarLogs = logs.filter(l => l.category === 'transportation' && l.subcategory === 'Petrol Car');
  const petrolCarKm = petrolCarLogs.reduce((sum, l) => sum + Number(l.quantity), 0);
  const totalCommuteKm = logs.filter(l => l.category === 'transportation').reduce((sum, l) => sum + Number(l.quantity), 0);

  if (longHaulCount > 0) {
    persona_key = 'frequent_flyer';
  } else if (petrolCarKm > 0 && petrolCarKm > totalCommuteKm * 0.5) {
    persona_key = 'daily_driver';
  }

  const meta = PERSONA_METADATA[persona_key];

  const strengths = [...meta.strengths];
  if (persona_key === 'frequent_flyer' && !strengths.includes('Global mobility and impact awareness')) {
    strengths.push('Global mobility and impact awareness');
  }

  const opportunity_areas = [...meta.opportunity_areas];
  if (persona_key === 'daily_driver' && !opportunity_areas.includes('transportation')) {
    opportunity_areas.push('transportation');
  }

  // Generate a valid v4 UUID for schema compliance
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });

  return {
    id: uuid,
    user_id: logs[0]?.user_id || '00000000-0000-0000-0000-000000000000',
    persona_key,
    persona_description: meta.description,
    strengths,
    opportunity_areas,
    suggested_first_mission: meta.suggested_first_mission,
    assigned_at: new Date().toISOString(),
    is_current: true
  };
}

