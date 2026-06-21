import React from 'react';
import { redirect } from 'next/navigation';
import { getSessionId, getUserProfile, getGoals, getHabits, getMissions, getRecommendations } from '../../lib/db';
import { Navigation } from '../../components/navigation';
import { Target, Flag, MapPin, Zap, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function RoadmapPage() {
  const sessionId = await getSessionId();
  const userId = `user-${sessionId}`;

  const profile = await getUserProfile(userId);
  if (!profile) {
    redirect('/demo');
  }

  const [goals, habits, missions, recommendations] = await Promise.all([
    getGoals(userId),
    getHabits(userId),
    getMissions(userId),
    getRecommendations(userId)
  ]);

  const activeMission = missions.find(m => m.status === 'active');
  const activeGoals = goals.filter(g => g.status === 'on_track' || g.status === 'at_risk');
  const acceptedRecs = recommendations.filter(r => r.status === 'accepted');

  return (
    <Navigation userProfile={profile}>
      <div className="space-y-8 pb-10 max-w-4xl mx-auto">
        <div className="bg-surface border border-border p-6 rounded-2xl shadow-xs">
          <h1 className="text-2xl font-extrabold font-display text-text-primary tracking-tight">
            Your 90-Day Roadmap
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            A sequenced timeline of your active mission, sustainability goals, and targeted actions.
          </p>
        </div>

        <div className="relative pl-6 md:pl-8 space-y-12 before:absolute before:inset-y-0 before:left-3 md:before:left-4 before:w-0.5 before:bg-border">
          
          {/* Phase 1: Current Mission */}
          <div className="relative">
            <div className="absolute -left-6 md:-left-8 top-1 bg-primary text-white p-1.5 rounded-full ring-4 ring-bg">
              <MapPin className="h-4 w-4" />
            </div>
            <div className="ml-4 md:ml-6">
              <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-3">Phase 1: Active Mission</h3>
              {activeMission ? (
                <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
                  <h4 className="text-lg font-bold text-text-primary">{activeMission.title}</h4>
                  <p className="text-sm text-text-secondary mt-1 mb-4">{activeMission.description}</p>
                  <Link 
                    href="/dashboard"
                    className="inline-flex items-center text-xs font-bold text-primary hover:underline"
                  >
                    View active week tasks <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Link>
                </div>
              ) : (
                <div className="bg-surface border border-border border-dashed rounded-2xl p-5 flex items-center justify-between">
                  <div className="flex items-center space-x-3 text-text-muted">
                    <AlertCircle className="h-5 w-5" />
                    <span className="text-sm font-medium">No active mission right now.</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Phase 2: In Progress Goals & Habits */}
          <div className="relative">
            <div className="absolute -left-6 md:-left-8 top-1 bg-accent text-accent-foreground p-1.5 rounded-full ring-4 ring-bg">
              <Target className="h-4 w-4" />
            </div>
            <div className="ml-4 md:ml-6">
              <h3 className="text-sm font-bold text-accent uppercase tracking-wider mb-3">Phase 2: Ongoing Targets</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeGoals.map(goal => (
                  <div key={goal.id} className="bg-surface border border-border rounded-xl p-4 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-text-muted uppercase">{goal.goal_type.replace(/_/g, ' ')}</span>
                        <span className={cn(
                          "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase",
                          goal.status === 'on_track' ? "bg-success/20 text-success" : "bg-warning/20 text-warning"
                        )}>
                          {goal.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-2xl font-bold font-tabular text-text-primary">
                        {goal.current_progress.toFixed(1)} <span className="text-sm text-text-secondary">{goal.target_unit}</span>
                      </div>
                      <p className="text-xs text-text-secondary mt-1">
                        Target: {goal.target_value} {goal.target_unit} by {new Date(goal.target_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                {activeGoals.length === 0 && (
                  <div className="col-span-full text-sm text-text-muted p-4 border border-border border-dashed rounded-xl">
                    No active targets set.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Phase 3: Upcoming Changes (Accepted Recs) */}
          <div className="relative">
            <div className="absolute -left-6 md:-left-8 top-1 bg-surface border-2 border-primary text-primary p-1.5 rounded-full ring-4 ring-bg">
              <Flag className="h-4 w-4" />
            </div>
            <div className="ml-4 md:ml-6">
              <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-3">Phase 3: Accepted Changes</h3>
              
              <div className="space-y-3">
                {acceptedRecs.length > 0 ? acceptedRecs.map(rec => (
                  <div key={rec.id} className="flex items-center justify-between bg-surface border border-border rounded-xl p-4 shadow-sm">
                    <div className="flex items-center space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-success" />
                      <div>
                        <h4 className="text-sm font-bold text-text-primary">{rec.action_title}</h4>
                        <p className="text-xs text-text-secondary mt-0.5">{rec.action_description}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-primary text-xs font-bold bg-primary/10 px-2 py-1 rounded-lg">
                      <Zap className="h-3 w-3 mr-1" />
                      -{rec.predicted_impact_kgco2e_per_month} kg/mo
                    </div>
                  </div>
                )) : (
                  <div className="text-sm text-text-muted p-4 border border-border border-dashed rounded-xl">
                    You haven't accepted any AI recommendations yet. Check your <Link href="/recommendations" className="text-primary underline font-bold">Recommendations feed</Link> to build out your roadmap.
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </Navigation>
  );
}
