'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { loadDemoProfileIntoSession } from '../../lib/mockDb';
import { DemoSlug } from '../../types';

export async function selectDemoProfile(formData: FormData) {
  const slug = formData.get('slug') as DemoSlug;
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('verdance_session_id')?.value || 'default-session';
  
  if (slug) {
    loadDemoProfileIntoSession(sessionId, slug);
  }
  
  redirect('/dashboard');
}
