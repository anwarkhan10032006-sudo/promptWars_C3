import React from 'react';
import { WeeklyReport } from '../../types';
import { cn } from '../../lib/utils';
import { FileText, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface ReportCardProps {
  report: WeeklyReport;
  className?: string;
}

export function ReportCard({ report, className }: ReportCardProps) {
  const formatDateRange = (startStr: string, endStr: string) => {
    const s = new Date(startStr);
    const e = new Date(endStr);
    return `${s.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${e.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  return (
    <div className={cn('bg-surface border border-border p-5 rounded-2xl shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow duration-120', className)}>
      <div>
        {/* Header Block */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2 text-xs font-semibold text-text-muted">
            <FileText className="h-4 w-4 text-primary" />
            <span>Weekly Report</span>
          </div>
          <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full flex items-center space-x-1">
            <Sparkles className="h-3 w-3 fill-primary" />
            <span>AI Aggregated</span>
          </span>
        </div>

        {/* Date Title */}
        <h4 className="text-sm font-bold font-display text-text-primary mt-3">
          {formatDateRange(report.week_start, report.week_end)}
        </h4>

        {/* AI Synopsis Summary */}
        <p className="text-xs text-text-secondary mt-1.5 line-clamp-2 leading-relaxed">
          {report.narrative_text}
        </p>

        {/* Highlight Bullets */}
        {report.highlights?.length > 0 && (
          <div className="mt-3.5 space-y-1">
            {report.highlights.slice(0, 2).map((hl, i) => (
              <div key={i} className="text-[11px] text-text-secondary flex items-center space-x-1.5">
                <span className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                <span className="truncate">{hl}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="pt-3 border-t border-border flex justify-end">
        <Link 
          href={`/reports?id=${report.id}`} 
          className="text-xs font-semibold text-primary hover:underline flex items-center space-x-1 cursor-pointer"
        >
          <span>View Full Report</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
