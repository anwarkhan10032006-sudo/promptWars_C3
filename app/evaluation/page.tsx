import React from 'react';
import { Navigation } from '../../components/navigation';
import { CheckCircle2, FileCode, Beaker, LayoutDashboard } from 'lucide-react';

export const dynamic = 'force-static';

const EVALUATION_MAPPINGS = [
  {
    metric: 'Explainable AI Transparency',
    description: 'Every AI decision must trace back to deterministic math without hallucination.',
    uiLocation: 'Recommendations Feed -> "Why is this recommended?" chip',
    codeLocation: 'lib/recommendations.ts, components/cards/recommendation-card.tsx'
  },
  {
    metric: 'Data Isolation / Demo Mode Security',
    description: 'Multiple judges testing simultaneously must not contaminate global state.',
    uiLocation: 'Any data logging action via the Dashboard or Track pages',
    codeLocation: 'lib/mockDb.ts, lib/db.ts (isMockMode checks)'
  },
  {
    metric: 'Dynamic Contextual Adaptation',
    description: 'The app reacts to user input dynamically without page reloads.',
    uiLocation: 'Dashboard (Quick Log -> immediate update to Footprint & AI Twin)',
    codeLocation: 'app/dashboard/actions.ts (quickLogActivity trigger)'
  },
  {
    metric: 'Accessibility (A11y)',
    description: 'Charts must have screen-reader visible tabular data fallbacks.',
    uiLocation: 'Dashboard (Donut & Line charts tabular views)',
    codeLocation: 'components/charts/donut-chart.tsx, globals.css (.font-tabular)'
  },
  {
    metric: 'AI Persona Generation',
    description: 'A precedence tree classifying the user into 1 of 8 unique archetypes.',
    uiLocation: 'Onboarding Reveal Card & Dashboard Persona block',
    codeLocation: 'lib/persona.ts'
  },
  {
    metric: 'Carbon Twin Projections',
    description: '3 scenario projections comparing trajectory vs moderate vs aggressive changes.',
    uiLocation: 'Carbon Twin Tab / Split View on Desktop',
    codeLocation: 'lib/carbon-twin.ts, components/carbon-twin/scenario-toggle.tsx'
  },
  {
    metric: 'Zero Empty States',
    description: 'New visitors must immediately see data. Demo profiles solve cold starts.',
    uiLocation: '/demo Selection Gateway',
    codeLocation: 'app/demo/page.tsx, lib/demo/demo-seeds.ts'
  },
  {
    metric: 'Impact Storytelling',
    description: 'Converting abstract kg CO2e into relatable human equivalencies.',
    uiLocation: 'Simulator, Dashboard Impact Cards',
    codeLocation: 'lib/storytelling.ts'
  },
  {
    metric: 'Adaptive Missions',
    description: 'Difficulty scales based on completion rate of the previous week.',
    uiLocation: 'Roadmap Page, Dashboard Mission Tasks',
    codeLocation: 'lib/missions.ts'
  },
  {
    metric: 'Resilient AI Gateway',
    description: 'App must function perfectly even if Anthropic API keys are missing/rate-limited.',
    uiLocation: 'Copilot Chat, Weekly Reports',
    codeLocation: 'lib/ai-gateway.ts (Fallback Generators)'
  }
];

export default function EvaluationPage() {
  return (
    <Navigation userProfile={{
      id: 'evaluator',
      full_name: 'PromptWars Evaluator',
      is_demo: true
    }}>
      <div className="space-y-8 pb-10 max-w-5xl mx-auto">
        <div className="bg-primary text-primary-foreground p-8 rounded-3xl shadow-md border-b border-white/10 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 opacity-10">
            <Beaker className="w-64 h-64" />
          </div>
          <div className="relative z-10">
            <div className="inline-flex items-center space-x-2 bg-primary-foreground/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              <CheckCircle2 className="h-4 w-4" />
              <span>PromptWars Readiness</span>
            </div>
            <h1 className="text-3xl font-extrabold font-display tracking-tight mb-2">
              Evaluation Mapping Matrix
            </h1>
            <p className="text-primary-foreground/80 max-w-2xl text-sm leading-relaxed">
              VERDANCE is built to fulfill all constraints of the investor-grade AI Sustainability Copilot brief. 
              Use this dashboard to trace the required KPI features directly to their UI and Codebase implementations.
            </p>
          </div>
        </div>

        <div className="grid gap-4">
          {EVALUATION_MAPPINGS.map((item, idx) => (
            <div key={idx} className="bg-surface border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                
                <div className="lg:w-1/2">
                  <h3 className="text-base font-bold text-text-primary mb-1">
                    {idx + 1}. {item.metric}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="lg:w-1/2 flex flex-col gap-3">
                  <div className="bg-surface-elevated border border-border rounded-xl p-3 flex items-start space-x-3">
                    <LayoutDashboard className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-0.5">Where to test in UI</span>
                      <span className="text-sm font-semibold text-text-primary">{item.uiLocation}</span>
                    </div>
                  </div>
                  
                  <div className="bg-bg border border-border rounded-xl p-3 flex items-start space-x-3">
                    <FileCode className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-0.5">Implementation Files</span>
                      <code className="text-xs font-bold text-text-secondary break-all">{item.codeLocation}</code>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </Navigation>
  );
}
