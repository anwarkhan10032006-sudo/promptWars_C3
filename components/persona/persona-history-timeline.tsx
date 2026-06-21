import React from 'react';
import { PersonaHistory } from '../../types';
import { PERSONA_METADATA } from '../../lib/persona';
import { cn } from '../../lib/utils';
import { Calendar, RefreshCw } from 'lucide-react';

interface PersonaHistoryTimelineProps {
  history: PersonaHistory[];
  className?: string;
}

export function PersonaHistoryTimeline({ history, className }: PersonaHistoryTimelineProps) {
  if (history.length === 0) {
    return (
      <div className={cn('bg-surface border border-border p-6 rounded-2xl text-center', className)}>
        <p className="text-sm text-text-muted">No persona evolution history recorded yet. As your footprint trends shift MoM, your persona will adapt!</p>
      </div>
    );
  }

  // Sort history chronologically (newest first)
  const sortedHistory = [...history].sort((a, b) => b.changed_at.localeCompare(a.changed_at));

  return (
    <div className={cn('flex flex-col space-y-6 relative pl-6 border-l border-border', className)}>
      {sortedHistory.map((item, idx) => {
        const fromMeta = item.from_persona_key ? PERSONA_METADATA[item.from_persona_key] : null;
        const toMeta = PERSONA_METADATA[item.to_persona_key];

        return (
          <div key={item.id || idx} className="relative">
            {/* Timeline node dot indicator */}
            <div 
              className="absolute -left-[31px] top-1 w-4.5 h-4.5 rounded-full border-4 border-surface shadow-sm flex items-center justify-center"
              style={{ backgroundColor: toMeta?.color || '#cbd5e1' }}
            />

            {/* Date Badge */}
            <div className="flex items-center space-x-2 text-xs text-text-muted mb-2 font-medium">
              <Calendar className="h-3.5 w-3.5" />
              <span>{new Date(item.changed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>

            {/* Content card */}
            <div className="bg-surface border border-border p-4 rounded-xl shadow-sm">
              <h4 className="text-sm font-bold text-text-primary flex items-center space-x-2 flex-wrap">
                {fromMeta ? (
                  <>
                    <span className="px-2 py-0.5 rounded text-xs font-semibold text-white" style={{ backgroundColor: fromMeta.color }}>
                      {fromMeta.name}
                    </span>
                    <RefreshCw className="h-3.5 w-3.5 text-text-muted" />
                  </>
                ) : null}
                <span className="px-2 py-0.5 rounded text-xs font-semibold text-white" style={{ backgroundColor: toMeta.color }}>
                  {toMeta.name}
                </span>
              </h4>

              <p className="text-xs text-text-secondary mt-2 leading-relaxed">
                {item.reason_text}
              </p>

              <div className="mt-3 text-[10px] font-semibold text-text-muted uppercase tracking-wider bg-surface-elevated px-2 py-1 rounded inline-block">
                Trigger: {item.triggering_rule}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
