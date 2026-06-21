import React from 'react';
import { calculateEquivalencies } from '../../lib/storytelling';
import { cn } from '../../lib/utils';
import { Smartphone, Car, Home, Trees } from 'lucide-react';

interface ImpactStoryCardProps {
  kgco2e: number;
  label?: string;
  className?: string;
  preferredType?: 'car_km' | 'smartphone_charge' | 'home_day_powered' | 'tree_year_absorption';
}

export function ImpactStoryCard({ kgco2e, label, className, preferredType = 'smartphone_charge' }: ImpactStoryCardProps) {
  const equivalents = calculateEquivalencies(Math.abs(kgco2e));
  const equiv = equivalents[preferredType];

  if (!equiv) return null;

  // Icon mapping
  const icons = {
    car_km: <Car className="h-6 w-6 text-category-transportation" />,
    smartphone_charge: <Smartphone className="h-6 w-6 text-category-flights" />,
    home_day_powered: <Home className="h-6 w-6 text-category-electricity" />,
    tree_year_absorption: <Trees className="h-6 w-6 text-category-food" />
  };

  return (
    <div className={cn('bg-surface-elevated border border-border p-5 rounded-xl flex items-center space-x-4 shadow-sm hover:scale-[1.01] transition-transform duration-120', className)}>
      <div className="p-3 bg-border/20 rounded-lg flex items-center justify-center">
        {icons[preferredType]}
      </div>
      <div className="flex-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          {label || (kgco2e >= 0 ? 'Carbon Equivalent' : 'Carbon Saved')}
        </span>
        <h4 className="text-lg font-bold font-display text-text-primary mt-0.5">
          {equiv.value.toLocaleString()} {equiv.description}
        </h4>
        <p className="text-[11px] text-text-muted mt-1 italic">
          Source: {equiv.source_citation}
        </p>
      </div>
    </div>
  );
}
