-- VERDANCE: Supabase PostgreSQL Schema Migration

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Define Custom ENUMs
CREATE TYPE activity_category AS ENUM ('transportation', 'electricity', 'food', 'shopping', 'flights');
CREATE TYPE activity_source AS ENUM ('manual', 'estimated', 'integration', 'seed_demo');
CREATE TYPE recommendation_status AS ENUM ('active', 'accepted', 'dismissed', 'completed');
CREATE TYPE goal_status AS ENUM ('on_track', 'at_risk', 'achieved', 'missed');
CREATE TYPE scenario_type AS ENUM ('current_trajectory', 'moderate', 'aggressive');
CREATE TYPE mission_status AS ENUM ('active', 'completed', 'abandoned');
CREATE TYPE mission_week_status AS ENUM ('pending', 'active', 'completed', 'missed');
CREATE TYPE persona_type AS ENUM (
  'daily_driver',
  'frequent_flyer',
  'conscious_commuter',
  'hidden_emitter',
  'green_starter',
  'climate_champion',
  'household_optimizer',
  'energy_explorer'
);
CREATE TYPE demo_slug_type AS ENUM (
  'college_student',
  'frequent_traveler',
  'family_household',
  'sustainability_enthusiast'
);

-- Users (Profiles) Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  country_region TEXT NOT NULL,
  household_size INT NOT NULL DEFAULT 1,
  home_type TEXT NOT NULL,
  electricity_grid_region TEXT NOT NULL,
  is_demo BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Versioned Emission Factors Reference Table
CREATE TABLE emission_factors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL,
  subcategory TEXT NOT NULL,
  region TEXT NOT NULL,
  unit TEXT NOT NULL,
  factor_kgco2e_per_unit NUMERIC NOT NULL,
  source_citation TEXT NOT NULL,
  effective_date DATE NOT NULL DEFAULT CURRENT_DATE
);

-- Cost Factors Table (powers twin cost projections)
CREATE TABLE cost_factors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL,
  subcategory TEXT NOT NULL,
  region TEXT NOT NULL,
  unit TEXT NOT NULL,
  cost_per_unit NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  source_citation TEXT NOT NULL,
  effective_date DATE NOT NULL DEFAULT CURRENT_DATE
);

-- Equivalence Factors Table (powers impact storytelling)
CREATE TABLE equivalence_factors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  label TEXT UNIQUE NOT NULL, -- e.g. 'car_km', 'smartphone_charge', 'home_day_powered', 'tree_year_absorption'
  factor_kgco2e_per_unit NUMERIC NOT NULL,
  unit_description TEXT NOT NULL,
  source_citation TEXT NOT NULL
);

-- Activity Logs Table
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  category activity_category NOT NULL,
  subcategory TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  occurred_at TIMESTAMPTZ NOT NULL,
  computed_emissions_kgco2e NUMERIC NOT NULL,
  source activity_source NOT NULL DEFAULT 'manual',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User Behavior Profile Table
CREATE TABLE user_behavior_profile (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  rolling_30d_emissions_by_category JSONB NOT NULL,
  rolling_90d_trend JSONB NOT NULL,
  recency_weighted_habit_vector JSONB NOT NULL,
  last_recomputed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Recommendations Table
CREATE TABLE recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  category activity_category NOT NULL,
  action_title TEXT NOT NULL,
  action_description TEXT NOT NULL,
  predicted_impact_kgco2e_per_month NUMERIC NOT NULL,
  effort_score SMALLINT CHECK (effort_score >= 1 AND effort_score <= 5) NOT NULL,
  confidence_score NUMERIC CHECK (confidence_score >= 0 AND confidence_score <= 1) NOT NULL,
  rationale_text TEXT NOT NULL,
  rationale_data_points JSONB NOT NULL,
  status recommendation_status NOT NULL DEFAULT 'active',
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

-- Goals Table
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  goal_type TEXT NOT NULL,
  target_value NUMERIC NOT NULL,
  target_unit TEXT NOT NULL,
  start_date DATE NOT NULL,
  target_date DATE NOT NULL,
  current_progress NUMERIC NOT NULL DEFAULT 0,
  status goal_status NOT NULL DEFAULT 'on_track'
);

-- Habits Table
CREATE TABLE habits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  habit_title TEXT NOT NULL,
  category activity_category NOT NULL,
  frequency_target TEXT NOT NULL,
  streak_count INT NOT NULL DEFAULT 0,
  last_completed_at TIMESTAMPTZ,
  linked_emission_savings_kgco2e NUMERIC NOT NULL DEFAULT 0
);

-- Challenges Table
CREATE TABLE challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category activity_category NOT NULL,
  duration_days INT NOT NULL,
  difficulty TEXT NOT NULL
);

-- User Challenges Join Table
CREATE TABLE user_challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('joined', 'completed', 'abandoned')),
  progress NUMERIC NOT NULL DEFAULT 0,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  opted_into_leaderboard BOOLEAN NOT NULL DEFAULT false
);

