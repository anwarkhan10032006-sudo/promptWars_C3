'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../components/ui/button';
import { Leaf, ArrowRight, ArrowLeft } from 'lucide-react';
import { calculateEmissions } from '../../lib/emissions';
import { classifyUserPersona } from '../../lib/persona';
import { calculateEquivalencies } from '../../lib/storytelling';
import { PersonaRevealModal } from '../../components/persona/persona-reveal-modal';
import { finishOnboardingAction } from './actions';
import { PersonaKey } from '../../types';
import { OnboardingSteps } from './components/onboarding-steps';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Onboarding Form States
  const [region, setRegion] = useState('US-NW');
  const [householdSize, setHouseholdSize] = useState(1);
  const [homeType, setHomeType] = useState('Apartment');
  const [commuteMode, setCommuteMode] = useState('Petrol Car');
  const [commuteDistance, setCommuteDistance] = useState(20);
  const [diet, setDiet] = useState('Flexitarian Grocery Mix');
  const [shoppingSpend, setShoppingSpend] = useState(150);
  const [flightCount, setFlightCount] = useState(2);
  const [selectedGoalPct, setSelectedGoalPct] = useState(15);
  
  // Computed baseline stats
  const [baselineFootprint, setBaselineFootprint] = useState(0);
  const [detectedPersona, setDetectedPersona] = useState<PersonaKey>('green_starter');
  const [showPersonaReveal, setShowPersonaReveal] = useState(false);

  const totalSteps = 9;

  // Calculate baseline footprint based on answers
  const computeBaseline = () => {
    // Estimating monthly emissions based on onboarding values
    const transEmissions = calculateEmissions('transportation', commuteMode, commuteDistance * 4.3); // 4.3 weeks in a month
    const elecKwh = homeType === 'Apartment' ? 250 : 600;
    const elecEmissions = calculateEmissions('electricity', 'Grid Electricity', elecKwh, region);
    const foodEmissions = calculateEmissions('food', diet, 30); // 30 days
    const shoppingEmissions = calculateEmissions('shopping', 'Discretionary Spend', shoppingSpend);
    const flightEmissions = calculateEmissions('flights', 'Short-haul Flight', flightCount * 0.08); // average monthly proration

    const total = Number((transEmissions + elecEmissions + foodEmissions + shoppingEmissions + flightEmissions).toFixed(1));
    setBaselineFootprint(total);
    return total;
  };

  // Move forward in the wizard
  const nextStep = () => {
    if (step === 6) {
      // Calculate footprint before step 7 reveal
      computeBaseline();
    }
    setStep(prev => Math.min(totalSteps, prev + 1));
  };

  const prevStep = () => {
    setStep(prev => Math.max(1, prev - 1));
  };

  // Step 8: Persona Reveal handler
  const handleRevealPersona = () => {
    // Classify user persona
    const mockInput = {
      userId: 'onboarding-user',
      accountAgeDays: 0,
      householdSize,
      logs: [],
      rolling30dEmissions: {
        transportation: calculateEmissions('transportation', commuteMode, commuteDistance * 4.3),
        electricity: calculateEmissions('electricity', 'Grid Electricity', homeType === 'Apartment' ? 250 : 600, region),
        food: calculateEmissions('food', diet, 30),
        shopping: calculateEmissions('shopping', 'Discretionary Spend', shoppingSpend),
        flights: calculateEmissions('flights', 'Short-haul Flight', flightCount)
      },
      monthlyHistory: []
    };
    
    const persona = classifyUserPersona(mockInput);
    setDetectedPersona(persona);
    setShowPersonaReveal(true);
  };

  // Finish onboarding & redirect
  const handleFinishOnboarding = async (acceptMission: boolean) => {
    setLoading(true);
    try {
      await finishOnboardingAction({
        region,
        householdSize,
        homeType,
        commuteMode,
        commuteDistance,
        selectedGoalPct
      });
      router.push(acceptMission ? '/missions' : '/dashboard');
    } catch {
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Equivalencies for baseline reveal
  const revealEquivs = calculateEquivalencies(baselineFootprint);

  return (
    <div className="min-h-screen bg-bg text-text-primary flex flex-col justify-between py-12 px-6">
      
      {/* Header */}
      <div className="max-w-2xl w-full mx-auto flex items-center justify-between pb-6 border-b border-border">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-primary rounded-lg text-white">
            <Leaf className="h-5 w-5" />
          </div>
          <span className="font-extrabold font-display text-base tracking-tight">VERDANCE SETUP</span>
        </div>
        <div className="text-xs font-semibold text-text-muted">
          Step {step} of {totalSteps}
        </div>
      </div>

      {/* Main Wizard Slider */}
      <div className="max-w-xl w-full mx-auto bg-surface border border-border p-8 rounded-3xl shadow-lg my-12 flex-1 flex flex-col justify-between">
        
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.18 }}
            className="flex-1 flex flex-col justify-center"
          >
            <OnboardingSteps
              step={step}
              homeType={homeType}
              setHomeType={setHomeType}
              householdSize={householdSize}
              setHouseholdSize={setHouseholdSize}
              region={region}
              setRegion={setRegion}
              commuteMode={commuteMode}
              setCommuteMode={setCommuteMode}
              commuteDistance={commuteDistance}
              setCommuteDistance={setCommuteDistance}
              diet={diet}
              setDiet={setDiet}
              shoppingSpend={shoppingSpend}
              setShoppingSpend={setShoppingSpend}
              flightCount={flightCount}
              setFlightCount={setFlightCount}
              selectedGoalPct={selectedGoalPct}
              setSelectedGoalPct={setSelectedGoalPct}
              baselineFootprint={baselineFootprint}
              revealEquivs={revealEquivs}
              handleRevealPersona={handleRevealPersona}
              handleFinishOnboarding={handleFinishOnboarding}
              loading={loading}
            />
          </motion.div>
        </AnimatePresence>

        {/* Wizard Footer controls */}
        {step < 8 && (
          <div className="flex justify-between items-center pt-6 mt-6 border-t border-border">
            <button
              onClick={prevStep}
              disabled={step === 1}
              className="flex items-center space-x-1 text-xs font-semibold text-text-muted hover:text-text-primary disabled:opacity-35 cursor-pointer disabled:pointer-events-none"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>

            <Button
              onClick={nextStep}
              variant="primary"
              size="sm"
              className="font-bold text-xs shadow-sm h-10 space-x-1"
            >
              <span>Continue</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Footer Branding */}
      <div className="text-center text-[10px] text-text-muted">
        VERDANCE Sustainability Copilot &copy; 2026. All rights reserved.
      </div>

      {/* Modal revealed at Step 8 */}
      <PersonaRevealModal
        isOpen={showPersonaReveal}
        onClose={() => {
          setShowPersonaReveal(false);
          setStep(9);
        }}
        personaKey={detectedPersona}
      />
    </div>
  );
}
