'use server';

import { getSessionId, getUserProfile, createUserProfile } from '../../lib/db';
import { loadDemoProfileIntoSession, findAndCopyProfileByEmail } from '../../lib/mockDb';
import { DemoSlug } from '../../types';

export async function loginAction(email: string) {
  const sessId = await getSessionId();
  const profileId = `user-${sessId}`;
  
  // 1. Check if the email matches a demo profile keyword:
  const emailLower = email.toLowerCase();
  let demoSlug: DemoSlug | null = null;
  if (emailLower.includes('student')) {
    demoSlug = 'college_student';
  } else if (emailLower.includes('traveler') || emailLower.includes('traveller')) {
    demoSlug = 'frequent_traveler';
  } else if (emailLower.includes('family') || emailLower.includes('miller')) {
    demoSlug = 'family_household';
  } else if (emailLower.includes('enthusiast') || emailLower.includes('clara')) {
    demoSlug = 'sustainability_enthusiast';
  }
  
  if (demoSlug) {
    loadDemoProfileIntoSession(sessId, demoSlug);
    return { success: true, redirect: '/dashboard' };
  }
  
  // 2. Try to find if any other session has a profile matching this email,
  // and copy its data to the current session (simulates database persistence).
  const foundExisting = findAndCopyProfileByEmail(sessId, email);
  if (foundExisting) {
    return { success: true, redirect: '/dashboard' };
  }
  
  // 3. Check if the current session already has a profile.
  const existingProfile = await getUserProfile(profileId);
  if (existingProfile) {
    return { success: true, redirect: '/dashboard' };
  }
  
  // 4. Otherwise, create a default profile for this email and send to onboarding.
  await createUserProfile({
    id: profileId,
    email: email,
    full_name: email.split('@')[0],
    country_region: 'US-NW',
    household_size: 1,
    home_type: 'Apartment',
    electricity_grid_region: 'US-NW',
    is_demo: false
  });
  
  return { success: true, redirect: '/onboarding' };
}