-- Weekly Reports Table
CREATE TABLE weekly_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  summary_json JSONB NOT NULL,
  narrative_text TEXT NOT NULL,
  highlights JSONB NOT NULL,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Personas Table
CREATE TABLE personas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  persona_key persona_type NOT NULL,
  persona_description TEXT NOT NULL,
  strengths JSONB NOT NULL,
  opportunity_areas JSONB NOT NULL,
  suggested_first_mission TEXT NOT NULL,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_current BOOLEAN NOT NULL DEFAULT true
);

-- Persona History Table
CREATE TABLE persona_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  from_persona_key persona_type,
  to_persona_key persona_type NOT NULL,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reason_text TEXT NOT NULL,
  triggering_rule TEXT NOT NULL
);

-- Carbon Twin Projections Table
CREATE TABLE carbon_twin_projections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  scenario scenario_type NOT NULL,
  baseline_monthly_kgco2e NUMERIC NOT NULL,
  month_3_kgco2e NUMERIC NOT NULL,
  month_6_kgco2e NUMERIC NOT NULL,
  month_12_kgco2e NUMERIC NOT NULL,
  reduction_pct NUMERIC NOT NULL,
  sustainability_score SMALLINT NOT NULL CHECK (sustainability_score >= 0 AND sustainability_score <= 100),
  goal_achievement_probability NUMERIC NOT NULL CHECK (goal_achievement_probability >= 0 AND goal_achievement_probability <= 1),
  estimated_cost_savings NUMERIC NOT NULL,
  key_habit_changes JSONB NOT NULL,
  computed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Missions Table
CREATE TABLE missions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  persona_id UUID REFERENCES personas(id) ON DELETE CASCADE,
  goal_id UUID REFERENCES goals(id) ON DELETE SET NULL,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status mission_status NOT NULL DEFAULT 'active',
  difficulty_level SMALLINT NOT NULL CHECK (difficulty_level >= 1 AND difficulty_level <= 5)
);

-- Mission Weeks Table
CREATE TABLE mission_weeks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mission_id UUID REFERENCES missions(id) ON DELETE CASCADE,
  week_number SMALLINT NOT NULL CHECK (week_number >= 1 AND week_number <= 4),
  primary_recommendation_id UUID REFERENCES recommendations(id) ON DELETE RESTRICT,
  secondary_recommendation_id UUID REFERENCES recommendations(id) ON DELETE RESTRICT,
  expected_reduction_kgco2e NUMERIC NOT NULL,
  difficulty SMALLINT NOT NULL,
  status mission_week_status NOT NULL DEFAULT 'pending',
  completed_at TIMESTAMPTZ
);

-- Demo Profile Seeds (static seeds database)
CREATE TABLE demo_profile_seeds (
  slug demo_slug_type PRIMARY KEY,
  display_name TEXT NOT NULL,
  description TEXT NOT NULL,
  seed_payload JSONB NOT NULL
);

-- --- Row Level Security (RLS) Configuration ---

-- Enable RLS on all user tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_behavior_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE persona_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE carbon_twin_projections ENABLE ROW LEVEL SECURITY;
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mission_weeks ENABLE ROW LEVEL SECURITY;

-- Enable RLS on reference tables
ALTER TABLE emission_factors ENABLE ROW LEVEL SECURITY;
ALTER TABLE cost_factors ENABLE ROW LEVEL SECURITY;
ALTER TABLE equivalence_factors ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_profile_seeds ENABLE ROW LEVEL SECURITY;

-- User Row Level Security Policies (auth.uid() = user_id scoped)
CREATE POLICY user_users_policy ON users 
  FOR ALL USING (auth.uid() = id);

CREATE POLICY user_activity_logs_policy ON activity_logs 
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY user_behavior_profile_policy ON user_behavior_profile 
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY user_recommendations_policy ON recommendations 
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY user_goals_policy ON goals 
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY user_habits_policy ON habits 
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY user_challenges_policy ON user_challenges 
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY user_weekly_reports_policy ON weekly_reports 
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY user_personas_policy ON personas 
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY user_persona_history_policy ON persona_history 
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY user_carbon_twin_projections_policy ON carbon_twin_projections 
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY user_missions_policy ON missions 
  FOR ALL USING (auth.uid() = user_id);

-- Mission Weeks check parent mission's user ID
CREATE POLICY user_mission_weeks_policy ON mission_weeks 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM missions 
      WHERE missions.id = mission_weeks.mission_id 
        AND missions.user_id = auth.uid()
    )
  );

-- Reference Tables Policies (Public read, admin write)
CREATE POLICY read_all_emission_factors ON emission_factors 
  FOR SELECT TO public USING (true);

CREATE POLICY read_all_cost_factors ON cost_factors 
  FOR SELECT TO public USING (true);

CREATE POLICY read_all_equivalence_factors ON equivalence_factors 
  FOR SELECT TO public USING (true);

CREATE POLICY read_all_challenges ON challenges 
  FOR SELECT TO public USING (true);

CREATE POLICY read_all_demo_profile_seeds ON demo_profile_seeds 
  FOR SELECT TO public USING (true);
