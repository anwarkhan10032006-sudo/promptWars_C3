import { supabase } from './supabase';
import { getSessionState, updateSessionState, deleteSessionState, mockEmissionFactors, mockCostFactors, mockEquivalenceFactors, mockChallenges } from './mockDb';
import { 
  UserProfile, ActivityLog, Goal, Habit, WeeklyReport, Persona, 
  PersonaHistory, CarbonTwinProjection, Mission, MissionWeek, UserChallenge, DemoSlug 
} from '../types';
import { cookies } from 'next/headers';

// Helper to get or generate the session ID from cookies
export async function getSessionId(): Promise<string> {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('verdance_session_id')?.value;
    if (!sessionId) {
      return 'default-session';
    }
    return sessionId;
  } catch (err) {
    // Fallback when headers are not available (e.g. static generation or test environment)
    return 'default-session';
  }
}

// Check if we should use Mock DB
export function isMockMode(userId?: string): boolean {
  if (!supabase) {
    return true;
  }
  // If the userId starts with 'user-' (indicating a demo session) or if is explicitly requested, use mock
  if (userId && (userId.startsWith('user-') || userId === 'default-session')) {
    return true;
  }
  return false;
}

// Log once about mock mode
let hasLoggedMock = false;
function logMockMode() {
  if (!hasLoggedMock) {
    console.log('\n=========================================');
    console.log('  MOCK MODE — not for production         ');
    console.log('  Isolated Local Database Active         ');
    console.log('=========================================\n');
    hasLoggedMock = true;
  }
}

// --- Unified DB Operations ---

// Users (Profile)
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  if (isMockMode(userId)) {
    logMockMode();
    const state = getSessionState(await getSessionId());
    return state.profile;
  }

  const { data, error } = await supabase!
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) return null;
  return data;
}

