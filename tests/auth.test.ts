import { describe, it, expect, beforeEach } from 'vitest';
import { signupAction } from '../app/signup/actions';
import { loginAction } from '../app/login/actions';
import { getUserProfile } from '../lib/db';
import { deleteSessionState } from '../lib/mockDb';

describe('Mock Authentication Actions', () => {
  beforeEach(() => {
    deleteSessionState('default-session');
  });

  it('handles signup by creating user profile', async () => {
    const success = await signupAction('John Doe', 'john@example.com');
    expect(success).toBe(true);

    const profile = await getUserProfile('user-default-session');
    expect(profile).not.toBeNull();
    expect(profile?.full_name).toBe('John Doe');
    expect(profile?.email).toBe('john@example.com');
    expect(profile?.is_demo).toBe(false);
  });

  it('handles login with demo email student@verdance.demo', async () => {
    const res = await loginAction('student@verdance.demo');
    expect(res.success).toBe(true);
    expect(res.redirect).toBe('/dashboard');

    const profile = await getUserProfile('user-default-session');
    expect(profile).not.toBeNull();
    expect(profile?.full_name).toBe('Alex Rivera');
    expect(profile?.is_demo).toBe(true);
  });

  it('handles login with generic email', async () => {
    // Sign in with new email should create user profile stub and redirect to onboarding
    const res = await loginAction('newuser@example.com');
    expect(res.success).toBe(true);
    expect(res.redirect).toBe('/onboarding');

    const profile = await getUserProfile('user-default-session');
    expect(profile).not.toBeNull();
    expect(profile?.email).toBe('newuser@example.com');
  });
});
