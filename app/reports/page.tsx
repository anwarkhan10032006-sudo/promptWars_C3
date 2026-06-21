import React from 'react';
import { redirect } from 'next/navigation';
import { getSessionId, getUserProfile, getWeeklyReports } from '../../lib/db';
import { Navigation } from '../../components/navigation';
import { FileText, TrendingDown, TrendingUp, Calendar, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';

export const dynamic = 'force-dynamic';

export default async function ReportsPage() {
  const sessionId = await getSessionId();
  const userId = `user-${sessionId}`;

  const profile = await getUserProfile(userId);
  if (!profile) {
    redirect('/demo');
  }

  // Fetch reports and sort newest first
  const reports = await getWeeklyReports(userId);
  reports.sort((a, b) => new Date(b.week_start).getTime() - new Date(a.week_start).getTime());

  return (
    <Navigation userProfile={profile}>
      <div className="space-y-8 pb-10 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-surface border border-border p-6 rounded-2xl shadow-xs">
          <div>
            <h1 className="text-2xl font-extrabold font-display text-text-primary tracking-tight">
              AI Weekly Reports
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              Your footprint summarized and analyzed every week by your Copilot.
            </p>
          </div>
          <div className="p-3 bg-primary/10 rounded-xl text-primary">
            <FileText className="h-6 w-6" />
          </div>
        </div>

        <div className="grid gap-6">
          {reports.length > 0 ? (
            reports.map((report) => {
              const weekStart = new Date(report.week_start).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
              const totalEmissions = (report.summary_json?.total_emissions as number) || 0;
              const savings = (report.summary_json?.savings as number) || 0;
              const prevEmissions = totalEmissions + savings;
              const deltaPct = prevEmissions > 0 ? ((totalEmissions - prevEmissions) / prevEmissions) * 100 : 0;
              const isReduction = deltaPct < 0;

              return (
                <div key={report.id} className="bg-surface border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row">
                  
                  {/* Left Column: Stats */}
                  <div className="md:w-1/3 bg-surface-elevated border-b md:border-b-0 md:border-r border-border p-6 flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                      <FileText className="w-32 h-32 text-primary" />
                    </div>
                    
                    <div className="flex items-center space-x-2 text-text-muted font-bold text-[10px] uppercase tracking-wider mb-4 relative z-10">
                      <Calendar className="h-4 w-4" />
                      <span>Week of {weekStart}</span>
                    </div>

                    <div className="space-y-4 relative z-10">
                      <div>
                        <span className="text-xs text-text-secondary">Weekly Footprint</span>
                        <div className="text-3xl font-extrabold font-tabular text-text-primary">
                          {totalEmissions.toFixed(1)} <span className="text-base font-semibold text-text-muted">kg</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className={cn(
                          "px-2 py-1 rounded-md text-xs font-bold flex items-center space-x-1",
                          isReduction ? "bg-success/20 text-success" : "bg-warning/20 text-warning"
                        )}>
                          {isReduction ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                          <span>{Math.abs(deltaPct).toFixed(1)}%</span>
                        </span>
                        <span className="text-xs text-text-secondary">vs previous week</span>
                      </div>

                      {savings > 0 && (
                        <div className="pt-4 border-t border-border mt-4">
                          <div className="flex items-center text-xs font-bold text-primary">
                            <Zap className="h-3.5 w-3.5 mr-1" />
                            Saved {savings} kg CO2e
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: AI Narrative */}
                  <div className="md:w-2/3 p-6 flex flex-col justify-center">
                    <h3 className="text-sm font-bold text-text-primary mb-3 flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <span>Copilot Synthesis</span>
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed font-sans">
                      {report.narrative_text}
                    </p>
                  </div>

                </div>
              );
            })
          ) : (
            <div className="text-center py-20 bg-surface border border-border border-dashed rounded-3xl">
              <FileText className="h-10 w-10 text-text-muted mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-bold text-text-primary mb-2">No Reports Yet</h3>
              <p className="text-sm text-text-secondary max-w-sm mx-auto">
                AI weekly reports will generate automatically at the end of each week summarizing your logs.
              </p>
            </div>
          )}
        </div>
      </div>
    </Navigation>
  );
}
