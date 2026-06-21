import { describe, it, expect } from 'vitest';
import { 
  getFallbackRecommendationRationale, 
  getFallbackWeeklyReport, 
  getFallbackTwinNarrative, 
  getFallbackCopilotReply,
  CopilotDataContext
} from '../../lib/ai-gateway';

describe('AI Gateway Offline Fallbacks', () => {
  it('generates a correct rationale fallback', () => {
    const text = getFallbackRecommendationRationale('Upgrade LED', 12, 'electricity');
    expect(text).toContain('Upgrade LED');
    expect(text).toContain('12 kg CO2e');
    expect(text).toContain('electricity');
  });

  it('generates a weekly report narrative for positive savings', () => {
    const text = getFallbackWeeklyReport({
      userId: 'u1',
      totalEmissions: 100,
      savings: 20,
      deltaPct: 15,
      highlight: 'Adopted Meatless Mondays'
    });
    expect(text).toContain('reduced your carbon footprint by 20 kg');
    expect(text).toContain('Adopted Meatless Mondays');
  });

  it('generates a carbon twin scenario narrative', () => {
    const text = getFallbackTwinNarrative('aggressive', 25, 90, 45);
    expect(text).toContain('stellar 25% carbon reduction');
    expect(text).toContain('90/100');
    expect(text).toContain('$45');
  });

  it('handles copilot queries correctly via rule-based fallbacks', () => {
    const mockContext: CopilotDataContext = {
      profile: {
        id: 'u1',
        email: 'test@example.com',
        full_name: 'Test User',
        country_region: 'US',
        household_size: 1,
        home_type: 'house',
        electricity_grid_region: 'US-NE',
        is_demo: true,
        created_at: ''
      },
      activity_logs: [
        {
          id: 'log-1',
          user_id: 'u1',
          category: 'transportation',
          subcategory: 'Petrol Car',
          quantity: 100,
          unit: 'km',
          occurred_at: new Date().toISOString(),
          computed_emissions_kgco2e: 18,
          source: 'manual',
          created_at: ''
        }
      ],
      goals: [],
      habits: [],
      persona: {
        id: 'p1',
        user_id: 'u1',
        persona_key: 'green_starter',
        persona_description: 'Green Starter',
        strengths: ['Low energy consumption'],
        opportunity_areas: ['transportation'],
        suggested_first_mission: '',
        assigned_at: '',
        is_current: true
      },
      carbon_twin_projections: [],
      active_mission: null
    };

    const reply = getFallbackCopilotReply('What is my persona?', mockContext);
    expect(reply).toContain('Green Starter');
    expect(reply).toContain('Low energy consumption');
  });
});
