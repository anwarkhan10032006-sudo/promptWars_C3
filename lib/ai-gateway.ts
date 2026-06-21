import { z } from 'zod';
import { calculateEquivalencies } from './storytelling';

// --- System Prompt Versioned Constants ---

export const COPILOT_SYSTEM_PROMPT = `
You are VERDANCE — an elite AI Sustainability Copilot. Your role is to help users track, understand, and reduce their personal carbon footprint.
Guidelines:
1. Be warm, concise, encouraging, and specific to the user's actual data.
2. Cite specific data points (emissions, habits, goals) in your replies.
3. NEVER invent emissions factors, cost figures, or math. Only reference the precomputed figures passed to you.
4. If asked about topics outside sustainability (e.g., medical, finance, politics), politely redirect the user.
5. NEVER offer professional medical or financial advice.
`;

export const RECOMMENDATION_RATIONALE_PROMPT = `
Write a 1-2 sentence explainable rationale for why this sustainability action is recommended.
Highlight the carbon savings (in kg CO2e) and link it directly to their specific activity history.
Do not invent any numbers; only use the metrics provided in the context.
`;

export const WEEKLY_REPORT_PROMPT = `
Summarize the user's sustainability progress for the past week in a concise, encouraging narrative (~100-150 words).
Ensure you incorporate at least one progress storytelling equivalence (e.g. smartphone charges or car km offset) to make it relatable.
Avoid guilt-based language; remain constructive even if emissions increased.
`;

export const CARBON_TWIN_PROMPT = `
Create a "Current You vs Future You" comparative narrative (~100 words) based on the Carbon Twin projections provided.
Contrast their current trajectory with their future projections in terms of sustainability score, cost savings, and key habit shifts.
Only cite numbers provided; do not invent figures.
`;

// Fallback generators (deterministic rules)
export function getFallbackRecommendationRationale(
  title: string,
  impact: number,
  category: string
): string {
  return `This is recommended because reducing your ${category} footprints by adopting "${title}" can save up to ${impact} kg CO2e per month, helping you align with your active carbon reduction goals.`;
}

export function getFallbackWeeklyReport(data: {
  userId: string;
  totalEmissions: number;
  savings: number;
  deltaPct: number;
  highlight: string;
}): string {
  const equivs = calculateEquivalencies(Math.abs(data.savings));
  const smartphoneEquivalent = equivs.smartphone_charge?.value || 0;
  
  if (data.savings > 0) {
    return `Great job this week! You reduced your carbon footprint by ${data.savings} kg CO2e (${data.deltaPct}% lower than your rolling average). This savings is equivalent to offsetting ${smartphoneEquivalent} smartphone charges. Your top highlight was: ${data.highlight}. Keep up the great work!`;
  } else {
    return `This week your emissions totaled ${data.totalEmissions} kg CO2e. While this was slightly higher than your rolling average, you did manage to achieve a milestone: ${data.highlight}. Small, steady adjustments will help you bounce back next week!`;
  }
}

export function getFallbackTwinNarrative(
  scenario: string,
  reductionPct: number,
  score: number,
  costSavings: number
): string {
  if (scenario === 'current_trajectory') {
    return `Current You: On your current path, you will only achieve a ${reductionPct}% reduction over the next 12 months with a sustainability score of ${score}/100. By staying here, you miss out on potential cost savings of $${costSavings}/month and continue carbon-heavy habits.`;
  } else if (scenario === 'moderate') {
    return `Future You (Moderate): By adopting key recommendations at a 50% rate, you project to achieve a ${reductionPct}% reduction in emissions, boosting your sustainability score to ${score}/100 and saving $${costSavings} monthly. This path successfully mitigates major utility waste.`;
  } else {
    return `Future You (Aggressive): Optimizing all transport, heating, and diet channels yields a stellar ${reductionPct}% carbon reduction, achieving a sustainability score of ${score}/100. This path maximizes your household efficiency, saving $${costSavings} per month in avoided energy and fuel bills.`;
  }
}

