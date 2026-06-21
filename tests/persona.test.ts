import { describe, it, expect } from 'vitest';
import { evaluatePersona } from '../lib/persona';
import { ActivityLog } from '../types';

describe('Persona Classification Engine', () => {
  it('classifies Frequent Flyer if long-haul flights exist', () => {
    const logs: ActivityLog[] = [
      { id: '1', user_id: 'u1', category: 'flights', subcategory: 'Long-haul Flight', quantity: 1, unit: 'flight', occurred_at: new Date().toISOString(), computed_emissions_kgco2e: 1200, source: 'manual', created_at: '' }
    ];
    
    const persona = evaluatePersona(logs);
    expect(persona.persona_key).toBe('frequent_flyer');
    expect(persona.strengths).toContain('Global mobility and impact awareness');
  });

  it('classifies Daily Driver if petrol car commutes dominate', () => {
    const logs: ActivityLog[] = [
      { id: '2', user_id: 'u1', category: 'transportation', subcategory: 'Petrol Car', quantity: 300, unit: 'km', occurred_at: new Date().toISOString(), computed_emissions_kgco2e: 54, source: 'manual', created_at: '' }
    ];
    
    const persona = evaluatePersona(logs);
    expect(persona.persona_key).toBe('daily_driver');
    expect(persona.opportunity_areas).toContain('transportation');
  });

  it('defaults to Green Starter if footprint is low or empty', () => {
    const logs: ActivityLog[] = [];
    
    const persona = evaluatePersona(logs);
    expect(persona.persona_key).toBe('green_starter');
  });
});
