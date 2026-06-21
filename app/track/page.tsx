import React from 'react';
import { redirect } from 'next/navigation';
import { getUserProfile, getActivityLogs, getSessionId } from '../../lib/db';
import { TrackClient } from './TrackClient';
import { Navigation } from '../../components/navigation';

export const dynamic = 'force-dynamic';

export default async function TrackPage() {
  const sessionId = await getSessionId();
  const userId = `user-${sessionId}`;

  const profile = await getUserProfile(userId);
  if (!profile) {
    redirect('/demo');
  }

  const logs = await getActivityLogs(userId);

  return (
    <Navigation userProfile={profile}>
      <TrackClient initialLogs={logs} />
    </Navigation>
  );
}
