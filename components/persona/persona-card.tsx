import React from 'react';
import { PersonaKey } from '../../types';
import { PERSONA_METADATA } from '../../lib/persona';
import { cn } from '../../lib/utils';
import { Compass, Shield, Plane, Car, EyeOff, Zap, Users, Leaf, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface PersonaCardProps {
  personaKey: PersonaKey;
  showDetails?: boolean;
  className?: string;
}

export function PersonaCard({ personaKey, showDetails = true, className }: PersonaCardProps) {
  const meta = PERSONA_METADATA[personaKey];
  if (!meta) return null;

  // Icon mapping
  const icons = {
    green_starter: <Compass className="h-8 w-8 text-white" />,
    climate_champion: <Shield className="h-8 w-8 text-white" />,
    frequent_flyer: <Plane className="h-8 w-8 text-white" />,
    daily_driver: <Car className="h-8 w-8 text-white" />,
    hidden_emitter: <EyeOff className="h-8 w-8 text-white" />,
    energy_explorer: <Zap className="h-8 w-8 text-white" />,
    household_optimizer: <Users className="h-8 w-8 text-white" />,
    conscious_commuter: <Leaf className="h-8 w-8 text-white" />
  };

  return (
    <div className={cn('bg-surface border border-border p-6 rounded-2xl shadow-sm flex flex-col justify-between', className)}>
      <div>
        {/* Header Block */}
        <div className="flex items-center space-x-4">
          <div 
            className="p-3.5 rounded-xl flex items-center justify-center shadow-sm"
            style={{ backgroundColor: meta.color }}
          >
            {icons[personaKey]}
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Active Persona</span>
            <h3 className="text-xl font-bold font-display text-text-primary mt-0.5">{meta.name}</h3>
          </div>
        </div>

        {/* Persona Description */}
        <p className="text-sm text-text-secondary mt-4 leading-relaxed">
          {meta.description}
        </p>

        {showDetails && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-border">
            {/* Strengths */}
            <div>
              <h4 className="text-xs font-bold uppercase text-text-primary tracking-wider mb-2">Strengths</h4>
              <ul className="space-y-1.5 text-xs text-text-secondary">
                {meta.strengths.map((str, i) => (
                  <li key={i} className="flex items-center space-x-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Opportunity Areas */}
            <div>
              <h4 className="text-xs font-bold uppercase text-text-primary tracking-wider mb-2">Opportunities</h4>
              <ul className="space-y-1.5 text-xs text-text-secondary">
                {meta.opportunity_areas.map((opp, i) => (
                  <li key={i} className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-accent" />
                    <span>{opp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Suggested first mission CTA */}
      <div className="mt-6 pt-5 border-t border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-xs">
          <span className="text-text-muted block">Suggested First Mission</span>
          <span className="font-bold text-text-primary">{meta.suggested_first_mission}</span>
        </div>
        <Link 
          href="/missions" 
          className="inline-flex items-center justify-center space-x-2 text-xs font-semibold text-white bg-primary px-4 py-2 rounded-lg hover:bg-opacity-95 focus:outline-none"
        >
          <span>Kickoff Mission</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
