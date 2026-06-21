import React from 'react';
import { redirect } from 'next/navigation';
import { getSessionId, getUserProfile, getRecommendations } from '../../lib/db';
import { Navigation } from '../../components/navigation';
import { RecommendationsClient } from './RecommendationsClient';

export const dynamic = 'force-dynamic';

export default async function RecommendationsPage() {
  const sessionId = await getSessionId();
  const userId = `user-${sessionId}`;

  const profile = await getUserProfile(userId);
  if (!profile) {
    redirect('/demo');
  }

  const allRecommendations = await getRecommendations(userId);
  
  // Filter active recommendations that have not been dismissed/accepted
  const activeRecommendations = allRecommendations.filter(r => r.status === 'active');

  return (
    <Navigation userProfile={profile}>
      <RecommendationsClient initialRecommendations={activeRecommendations} />
    </Navigation>
  );
}
