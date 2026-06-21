'use server';

import { getSessionId, createUserProfile, insertActivityLog, insertGoal, getUserProfile } from '../../lib/db';
import { calculateEmissions } from '../../lib/emissions';
import { Goal } from '../../types';

export async function finishOnboardingAction(data: {
  region: string;
  householdSize: number;
  homeType: string;
  commuteMode: string;
  commuteDistance: number;
  selectedGoalPct: number;
}) {
  const sessId = await getSessionId();
  const profileId = `user-${sessId}`;

  const existingProfile = await getUserProfile(profileId);

  const profile = {
    id: profileId,
    email: existingProfile?.email || 'user@verdance.local',
    full_name: existingProfile?.full_name || 'Eco Explorer',
    country_region: data.region,
    household_size: data.householdSize,
    home_type: data.homeType,
    electricity_grid_region: data.region,
    is_demo: false
  };
  await createUserProfile(profile);

  await insertActivityLog(profileId, {
    user_id: profileId,
    category: 'transportation',
    subcategory: data.commuteMode,
    quantity: data.commuteDistance,
    unit: 'km',
    occurred_at: new Date().toISOString(),
    computed_emissions_kgco2e: calculateEmissions('transportation', data.commuteMode, data.commuteDistance),
    source: 'manual'
  });

  const targetGoal: Omit<Goal, 'id'> = {
    user_id: profileId,
    goal_type: 'footprint_reduction_pct',
    target_value: data.selectedGoalPct,
    target_unit: '%',
    start_date: new Date().toISOString().substring(0, 10),
    target_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
    current_progress: 0,
    status: 'on_track'
  };
  await insertGoal(profileId, targetGoal);
  
  return true;
}
