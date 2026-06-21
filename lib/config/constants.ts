
/**
 * Carbon Twin scenario calculation weights and costs
 */
export const CARBON_TWIN_CONFIG = {
  MODERATE_ADOPTION_RATE: 0.50,
  COST_SAVINGS_MULTIPLIER: 0.45, // $0.45 saved per kg CO2e reduced
  SUSTAINABILITY_SCORE_WEIGHTS: {
    reduction: 0.50,
    breadth: 0.30,
    consistency: 0.20
  }
};

/**
 * Recommendation scoring weights
 */
export const RECOMMENDATION_CONFIG = {
  WEIGHTS: {
    impact: 0.5,
    feasibility: 0.3,
    goal: 0.2
  }
};

/**
 * Simulator multipliers for carbon footprint reductions
 */
export const SIMULATOR_CONFIG = {
  DRIVING_EMISSION_FACTOR: 0.18, // kg CO2e per km saved
  ELEC_EMISSION_FACTOR: 0.35,    // kg CO2e per kWh saved
  VEG_DAY_SAVINGS: 4.5          // kg CO2e saved per day swapping meat to veg
};

/**
 * Monthly seasonality multipliers (heating/cooling fluctuations)
 */
export const EMISSIONS_CONFIG = {
  SEASONALITY_FACTORS: {
    0: 1.15,  // Jan (High heating)
    1: 1.10,  // Feb (High heating)
    2: 0.95,  // Mar (Mild)
    3: 0.90,  // Apr (Mild)
    4: 0.90,  // May (Mild)
    5: 1.05,  // Jun (AC cooling)
    6: 1.12,  // Jul (AC cooling)
    7: 1.10,  // Aug (AC cooling)
    8: 0.90,  // Sep (Mild)
    9: 0.95,  // Oct (Mild)
    10: 1.05, // Nov (Heating starts)
    11: 1.15  // Dec (High heating/holiday)
  } as Record<number, number>
};
