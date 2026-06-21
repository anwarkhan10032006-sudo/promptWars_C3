import React from 'react';
import { redirect } from 'next/navigation';
import { getSessionId, getUserProfile, getChallenges, getUserChallenges } from '../../lib/db';
import { Navigation } from '../../components/navigation';
import { Award, Users, PlusCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../../components/ui/button';

export const dynamic = 'force-dynamic';

function getDeterministicParticipantCount(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.floor(Math.abs(hash) % 500 + 100);
}

export default async function ChallengesPage() {
  const sessionId = await getSessionId();
  const userId = `user-${sessionId}`;

  const profile = await getUserProfile(userId);
  if (!profile) {
    redirect('/demo');
  }

  const [allChallenges, userChallenges] = await Promise.all([
    getChallenges(),
    getUserChallenges(userId)
  ]);

  const activeChallengeIds = new Set(userChallenges.map(uc => uc.challenge_id));

  return (
    <Navigation userProfile={profile}>
      <div className="space-y-8 pb-10 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-surface border border-border p-6 rounded-2xl shadow-xs">
          <div>
            <h1 className="text-2xl font-extrabold font-display text-text-primary tracking-tight">
              Community Challenges
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              Join timed sustainability sprints and see how you stack up against the VERDANCE community.
            </p>
          </div>
          <div className="p-3 bg-accent/10 rounded-xl text-accent flex-shrink-0">
            <Award className="h-6 w-6" />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-bold text-text-muted uppercase tracking-wider pl-1">Available Challenges</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allChallenges.map((challenge) => {
              const isJoined = activeChallengeIds.has(challenge.id);
              const categoryColors: Record<string, string> = {
                transportation: 'bg-category-transportation text-white',
                electricity: 'bg-category-electricity text-white',
                food: 'bg-category-food text-white',
                shopping: 'bg-category-shopping text-white',
                flights: 'bg-category-flights text-white'
              };

              return (
                <div key={challenge.id} className="bg-surface border border-border rounded-2xl p-5 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider', categoryColors[challenge.category])}>
                        {challenge.category}
                      </span>
                      <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider bg-surface-elevated px-2 py-0.5 rounded-md border border-border">
                        {challenge.duration_days} Days
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-text-primary mb-1">{challenge.title}</h3>
                    <p className="text-xs text-text-secondary leading-relaxed mb-4">{challenge.description}</p>
                    
                    <div className="flex items-center space-x-1.5 text-xs font-semibold text-text-muted mb-6">
                      <Users className="h-3.5 w-3.5" />
                      <span>{getDeterministicParticipantCount(challenge.id)} participants</span>
                    </div>
                  </div>
                  
                  {isJoined ? (
                    <div className="flex justify-center items-center py-2 bg-success/10 text-success rounded-xl text-xs font-bold w-full border border-success/20">
                      <CheckCircle2 className="h-4 w-4 mr-1.5" />
                      Joined Active
                    </div>
                  ) : (
                    <Button variant="outline" size="sm" className="w-full text-xs font-bold rounded-xl space-x-1 border-primary/20 hover:border-primary text-primary">
                      <PlusCircle className="h-3.5 w-3.5" />
                      <span>Join Sprint</span>
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Navigation>
  );
}
