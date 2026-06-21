import React from 'react';
import { cn } from '../../lib/utils';
import { Sparkles, ArrowDownRight, ArrowUpRight } from 'lucide-react';

interface ProgressNarrativeCardProps {
  narrativeText: string;
  deltaPct?: number; // MoM or WoW delta, optional
  className?: string;
}

export function ProgressNarrativeCard({ narrativeText, deltaPct = 0, className }: ProgressNarrativeCardProps) {
  const isReduction = deltaPct < 0;

  return (
    <div className={cn(
      'border p-5 rounded-xl flex flex-col space-y-3 shadow-sm relative overflow-hidden',
      isReduction 
        ? 'bg-category-food/5 border-category-food/25 text-text-primary'
        : 'bg-accent/5 border-accent/25 text-text-primary',
      className
    )}>
      {/* Visual background badge accent */}
      <div className="absolute -right-4 -bottom-4 opacity-10 text-primary">
        <Sparkles className="h-24 w-24" />
      </div>

      <div className="flex items-center space-x-2">
        <div className={cn(
          'p-1.5 rounded-full flex items-center justify-center text-white',
          isReduction ? 'bg-category-food' : 'bg-accent'
        )}>
          {isReduction ? <ArrowDownRight className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
        </div>
        <span className="font-semibold font-display text-sm">
          {isReduction ? 'Carbon Trend Improving' : 'Carbon Trend Spiked'}
        </span>
        {deltaPct !== 0 && (
          <span className={cn(
            'text-xs font-bold font-tabular px-2 py-0.5 rounded-full',
            isReduction ? 'bg-category-food/20 text-category-food' : 'bg-accent/20 text-accent'
          )}>
            {isReduction ? '' : '+'}{deltaPct.toFixed(1)}%
          </span>
        )}
      </div>

      <p className="text-sm text-text-secondary leading-relaxed relative z-10">
        {narrativeText}
      </p>
    </div>
  );
}
