import { describe, it, expect } from 'vitest';
import { generateMissionsForUser, adjustNextWeekDifficulty } from '../../lib/missions';
import { Recommendation, MissionWeek } from '../../types';

describe('Adaptive Mission Engine', () => {
  const mockRecs: Recommendation[] = [
    {
      id: 'rec-1',
      user_id: 'u1',
      category: 'electricity',
      action_title: 'LED Bulbs',
      action_description: '',
      predicted_impact_kgco2e_per_month: 12,
      effort_score: 1,
      confidence_score: 0.98,
      rationale_text: '',
      rationale_data_points: {},
      status: 'active',
      generated_at: '',
      expires_at: ''
    },
    {
      id: 'rec-2',
      user_id: 'u1',
      category: 'food',
      action_title: 'Meatless Mondays',
      action_description: '',
      predicted_impact_kgco2e_per_month: 15,
      effort_score: 2,
      confidence_score: 0.90,
      rationale_text: '',
      rationale_data_points: {},
      status: 'active',
      generated_at: '',
      expires_at: ''
    },
    {
      id: 'rec-3',
      user_id: 'u1',
      category: 'shopping',
      action_title: 'Thrift Clothes',
      action_description: '',
      predicted_impact_kgco2e_per_month: 15,
      effort_score: 2,
      confidence_score: 0.92,
      rationale_text: '',
      rationale_data_points: {},
      status: 'active',
      generated_at: '',
      expires_at: ''
    },
    {
      id: 'rec-4',
      user_id: 'u1',
      category: 'transportation',
      action_title: 'Carpool',
      action_description: '',
      predicted_impact_kgco2e_per_month: 25,
      effort_score: 2,
      confidence_score: 0.85,
      rationale_text: '',
      rationale_data_points: {},
      status: 'active',
      generated_at: '',
      expires_at: ''
    },
    {
      id: 'rec-5',
      user_id: 'u1',
      category: 'transportation',
      action_title: 'EV Swap',
      action_description: '',
      predicted_impact_kgco2e_per_month: 120,
      effort_score: 4,
      confidence_score: 0.90,
      rationale_text: '',
      rationale_data_points: {},
      status: 'active',
      generated_at: '',
      expires_at: ''
    }
  ];

  it('generates a 4-week mission distributing actions by effort', () => {
    const result = generateMissionsForUser('u1', 'p1', mockRecs);
    expect(result.mission).toBeDefined();
    expect(result.weeks.length).toBe(4);

    // Week 1 should be easiest (lowest effort)
    const w1 = result.weeks[0];
    const w4 = result.weeks[3];
    expect(w1.difficulty).toBeLessThanOrEqual(w4.difficulty);
  });

  it('increases next week difficulty if previous week is fully completed', () => {
    const currentWeek: MissionWeek = {
      id: 'cw-1',
      mission_id: 'm1',
      week_number: 1,
      primary_recommendation_id: 'rec-2',
      secondary_recommendation_id: 'rec-3',
      expected_reduction_kgco2e: 10,
      difficulty: 2,
      status: 'completed',
      completed_at: null
    };

    const nextWeek: MissionWeek = {
      id: 'cw-2',
      mission_id: 'm1',
      week_number: 2,
      primary_recommendation_id: 'rec-3',
      secondary_recommendation_id: 'rec-4',
      expected_reduction_kgco2e: 10,
      difficulty: 2,
      status: 'active',
      completed_at: null
    };

    const result = adjustNextWeekDifficulty(currentWeek, nextWeek, mockRecs);
    expect(result.difficultyChanged).toBe('increased');
    expect(result.adjustedWeek.difficulty).toBe(4); // swapped with EV Swap (effort 4)
    expect(result.adjustedWeek.primary_recommendation_id).toBe('rec-5');
  });

  it('decreases next week difficulty if previous week was missed/active (completion rate < 40%)', () => {
    const currentWeek: MissionWeek = {
      id: 'cw-1',
      mission_id: 'm1',
      week_number: 1,
      primary_recommendation_id: 'rec-5', // difficulty 4
      secondary_recommendation_id: 'rec-3',
      expected_reduction_kgco2e: 10,
      difficulty: 4,
      status: 'active', // not completed
      completed_at: null
    };

    const nextWeek: MissionWeek = {
      id: 'cw-2',
      mission_id: 'm1',
      week_number: 2,
      primary_recommendation_id: 'rec-5',
      secondary_recommendation_id: 'rec-4',
      expected_reduction_kgco2e: 10,
      difficulty: 4,
      status: 'active',
      completed_at: null
    };

    const result = adjustNextWeekDifficulty(currentWeek, nextWeek, mockRecs);
    expect(result.difficultyChanged).toBe('decreased');
    expect(result.adjustedWeek.difficulty).toBe(1); // swapped with easiest high-confidence winner (rec-1, effort 1)
  });
});
