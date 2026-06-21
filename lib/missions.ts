import { Mission, MissionWeek, Recommendation } from '../types';

// Adaptive difficulty adjustment logic (deterministic state machine)
export function adjustNextWeekDifficulty(
  currentWeek: MissionWeek,
  nextWeek: MissionWeek,
  pool: Recommendation[]
): {
  adjustedWeek: MissionWeek;
  difficultyChanged: 'increased' | 'decreased' | 'unchanged';
  changedActionTitle?: string;
} {
  // Calculate completion rate of current week
  // 100% completed = 2/2, 50% = 1/2, 0% = 0/2
  // We assume status of the week is evaluated. If completed, it means both are done.
  // Let's pass the completion count of the current week:
  const completionRate = currentWeek.status === 'completed' ? 1.0 : 0.0; // Simplification or pass explicit count

  let difficultyChanged: 'increased' | 'decreased' | 'unchanged' = 'unchanged';
  let changedActionTitle: string | undefined;

  const adjustedWeek = { ...nextWeek };

  if (completionRate >= 0.80) {
    // Increase difficulty: Swap next week's primary action to a higher effort_score candidate if available
    const currentMaxEffort = Math.max(Number(currentWeek.difficulty));
    const higherEffortCandidates = pool.filter(r => r.effort_score > currentMaxEffort && r.status === 'active');
    
    if (higherEffortCandidates.length > 0) {
      // Sort by effort ascending to find the next step up
      higherEffortCandidates.sort((a, b) => a.effort_score - b.effort_score);
      const chosen = higherEffortCandidates[0];
      
      adjustedWeek.primary_recommendation_id = chosen.id;
      adjustedWeek.difficulty = chosen.effort_score;
      adjustedWeek.expected_reduction_kgco2e = Number((chosen.predicted_impact_kgco2e_per_month / 4).toFixed(1));
      
      difficultyChanged = 'increased';
      changedActionTitle = chosen.action_title;
    }
  } else if (completionRate < 0.40) {
    // Decrease difficulty: Swap next week's actions to lower effort_score + higher confidence_score candidates
    const currentMaxEffort = Math.max(Number(currentWeek.difficulty));
    const lowerEffortCandidates = pool.filter(r => r.effort_score < currentMaxEffort && r.status === 'active');
    
    if (lowerEffortCandidates.length > 0) {
      // Sort by confidence score descending to find the easiest, most reliable win
      lowerEffortCandidates.sort((a, b) => b.confidence_score - a.confidence_score);
      const chosen = lowerEffortCandidates[0];
      
      adjustedWeek.primary_recommendation_id = chosen.id;
      adjustedWeek.difficulty = chosen.effort_score;
      adjustedWeek.expected_reduction_kgco2e = Number((chosen.predicted_impact_kgco2e_per_month / 4).toFixed(1));
      
      difficultyChanged = 'decreased';
      changedActionTitle = chosen.action_title;
    }
  }

  return {
    adjustedWeek,
    difficultyChanged,
    changedActionTitle
  };
}

// Generate a new 4-week mission from active recommendations
export function generateMissionsForUser(
  userId: string,
  personaId: string,
  activeRecommendations: Recommendation[]
): { mission: Omit<Mission, 'id'>; weeks: Omit<MissionWeek, 'id' | 'mission_id'>[] } {
  

  // Group recommendations by effort to distribute over 4 weeks
  const sortedRecs = [...activeRecommendations].sort((a, b) => a.effort_score - b.effort_score);

  // We assign 2 recommendations per week (primary + secondary)
  // Week 1: Easiest (lowest effort)
  // Week 2: Medium-Low
  // Week 3: Medium-High
  // Week 4: Hardest
  const weeksData: Omit<MissionWeek, 'id' | 'mission_id'>[] = [];

  for (let w = 1; w <= 4; w++) {
    // Select primary and secondary recommendations
    const primaryIdx = Math.min(sortedRecs.length - 1, (w - 1) * 2);
    const secondaryIdx = Math.min(sortedRecs.length - 1, (w - 1) * 2 + 1);

    const primary = sortedRecs[primaryIdx] || { id: 'fallback-p-id', effort_score: 2, predicted_impact_kgco2e_per_month: 20 };
    const secondary = sortedRecs[secondaryIdx] || { id: 'fallback-s-id', effort_score: 2, predicted_impact_kgco2e_per_month: 12 };

    const avgDifficulty = Math.round((Number(primary.effort_score) + Number(secondary.effort_score)) / 2);
    const weeklyReduction = (Number(primary.predicted_impact_kgco2e_per_month) + Number(secondary.predicted_impact_kgco2e_per_month)) / 4;

    weeksData.push({
      week_number: w,
      primary_recommendation_id: primary.id,
      secondary_recommendation_id: secondary.id,
      expected_reduction_kgco2e: Number(weeklyReduction.toFixed(1)),
      difficulty: avgDifficulty,
      status: w === 1 ? 'active' : 'pending',
      completed_at: null
    });
  }

  // Calculate mission difficulty level (average of weeks)
  const difficultyLevel = Math.round(weeksData.reduce((sum, w) => sum + w.difficulty, 0) / 4);

  return {
    mission: {
      user_id: userId,
      persona_id: personaId,
      goal_id: null,
      start_date: new Date().toISOString().substring(0, 10),
      status: 'active',
      difficulty_level: difficultyLevel
    },
    weeks: weeksData
  };
}
