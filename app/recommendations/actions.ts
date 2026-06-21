'use server';

import { getSessionId, updateRecommendationStatus } from '../../lib/db';
import { revalidatePath } from 'next/cache';

export async function acceptRecommendationAction(recId: string) {
  const sessionId = await getSessionId();
  const userId = `user-${sessionId}`;
  
  await updateRecommendationStatus(userId, recId, 'accepted');
  
  revalidatePath('/recommendations');
  revalidatePath('/dashboard'); // Keep dashboard synced if top recommendations change
}

export async function dismissRecommendationAction(recId: string) {
  const sessionId = await getSessionId();
  const userId = `user-${sessionId}`;
  
  await updateRecommendationStatus(userId, recId, 'dismissed');
  
  revalidatePath('/recommendations');
  revalidatePath('/dashboard');
}
