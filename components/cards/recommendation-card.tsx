'use client';

import React, { useState } from 'react';
import { Recommendation } from '../../types';
import { cn } from '../../lib/utils';
import { HelpCircle, Check, X, ChevronDown, ChevronUp, Zap, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface RecommendationCardProps {
  recommendation: Recommendation;
  onAccept?: (recId: string) => void;
  onDismiss?: (recId: string) => void;
  className?: string;
}

export function RecommendationCard({ recommendation, onAccept, onDismiss, className }: RecommendationCardProps) {
  const [expanded, setExpanded] = useState(false);

  const categoryColors = {
    transportation: 'bg-category-transportation',
    electricity: 'bg-category-electricity',
    food: 'bg-category-food',
    shopping: 'bg-category-shopping',
    flights: 'bg-category-flights'
  };

  const effortLabels = {
    1: 'Very Low',
    2: 'Low',
    3: 'Medium',
    4: 'High',
    5: 'Very High'
  };

  return (
    <div className={cn('bg-surface border border-border p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-120 flex flex-col justify-between space-y-4', className)}>
      <div>
        {/* Category Badge & Impact */}
        <div className="flex justify-between items-center">
          <span className={cn('px-2.5 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-wider', categoryColors[recommendation.category])}>
            {recommendation.category}
          </span>
          <span className="text-xs font-bold text-primary flex items-center space-x-1">
            <Zap className="h-3.5 w-3.5 fill-primary" />
            <span className="font-tabular font-extrabold">-{recommendation.predicted_impact_kgco2e_per_month} kg/mo</span>
          </span>
        </div>

        {/* Title & Description */}
        <h4 className="text-base font-bold font-display text-text-primary mt-3 leading-tight">
          {recommendation.action_title}
        </h4>
        <p className="text-xs text-text-secondary mt-1 leading-relaxed">
          {recommendation.action_description}
        </p>

        {/* Effort & Confidence metrics row */}
        <div className="flex items-center space-x-4 mt-3 text-[11px] font-semibold text-text-muted">
          <div>
            <span>Effort: </span>
            <span className="text-text-secondary">{effortLabels[recommendation.effort_score as 1|2|3|4|5] || 'Medium'}</span>
          </div>
          <div>
            <span>Confidence: </span>
            <span className="text-text-secondary">{(recommendation.confidence_score * 100).toFixed(0)}%</span>
          </div>
        </div>

        {/* Expandable "Why this?" Rationale Chip */}
        <div className="mt-4 pt-1">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-primary hover:underline focus:outline-none cursor-pointer"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Why is this recommended?</span>
            {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>

          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="overflow-hidden"
              >
                <div className="mt-2.5 p-3.5 bg-surface-elevated border border-border/80 rounded-xl text-xs space-y-2 leading-relaxed">
                  <div className="flex items-center space-x-1.5 text-primary font-semibold">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>AI Rationale Explanation</span>
                  </div>
                  <p className="text-text-secondary">{recommendation.rationale_text}</p>
                  
                  {/* AI Scoring Breakdown */}
                  <div className="pt-2 border-t border-border mt-2">
                    <span className="block font-bold text-text-primary mb-1">AI Scoring Breakdown:</span>
                    <div className="text-[11px] text-text-secondary space-y-1">
                      <div className="flex justify-between">
                        <span>Carbon Impact (50%):</span>
                        <span className="font-bold text-text-primary">
                          +{(recommendation.predicted_impact_kgco2e_per_month * 0.5).toFixed(1)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Feasibility / Effort (30%):</span>
                        <span className="font-bold text-text-primary">
                          +{((6 - recommendation.effort_score) * 0.3).toFixed(1)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Goal Alignment (20%):</span>
                        <span className="font-bold text-text-primary">
                          +{((recommendation.rationale_text.toLowerCase().includes('goal') || recommendation.rationale_text.toLowerCase().includes('align')) ? 0.3 : 0.1).toFixed(1)}
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-border/40 pt-1 font-bold text-primary">
                        <span>Total Decision Score:</span>
                        <span>
                          {(
                            (recommendation.predicted_impact_kgco2e_per_month * 0.5) +
                            ((6 - recommendation.effort_score) * 0.3) +
                            ((recommendation.rationale_text.toLowerCase().includes('goal') || recommendation.rationale_text.toLowerCase().includes('align')) ? 0.3 : 0.1)
                          ).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Traceable Data points list */}
                  {recommendation.rationale_data_points && Object.keys(recommendation.rationale_data_points).length > 0 && (
                    <div className="pt-2 border-t border-border mt-2">
                      <span className="block font-bold text-text-primary mb-1">Calculation parameters:</span>
                      <div className="grid grid-cols-2 gap-1 text-[11px] text-text-secondary font-tabular">
                        {Object.entries(recommendation.rationale_data_points).map(([k, v]) => (
                          <div key={k} className="flex justify-between border-b border-border/20 py-0.5 pr-2">
                            <span className="capitalize">{k.replace(/_/g, ' ')}:</span>
                            <span className="font-bold text-text-primary">{String(v)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Action Buttons */}
      {recommendation.status === 'active' && (
        <div className="flex items-center space-x-2 pt-2">
          {onAccept && (
            <Button
              onClick={() => onAccept(recommendation.id)}
              variant="primary"
              size="sm"
              className="flex-1 space-x-1"
            >
              <Check className="h-4 w-4" />
              <span>Accept</span>
            </Button>
          )}
          {onDismiss && (
            <Button
              onClick={() => onDismiss(recommendation.id)}
              variant="secondary"
              size="sm"
              className="px-3"
              aria-label="Dismiss recommendation"
            >
              <X className="h-4 w-4 text-text-muted" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
