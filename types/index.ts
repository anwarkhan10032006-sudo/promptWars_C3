import { z } from 'zod';

// Categories ENUM
export const CategoryEnum = z.enum(['transportation', 'electricity', 'food', 'shopping', 'flights']);
export type Category = z.infer<typeof CategoryEnum>;

// Source ENUM
export const SourceEnum = z.enum(['manual', 'estimated', 'integration', 'seed_demo']);
export type Source = z.infer<typeof SourceEnum>;

// Recommendation Status ENUM
export const RecStatusEnum = z.enum(['active', 'accepted', 'dismissed', 'completed']);
export type RecStatus = z.infer<typeof RecStatusEnum>;

// Goal Status ENUM
export const GoalStatusEnum = z.enum(['on_track', 'at_risk', 'achieved', 'missed']);
export type GoalStatus = z.infer<typeof GoalStatusEnum>;

// Challenge Status ENUM
export const ChallengeStatusEnum = z.enum(['active', 'completed', 'abandoned']);
export type ChallengeStatus = z.infer<typeof ChallengeStatusEnum>;

// Persona Key ENUM
export const PersonaKeyEnum = z.enum([
  'daily_driver',
  'frequent_flyer',
  'conscious_commuter',
  'hidden_emitter',
  'green_starter',
  'climate_champion',
  'household_optimizer',
  'energy_explorer'
]);
export type PersonaKey = z.infer<typeof PersonaKeyEnum>;

// Scenario ENUM
export const ScenarioEnum = z.enum(['current_trajectory', 'moderate', 'aggressive']);
export type Scenario = z.infer<typeof ScenarioEnum>;

// Mission Status ENUM
export const MissionStatusEnum = z.enum(['active', 'completed', 'abandoned']);
export type MissionStatus = z.infer<typeof MissionStatusEnum>;

// Mission Week Status ENUM
export const MissionWeekStatusEnum = z.enum(['pending', 'active', 'completed', 'missed']);
export type MissionWeekStatus = z.infer<typeof MissionWeekStatusEnum>;

// Demo Profile Slug ENUM
export const DemoSlugEnum = z.enum([
  'college_student',
  'frequent_traveler',
  'family_household',
  'sustainability_enthusiast'
]);
export type DemoSlug = z.infer<typeof DemoSlugEnum>;

// --- Database Table Schemas ---

export const UserProfileSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  full_name: z.string(),
  country_region: z.string(),
  household_size: z.number().int().positive(),
  home_type: z.string(),
  electricity_grid_region: z.string(),
  is_demo: z.boolean().default(false),
  created_at: z.string().datetime()
});
export type UserProfile = z.infer<typeof UserProfileSchema>;

export const ActivityLogSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  category: CategoryEnum,
  subcategory: z.string(),
  quantity: z.number().nonnegative(),
  unit: z.string(),
  occurred_at: z.string().datetime(),
  computed_emissions_kgco2e: z.number().nonnegative(),
  source: SourceEnum,
  created_at: z.string().datetime()
});
export type ActivityLog = z.infer<typeof ActivityLogSchema>;

export const EmissionFactorSchema = z.object({
  id: z.string().uuid(),
  category: z.string(),
  subcategory: z.string(),
  region: z.string(),
  unit: z.string(),
  factor_kgco2e_per_unit: z.number().nonnegative(),
  source_citation: z.string(),
  effective_date: z.string()
});
export type EmissionFactor = z.infer<typeof EmissionFactorSchema>;

export const CostFactorSchema = z.object({
  id: z.string().uuid(),
  category: z.string(),
  subcategory: z.string(),
  region: z.string(),
  unit: z.string(),
  cost_per_unit: z.number().nonnegative(),
  currency: z.string(),
  source_citation: z.string(),
  effective_date: z.string()
});
export type CostFactor = z.infer<typeof CostFactorSchema>;

export const EquivalenceFactorSchema = z.object({
  id: z.string().uuid(),
  label: z.string(),
  factor_kgco2e_per_unit: z.number().nonnegative(),
  unit_description: z.string(),
  source_citation: z.string()
});
export type EquivalenceFactor = z.infer<typeof EquivalenceFactorSchema>;

export const UserBehaviorProfileSchema = z.object({
  user_id: z.string().uuid(),
  rolling_30d_emissions_by_category: z.record(CategoryEnum, z.number()),
  rolling_90d_trend: z.array(z.object({ month: z.string(), emissions: z.number() })),
  recency_weighted_habit_vector: z.record(z.string(), z.number()),
  last_recomputed_at: z.string().datetime()
});
export type UserBehaviorProfile = z.infer<typeof UserBehaviorProfileSchema>;

export const RecommendationSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  category: CategoryEnum,
  action_title: z.string(),
  action_description: z.string(),
  predicted_impact_kgco2e_per_month: z.number().nonnegative(),
  effort_score: z.number().int().min(1).max(5),
  confidence_score: z.number().min(0).max(1),
  rationale_text: z.string(),
  rationale_data_points: z.record(z.string(), z.any()),
  status: RecStatusEnum,
  generated_at: z.string().datetime(),
  expires_at: z.string().datetime()
});
export type Recommendation = z.infer<typeof RecommendationSchema>;

