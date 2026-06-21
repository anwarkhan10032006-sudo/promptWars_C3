import React from 'react';
import { Button } from '../../../components/ui/button';
import { Check, Sparkles } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface OnboardingStepsProps {
  step: number;
  homeType: string;
  setHomeType: (t: string) => void;
  householdSize: number;
  setHouseholdSize: (n: number) => void;
  region: string;
  setRegion: (r: string) => void;
  commuteMode: string;
  setCommuteMode: (m: string) => void;
  commuteDistance: number;
  setCommuteDistance: (d: number) => void;
  diet: string;
  setDiet: (d: string) => void;
  shoppingSpend: number;
  setShoppingSpend: (s: number) => void;
  flightCount: number;
  setFlightCount: (f: number) => void;
  selectedGoalPct: number;
  setSelectedGoalPct: (g: number) => void;
  baselineFootprint: number;
  revealEquivs: {
    car_km?: { value: number };
    smartphone_charge?: { value: number };
  };
  handleRevealPersona: () => void;
  handleFinishOnboarding: (accept: boolean) => void;
  loading: boolean;
}

export function OnboardingSteps({
  step,
  homeType,
  setHomeType,
  householdSize,
  setHouseholdSize,
  region,
  setRegion,
  commuteMode,
  setCommuteMode,
  commuteDistance,
  setCommuteDistance,
  diet,
  setDiet,
  shoppingSpend,
  setShoppingSpend,
  flightCount,
  setFlightCount,
  selectedGoalPct,
  setSelectedGoalPct,
  baselineFootprint,
  revealEquivs,
  handleRevealPersona,
  handleFinishOnboarding,
  loading
}: OnboardingStepsProps) {
  return (
    <>
      {/* STEP 1: Welcome Explainer */}
      {step === 1 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-extrabold font-display text-text-primary tracking-tight">
            Welcome to VERDANCE
          </h2>
          <p className="text-xs text-text-secondary leading-relaxed">
            Verdance helps you reduce your carbon footprint through three simple, automated pillars:
          </p>
          <div className="space-y-3">
            <div className="bg-surface-elevated p-4 rounded-xl border border-border flex items-start space-x-3">
              <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">1</div>
              <div>
                <h4 className="font-bold text-xs text-text-primary">Track Activities</h4>
                <p className="text-[11px] text-text-secondary mt-1">Log transport, utilities, food, shopping, and flight logs manually or via connected APIs.</p>
              </div>
            </div>
            <div className="bg-surface-elevated p-4 rounded-xl border border-border flex items-start space-x-3">
              <div className="w-5 h-5 rounded-full bg-category-food/20 text-category-food flex items-center justify-center font-bold text-xs">2</div>
              <div>
                <h4 className="font-bold text-xs text-text-primary">Understand Insights</h4>
                <p className="text-[11px] text-text-secondary mt-1">See your sustainability persona card, explore forecasting trends, and interact with your Carbon Twin.</p>
              </div>
            </div>
            <div className="bg-surface-elevated p-4 rounded-xl border border-border flex items-start space-x-3">
              <div className="w-5 h-5 rounded-full bg-accent/20 text-accent flex items-center justify-center font-bold text-xs">3</div>
              <div>
                <h4 className="font-bold text-xs text-text-primary">Take Action</h4>
                <p className="text-[11px] text-text-secondary mt-1">Unlock ranked suggestions, start 30-day missions, and streaks that align with your targets.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Household Basics */}
      {step === 2 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-extrabold font-display text-text-primary tracking-tight">
            Tell us about your Household
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Home Type</label>
              <div className="grid grid-cols-2 gap-3">
                {['Apartment', 'Single Family Home'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setHomeType(t)}
                    className={cn(
                      'p-3 border rounded-xl text-center text-xs font-semibold cursor-pointer',
                      homeType === t ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-surface-elevated'
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Household Size</label>
              <div className="flex space-x-3">
                {[1, 2, 3, 4, '5+'].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setHouseholdSize(typeof num === 'number' ? num : 5)}
                    className={cn(
                      'w-11 h-11 border rounded-xl font-bold font-tabular text-sm flex items-center justify-center cursor-pointer',
                      (typeof num === 'number' ? householdSize === num : householdSize >= 5) 
                        ? 'border-primary bg-primary/5 text-primary' 
                        : 'border-border bg-surface-elevated'
                    )}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Electricity Grid Region</label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full h-11 border border-border rounded-lg px-3 bg-surface text-text-primary text-sm focus:outline-none"
              >
                <option value="US-NW">Pacific Northwest (Coal/Hydro mix)</option>
                <option value="US-NE">Northeast Grid (Natural gas heavy)</option>
                <option value="US-MW">Midwest Grid (High coal share)</option>
                <option value="US-CA">California Grid (Solar/Renewable mix)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Transportation Profile */}
      {step === 3 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-extrabold font-display text-text-primary tracking-tight">
            Your Commuting Habits
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Primary Mode of Transport</label>
              <div className="grid grid-cols-3 gap-3">
                {['Petrol Car', 'Bus/Transit', 'Electric Vehicle'].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setCommuteMode(mode)}
                    className={cn(
                      'p-3 border rounded-xl text-center text-xs font-semibold cursor-pointer',
                      commuteMode === mode ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-surface-elevated'
                    )}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
                Weekly Commute Distance
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min={0}
                  max={300}
                  step={10}
                  value={commuteDistance}
                  onChange={(e) => setCommuteDistance(Number(e.target.value))}
                  className="flex-1 accent-primary cursor-pointer"
                />
                <span className="w-20 text-right text-sm font-bold font-tabular text-text-primary">
                  {commuteDistance} km
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: Food Preferences */}
      {step === 4 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-extrabold font-display text-text-primary tracking-tight">
            Your Food & Diet
          </h2>
          <div className="space-y-4">
            <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Primary Diet Pattern</label>
            <div className="space-y-2">
              {[
                { key: 'Meat-Heavy Grocery Mix', label: 'Meat Lover (Beef/Pork frequently)' },
                { key: 'Flexitarian Grocery Mix', label: 'Flexitarian (Occasional red meat/poultry)' },
                { key: 'Vegetarian Meal', label: 'Vegetarian (No meat, consumes dairy/eggs)' },
                { key: 'Vegan Diet Plan', label: 'Vegan (100% plant-based)' }
              ].map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setDiet(opt.key)}
                  className={cn(
                    'w-full p-4 border rounded-xl text-left text-xs font-semibold cursor-pointer flex justify-between items-center',
                    diet === opt.key ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-surface-elevated'
                  )}
                >
                  <span>{opt.label}</span>
                  {diet === opt.key && <Check className="h-4 w-4 text-primary" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: Shopping & Flights */}
      {step === 5 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-extrabold font-display text-text-primary tracking-tight">
            Discretionary Habits
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Rough Monthly Retail Spend</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: '< $100', val: 50 },
                  { label: '$100 - $300', val: 200 },
                  { label: '> $300', val: 450 }
                ].map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setShoppingSpend(opt.val)}
                    className={cn(
                      'p-3 border rounded-xl text-center text-xs font-semibold cursor-pointer',
                      shoppingSpend === opt.val ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-surface-elevated'
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Flights Taken in Last 12 Months</label>
              <div className="flex space-x-3">
                {[0, 1, 2, 4, '6+'].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setFlightCount(typeof num === 'number' ? num : 8)}
                    className={cn(
                      'w-11 h-11 border rounded-xl font-bold font-tabular text-sm flex items-center justify-center cursor-pointer',
                      (typeof num === 'number' ? flightCount === num : flightCount >= 6) 
                        ? 'border-primary bg-primary/5 text-primary' 
                        : 'border-border bg-surface-elevated'
                    )}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 6: Goal Selection */}
      {step === 6 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-extrabold font-display text-text-primary tracking-tight">
            Choose a Starting Target
          </h2>
          <p className="text-xs text-text-secondary leading-relaxed">
            Setting a footprint reduction goal directs our AI recommendations engine toward specific categories.
          </p>
          <div className="space-y-2.5">
            {[
              { pct: 10, label: 'Modest Carbon Shift (-10%)' },
              { pct: 15, label: 'Recommended: Active Reductions (-15%)' },
              { pct: 25, label: 'Aggressive: Net Zero Pace (-25%)' }
            ].map((opt) => (
              <button
                key={opt.pct}
                type="button"
                onClick={() => setSelectedGoalPct(opt.pct)}
                className={cn(
                  'w-full p-4 border rounded-xl text-left text-xs font-semibold cursor-pointer flex justify-between items-center',
                  selectedGoalPct === opt.pct ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-surface-elevated'
                )}
              >
                <span>{opt.label}</span>
                {selectedGoalPct === opt.pct && <Check className="h-4 w-4 text-primary" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 7: Baseline Reveal */}
      {step === 7 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-extrabold font-display text-text-primary tracking-tight">
            Your Estimated Footprint
          </h2>
          <div className="bg-surface-elevated border border-border p-6 rounded-2xl text-center shadow-inner">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Estimated Monthly emissions</span>
            <div className="text-5xl font-extrabold font-tabular text-primary mt-2">
              {baselineFootprint} <span className="text-base font-semibold text-text-secondary">kg CO2e</span>
            </div>
          </div>

          {/* Relatable equivalence story */}
          <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl text-xs space-y-2 leading-relaxed">
            <div className="flex items-center space-x-1 text-primary font-bold">
              <Sparkles className="h-4 w-4" />
              <span>Storytelling Equivalence</span>
            </div>
            <p className="text-text-secondary">
              Your footprint is equivalent to driving a gasoline car for{' '}
              <span className="font-bold text-text-primary font-tabular">
                {revealEquivs.car_km?.value || 0} km
              </span>{' '}
              or charging a phone{' '}
              <span className="font-bold text-text-primary font-tabular">
                {revealEquivs.smartphone_charge?.value || 0} times
              </span>.
            </p>
          </div>

          {/* Benchmark compared to average */}
          <p className="text-xs text-text-secondary text-center leading-relaxed">
            Your footprint is about{' '}
            <span className="font-bold text-text-primary">
              {baselineFootprint > 400 ? '25% higher than' : '30% lower than'}
            </span>{' '}
            the national average monthly footprint of 400 kg.
          </p>
        </div>
      )}

      {/* STEP 8: Persona Reveal Kickoff */}
      {step === 8 && (
        <div className="space-y-6 text-center">
          <h2 className="text-2xl font-extrabold font-display text-text-primary tracking-tight">
            Your Carbon Persona Card
          </h2>
          <p className="text-xs text-text-secondary leading-relaxed max-w-sm mx-auto">
            Based on your answers, our Persona Engine classified your behavior. Click below to reveal your starting persona badge.
          </p>

          <div className="pt-6">
            <Button onClick={handleRevealPersona} variant="accent" className="w-full max-w-xs font-bold text-base shadow-md">
              Reveal Persona Card
            </Button>
          </div>
        </div>
      )}

      {/* STEP 9: Mission Kickoff */}
      {step === 9 && (
        <div className="space-y-6 text-center">
          <h2 className="text-2xl font-extrabold font-display text-text-primary tracking-tight">
            Kickoff your First Mission
          </h2>
          <p className="text-xs text-text-secondary leading-relaxed max-w-sm mx-auto">
            {"Ready to act? Let's start your first 30-Day Mission, pre-built with 4 weeks of custom actions tailored to your target."}
          </p>

          <div className="space-y-3 pt-6 w-full max-w-xs mx-auto">
            <Button disabled={loading} onClick={() => handleFinishOnboarding(true)} variant="primary" className="w-full h-11 font-bold text-sm">
              {loading ? 'Starting...' : 'Accept Mission & Start'}
            </Button>
            <Button disabled={loading} onClick={() => handleFinishOnboarding(false)} variant="outline" className="w-full h-11 text-xs text-text-muted">
              {loading ? 'Entering...' : 'Skip and go to Dashboard'}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
