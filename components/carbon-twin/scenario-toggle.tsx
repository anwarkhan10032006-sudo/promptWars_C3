'use client';

import React from 'react';
import { Scenario } from '../../types';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

interface ScenarioToggleProps {
  selected: Scenario;
  onChange: (scenario: Scenario) => void;
  className?: string;
}

export function ScenarioToggle({ selected, onChange, className }: ScenarioToggleProps) {
  const options = [
    { value: 'current_trajectory' as const, label: 'Current Trajectory', color: 'bg-scenario-current' },
    { value: 'moderate' as const, label: 'Moderate', color: 'bg-scenario-moderate' },
    { value: 'aggressive' as const, label: 'Aggressive', color: 'bg-scenario-aggressive' }
  ];

  return (
    <div className={cn('flex p-1 bg-surface-elevated border border-border rounded-xl w-full md:w-auto self-center', className)}>
      {options.map((opt) => {
        const isActive = selected === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              'relative flex-1 md:flex-initial px-4 py-2 text-xs font-semibold rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer text-center whitespace-nowrap',
              isActive ? 'text-white' : 'text-text-secondary hover:text-text-primary'
            )}
          >
            {isActive && (
              <motion.div
                layoutId="activeScenarioBg"
                className={cn('absolute inset-0 rounded-lg shadow-sm', 
                  opt.value === 'current_trajectory' && 'bg-scenario-current',
                  opt.value === 'moderate' && 'bg-scenario-moderate',
                  opt.value === 'aggressive' && 'bg-scenario-aggressive'
                )}
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              />
            )}
            <span className="relative z-10">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
