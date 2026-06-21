'use client';

import React, { useState } from 'react';
import { CarbonTwinProjection, Scenario } from '../../types';
import { TwinSplitScreen } from '../../components/carbon-twin/twin-split-screen';
import { ScenarioToggle } from '../../components/carbon-twin/scenario-toggle';

interface CarbonTwinClientProps {
  projections: CarbonTwinProjection[];
}

export function CarbonTwinClient({ projections }: CarbonTwinClientProps) {
  const [scenario, setScenario] = useState<Scenario>('moderate');

  // Simple narrative generator based on scenario
  const narrativeText = scenario === 'aggressive' 
    ? "By adopting aggressive changes like switching to an EV and a plant-based diet, your future twin is drastically cutting emissions and saving significant costs."
    : "By making moderate, sustainable lifestyle tweaks, your future twin is steadily lowering emissions without major disruptions.";

  return (
    <div className="space-y-6">
      <div className="flex justify-center mb-8">
        <ScenarioToggle selected={scenario} onChange={setScenario} />
      </div>
      <TwinSplitScreen 
        projections={projections} 
        selectedScenario={scenario} 
        months={12} 
        narrativeText={narrativeText} 
      />
    </div>
  );
}
