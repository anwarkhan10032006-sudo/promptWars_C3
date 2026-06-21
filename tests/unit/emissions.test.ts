import { describe, it, expect } from 'vitest';
import { calculateEmissions, partitionLogsInto30DayBlocks, forecastNext30DayFootprint } from '../../lib/emissions';
import { ActivityLog } from '../../types';

describe('Emissions Math Engine', () => {
  it('calculates transportation emissions correctly (100km driving @ 0.18)', () => {
    const emissions = calculateEmissions('transportation', 'Petrol Car', 100);
    expect(emissions).toBe(18); // 100 * 0.18
  });

  it('calculates food emissions correctly (10 vegan days @ 1.5)', () => {
    const emissions = calculateEmissions('food', 'Vegan Meal', 10);
    expect(emissions).toBe(15); // 10 * 1.5
  });

  it('partitions logs into 30-day blocks correctly', () => {
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    
    // Create logs for each 30-day block
    const logs: ActivityLog[] = [
      { id: '1', user_id: 'u1', category: 'transportation', subcategory: 'Bus', quantity: 10, unit: 'km', occurred_at: new Date(now - 5 * dayMs).toISOString(), computed_emissions_kgco2e: 10, source: 'manual', created_at: '' },
      { id: '2', user_id: 'u1', category: 'transportation', subcategory: 'Bus', quantity: 10, unit: 'km', occurred_at: new Date(now - 40 * dayMs).toISOString(), computed_emissions_kgco2e: 20, source: 'manual', created_at: '' },
      { id: '3', user_id: 'u1', category: 'transportation', subcategory: 'Bus', quantity: 10, unit: 'km', occurred_at: new Date(now - 70 * dayMs).toISOString(), computed_emissions_kgco2e: 30, source: 'manual', created_at: '' }
    ];

    const [b1, b2, b3] = partitionLogsInto30DayBlocks(logs);
    
    expect(b1).toBe(10); // 0-30 days ago
    expect(b2).toBe(20); // 31-60 days ago
    expect(b3).toBe(30); // 61-90 days ago
  });

  it('forecasts using a weighted moving average (0.5, 0.3, 0.2)', () => {
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    
    // b1 = 100 (weight 0.5)
    // b2 = 80 (weight 0.3)
    // b3 = 60 (weight 0.2)
    // Expected: 100*0.5 + 80*0.3 + 60*0.2 = 50 + 24 + 12 = 86
    
    const logs: ActivityLog[] = [
      { id: '1', user_id: 'u1', category: 'transportation', subcategory: 'Bus', quantity: 10, unit: 'km', occurred_at: new Date(now - 10 * dayMs).toISOString(), computed_emissions_kgco2e: 100, source: 'manual', created_at: '' },
      { id: '2', user_id: 'u1', category: 'transportation', subcategory: 'Bus', quantity: 10, unit: 'km', occurred_at: new Date(now - 45 * dayMs).toISOString(), computed_emissions_kgco2e: 80, source: 'manual', created_at: '' },
      { id: '3', user_id: 'u1', category: 'transportation', subcategory: 'Bus', quantity: 10, unit: 'km', occurred_at: new Date(now - 75 * dayMs).toISOString(), computed_emissions_kgco2e: 60, source: 'manual', created_at: '' }
    ];

    const forecast = forecastNext30DayFootprint(logs);
    expect(forecast.forecasted).toBe(86);
    expect(forecast.lowerBound).toBeLessThan(86);
    expect(forecast.upperBound).toBeGreaterThan(86);
  });
});