export const GoalSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  goal_type: z.string(), // e.g., "footprint_reduction_pct"
  target_value: z.number().nonnegative(),
  target_unit: z.string(),
  start_date: z.string(),
  target_date: z.string(),
  current_progress: z.number().nonnegative(),
  status: GoalStatusEnum
});
export type Goal = z.infer<typeof GoalSchema>;

export const HabitSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  habit_title: z.string(),
  category: CategoryEnum,
  frequency_target: z.string(), // e.g., "daily", "3x_weekly"
  streak_count: z.number().int().nonnegative(),
  last_completed_at: z.string().datetime().nullable(),
  linked_emission_savings_kgco2e: z.number().nonnegative()
});
export type Habit = z.infer<typeof HabitSchema>;

export const ChallengeSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  category: CategoryEnum,
  duration_days: z.number().int().positive(),
  difficulty: z.string()
});
export type Challenge = z.infer<typeof ChallengeSchema>;

export const UserChallengeSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  challenge_id: z.string().uuid(),
  status: z.enum(['joined', 'completed', 'abandoned']),
  progress: z.number().nonnegative(),
  joined_at: z.string().datetime(),
  opted_into_leaderboard: z.boolean().default(false)
});
export type UserChallenge = z.infer<typeof UserChallengeSchema>;

export const WeeklyReportSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  week_start: z.string(),
  week_end: z.string(),
  summary_json: z.record(z.string(), z.any()),
  narrative_text: z.string(),
  highlights: z.array(z.string()),
  generated_at: z.string().datetime()
});
export type WeeklyReport = z.infer<typeof WeeklyReportSchema>;

export const PersonaSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  persona_key: PersonaKeyEnum,
  persona_description: z.string(),
  strengths: z.array(z.string()),
  opportunity_areas: z.array(z.string()),
  suggested_first_mission: z.string(),
  assigned_at: z.string().datetime(),
  is_current: z.boolean().default(true)
});
export type Persona = z.infer<typeof PersonaSchema>;

export const PersonaHistorySchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  from_persona_key: PersonaKeyEnum.nullable(),
  to_persona_key: PersonaKeyEnum,
  changed_at: z.string().datetime(),
  reason_text: z.string(),
  triggering_rule: z.string()
});
export type PersonaHistory = z.infer<typeof PersonaHistorySchema>;

export const CarbonTwinProjectionSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  scenario: ScenarioEnum,
  baseline_monthly_kgco2e: z.number().nonnegative(),
  month_3_kgco2e: z.number().nonnegative(),
  month_6_kgco2e: z.number().nonnegative(),
  month_12_kgco2e: z.number().nonnegative(),
  reduction_pct: z.number(),
  sustainability_score: z.number().int().min(0).max(100),
  goal_achievement_probability: z.number().min(0).max(1),
  estimated_cost_savings: z.number(),
  key_habit_changes: z.array(z.string()),
  computed_at: z.string().datetime()
});
export type CarbonTwinProjection = z.infer<typeof CarbonTwinProjectionSchema>;

export const MissionSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  persona_id: z.string().uuid(),
  goal_id: z.string().uuid().nullable(),
  start_date: z.string(),
  status: MissionStatusEnum,
  difficulty_level: z.number().int().min(1).max(5),
  title: z.string().optional(),
  description: z.string().optional(),
  current_streak: z.number().int().nonnegative().optional()
});
export type Mission = z.infer<typeof MissionSchema>;

export const MissionWeekSchema = z.object({
  id: z.string().uuid(),
  mission_id: z.string().uuid(),
  week_number: z.number().int().min(1).max(4),
  primary_recommendation_id: z.string().uuid(),
  secondary_recommendation_id: z.string().uuid(),
  expected_reduction_kgco2e: z.number().nonnegative(),
  difficulty: z.number().int().min(1).max(5),
  status: MissionWeekStatusEnum,
  completed_at: z.string().datetime().nullable(),
  action_items: z.array(z.object({
    task_description: z.string(),
    completed: z.boolean()
  })).optional()
});
export type MissionWeek = z.infer<typeof MissionWeekSchema>;

// Seed Payload Zod schema
export const SeedPayloadSchema = z.object({
  profile: z.any(),
  activity_logs: z.array(z.any()),
  goals: z.array(z.any()),
  habits: z.array(z.any()),
  challenges: z.array(z.any()),
  weekly_reports: z.array(z.any()),
  carbon_twin_projections: z.array(z.any()),
  persona: z.any(),
  active_mission: z.object({
    mission: z.any(),
    weeks: z.array(z.any())
  }).optional()
});
export type SeedPayload = z.infer<typeof SeedPayloadSchema>;

export const DemoProfileSeedSchema = z.object({
  slug: DemoSlugEnum,
  display_name: z.string(),
  description: z.string(),
  seed_payload: SeedPayloadSchema
});
export type DemoProfileSeed = z.infer<typeof DemoProfileSeedSchema>;
