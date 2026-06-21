'use server';

import { getSessionId, updateRecommendationStatus } from '../../lib/db';
import { revalidatePath } from 'next/cache';

function safeRevalidatePath(path: string) {
  try {
    revalidatePath(path);
  } catch {
    // Ignore when running outside Next.js runtime context (e.g. during Vitest tests)
  }
}

export async function acceptRecommendationAction(recId: string) {
  const sessionId = await getSessionId();
  const userId = `user-${sessionId}`;
  
  await updateRecommendationStatus(userId, recId, 'accepted');
  
  safeRevalidatePath('/recommendations');
  safeRevalidatePath('/dashboard'); // Keep dashboard synced if top recommendations change
}

export async function dismissRecommendationAction(recId: string) {
  const sessionId = await getSessionId();
  const userId = `user-${sessionId}`;
  
  await updateRecommendationStatus(userId, recId, 'dismissed');
  
  safeRevalidatePath('/recommendations');
  safeRevalidatePath('/dashboard');
}