export async function createUserProfile(profile: Omit<UserProfile, 'created_at'>): Promise<UserProfile> {
  const newProfile = { ...profile, created_at: new Date().toISOString() };
  if (isMockMode(profile.id)) {
    updateSessionState(await getSessionId(), state => {
      state.profile = newProfile;
    });
    return newProfile;
  }

  const { data, error } = await supabase!
    .from('users')
    .insert([newProfile])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// Activity Logs
export async function getActivityLogs(userId: string): Promise<ActivityLog[]> {
  if (isMockMode(userId)) {
    const state = getSessionState(await getSessionId());
    return state.activity_logs.sort((a, b) => b.occurred_at.localeCompare(a.occurred_at));
  }

  const { data, error } = await supabase!
    .from('activity_logs')
    .select('*')
    .eq('user_id', userId)
    .order('occurred_at', { ascending: false });

  if (error) return [];
  return data;
}

export async function insertActivityLog(userId: string, log: Omit<ActivityLog, 'id' | 'created_at'>): Promise<ActivityLog> {
  const newLog: ActivityLog = {
    ...log,
    id: `log-${Math.random().toString(36).substring(2, 9)}`,
    created_at: new Date().toISOString()
  };

  if (isMockMode(userId)) {
    updateSessionState(await getSessionId(), state => {
      state.activity_logs.push(newLog);
    });
    return newLog;
  }

  const { data, error } = await supabase!
    .from('activity_logs')
    .insert([log])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// Factors (Read-only)
export async function getEmissionFactors() {
  if (!supabase) return mockEmissionFactors;
  const { data } = await supabase.from('emission_factors').select('*');
  return data || mockEmissionFactors;
}

export async function getCostFactors() {
  if (!supabase) return mockCostFactors;
  const { data } = await supabase.from('cost_factors').select('*');
  return data || mockCostFactors;
}

export async function getEquivalenceFactors() {
  if (!supabase) return mockEquivalenceFactors;
  const { data } = await supabase.from('equivalence_factors').select('*');
  return data || mockEquivalenceFactors;
}

// Recommendations
export async function getRecommendations(userId: string): Promise<any[]> {
  if (isMockMode(userId)) {
    const state = getSessionState(await getSessionId());
    if ((state as any).recommendations && (state as any).recommendations.length > 0) {
      return (state as any).recommendations;
    }
    // Generate dynamically if empty
    const { getRankedRecommendations } = require('./recommendations');
    const ranked = getRankedRecommendations(state.activity_logs, state.goals, state.profile);
    const recs = ranked.map((r: any) => ({
      id: `rec-${Math.random().toString(36).substring(2, 9)}`,
      user_id: userId,
      category: r.category,
      action_title: r.action_title,
      action_description: r.action_description,
      predicted_impact_kgco2e_per_month: r.predicted_impact_kgco2e_per_month,
      effort_score: r.effort_score,
      confidence_score: r.confidence_score,
      rationale_text: r.rationale,
      rationale_data_points: { qty: 1 },
      status: 'active',
      generated_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    }));
    // Save to state
    updateSessionState(await getSessionId(), s => {
      (s as any).recommendations = recs;
    });
    return recs;
  }
  const { data } = await supabase!.from('recommendations').select('*').eq('user_id', userId);
  return data || [];
}

export async function updateRecommendationStatus(userId: string, recId: string, status: 'active' | 'accepted' | 'dismissed' | 'completed'): Promise<any> {
  if (isMockMode(userId)) {
    let updated: any = null;
    updateSessionState(await getSessionId(), state => {
      const recs = (state as any).recommendations || [];
      const idx = recs.findIndex((r: any) => r.id === recId);
      if (idx !== -1) {
        recs[idx].status = status;
        updated = recs[idx];
      }
    });
    if (!updated) throw new Error('Recommendation not found');
    return updated;
  }
  const { data, error } = await supabase!
    .from('recommendations')
    .update({ status })
    .eq('id', recId)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

// Goals
export async function getGoals(userId: string): Promise<Goal[]> {
  if (isMockMode(userId)) {
    const state = getSessionState(await getSessionId());
    return state.goals;
  }
  const { data } = await supabase!.from('goals').select('*').eq('user_id', userId);
  return data || [];
}

export async function insertGoal(userId: string, goal: Omit<Goal, 'id'>): Promise<Goal> {
  const newGoal: Goal = {
    ...goal,
    id: `goal-${Math.random().toString(36).substring(2, 9)}`
  };
  if (isMockMode(userId)) {
    updateSessionState(await getSessionId(), state => {
      state.goals.push(newGoal);
    });
    return newGoal;
  }
  const { data, error } = await supabase!.from('goals').insert([goal]).select().single();
  if (error) throw new Error(error.message);
  return data;
}

// Habits
export async function getHabits(userId: string): Promise<Habit[]> {
  if (isMockMode(userId)) {
    const state = getSessionState(await getSessionId());
    return state.habits;
  }
  const { data } = await supabase!.from('habits').select('*').eq('user_id', userId);
  return data || [];
}

export async function completeHabit(userId: string, habitId: string): Promise<Habit> {
  if (isMockMode(userId)) {
    let updated: Habit | null = null;
    updateSessionState(await getSessionId(), state => {
      const idx = state.habits.findIndex(h => h.id === habitId);
      if (idx !== -1) {
        state.habits[idx].streak_count += 1;
        state.habits[idx].last_completed_at = new Date().toISOString();
        updated = state.habits[idx];
      }
    });
    if (!updated) throw new Error('Habit not found');
    return updated;
  }

  // Get current habit
  const { data: current } = await supabase!.from('habits').select('*').eq('id', habitId).single();
  const nextStreak = (current?.streak_count || 0) + 1;
  const { data, error } = await supabase!
    .from('habits')
    .update({ streak_count: nextStreak, last_completed_at: new Date().toISOString() })
    .eq('id', habitId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// Challenges
export async function getChallenges() {
  if (!supabase) return mockChallenges;
  const { data } = await supabase.from('challenges').select('*');
  return data || mockChallenges;
}

export async function getUserChallenges(userId: string): Promise<UserChallenge[]> {
  if (isMockMode(userId)) {
    const state = getSessionState(await getSessionId());
    return state.user_challenges;
  }
  const { data } = await supabase!.from('user_challenges').select('*').eq('user_id', userId);
  return data || [];
}

export async function joinChallenge(userId: string, challengeId: string): Promise<UserChallenge> {
  const newUc: UserChallenge = {
    id: `uc-${Math.random().toString(36).substring(2, 9)}`,
    user_id: userId,
    challenge_id: challengeId,
    status: 'joined',
    progress: 0,
    joined_at: new Date().toISOString(),
    opted_into_leaderboard: true
  };
  if (isMockMode(userId)) {
    updateSessionState(await getSessionId(), state => {
      state.user_challenges.push(newUc);
    });
    return newUc;
  }
  const { data, error } = await supabase!.from('user_challenges').insert([newUc]).select().single();
  if (error) throw new Error(error.message);
  return data;
}

// Weekly Reports
export async function getWeeklyReports(userId: string): Promise<WeeklyReport[]> {
  if (isMockMode(userId)) {
    const state = getSessionState(await getSessionId());
    return state.weekly_reports;
  }
  const { data } = await supabase!.from('weekly_reports').select('*').eq('user_id', userId);
  return data || [];
}

// Persona
export async function getPersona(userId: string): Promise<Persona | null> {
  if (isMockMode(userId)) {
    const state = getSessionState(await getSessionId());
    return state.personas.find(p => p.is_current) || null;
  }
  const { data, error } = await supabase!
    .from('personas')
    .select('*')
    .eq('user_id', userId)
    .eq('is_current', true)
    .single();
  if (error) return null;
  return data;
}

// Carbon Twin Projections
export async function getCarbonTwinProjections(userId: string): Promise<CarbonTwinProjection[]> {
  if (isMockMode(userId)) {
    const state = getSessionState(await getSessionId());
    return state.carbon_twin_projections;
  }
  const { data } = await supabase!.from('carbon_twin_projections').select('*').eq('user_id', userId);
  return data || [];
}

// Missions
export async function getMissions(userId: string): Promise<Mission[]> {
  let missions: Mission[] = [];
  if (isMockMode(userId)) {
    const state = getSessionState(await getSessionId());
    missions = state.missions;
  } else {
    const { data } = await supabase!.from('missions').select('*').eq('user_id', userId);
    missions = data || [];
  }

  return missions.map(m => ({
    ...m,
    title: m.title || `30-Day Reduction Sprint (Tier ${m.difficulty_level})`,
    description: m.description || `Focus on category-specific swaps to lower your footprint by ${m.difficulty_level * 5}%.`,
    current_streak: m.current_streak !== undefined ? m.current_streak : 12
  }));
}

export async function getMissionWeeks(userId: string, missionId: string): Promise<MissionWeek[]> {
  let weeks: MissionWeek[] = [];
  if (isMockMode(userId)) {
    const state = getSessionState(await getSessionId());
    weeks = state.mission_weeks.filter(w => w.mission_id === missionId);
  } else {
    const { data } = await supabase!.from('mission_weeks').select('*').eq('mission_id', missionId);
    weeks = data || [];
  }

  // Get recommendations to resolve titles
  const recs = await getRecommendations(userId);
  const recMap = new Map(recs.map(r => [r.id, r]));

  // Default fallbacks for demo / offline safety
  const defaultTasks: Record<number, string[]> = {
    1: ['Bicycle or Walk Short Trips', 'Adopt Meatless Mondays'],
    2: ['Opt-in to Community Solar', 'Use Cold Wash for Laundry'],
    3: ['Install Smart Thermostat', 'Reduce Meat consumption'],
    4: ['Unplug Vampire Electronics', 'Shop at Thrift Stores']
  };

  return weeks.map(w => {
    const prim = recMap.get(w.primary_recommendation_id);
    const sec = recMap.get(w.secondary_recommendation_id);
    
    const weekDefaults = defaultTasks[w.week_number] || ['Reduce driving by 10km', 'Reduce home electricity'];

    const items = [
      {
        task_description: prim?.action_title || weekDefaults[0],
        completed: w.status === 'completed'
      },
      {
        task_description: sec?.action_title || weekDefaults[1],
        completed: w.status === 'completed'
      }
    ];

    return {
      ...w,
      action_items: items
    };
  });
}

export async function updateMissionWeekStatus(userId: string, weekId: string, status: 'pending' | 'active' | 'completed' | 'missed'): Promise<MissionWeek> {
  if (isMockMode(userId)) {
    let updated: MissionWeek | null = null;
    updateSessionState(await getSessionId(), state => {
      const idx = state.mission_weeks.findIndex(w => w.id === weekId);
      if (idx !== -1) {
        state.mission_weeks[idx].status = status;
        if (status === 'completed') {
          state.mission_weeks[idx].completed_at = new Date().toISOString();
        }
        updated = state.mission_weeks[idx];
      }
    });
    if (!updated) throw new Error('Mission week not found');
    return updated;
  }

  const { data, error } = await supabase!
    .from('mission_weeks')
    .update({ status, completed_at: status === 'completed' ? new Date().toISOString() : null })
    .eq('id', weekId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// GDPR Delete
export async function gdprDeleteUser(userId: string) {
  if (isMockMode(userId)) {
    deleteSessionState(await getSessionId());
    return;
  }
  await supabase!.from('users').delete().eq('id', userId);
}
