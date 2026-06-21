import React from 'react';
import { calculateEquivalencies } from '../../lib/storytelling';
import { cn } from '../../lib/utils';
import { Smartphone, Car, Home, Trees } from 'lucide-react';

interface EmissionEquivalentPanelProps {
  kgco2e: number;
  className?: string;
}

export function EmissionEquivalentPanel({ kgco2e, className }: EmissionEquivalentPanelProps) {
  const equivalents = calculateEquivalencies(Math.abs(kgco2e));

  const items = [
    {
      key: 'car_km',
      icon: <Car className="h-5 w-5 text-category-transportation" />,
      color: 'bg-category-transportation/10',
      title: 'Drive Offset',
      ...equivalents.car_km
    },
    {
      key: 'smartphone_charge',
      icon: <Smartphone className="h-5 w-5 text-category-flights" />,
      color: 'bg-category-flights/10',
      title: 'Phone Charges',
      ...equivalents.smartphone_charge
    },
    {
      key: 'home_day_powered',
      icon: <Home className="h-5 w-5 text-category-electricity" />,
      color: 'bg-category-electricity/10',
      title: 'Home Energy',
      ...equivalents.home_day_powered
    },
    {
      key: 'tree_year_absorption',
      icon: <Trees className="h-5 w-5 text-category-food" />,
      color: 'bg-category-food/10',
      title: 'Tree Absorption',
      ...equivalents.tree_year_absorption
    }
  ];

  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-4 gap-4', className)}>
      {items.map((item) => (
        <div key={item.key} className="bg-surface border border-border p-4 rounded-xl flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">{item.title}</span>
            <div className={cn('p-2 rounded-lg', item.color)}>
              {item.icon}
            </div>
          </div>
          <div className="mt-4">
            <h5 className="text-2xl font-bold font-display text-text-primary tracking-tight">
              {item.value.toLocaleString()}
            </h5>
            <p className="text-[12px] text-text-secondary mt-1 leading-snug">
              {item.key === 'car_km' && 'km driven'}
              {item.key === 'smartphone_charge' && 'smartphone charges'}
              {item.key === 'home_day_powered' && 'home-days powered'}
              {item.key === 'tree_year_absorption' && 'tree-years of absorption'}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
