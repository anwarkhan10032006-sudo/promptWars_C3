import { SeedPayload, DemoSlug } from '../../types';

// Let's define some constants for calculations to keep seeds consistent:
// Transportation: Petrol Car = 0.18 kg CO2e/km, Bus/Transit = 0.04 kg CO2e/km, Electric Vehicle = 0.05 kg CO2e/km
// Electricity: Grid average = 0.4 kg CO2e/kWh
// Food: Vegan = 1.5 kg CO2e/day, Vegetarian = 2.5 kg CO2e/day, Flexitarian = 4.0 kg CO2e/day, Meat-Heavy = 7.0 kg CO2e/day
// Shopping: Discretionary spend = 0.15 kg CO2e/$
// Flights: Short-haul = 150 kg/flight, Medium-haul = 500 kg/flight, Long-haul = 1200 kg/flight

const now = new Date();
const getPastDate = (daysAgo: number) => {
  const d = new Date(now);
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
};

export const DEMO_SEEDS: Record<DemoSlug, SeedPayload> = {
  college_student: {
    profile: {
      id: 'demo-student-id',
      email: 'student@verdance.demo',
      full_name: 'Alex Rivera',
      country_region: 'Pacific Northwest, USA',
      household_size: 2,
      home_type: 'Apartment',
      electricity_grid_region: 'US-NW',
      is_demo: true,
      created_at: getPastDate(90)
    },
    activity_logs: [
      // 90 days of logs (sample subsets showing patterns)
      ...Array.from({ length: 15 }).map((_, i) => ({
        id: `log-stud-trans-${i}`,
        user_id: 'demo-student-id',
        category: 'transportation' as const,
        subcategory: 'Bus/Transit',
        quantity: 15,
        unit: 'km',
        occurred_at: getPastDate(i * 6 + 1),
        computed_emissions_kgco2e: 15 * 0.04,
        source: 'manual' as const,
        created_at: getPastDate(i * 6 + 1)
      })),
      ...Array.from({ length: 10 }).map((_, i) => ({
        id: `log-stud-elec-${i}`,
        user_id: 'demo-student-id',
        category: 'electricity' as const,
        subcategory: 'Grid Electricity',
        quantity: 120,
        unit: 'kWh',
        occurred_at: getPastDate(i * 9 + 3),
        computed_emissions_kgco2e: 120 * 0.35,
        source: 'integration' as const,
        created_at: getPastDate(i * 9 + 3)
      })),
      ...Array.from({ length: 30 }).map((_, i) => ({
        id: `log-stud-food-${i}`,
        user_id: 'demo-student-id',
        category: 'food' as const,
        subcategory: 'Vegetarian Meal',
        quantity: 1,
        unit: 'day',
        occurred_at: getPastDate(i * 3),
        computed_emissions_kgco2e: 2.5,
        source: 'manual' as const,
        created_at: getPastDate(i * 3)
      })),
      ...Array.from({ length: 12 }).map((_, i) => ({
        id: `log-stud-shop-${i}`,
        user_id: 'demo-student-id',
        category: 'shopping' as const,
        subcategory: 'Thrift Store Clothing',
        quantity: 30,
        unit: 'USD',
        occurred_at: getPastDate(i * 7 + 2),
        computed_emissions_kgco2e: 30 * 0.03, // Low emissions for thrift
        source: 'manual' as const,
        created_at: getPastDate(i * 7 + 2)
      }))
    ],
    goals: [
      {
        id: 'goal-student-1',
        user_id: 'demo-student-id',
        goal_type: 'footprint_reduction_pct',
        target_value: 15,
        target_unit: '%',
        start_date: getPastDate(30).substring(0, 10),
        target_date: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
        current_progress: 11.2,
        status: 'on_track'
      }
    ],
    habits: [
      {
        id: 'habit-student-1',
        user_id: 'demo-student-id',
        habit_title: 'Bicycle Commute',
        category: 'transportation',
        frequency_target: '3x_weekly',
        streak_count: 5,
        last_completed_at: getPastDate(1),
        linked_emission_savings_kgco2e: 2.1
      },
      {
        id: 'habit-student-2',
        user_id: 'demo-student-id',
        habit_title: 'Cold Wash Laundry',
        category: 'electricity',
        frequency_target: 'weekly',
        streak_count: 8,
        last_completed_at: getPastDate(4),
        linked_emission_savings_kgco2e: 0.8
      }
    ],
    challenges: [
      {
        id: 'challenge-student-1',
        user_id: 'demo-student-id',
        challenge_id: 'challenge-meatless',
        status: 'joined',
        progress: 4, // 4 meatless days of 7
        joined_at: getPastDate(4),
        opted_into_leaderboard: true
      }
    ],
    weekly_reports: [
      {
        id: 'rep-stud-1',
        user_id: 'demo-student-id',
        week_start: getPastDate(14).substring(0, 10),
        week_end: getPastDate(7).substring(0, 10),
        summary_json: { total_emissions: 85.5, savings: 8.2 },
        narrative_text: 'You had a highly sustainable week! Your bicycle commuting offset transport emissions, and your electricity usage was 12% lower than the regional average for apartments.',
        highlights: ['Commuted by bicycle 3 times', 'Saved 8.2 kg CO2e compared to last week'],
        generated_at: getPastDate(7)
      }
    ],
    carbon_twin_projections: [
      {
        id: 'twin-stud-current',
        user_id: 'demo-student-id',
        scenario: 'current_trajectory' as const,
        baseline_monthly_kgco2e: 280,
        month_3_kgco2e: 275,
        month_6_kgco2e: 270,
        month_12_kgco2e: 265,
        reduction_pct: 5.3,
        sustainability_score: 62,
        goal_achievement_probability: 0.45,
        estimated_cost_savings: 15,
        key_habit_changes: [],
        computed_at: getPastDate(1)
      },
      {
        id: 'twin-stud-moderate',
        user_id: 'demo-student-id',
        scenario: 'moderate' as const,
        baseline_monthly_kgco2e: 280,
        month_3_kgco2e: 230,
        month_6_kgco2e: 220,
        month_12_kgco2e: 210,
        reduction_pct: 25.0,
        sustainability_score: 78,
        goal_achievement_probability: 0.85,
        estimated_cost_savings: 80,
        key_habit_changes: ['Commit to 100% vegetarian meals', 'Swap 2 transit trips with bike'],
        computed_at: getPastDate(1)
      },
      {
        id: 'twin-stud-aggressive',
        user_id: 'demo-student-id',
        scenario: 'aggressive' as const,
        baseline_monthly_kgco2e: 280,
        month_3_kgco2e: 200,
        month_6_kgco2e: 180,
        month_12_kgco2e: 160,
        reduction_pct: 42.8,
        sustainability_score: 91,
        goal_achievement_probability: 0.98,
        estimated_cost_savings: 150,
        key_habit_changes: ['Commit to 100% vegan meals', 'Unplug vampire electronics', 'Transition to zero-waste shopping'],
        computed_at: getPastDate(1)
      }
    ],
    persona: {
      id: 'pers-student',
      user_id: 'demo-student-id',
      persona_key: 'green_starter' as const,
      persona_description: 'You are just beginning your climate footprint reduction journey. With low initial emissions, small changes make a big relative impact!',
      strengths: ['Low baseline emissions', 'Open to transit/cycling options'],
      opportunity_areas: ['Discretionary shopping choices', 'Adopting a more plant-based diet'],
      suggested_first_mission: 'Bicycle Commuter Kickoff',
      assigned_at: getPastDate(90),
      is_current: true
    },
    active_mission: {
      mission: {
        id: 'miss-student',
        user_id: 'demo-student-id',
        persona_id: 'pers-student',
        goal_id: 'goal-student-1',
        start_date: getPastDate(8).substring(0, 10),
        status: 'active' as const,
        difficulty_level: 2
      },
      weeks: [
        {
          id: 'miss-week-stud-1',
          mission_id: 'miss-student',
          week_number: 1,
          primary_recommendation_id: 'rec-student-fake1',
          secondary_recommendation_id: 'rec-student-fake2',
          expected_reduction_kgco2e: 4.5,
          difficulty: 1,
          status: 'completed' as const,
          completed_at: getPastDate(2)
        },
        {
          id: 'miss-week-stud-2',
          mission_id: 'miss-student',
          week_number: 2,
          primary_recommendation_id: 'rec-student-fake3',
          secondary_recommendation_id: 'rec-student-fake4',
          expected_reduction_kgco2e: 6.0,
          difficulty: 2,
          status: 'active' as const,
          completed_at: null
        },
        {
          id: 'miss-week-stud-3',
          mission_id: 'miss-student',
          week_number: 3,
          primary_recommendation_id: 'rec-student-fake5',
          secondary_recommendation_id: 'rec-student-fake6',
          expected_reduction_kgco2e: 8.0,
          difficulty: 2,
          status: 'pending' as const,
          completed_at: null
        },
        {
          id: 'miss-week-stud-4',
          mission_id: 'miss-student',
          week_number: 4,
          primary_recommendation_id: 'rec-student-fake7',
          secondary_recommendation_id: 'rec-student-fake8',
          expected_reduction_kgco2e: 10.0,
          difficulty: 3,
          status: 'pending' as const,
          completed_at: null
        }
      ]
    }
  },
  frequent_traveler: {
    profile: {
      id: 'demo-traveler-id',
      email: 'traveler@verdance.demo',
      full_name: 'Maya Lin',
      country_region: 'Northeast, USA',
      household_size: 1,
      home_type: 'Condo',
      electricity_grid_region: 'US-NE',
      is_demo: true,
      created_at: getPastDate(90)
    },
    activity_logs: [
      // Major high-impact flight logs + taxi rides
      ...Array.from({ length: 4 }).map((_, i) => ({
        id: `log-trav-flight-${i}`,
        user_id: 'demo-traveler-id',
        category: 'flights' as const,
        subcategory: 'Long-haul Flight',
        quantity: 1,
        unit: 'flight',
        occurred_at: getPastDate(i * 20 + 5),
        computed_emissions_kgco2e: 1200,
        source: 'manual' as const,
        created_at: getPastDate(i * 20 + 5)
      })),
      ...Array.from({ length: 15 }).map((_, i) => ({
        id: `log-trav-taxi-${i}`,
        user_id: 'demo-traveler-id',
        category: 'transportation' as const,
        subcategory: 'Rideshare/Taxi',
        quantity: 22,
        unit: 'km',
        occurred_at: getPastDate(i * 5 + 2),
        computed_emissions_kgco2e: 22 * 0.22,
        source: 'manual' as const,
        created_at: getPastDate(i * 5 + 2)
      })),
      ...Array.from({ length: 8 }).map((_, i) => ({
        id: `log-trav-elec-${i}`,
        user_id: 'demo-traveler-id',
        category: 'electricity' as const,
        subcategory: 'Grid Electricity',
        quantity: 190,
        unit: 'kWh',
        occurred_at: getPastDate(i * 10 + 1),
        computed_emissions_kgco2e: 190 * 0.42,
        source: 'integration' as const,
        created_at: getPastDate(i * 10 + 1)
      }))
    ],
    goals: [
      {
        id: 'goal-traveler-1',
        user_id: 'demo-traveler-id',
        goal_type: 'footprint_reduction_pct',
        target_value: 20,
        target_unit: '%',
        start_date: getPastDate(45).substring(0, 10),
        target_date: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
        current_progress: 8.5,
        status: 'at_risk'
      }
    ],
    habits: [
      {
        id: 'habit-traveler-1',
        user_id: 'demo-traveler-id',
        habit_title: 'Offset flight emissions',
        category: 'flights',
        frequency_target: 'per_occurrence',
        streak_count: 2,
        last_completed_at: getPastDate(15),
        linked_emission_savings_kgco2e: 1200
      }
    ],
    challenges: [
      {
        id: 'challenge-traveler-1',
        user_id: 'demo-traveler-id',
        challenge_id: 'challenge-rideshare-free',
        status: 'joined',
        progress: 2,
        joined_at: getPastDate(3),
        opted_into_leaderboard: true
      }
    ],
    weekly_reports: [
      {
        id: 'rep-trav-1',
        user_id: 'demo-traveler-id',
        week_start: getPastDate(14).substring(0, 10),
        week_end: getPastDate(7).substring(0, 10),
        summary_json: { total_emissions: 1250, savings: 0 },
        narrative_text: 'Your emissions spiked this week due to a long-haul flight from NYC to London. Outside of travel, your residential footprint remained highly efficient.',
        highlights: ['1 Long-haul Flight recorded', 'Opted for public transit to airport'],
        generated_at: getPastDate(7)
      }
    ],
    carbon_twin_projections: [
      {
        id: 'twin-trav-current',
        user_id: 'demo-traveler-id',
        scenario: 'current_trajectory' as const,
        baseline_monthly_kgco2e: 2450,
        month_3_kgco2e: 2400,
        month_6_kgco2e: 2420,
        month_12_kgco2e: 2380,
        reduction_pct: 2.8,
        sustainability_score: 31,
        goal_achievement_probability: 0.15,
        estimated_cost_savings: 40,
        key_habit_changes: [],
        computed_at: getPastDate(1)
      },
      {
        id: 'twin-trav-moderate',
        user_id: 'demo-traveler-id',
        scenario: 'moderate' as const,
        baseline_monthly_kgco2e: 2450,
        month_3_kgco2e: 1980,
        month_6_kgco2e: 1850,
        month_12_kgco2e: 1720,
        reduction_pct: 29.7,
        sustainability_score: 58,
        goal_achievement_probability: 0.65,
        estimated_cost_savings: 350,
        key_habit_changes: ['Substitute 1 domestic flight with rail', 'Offset all required business travel'],
        computed_at: getPastDate(1)
      },
      {
        id: 'twin-trav-aggressive',
        user_id: 'demo-traveler-id',
        scenario: 'aggressive' as const,
        baseline_monthly_kgco2e: 2450,
        month_3_kgco2e: 1350,
        month_6_kgco2e: 1200,
        month_12_kgco2e: 1050,
        reduction_pct: 57.1,
        sustainability_score: 83,
        goal_achievement_probability: 0.95,
        estimated_cost_savings: 1200,
        key_habit_changes: ['Substitute 3 regional flights with video meetings', 'Utilize public transit only during trips', 'In-hotel conservation routines'],
        computed_at: getPastDate(1)
      }
    ],
    persona: {
      id: 'pers-traveler',
      user_id: 'demo-traveler-id',
      persona_key: 'frequent_flyer' as const,
      persona_description: 'Flights comprise over 80% of your footprint. Targeting air travel frequency and options is your highest-leverage carbon reduction path.',
      strengths: ['Low baseline household energy footprint', 'Willingness to buy carbon offsets'],
      opportunity_areas: ['High flight frequency', 'Frequent airport commutes via private vehicle'],
      suggested_first_mission: 'Flight Offset & Reduction',
      assigned_at: getPastDate(90),
      is_current: true
    },
    active_mission: {
      mission: {
        id: 'miss-traveler',
        user_id: 'demo-traveler-id',
        persona_id: 'pers-traveler',
        goal_id: 'goal-traveler-1',
        start_date: getPastDate(5).substring(0, 10),
        status: 'active' as const,
        difficulty_level: 4
      },
      weeks: [
        {
          id: 'miss-week-trav-1',
          mission_id: 'miss-traveler',
          week_number: 1,
          primary_recommendation_id: 'rec-trav-fake1',
          secondary_recommendation_id: 'rec-trav-fake2',
          expected_reduction_kgco2e: 150,
          difficulty: 3,
          status: 'active' as const,
          completed_at: null
        },
        {
          id: 'miss-week-trav-2',
          mission_id: 'miss-traveler',
          week_number: 2,
          primary_recommendation_id: 'rec-trav-fake3',
          secondary_recommendation_id: 'rec-trav-fake4',
          expected_reduction_kgco2e: 300,
          difficulty: 4,
          status: 'pending' as const,
          completed_at: null
        },
        {
          id: 'miss-week-trav-3',
          mission_id: 'miss-traveler',
          week_number: 3,
          primary_recommendation_id: 'rec-trav-fake5',
          secondary_recommendation_id: 'rec-trav-fake6',
          expected_reduction_kgco2e: 300,
          difficulty: 4,
          status: 'pending' as const,
          completed_at: null
        },
        {
          id: 'miss-week-trav-4',
          mission_id: 'miss-traveler',
          week_number: 4,
          primary_recommendation_id: 'rec-trav-fake7',
          secondary_recommendation_id: 'rec-trav-fake8',
          expected_reduction_kgco2e: 450,
          difficulty: 5,
          status: 'pending' as const,
          completed_at: null
        }
      ]
    }
  },
  family_household: {
    profile: {
      id: 'demo-family-id',
      email: 'family@verdance.demo',
      full_name: 'The Millers',
      country_region: 'Midwest, USA',
      household_size: 4,
      home_type: 'Single Family Home',
      electricity_grid_region: 'US-MW',
      is_demo: true,
      created_at: getPastDate(90)
    },
    activity_logs: [
      // High electricity and heating consumption logs, plus grocery bills
      ...Array.from({ length: 9 }).map((_, i) => ({
        id: `log-fam-elec-${i}`,
        user_id: 'demo-family-id',
        category: 'electricity' as const,
        subcategory: 'Grid Electricity',
        quantity: 950,
        unit: 'kWh',
        occurred_at: getPastDate(i * 10 + 2),
        computed_emissions_kgco2e: 950 * 0.52, // Coal-heavy grid
        source: 'integration' as const,
        created_at: getPastDate(i * 10 + 2)
      })),
      ...Array.from({ length: 15 }).map((_, i) => ({
        id: `log-fam-gas-${i}`,
        user_id: 'demo-family-id',
        category: 'electricity' as const,
        subcategory: 'Natural Gas Heating',
        quantity: 80,
        unit: 'Therms',
        occurred_at: getPastDate(i * 6 + 1),
        computed_emissions_kgco2e: 80 * 5.3, // Gas conversion factor
        source: 'manual' as const,
        created_at: getPastDate(i * 6 + 1)
      })),
      ...Array.from({ length: 20 }).map((_, i) => ({
        id: `log-fam-food-${i}`,
        user_id: 'demo-family-id',
        category: 'food' as const,
        subcategory: 'Flexitarian Grocery Mix',
        quantity: 4,
        unit: 'people',
        occurred_at: getPastDate(i * 4 + 1),
        computed_emissions_kgco2e: 4 * 4.0,
        source: 'manual' as const,
        created_at: getPastDate(i * 4 + 1)
      }))
    ],
    goals: [
      {
        id: 'goal-family-1',
        user_id: 'demo-family-id',
        goal_type: 'footprint_reduction_pct',
        target_value: 10,
        target_unit: '%',
        start_date: getPastDate(20).substring(0, 10),
        target_date: new Date(now.getTime() + 70 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
        current_progress: 4.8,
        status: 'on_track'
      }
    ],
    habits: [
      {
        id: 'habit-family-1',
        user_id: 'demo-family-id',
        habit_title: 'Meatless Mondays',
        category: 'food',
        frequency_target: 'weekly',
        streak_count: 6,
        last_completed_at: getPastDate(6),
        linked_emission_savings_kgco2e: 8.5
      },
      {
        id: 'habit-family-2',
        user_id: 'demo-family-id',
        habit_title: 'Smart thermostat control',
        category: 'electricity',
        frequency_target: 'daily',
        streak_count: 14,
        last_completed_at: getPastDate(1),
        linked_emission_savings_kgco2e: 2.3
      }
    ],
    challenges: [
      {
        id: 'challenge-family-1',
        user_id: 'demo-family-id',
        challenge_id: 'challenge-eco-heating',
        status: 'joined',
        progress: 5,
        joined_at: getPastDate(5),
        opted_into_leaderboard: false
      }
    ],
    weekly_reports: [
      {
        id: 'rep-fam-1',
        user_id: 'demo-family-id',
        week_start: getPastDate(14).substring(0, 10),
        week_end: getPastDate(7).substring(0, 10),
        summary_json: { total_emissions: 340, savings: 15.6 },
        narrative_text: 'Your household saved 15.6 kg CO2e this week by lowering the thermostat 2 degrees at night. Food emissions were slightly elevated due to hosting a weekend dinner.',
        highlights: ['Thermostat setpoints optimized', 'Streak of 6 weeks on Meatless Mondays'],
        generated_at: getPastDate(7)
      }
    ],
    carbon_twin_projections: [
      {
        id: 'twin-fam-current',
        user_id: 'demo-family-id',
        scenario: 'current_trajectory' as const,
        baseline_monthly_kgco2e: 980,
        month_3_kgco2e: 960,
        month_6_kgco2e: 975,
        month_12_kgco2e: 955,
        reduction_pct: 2.5,
        sustainability_score: 55,
        goal_achievement_probability: 0.52,
        estimated_cost_savings: 30,
        key_habit_changes: [],
        computed_at: getPastDate(1)
      },
      {
        id: 'twin-fam-moderate',
        user_id: 'demo-family-id',
        scenario: 'moderate' as const,
        baseline_monthly_kgco2e: 980,
        month_3_kgco2e: 860,
        month_6_kgco2e: 820,
        month_12_kgco2e: 790,
        reduction_pct: 19.3,
        sustainability_score: 72,
        goal_achievement_probability: 0.89,
        estimated_cost_savings: 220,
        key_habit_changes: ['Install smart power strips', 'Set water heater to 120°F', 'Incorporate 2 plant-based dinners/week'],
        computed_at: getPastDate(1)
      },
      {
        id: 'twin-fam-aggressive',
        user_id: 'demo-family-id',
        scenario: 'aggressive' as const,
        baseline_monthly_kgco2e: 980,
        month_3_kgco2e: 710,
        month_6_kgco2e: 640,
        month_12_kgco2e: 580,
        reduction_pct: 40.8,
        sustainability_score: 87,
        goal_achievement_probability: 0.99,
        estimated_cost_savings: 640,
        key_habit_changes: ['Switch to 100% community solar tariff', 'Seal window leaks & insulation upgrade', 'Reduce dairy intake by 50%'],
        computed_at: getPastDate(1)
      }
    ],
    persona: {
      id: 'pers-family',
      user_id: 'demo-family-id',
      persona_key: 'household_optimizer' as const,
      persona_description: 'With a household of 4, shared resources like home heating, electricity, and bulk food purchases are your major areas of optimization.',
      strengths: ['Motivated family unit', 'Regular habits tracking'],
      opportunity_areas: ['High baseline energy demand', 'Food waste from bulk prep'],
      suggested_first_mission: 'Energy Efficiency Blitz',
      assigned_at: getPastDate(90),
      is_current: true
    },
    active_mission: {
      mission: {
        id: 'miss-family',
        user_id: 'demo-family-id',
        persona_id: 'pers-family',
        goal_id: 'goal-family-1',
        start_date: getPastDate(12).substring(0, 10),
        status: 'active' as const,
        difficulty_level: 3
      },
      weeks: [
        {
          id: 'miss-week-fam-1',
          mission_id: 'miss-family',
          week_number: 1,
          primary_recommendation_id: 'rec-fam-fake1',
          secondary_recommendation_id: 'rec-fam-fake2',
          expected_reduction_kgco2e: 12.0,
          difficulty: 2,
          status: 'completed' as const,
          completed_at: getPastDate(6)
        },
        {
          id: 'miss-week-fam-2',
          mission_id: 'miss-family',
          week_number: 2,
          primary_recommendation_id: 'rec-fam-fake3',
          secondary_recommendation_id: 'rec-fam-fake4',
          expected_reduction_kgco2e: 15.0,
          difficulty: 3,
          status: 'active' as const,
          completed_at: null
        },
        {
          id: 'miss-week-fam-3',
          mission_id: 'miss-family',
          week_number: 3,
          primary_recommendation_id: 'rec-fam-fake5',
          secondary_recommendation_id: 'rec-fam-fake6',
          expected_reduction_kgco2e: 20.0,
          difficulty: 3,
          status: 'pending' as const,
          completed_at: null
        },
        {
          id: 'miss-week-fam-4',
          mission_id: 'miss-family',
          week_number: 4,
          primary_recommendation_id: 'rec-fam-fake7',
          secondary_recommendation_id: 'rec-fam-fake8',
          expected_reduction_kgco2e: 25.0,
          difficulty: 4,
          status: 'pending' as const,
          completed_at: null
        }
      ]
    }
  },
  sustainability_enthusiast: {
    profile: {
      id: 'demo-enthusiast-id',
      email: 'enthusiast@verdance.demo',
      full_name: 'Clara Oswald',
      country_region: 'California, USA',
      household_size: 1,
      home_type: 'Apartment',
      electricity_grid_region: 'US-CA',
      is_demo: true,
      created_at: getPastDate(90)
    },
    activity_logs: [
      // Extremely low carbon lifestyle logs
      ...Array.from({ length: 10 }).map((_, i) => ({
        id: `log-enth-trans-${i}`,
        user_id: 'demo-enthusiast-id',
        category: 'transportation' as const,
        subcategory: 'Electric Vehicle Commute',
        quantity: 40,
        unit: 'km',
        occurred_at: getPastDate(i * 8 + 2),
        computed_emissions_kgco2e: 40 * 0.05,
        source: 'manual' as const,
        created_at: getPastDate(i * 8 + 2)
      })),
      ...Array.from({ length: 6 }).map((_, i) => ({
        id: `log-enth-elec-${i}`,
        user_id: 'demo-enthusiast-id',
        category: 'electricity' as const,
        subcategory: 'Rooftop Solar Tariffs',
        quantity: 80,
        unit: 'kWh',
        occurred_at: getPastDate(i * 12 + 1),
        computed_emissions_kgco2e: 80 * 0.08, // Low solar mix
        source: 'integration' as const,
        created_at: getPastDate(i * 12 + 1)
      })),
      ...Array.from({ length: 30 }).map((_, i) => ({
        id: `log-enth-food-${i}`,
        user_id: 'demo-enthusiast-id',
        category: 'food' as const,
        subcategory: 'Vegan Diet Plan',
        quantity: 1,
        unit: 'day',
        occurred_at: getPastDate(i * 3),
        computed_emissions_kgco2e: 1.5,
        source: 'manual' as const,
        created_at: getPastDate(i * 3)
      }))
    ],
    goals: [
      {
        id: 'goal-enthusiast-1',
        user_id: 'demo-enthusiast-id',
        goal_type: 'footprint_reduction_pct',
        target_value: 5, // Harder to shave off when already low
        target_unit: '%',
        start_date: getPastDate(10).substring(0, 10),
        target_date: new Date(now.getTime() + 80 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
        current_progress: 3.2,
        status: 'on_track'
      }
    ],
    habits: [
      {
        id: 'habit-enthusiast-1',
        user_id: 'demo-enthusiast-id',
        habit_title: '100% Vegan Eating',
        category: 'food',
        frequency_target: 'daily',
        streak_count: 28,
        last_completed_at: getPastDate(1),
        linked_emission_savings_kgco2e: 42.0
      },
      {
        id: 'habit-enthusiast-2',
        user_id: 'demo-enthusiast-id',
        habit_title: 'Zero-Waste shopping bag',
        category: 'shopping',
        frequency_target: 'weekly',
        streak_count: 12,
        last_completed_at: getPastDate(2),
        linked_emission_savings_kgco2e: 1.5
      }
    ],
    challenges: [
      {
        id: 'challenge-enthusiast-1',
        user_id: 'demo-enthusiast-id',
        challenge_id: 'challenge-no-waste',
        status: 'joined',
        progress: 100, // Completed!
        joined_at: getPastDate(15),
        opted_into_leaderboard: true
      }
    ],
    weekly_reports: [
      {
        id: 'rep-enth-1',
        user_id: 'demo-enthusiast-id',
        week_start: getPastDate(14).substring(0, 10),
        week_end: getPastDate(7).substring(0, 10),
        summary_json: { total_emissions: 32.2, savings: 1.1 },
        narrative_text: 'You maintain a tier-1 sustainability rating. Your vegan diet and solar tariff kept your footprint below the 95th percentile globally.',
        highlights: ['Achieved Zero-Waste Challenge', 'Maintained 28-day vegan streak'],
        generated_at: getPastDate(7)
      }
    ],
    carbon_twin_projections: [
      {
        id: 'twin-enth-current',
        user_id: 'demo-enthusiast-id',
        scenario: 'current_trajectory' as const,
        baseline_monthly_kgco2e: 98,
        month_3_kgco2e: 97,
        month_6_kgco2e: 97,
        month_12_kgco2e: 96,
        reduction_pct: 2.0,
        sustainability_score: 95,
        goal_achievement_probability: 0.75,
        estimated_cost_savings: 5,
        key_habit_changes: [],
        computed_at: getPastDate(1)
      },
      {
        id: 'twin-enth-moderate',
        user_id: 'demo-enthusiast-id',
        scenario: 'moderate' as const,
        baseline_monthly_kgco2e: 98,
        month_3_kgco2e: 92,
        month_6_kgco2e: 90,
        month_12_kgco2e: 88,
        reduction_pct: 10.2,
        sustainability_score: 97,
        goal_achievement_probability: 0.92,
        estimated_cost_savings: 20,
        key_habit_changes: ['Switch off idle router nodes', 'Offset 100% of EV charging grid mix'],
        computed_at: getPastDate(1)
      },
      {
        id: 'twin-enth-aggressive',
        user_id: 'demo-enthusiast-id',
        scenario: 'aggressive' as const,
        baseline_monthly_kgco2e: 98,
        month_3_kgco2e: 85,
        month_6_kgco2e: 80,
        month_12_kgco2e: 75,
        reduction_pct: 23.4,
        sustainability_score: 99,
        goal_achievement_probability: 0.99,
        estimated_cost_savings: 50,
        key_habit_changes: ['Invest in community micro-wind projects', 'Switch to a local zero-waste food coop'],
        computed_at: getPastDate(1)
      }
    ],
    persona: {
      id: 'pers-enthusiast',
      user_id: 'demo-enthusiast-id',
      persona_key: 'climate_champion' as const,
      persona_description: 'You are in the top 5% of low-impact lifestyles. Your challenge is optimizing the final, hardest-to-shave carbon margins and advocating to others.',
      strengths: ['Fully vegan diet', 'EV commuting', 'Maintains long habits streaks'],
      opportunity_areas: ['Upstream supply-chain shopping footprints', 'Public advocacy/cohort leading'],
      suggested_first_mission: 'Zero Waste Hero',
      assigned_at: getPastDate(90),
      is_current: true
    },
    active_mission: {
      mission: {
        id: 'miss-enthusiast',
        user_id: 'demo-enthusiast-id',
        persona_id: 'pers-enthusiast',
        goal_id: 'goal-enthusiast-1',
        start_date: getPastDate(4).substring(0, 10),
        status: 'active' as const,
        difficulty_level: 5
      },
      weeks: [
        {
          id: 'miss-week-enth-1',
          mission_id: 'miss-enthusiast',
          week_number: 1,
          primary_recommendation_id: 'rec-enth-fake1',
          secondary_recommendation_id: 'rec-enth-fake2',
          expected_reduction_kgco2e: 1.5,
          difficulty: 4,
          status: 'active' as const,
          completed_at: null
        },
        {
          id: 'miss-week-enth-2',
          mission_id: 'miss-enthusiast',
          week_number: 2,
          primary_recommendation_id: 'rec-enth-fake3',
          secondary_recommendation_id: 'rec-enth-fake4',
          expected_reduction_kgco2e: 2.0,
          difficulty: 5,
          status: 'pending' as const,
          completed_at: null
        },
        {
          id: 'miss-week-enth-3',
          mission_id: 'miss-enthusiast',
          week_number: 3,
          primary_recommendation_id: 'rec-enth-fake5',
          secondary_recommendation_id: 'rec-enth-fake6',
          expected_reduction_kgco2e: 2.5,
          difficulty: 5,
          status: 'pending' as const,
          completed_at: null
        },
        {
          id: 'miss-week-enth-4',
          mission_id: 'miss-enthusiast',
          week_number: 4,
          primary_recommendation_id: 'rec-enth-fake7',
          secondary_recommendation_id: 'rec-enth-fake8',
          expected_reduction_kgco2e: 3.0,
          difficulty: 5,
          status: 'pending' as const,
          completed_at: null
        }
      ]
    }
  }
};

// Seed Factors (Emission, Cost, Equivalence) to represent standard factors
export const SEED_EMISSION_FACTORS = [
  { category: 'transportation', subcategory: 'Petrol Car', region: 'global', unit: 'km', factor_kgco2e_per_unit: 0.18, source_citation: 'EPA Emission Factors Hub 2023', effective_date: '2023-01-01' },
  { category: 'transportation', subcategory: 'Bus/Transit', region: 'global', unit: 'km', factor_kgco2e_per_unit: 0.04, source_citation: 'EPA Emission Factors Hub 2023', effective_date: '2023-01-01' },
  { category: 'transportation', subcategory: 'Electric Vehicle', region: 'global', unit: 'km', factor_kgco2e_per_unit: 0.05, source_citation: 'EPA / EGrid Mix 2023', effective_date: '2023-01-01' },
  
  { category: 'electricity', subcategory: 'Grid Electricity', region: 'US-NW', unit: 'kWh', factor_kgco2e_per_unit: 0.35, source_citation: 'eGRID US NW Region 2022', effective_date: '2023-01-01' },
  { category: 'electricity', subcategory: 'Grid Electricity', region: 'US-NE', unit: 'kWh', factor_kgco2e_per_unit: 0.42, source_citation: 'eGRID US NE Region 2022', effective_date: '2023-01-01' },
  { category: 'electricity', subcategory: 'Grid Electricity', region: 'US-MW', unit: 'kWh', factor_kgco2e_per_unit: 0.52, source_citation: 'eGRID US MW Region 2022', effective_date: '2023-01-01' },
  { category: 'electricity', subcategory: 'Grid Electricity', region: 'US-CA', unit: 'kWh', factor_kgco2e_per_unit: 0.22, source_citation: 'eGRID US CA Region 2022', effective_date: '2023-01-01' },
  { category: 'electricity', subcategory: 'Natural Gas Heating', region: 'global', unit: 'Therms', factor_kgco2e_per_unit: 5.3, source_citation: 'EPA GHG Emission Factors 2023', effective_date: '2023-01-01' },

  { category: 'food', subcategory: 'Vegan Diet Plan', region: 'global', unit: 'day', factor_kgco2e_per_unit: 1.5, source_citation: 'Poore & Nemecek, Science 2018', effective_date: '2023-01-01' },
  { category: 'food', subcategory: 'Vegetarian Meal', region: 'global', unit: 'day', factor_kgco2e_per_unit: 2.5, source_citation: 'Poore & Nemecek, Science 2018', effective_date: '2023-01-01' },
  { category: 'food', subcategory: 'Flexitarian Grocery Mix', region: 'global', unit: 'day', factor_kgco2e_per_unit: 4.0, source_citation: 'Poore & Nemecek, Science 2018', effective_date: '2023-01-01' },
  { category: 'food', subcategory: 'Meat-Heavy Grocery Mix', region: 'global', unit: 'day', factor_kgco2e_per_unit: 7.0, source_citation: 'Poore & Nemecek, Science 2018', effective_date: '2023-01-01' },

  { category: 'shopping', subcategory: 'Discretionary Spend', region: 'global', unit: 'USD', factor_kgco2e_per_unit: 0.15, source_citation: 'Carnegie Mellon Green Design Institute EIO-LCA', effective_date: '2023-01-01' },
  { category: 'shopping', subcategory: 'Thrift Store Clothing', region: 'global', unit: 'USD', factor_kgco2e_per_unit: 0.03, source_citation: 'WRAP UK Textiles Footprint Study', effective_date: '2023-01-01' },

  { category: 'flights', subcategory: 'Short-haul Flight', region: 'global', unit: 'flight', factor_kgco2e_per_unit: 150, source_citation: 'ICAO Carbon Emissions Calculator', effective_date: '2023-01-01' },
  { category: 'flights', subcategory: 'Medium-haul Flight', region: 'global', unit: 'flight', factor_kgco2e_per_unit: 500, source_citation: 'ICAO Carbon Emissions Calculator', effective_date: '2023-01-01' },
  { category: 'flights', subcategory: 'Long-haul Flight', region: 'global', unit: 'flight', factor_kgco2e_per_unit: 1200, source_citation: 'ICAO Carbon Emissions Calculator', effective_date: '2023-01-01' }
];

export const SEED_COST_FACTORS = [
  { category: 'transportation', subcategory: 'Petrol Car', region: 'global', unit: 'km', cost_per_unit: 0.12, currency: 'USD', source_citation: 'AAA Commuting Costs averages 2023', effective_date: '2023-01-01' },
  { category: 'transportation', subcategory: 'Electric Vehicle', region: 'global', unit: 'km', cost_per_unit: 0.03, currency: 'USD', source_citation: 'US DOE EV charging costs averages', effective_date: '2023-01-01' },
  { category: 'electricity', subcategory: 'Grid Electricity', region: 'US-NW', unit: 'kWh', cost_per_unit: 0.11, currency: 'USD', source_citation: 'EIA State Energy Profiles 2023', effective_date: '2023-01-01' },
  { category: 'electricity', subcategory: 'Grid Electricity', region: 'US-NE', unit: 'kWh', cost_per_unit: 0.22, currency: 'USD', source_citation: 'EIA State Energy Profiles 2023', effective_date: '2023-01-01' },
  { category: 'electricity', subcategory: 'Grid Electricity', region: 'US-MW', unit: 'kWh', cost_per_unit: 0.14, currency: 'USD', source_citation: 'EIA State Energy Profiles 2023', effective_date: '2023-01-01' },
  { category: 'electricity', subcategory: 'Grid Electricity', region: 'US-CA', unit: 'kWh', cost_per_unit: 0.28, currency: 'USD', source_citation: 'EIA State Energy Profiles 2023', effective_date: '2023-01-01' },
  { category: 'electricity', subcategory: 'Natural Gas Heating', region: 'global', unit: 'Therms', cost_per_unit: 1.25, currency: 'USD', source_citation: 'EIA Natural Gas residential rates 2023', effective_date: '2023-01-01' }
];

export const SEED_EQUIVALENCE_FACTORS = [
  { label: 'car_km', factor_kgco2e_per_unit: 0.18, unit_description: 'km driven in a standard petrol car', source_citation: 'EPA GHG Equivalencies Calculator' },
  { label: 'smartphone_charge', factor_kgco2e_per_unit: 0.008, unit_description: 'smartphone charges', source_citation: 'EPA GHG Equivalencies Calculator' },
  { label: 'home_day_powered', factor_kgco2e_per_unit: 11.5, unit_description: 'days of powering an average home', source_citation: 'EIA Residential average use 2022' },
  { label: 'tree_year_absorption', factor_kgco2e_per_unit: 22.0, unit_description: 'tree-years of CO2 absorption', source_citation: 'European Environment Agency' }
];

export const STATIC_CHALLENGES = [
  { id: 'challenge-meatless', title: 'Go Meatless', description: 'Eat vegetarian or vegan meals for 7 consecutive days.', category: 'food', duration_days: 7, difficulty: 'Medium' },
  { id: 'challenge-rideshare-free', title: 'Active Transit Week', description: 'Replace all taxi/rideshares with walking, biking, or public transit for 7 days.', category: 'transportation', duration_days: 7, difficulty: 'Hard' },
  { id: 'challenge-eco-heating', title: 'Thermostat Setback', description: 'Lower your thermostat by 2°F for 30 consecutive days.', category: 'electricity', duration_days: 30, difficulty: 'Easy' },
  { id: 'challenge-no-waste', title: 'Zero Waste Challenge', description: 'Avoid single-use plastics and packaging for 14 days.', category: 'shopping', duration_days: 14, difficulty: 'Hard' }
];
