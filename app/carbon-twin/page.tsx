import React from 'react';
import { redirect } from 'next/navigation';
import { getSessionId, getUserProfile, getCarbonTwinProjections } from '../../lib/db';
import { Navigation } from '../../components/navigation';
import { CarbonTwinClient } from './CarbonTwinClient';

export const dynamic = 'force-dynamic';

export default async function CarbonTwinPage() {
  const sessionId = await getSessionId();
  const userId = `user-${sessionId}`;

  const profile = await getUserProfile(userId);
  if (!profile) {
    redirect('/demo');
  }

  const projections = await getCarbonTwinProjections(userId);

  return (
    <Navigation userProfile={profile}>
      <CarbonTwinClient projections={projections} />
    </Navigation>
  );
}
