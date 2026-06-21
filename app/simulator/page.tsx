import React from 'react';
import { redirect } from 'next/navigation';
import { getSessionId, getUserProfile } from '../../lib/db';
import { Navigation } from '../../components/navigation';
import { SimulatorClient } from './SimulatorClient';

export const dynamic = 'force-dynamic';

export default async function SimulatorPage() {
  const sessionId = await getSessionId();
  const userId = `user-${sessionId}`;

  const profile = await getUserProfile(userId);
  if (!profile) {
    redirect('/demo');
  }

  return (
    <Navigation userProfile={profile}>
      <SimulatorClient profile={profile} />
    </Navigation>
  );
}
