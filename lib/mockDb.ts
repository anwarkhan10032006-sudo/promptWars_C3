import fs from 'fs';
import path from 'path';
import { DEMO_SEEDS, STATIC_CHALLENGES, SEED_EMISSION_FACTORS, SEED_COST_FACTORS, SEED_EQUIVALENCE_FACTORS } from './demo/demo-seeds';
import { 
  UserProfile, ActivityLog, Goal, Habit, WeeklyReport, Persona, 
  PersonaHistory, CarbonTwinProjection, Mission, MissionWeek, UserChallenge, DemoSlug
} from '../types';

const MOCK_DB_PATH = path.join('C:', 'Users', 'ANWAR KHAN', '.gemini', 'antigravity', 'scratch', 'mockDbState.json');

// Session State interface
export interface SessionState {
  profile: UserProfile | null;
  activity_logs: ActivityLog[];
  goals: Goal[];
  habits: Habit[];
  user_challenges: UserChallenge[];
  weekly_reports: WeeklyReport[];
  personas: Persona[];
  persona_history: PersonaHistory[];
  carbon_twin_projections: CarbonTwinProjection[];
  missions: Mission[];
  mission_weeks: MissionWeek[];
  active_demo_slug?: DemoSlug;
}

// Global reference tables (read-only in mock db)
export const mockEmissionFactors = SEED_EMISSION_FACTORS;
export const mockCostFactors = SEED_COST_FACTORS;
export const mockEquivalenceFactors = SEED_EQUIVALENCE_FACTORS;
export const mockChallenges = STATIC_CHALLENGES;

// Core file read/write helper
function loadState(): Record<string, SessionState> {
  try {
    if (fs.existsSync(MOCK_DB_PATH)) {
      const content = fs.readFileSync(MOCK_DB_PATH, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error loading mock database state, resetting:', err);
  }
  return {};
}

function saveState(state: Record<string, SessionState>) {
  try {
    const dir = path.dirname(MOCK_DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(MOCK_DB_PATH, JSON.stringify(state, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving mock database state:', err);
  }
}

// Get or initialize state for a session
export function getSessionState(sessionId: string): SessionState {
  const db = loadState();
  if (!db[sessionId]) {
    // Default empty session state
    db[sessionId] = {
      profile: null,
      activity_logs: [],
      goals: [],
      habits: [],
      user_challenges: [],
      weekly_reports: [],
      personas: [],
      persona_history: [],
      carbon_twin_projections: [],
      missions: [],
      mission_weeks: []
    };
    saveState(db);
  }
  return db[sessionId];
}

export function updateSessionState(sessionId: string, updater: (state: SessionState) => void) {
  const db = loadState();
  const state = db[sessionId] || {
    profile: null,
    activity_logs: [],
    goals: [],
    habits: [],
    user_challenges: [],
    weekly_reports: [],
    personas: [],
    persona_history: [],
    carbon_twin_projections: [],
    missions: [],
    mission_weeks: []
  };
  updater(state);
  db[sessionId] = state;
  saveState(db);
}

// Clear mock state (GDPR account delete)
export function deleteSessionState(sessionId: string) {
  const db = loadState();
  if (db[sessionId]) {
    delete db[sessionId];
    saveState(db);
  }
}

// Load Demo profile seeds into session
export function loadDemoProfileIntoSession(sessionId: string, slug: DemoSlug): SessionState {
  const seed = DEMO_SEEDS[slug];
  const db = loadState();
  
  db[sessionId] = {
    profile: { ...seed.profile, id: `user-${sessionId}` },
    activity_logs: seed.activity_logs.map(log => ({ ...log, user_id: `user-${sessionId}` })),
    goals: seed.goals.map(goal => ({ ...goal, user_id: `user-${sessionId}` })),
    habits: seed.habits.map(habit => ({ ...habit, user_id: `user-${sessionId}` })),
    user_challenges: seed.challenges.map(uc => ({ ...uc, user_id: `user-${sessionId}` })),
    weekly_reports: seed.weekly_reports.map(rep => ({ ...rep, user_id: `user-${sessionId}` })),
    carbon_twin_projections: seed.carbon_twin_projections.map(twin => ({ ...twin, user_id: `user-${sessionId}` })),
    personas: seed.persona ? [{ ...seed.persona, user_id: `user-${sessionId}` }] : [],
    persona_history: [],
    missions: seed.active_mission ? [{ ...seed.active_mission.mission, user_id: `user-${sessionId}`, id: `miss-${sessionId}` }] : [],
    mission_weeks: seed.active_mission ? seed.active_mission.weeks.map(week => ({ ...week, mission_id: `miss-${sessionId}` })) : [],
    active_demo_slug: slug
  };

  saveState(db);
  console.log(`[MOCK DB] Loaded demo persona ${slug} for session ${sessionId}`);
  return db[sessionId];
}

// Find a profile by email in other sessions and copy its state to the current session
export function findAndCopyProfileByEmail(currentSessionId: string, email: string): boolean {
  const db = loadState();
  const emailLower = email.toLowerCase();
  
  // Find another session that has a profile with the same email
  const matchingSessionId = Object.keys(db).find(sessId => {
    return db[sessId]?.profile?.email?.toLowerCase() === emailLower;
  });
  
  if (matchingSessionId && matchingSessionId !== currentSessionId) {
    const copiedState = JSON.parse(JSON.stringify(db[matchingSessionId]));
    const newUserPrefix = `user-${currentSessionId}`;
    
    if (copiedState.profile) {
      copiedState.profile.id = newUserPrefix;
    }
    copiedState.activity_logs = (copiedState.activity_logs || []).map((x: any) => ({ ...x, user_id: newUserPrefix }));
    copiedState.goals = (copiedState.goals || []).map((x: any) => ({ ...x, user_id: newUserPrefix }));
    copiedState.habits = (copiedState.habits || []).map((x: any) => ({ ...x, user_id: newUserPrefix }));
    copiedState.user_challenges = (copiedState.user_challenges || []).map((x: any) => ({ ...x, user_id: newUserPrefix }));
    copiedState.weekly_reports = (copiedState.weekly_reports || []).map((x: any) => ({ ...x, user_id: newUserPrefix }));
    copiedState.personas = (copiedState.personas || []).map((x: any) => ({ ...x, user_id: newUserPrefix }));
    copiedState.carbon_twin_projections = (copiedState.carbon_twin_projections || []).map((x: any) => ({ ...x, user_id: newUserPrefix }));
    copiedState.missions = (copiedState.missions || []).map((x: any) => ({ ...x, user_id: newUserPrefix }));
    copiedState.mission_weeks = (copiedState.mission_weeks || []).map((x: any) => ({ ...x, user_id: newUserPrefix }));

    db[currentSessionId] = copiedState;
    saveState(db);
    console.log(`[MOCK DB] Copied data from session ${matchingSessionId} to session ${currentSessionId} for email ${email}`);
    return true;
  }
  
  return false;
}