export function getFallbackCopilotReply(query: string, dataContext: any): string {
  const q = query.toLowerCase();
  
  if (q.includes('emissions') || q.includes('carbon') || q.includes('footprint')) {
    const total = dataContext.activity_logs?.reduce((sum: number, l: any) => sum + Number(l.computed_emissions_kgco2e), 0) || 0;
    return `Looking at your last 90 days, your recorded activity logs sum to a footprint of ${total.toFixed(1)} kg CO2e. Your biggest single contributor category is ${dataContext.persona?.opportunity_areas?.[0] || 'transportation'}. Let me know if you would like suggestions to reduce this.`;
  }
  
  if (q.includes('persona')) {
    const p = dataContext.persona;
    if (!p) return "I don't have enough data to determine your persona yet. Start logging your activities to reveal it!";
    return `Your current sustainability persona is "${p.persona_description}". Your strengths include: ${p.strengths?.join(', ')}. Let's work on: ${p.opportunity_areas?.join(', ')}.`;
  }

  if (q.includes('mission')) {
    const m = dataContext.active_mission;
    if (!m) return "You don't have an active 30-Day Mission. Head over to the Missions tab to kickoff your first 4-week action plan!";
    return `You are currently on Week ${m.weeks?.find((w: any) => w.status === 'active')?.week_number || 1} of your 30-Day Mission. Your primary goal is to complete the actions for this week, which will reduce emissions by ${m.weeks?.find((w: any) => w.status === 'active')?.expected_reduction_kgco2e || 0} kg CO2e.`;
  }

  return `Hi! I'm your VERDANCE Sustainability Copilot. I can analyze your carbon footprint, explain your persona, simulate what-if scenarios, or help you track weekly progress. What would you like to explore?`;
}

// AI Gateway client orchestrator
export class AiGateway {
  private static apiKey = process.env.ANTHROPIC_API_KEY || '';

  // Generate personalized rationale for recommendation
  static async generateRationale(
    actionTitle: string,
    impact: number,
    category: string,
    historyContext: string
  ): Promise<string> {
    if (!this.apiKey) {
      return getFallbackRecommendationRationale(actionTitle, impact, category);
    }

    try {
      // Claude API request mock/wrapper
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 100,
          messages: [
            { role: 'user', content: `Context: Action is "${actionTitle}" in category ${category} with monthly savings ${impact} kg CO2e. History Context: ${historyContext}. Prompt: ${RECOMMENDATION_RATIONALE_PROMPT}` }
          ]
        })
      });

      const json = await response.json();
      const text = json.content?.[0]?.text;
      if (text) return text.trim();
    } catch (err) {
      console.error('AI Gateway rationale generation failed, falling back:', err);
    }

    return getFallbackRecommendationRationale(actionTitle, impact, category);
  }

  // Generate Weekly Report Narrative
  static async generateReportNarrative(data: {
    userId: string;
    totalEmissions: number;
    savings: number;
    deltaPct: number;
    highlight: string;
  }): Promise<string> {
    if (!this.apiKey) {
      return getFallbackWeeklyReport(data);
    }

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 250,
          messages: [
            { role: 'user', content: `Context: Weekly emissions: ${data.totalEmissions} kg, savings: ${data.savings} kg, change: ${data.deltaPct}%, highlight: "${data.highlight}". Prompt: ${WEEKLY_REPORT_PROMPT}` }
          ]
        })
      });

      const json = await response.json();
      const text = json.content?.[0]?.text;
      if (text) return text.trim();
    } catch (err) {
      console.error('AI Gateway weekly report narrative failed, falling back:', err);
    }

    return getFallbackWeeklyReport(data);
  }

  // Generate Twin Scenario Comparative Narrative
  static async generateTwinNarrative(
    scenario: string,
    reductionPct: number,
    score: number,
    costSavings: number
  ): Promise<string> {
    if (!this.apiKey) {
      return getFallbackTwinNarrative(scenario, reductionPct, score, costSavings);
    }

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 150,
          messages: [
            { role: 'user', content: `Scenario: ${scenario}, Reduction: ${reductionPct}%, Score: ${score}/100, Cost Savings: $${costSavings}/month. Prompt: ${CARBON_TWIN_PROMPT}` }
          ]
        })
      });

      const json = await response.json();
      const text = json.content?.[0]?.text;
      if (text) return text.trim();
    } catch (err) {
      console.error('AI Gateway twin narrative failed, falling back:', err);
    }

    return getFallbackTwinNarrative(scenario, reductionPct, score, costSavings);
  }

  // Interactive Copilot Chat
  static async generateCopilotResponse(query: string, dataContext: any): Promise<string> {
    if (!this.apiKey) {
      return getFallbackCopilotReply(query, dataContext);
    }

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 300,
          system: COPILOT_SYSTEM_PROMPT,
          messages: [
            { role: 'user', content: `User query: "${query}". Context: ${JSON.stringify(dataContext)}` }
          ]
        })
      });

      const json = await response.json();
      const text = json.content?.[0]?.text;
      if (text) return text.trim();
    } catch (err) {
      console.error('AI Gateway copilot chat failed, falling back:', err);
    }

    return getFallbackCopilotReply(query, dataContext);
  }
}
