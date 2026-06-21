import React from 'react';
import { redirect } from 'next/navigation';
import { getUserProfile, getSessionId } from '../../lib/db';
import { CopilotClient } from './CopilotClient';
import { Navigation } from '../../components/navigation';

export const dynamic = 'force-dynamic';

export default async function CopilotPage() {
  const sessionId = await getSessionId();
  const userId = `user-${sessionId}`;

  const profile = await getUserProfile(userId);
  if (!profile) {
    redirect('/demo');
  }

  return (
    <Navigation userProfile={profile}>
      <CopilotClient />
    </Navigation>
  );
}
