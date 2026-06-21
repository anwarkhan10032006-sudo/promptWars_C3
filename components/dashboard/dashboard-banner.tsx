import React from 'react';
import { Button } from '../ui/button';
import { Category } from '../../types';
import { 
  Plus, Navigation as CommuteIcon, 
  Lightbulb, Apple, ShoppingBag, Plane 
} from 'lucide-react';

interface DashboardBannerProps {
  profileName: string;
  onQuickLogClick: (category: Category) => void;
}

export const DashboardBanner = React.memo(({ profileName, onQuickLogClick }: DashboardBannerProps) => {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 bg-surface border border-border p-6 rounded-2xl shadow-xs">
      <div>
        <h1 className="text-2xl font-extrabold font-display text-text-primary tracking-tight">
          Hello, {profileName}!
        </h1>
        <p className="text-xs text-text-secondary mt-1">Here is your carbon footprint dashboard for today.</p>
      </div>

      {/* Quick Log Shortcuts */}
      <div className="flex flex-col space-y-2">
        <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Quick Log Shortcut</span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onQuickLogClick('transportation')}
            className="p-2.5 rounded-xl bg-category-transportation/10 text-category-transportation hover:bg-category-transportation/25 cursor-pointer focus:outline-none"
            title="Log Commute"
          >
            <CommuteIcon className="h-4.5 w-4.5" />
          </button>
          <button
            onClick={() => onQuickLogClick('electricity')}
            className="p-2.5 rounded-xl bg-category-electricity/10 text-category-electricity hover:bg-category-electricity/25 cursor-pointer focus:outline-none"
            title="Log Electricity"
          >
            <Lightbulb className="h-4.5 w-4.5" />
          </button>
          <button
            onClick={() => onQuickLogClick('food')}
            className="p-2.5 rounded-xl bg-category-food/10 text-category-food hover:bg-category-food/25 cursor-pointer focus:outline-none"
            title="Log Meal"
          >
            <Apple className="h-4.5 w-4.5" />
          </button>
          <button
            onClick={() => onQuickLogClick('shopping')}
            className="p-2.5 rounded-xl bg-category-shopping/10 text-category-shopping hover:bg-category-shopping/25 cursor-pointer focus:outline-none"
            title="Log Shopping"
          >
            <ShoppingBag className="h-4.5 w-4.5" />
          </button>
          <button
            onClick={() => onQuickLogClick('flights')}
            className="p-2.5 rounded-xl bg-category-flights/10 text-category-flights hover:bg-category-flights/25 cursor-pointer focus:outline-none"
            title="Log Flight"
          >
            <Plane className="h-4.5 w-4.5" />
          </button>
          
          <Button
            onClick={() => onQuickLogClick('transportation')}
            variant="primary"
            size="sm"
            className="rounded-xl font-bold text-xs h-10 space-x-1"
          >
            <Plus className="h-4 w-4" />
            <span>Add Entry</span>
          </Button>
        </div>
      </div>
    </div>
  );
});

DashboardBanner.displayName = 'DashboardBanner';
