'use server';

import { getSessionId, createUserProfile } from '../../lib/db';

export async function signupAction(fullName: string, email: string) {
  const sessId = await getSessionId();
  const profileId = `user-${sessId}`;
  
  await createUserProfile({
    id: profileId,
    email: email,
    full_name: fullName,
    country_region: 'US-NW', // defaults, will be updated during onboarding
    household_size: 1,
    home_type: 'Apartment',
    electricity_grid_region: 'US-NW',
    is_demo: false
  });
  
  return true;
}
