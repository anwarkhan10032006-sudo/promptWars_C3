# VERDANCE: AI Sustainability Copilot

VERDANCE is an elite, production-grade AI Sustainability Copilot built to help users trace, understand, and reduce their carbon footprint through simple actions and explainable AI insights.

## Core Stack
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 + shadcn/ui components (using native CSS variables for dynamic theming)
- **Animations**: Framer Motion
- **Data Visualization**: Recharts (with accessible screen-reader table fallbacks)
- **Data & Auth**: Supabase (with fully scoped Row-Level Security)
- **AI Gateway**: Anthropic Claude API (with deterministic fallback wrappers)

---

## 🏛 Architecture Overview

Verdance is architected to guarantee isolated, ephemeral sessions for demo purposes while retaining production readiness.

1. **AI Gateway (`lib/ai-gateway.ts`)**: Server-side client orchestrator mediating LLM calls. Enforces strict JSON structure and uses a rule-based fallback generator if API keys are missing.
2. **Pure Logic Engines (`lib/emissions.ts`, `lib/recommendations.ts`, `lib/carbon-twin.ts`)**: All mathematical processing lives here. They operate purely on arguments and produce deterministic outputs, easily tested by Vitest.
3. **Mock DB Isolation (`lib/mockDb.ts`)**: A resilient session manager mapping `verdance_session_id` cookies to transient JSON states. Ensures Demo profiles and judges do not pollute the global footprint aggregations.
4. **On-Write Reactivity (`app/dashboard/actions.ts`)**: Logging an activity triggers a server action that synchronously recompiles the user's Carbon Twin and Recommendation Feed.

---

## 🧠 Core Decisions Logic

- **Recommendations Feed**: Actions are scored with weighted multipliers: `(Impact * 0.5) + ((6 - Effort) * 0.3) + (GoalAlignment * 0.2)`.
- **Carbon Twin Projections**: Projects future emissions under three scenarios: Current Trajectory (0% reduction), Moderate (50% adoption of active recommendations), and Aggressive (100% adoption).
- **Adaptive Missions**: Uses a state machine. If week 1 completion rate is >80%, week 2 difficulty increments. If <40%, it decrements and surfaces encouragement.

---

## 🛠 Environment Setup

1. `npm install`
2. Create a `.env.local` containing:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ANTHROPIC_API_KEY=...
   ```
   *(Note: Verdance runs perfectly in offline/Mock Mode if keys are absent.)*
3. `npm run dev`

---

## 🧪 CI Pipeline Flow
1. `npm run lint` (ESLint Next.js checks)
2. `npx tsc --noEmit` (TypeScript strict compliance)
3. `npx vitest run` (Unit tests for math and logic engines)
4. Playwright E2E & Axe-core a11y scans (Run via CI runner)

---

## 🏆 PromptWars Evaluation Mapping

| Metric | Code Location / Implementation Detail | UI Testing Surface |
|--------|---------------------------------------|--------------------|
| **Explainable AI Transparency** | `lib/recommendations.ts` & `ai-gateway.ts`. AI decisions trace back to hardcoded metrics without hallucinations. | Expand the "Why is this recommended?" chip on any Recommendation Card. |
| **Demo Mode Security** | `lib/mockDb.ts`. Judges interact with isolated, transient session data. | Log an activity and verify it only updates your local Dashboard, not the base database. |
| **Contextual Adaptation** | `app/dashboard/actions.ts`. Mutating activities immediately recompiles recommendations. | Log a new activity on the Dashboard. Watch your Footprint total and AI insights instantly update. |
| **Accessibility (A11y)** | `components/charts/donut-chart.tsx`. Visualizations always render standard accessible HTML tables behind the canvas. | Use a screen reader on the Dashboard or Insights pages. |
| **AI Persona Generation** | `lib/persona.ts`. Precedence tree sorts the user into 1 of 8 unique archetypes. | Revealed via 3D card-flip during Onboarding, always visible on Dashboard. |
| **Carbon Twin Projections** | `lib/carbon-twin.ts`. 3 scenarios calculating future carbon offsets. | Go to Carbon Twin tab on Dashboard, toggle the scenario buttons. |
| **Impact Storytelling** | `lib/storytelling.ts`. Converts abstract CO2 values to relatable human equivalencies. | Adjust sliders in the Impact Simulator page. |
| **Resilient AI Gateway** | `lib/ai-gateway.ts`. Fallback logic generates perfect matching structured responses offline. | Use the AI Copilot Chat without an internet connection / API key. |
