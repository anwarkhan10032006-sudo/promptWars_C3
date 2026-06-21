import { SEED_EQUIVALENCE_FACTORS as mockEquivalenceFactors } from './demo/demo-seeds';

export interface EquivalenceResult {
  label: string;
  value: number;
  description: string;
  source_citation: string;
}

// Pure function to calculate equivalencies for a given CO2 footprint
export function calculateEquivalencies(kgco2e: number): Record<string, EquivalenceResult> {
  const result: Record<string, EquivalenceResult> = {};

  for (const factor of mockEquivalenceFactors) {
    const value = kgco2e / Number(factor.factor_kgco2e_per_unit);
    
    // Format description and labels nicely
    let desc = '';
    if (factor.label === 'car_km') {
      desc = `km driven in an average gasoline passenger vehicle`;
    } else if (factor.label === 'smartphone_charge') {
      desc = `smartphones charged from 0% to 100%`;
    } else if (factor.label === 'home_day_powered') {
      desc = `days of electricity use in a typical household`;
    } else if (factor.label === 'tree_year_absorption') {
      desc = `years of CO2 absorption by a mature urban tree`;
    } else {
      desc = factor.unit_description;
    }

    result[factor.label] = {
      label: factor.label,
      value: Number(value.toFixed(1)),
      description: desc,
      source_citation: factor.source_citation
    };
  }

  return result;
}

// Generate a random selection of 2-3 different stories (helpful for component variations)
export function getVariedEquivalenceStories(kgco2e: number, count: number = 3): EquivalenceResult[] {
  const equivalents = calculateEquivalencies(kgco2e);
  const items = Object.values(equivalents);
  
  // Sort randomly or by suitability based on magnitude
  // Capped at requested count
  return items.slice(0, count);
}
