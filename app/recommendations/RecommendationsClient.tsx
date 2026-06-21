'use client';

import React, { useState, useTransition } from 'react';
import { Recommendation, Category } from '../../types';
import { RecommendationCard } from '../../components/cards/recommendation-card';
import { acceptRecommendationAction, dismissRecommendationAction } from './actions';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Layers, Zap } from 'lucide-react';

interface RecommendationsClientProps {
  initialRecommendations: Recommendation[];
}

export function RecommendationsClient({ initialRecommendations }: RecommendationsClientProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>(initialRecommendations);
  const [filterCategory, setFilterCategory] = useState<Category | 'all'>('all');
  const [filterEffort, setFilterEffort] = useState<'all' | number>('all');
  const [, startTransition] = useTransition();

  const handleAccept = (recId: string) => {
    // Optimistic update
    setRecommendations(prev => prev.filter(r => r.id !== recId));
    
    startTransition(async () => {
      await acceptRecommendationAction(recId);
    });
  };

  const handleDismiss = (recId: string) => {
    // Optimistic update
    setRecommendations(prev => prev.filter(r => r.id !== recId));
    
    startTransition(async () => {
      await dismissRecommendationAction(recId);
    });
  };

  const filteredRecs = recommendations.filter(rec => {
    if (filterCategory !== 'all' && rec.category !== filterCategory) return false;
    if (filterEffort !== 'all' && rec.effort_score !== filterEffort) return false;
    return true;
  });

  return (
    <div className="space-y-8 pb-10 max-w-6xl mx-auto">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-surface border border-border p-6 rounded-2xl shadow-xs">
        <div>
          <h1 className="text-2xl font-extrabold font-display text-text-primary tracking-tight">
            AI Recommendations
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Personalized actions generated from your footprint profile and persona.
          </p>
        </div>
        
        {/* Total Impact Summary Badge */}
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Potential Savings</span>
          <div className="text-primary font-bold flex items-center space-x-1.5 mt-1 bg-primary/10 px-3 py-1.5 rounded-xl border border-primary/20">
            <Zap className="h-4 w-4" />
            <span className="font-tabular font-display text-lg">
              {recommendations.reduce((sum, r) => sum + r.predicted_impact_kgco2e_per_month, 0).toFixed(0)} kg CO2e / mo
            </span>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-4 border-b border-border pb-4">
        <div className="flex items-center space-x-2 text-sm text-text-muted font-semibold mr-2">
          <Filter className="h-4 w-4" />
          <span>Filters</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-text-muted">Category:</span>
          <select 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as Category | 'all')}
            className="text-xs bg-surface border border-border rounded-lg px-2 py-1.5 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="all">All Categories</option>
            <option value="transportation">Transportation</option>
            <option value="electricity">Electricity</option>
            <option value="food">Food</option>
            <option value="shopping">Shopping</option>
            <option value="flights">Flights</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-text-muted">Effort:</span>
          <select 
            value={filterEffort}
            onChange={(e) => setFilterEffort(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="text-xs bg-surface border border-border rounded-lg px-2 py-1.5 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="all">All Efforts</option>
            <option value="1">Very Low</option>
            <option value="2">Low</option>
            <option value="3">Medium</option>
            <option value="4">High</option>
            <option value="5">Very High</option>
          </select>
        </div>
      </div>

      {/* Recommendations Grid */}
      {filteredRecs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredRecs.map((rec) => (
              <motion.div
                key={rec.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <RecommendationCard 
                  recommendation={rec}
                  onAccept={handleAccept}
                  onDismiss={handleDismiss}
                  className="h-full"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 text-center bg-surface border border-border border-dashed rounded-3xl">
          <div className="p-4 bg-primary/5 text-primary rounded-full mb-4">
            <Layers className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-text-primary mb-2">No active recommendations</h3>
          <p className="text-sm text-text-secondary max-w-md">
            You have accepted or dismissed all active recommendations matching your filters. Log more activities to trigger the AI engine to find new savings opportunities.
          </p>
        </div>
      )}
    </div>
  );
}
