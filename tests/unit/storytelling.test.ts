import { describe, it, expect } from 'vitest';
import { calculateEquivalencies, getVariedEquivalenceStories } from '../../lib/storytelling';

describe('Storytelling Equivalencies Engine', () => {
  it('converts carbon values to correct smartphone charges', () => {
    // factor_kgco2e_per_unit = 0.008
    // 8.0 kg CO2e / 0.008 = 1000 charges
    const result = calculateEquivalencies(8.0);
    
    expect(result.smartphone_charge).toBeDefined();
    expect(result.smartphone_charge.value).toBe(1000);
    expect(result.smartphone_charge.description).toContain('smartphones charged');
  });

  it('converts carbon values to correct car km driven', () => {
    // factor_kgco2e_per_unit = 0.18
    // 18 kg CO2e / 0.18 = 100 km
    const result = calculateEquivalencies(18);

    expect(result.car_km).toBeDefined();
    expect(result.car_km.value).toBe(100);
    expect(result.car_km.description).toContain('km driven');
  });

  it('retrieves capped number of stories', () => {
    const stories = getVariedEquivalenceStories(50, 2);
    expect(stories.length).toBe(2);
  });
});
