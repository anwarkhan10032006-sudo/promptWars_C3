import React from 'react';
import { cn } from '../../lib/utils';

interface DifficultyBadgeProps {
  level: number; // 1-5
  className?: string;
}

export function DifficultyBadge({ level, className }: DifficultyBadgeProps) {
  const tiers = {
    1: { label: 'Tier 1: Very Easy', color: 'bg-category-food/15 text-category-food border-category-food/25' },
    2: { label: 'Tier 2: Easy', color: 'bg-category-flights/15 text-category-flights border-category-flights/25' },
    3: { label: 'Tier 3: Moderate', color: 'bg-category-electricity/15 text-category-electricity border-category-electricity/25' },
    4: { label: 'Tier 4: Challenging', color: 'bg-accent/15 text-accent border-accent/25' },
    5: { label: 'Tier 5: Hard', color: 'bg-danger/10 text-danger border-danger/25' }
  };

  const current = tiers[level as 1 | 2 | 3 | 4 | 5] || { label: 'Unknown', color: 'bg-border text-text-muted border-border' };

  return (
    <span className={cn('px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border', current.color, className)}>
      {current.label}
    </span>
  );
}
