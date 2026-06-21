import { describe, it, expect } from 'vitest';
import { scoreRecommendation, getRankedRecommendations, RECOMMENDATION_RULES } from '../../lib/recommendations';
import { Goal, ActivityLog, UserProfile } from '../../types';

describe('Recommendations Engine', () => {
  const mockGoals: Goal[] = [
    {
      id: 'g1',
      user_id: 'u1',
      goal_type: 'footprint_reduction_pct',
      target_value: 15,
      target_unit: 'pct',
      start_date: '',
      target_date: '',
      current_progress: 0,
      status: 'on_track'
    }
  ];

  const mockProfile: UserProfile = {
    id: 'u1',
    email: 'john@example.com',
    full_name: 'John Doe',
    country_region: 'US',
    household_size: 2,
    home_type: 'apartment',
    electricity_grid_region: 'US-CA',
    is_demo: false,
    created_at: new Date().toISOString()
  };

  it('scores recommendations with correct weights and alignments', () => {
    const action = RECOMMENDATION_RULES.find(r => r.ruleId === 'rule-ev-swap')!;
    // impact = 120, effort = 4
    // score = (120 * 0.5) + ((6 - 4) * 0.3) + (1.5 * 0.2) - 0 = 60 + 0.6 + 0.3 = 60.9
    const score = scoreRecommendation(action, mockGoals, false);
    expect(score).toBe(60.9);
  });

  it('applies dismissed penalty to recommendation score', () => {
    const action = RECOMMENDATION_RULES.find(r => r.ruleId === 'rule-ev-swap')!;
    const scoreWithoutPenalty = scoreRecommendation(action, mockGoals, false);
    const scoreWithPenalty = scoreRecommendation(action, mockGoals, true);
    
    expect(scoreWithPenalty).toBe(scoreWithoutPenalty - 3.0);
  });

  it('filters and ranks candidate recommendations based on activity history', () => {
    // 200 km driving in Petrol Car matches EV Swap and transit rules
    const logs: ActivityLog[] = [
      {
        id: '1',
        user_id: 'u1',
        category: 'transportation',
        subcategory: 'Petrol Car',
        quantity: 200,
        unit: 'km',
        occurred_at: new Date().toISOString(),
        computed_emissions_kgco2e: 36,
        source: 'manual',
        created_at: ''
      }
    ];

    const ranked = getRankedRecommendations(logs, mockGoals, mockProfile);
    expect(ranked.length).toBeGreaterThan(0);
    // EV Swap should match since driving is > 150 km
    expect(ranked.some(r => r.ruleId === 'rule-ev-swap')).toBe(true);
    // The recommendations should be sorted by score descending
    for (let i = 0; i < ranked.length - 1; i++) {
      expect(ranked[i].score).toBeGreaterThanOrEqual(ranked[i + 1].score);
    }
  });
});
