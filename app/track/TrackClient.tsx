'use client';

import React, { useState } from 'react';
import { ActivityLog, Category } from '../../types';
import { ActivityLogForm } from '../../components/forms/activity-log-form';
import { quickLogActivity } from '../dashboard/actions';
import { cn } from '../../lib/utils';
import { CalendarRange, History, Bus, Lightbulb, Apple, ShoppingBag, Plane } from 'lucide-react';

interface TrackClientProps {
  initialLogs: ActivityLog[];
}

export function TrackClient({ initialLogs }: TrackClientProps) {
  const [logs, setLogs] = useState<ActivityLog[]>(initialLogs);
  const [filter, setFilter] = useState<Category | 'all'>('all');

  const handleLogSubmit = async (values: { category: Category; subcategory: string; quantity: number; occurred_at: string; }) => {
    // 1. Trigger Server Action to insert in DB
    await quickLogActivity(values);
    
    // 2. Optimistic local state update (or rely on page refresh, since server action triggers page refresh we can append)
    const newLog: ActivityLog = {
      id: `log-temp-${Date.now()}`,
      user_id: 'current-user',
      category: values.category,
      subcategory: values.subcategory,
      quantity: values.quantity,
      unit: values.category === 'transportation' ? 'km' : values.category === 'electricity' ? 'kWh' : values.category === 'food' ? 'day' : values.category === 'shopping' ? 'USD' : 'flights',
      occurred_at: new Date(values.occurred_at).toISOString(),
      computed_emissions_kgco2e: Number((values.quantity * 0.25).toFixed(1)), // simple proxy for client-view before refresh
      source: 'manual',
      created_at: new Date().toISOString()
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const filteredLogs = filter === 'all' 
    ? logs 
    : logs.filter(l => l.category === filter);

  // Category Icons helper
  const icons = {
    transportation: <Bus className="h-4 w-4 text-category-transportation" />,
    electricity: <Lightbulb className="h-4 w-4 text-category-electricity" />,
    food: <Apple className="h-4 w-4 text-category-food" />,
    shopping: <ShoppingBag className="h-4 w-4 text-category-shopping" />,
    flights: <Plane className="h-4 w-4 text-category-flights" />
  };

  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold font-display text-text-primary tracking-tight flex items-center space-x-2">
          <CalendarRange className="h-6 w-6 text-primary" />
          <span>Activity Logging Hub</span>
        </h1>
        <p className="text-xs text-text-secondary mt-1">Input your real-world activities to calculate emissions and update recommendations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Logging Form */}
        <div className="lg:col-span-5 bg-surface border border-border p-6 rounded-2xl shadow-sm">
          <h3 className="font-semibold text-text-primary font-display text-base mb-4">Add Footprint Record</h3>
          <ActivityLogForm onSubmitSuccess={handleLogSubmit} />
        </div>

        {/* Right Side: Log History list */}
        <div className="lg:col-span-7 bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pb-2 border-b border-border">
            <h3 className="font-semibold text-text-primary font-display text-base flex items-center space-x-2">
              <History className="h-4.5 w-4.5 text-primary" />
              <span>Activity History Log</span>
            </h3>
            
            {/* Filter buttons */}
            <div className="flex flex-wrap gap-1 bg-surface-elevated border border-border/80 p-0.5 rounded-lg">
              {(['all', 'transportation', 'electricity', 'food', 'shopping', 'flights'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={cn(
                    'px-2 py-1 text-[9px] font-bold uppercase rounded-md cursor-pointer transition-colors',
                    filter === cat 
                      ? 'bg-surface text-text-primary shadow-sm' 
                      : 'text-text-secondary hover:text-text-primary'
                  )}
                >
                  {cat === 'all' ? 'All' : cat.substring(0, 5)}
                </button>
              ))}
            </div>
          </div>

          {/* Table list */}
          <div className="max-h-[480px] overflow-y-auto space-y-3 pr-1">
            {filteredLogs.length === 0 ? (
              <p className="text-xs text-text-muted text-center py-12">No activities recorded under this category filter.</p>
            ) : (
              filteredLogs.map((log) => (
                <div key={log.id} className="p-3.5 bg-surface-elevated border border-border/50 rounded-xl flex justify-between items-center hover:scale-[1.005] transition-transform duration-100">
                  <div className="flex items-center space-x-3.5">
                    <div className="p-2 bg-surface border border-border/60 rounded-lg flex items-center justify-center">
                      {icons[log.category]}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-text-primary capitalize">{log.subcategory}</h4>
                      <div className="flex items-center space-x-2 text-[10px] text-text-muted mt-1.5 font-medium">
                        <span>Quantity: <span className="font-tabular font-bold text-text-secondary">{log.quantity} {log.unit}</span></span>
                        <span>•</span>
                        <span>{new Date(log.occurred_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-primary font-tabular">
                      +{log.computed_emissions_kgco2e.toFixed(1)} kg CO2e
                    </span>
                    <span className="block text-[8px] text-text-muted uppercase font-bold tracking-wider mt-1">{log.source}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
