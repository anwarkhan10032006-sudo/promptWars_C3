'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '../../components/ui/button';
import { Leaf, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signupAction } from './actions';

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      console.log('[AUTH] Registering user:', email);
      
      await signupAction(fullName, email);
      
      // Redirect to onboarding
      router.push('/onboarding');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to sign up.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text-primary flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center flex flex-col items-center">
        <Link href="/" className="flex items-center space-x-2">
          <div className="p-1.5 bg-primary rounded-lg text-white">
            <Leaf className="h-5 w-5" />
          </div>
          <span className="font-extrabold font-display text-xl tracking-tight">VERDANCE</span>
        </Link>
        <h2 className="mt-6 text-2xl font-bold font-display text-text-primary">
          Create your Account
        </h2>
        <p className="mt-1 text-xs text-text-secondary">
          Track and reduce your personal carbon footprint
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-surface border border-border py-8 px-4 shadow-sm rounded-2xl sm:px-10 space-y-6">
          
          {errorMsg && (
            <div className="p-3 bg-danger/10 border border-danger/25 text-danger rounded-lg text-xs flex items-center space-x-2">
              <AlertCircle className="h-4 w-4" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full h-11 border border-border rounded-lg px-3 bg-surface text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Jane Doe"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 border border-border rounded-lg px-3 bg-surface text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="name@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 border border-border rounded-lg px-3 bg-surface text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
              />
            </div>

            {/* Buttons */}
            <div className="space-y-3 pt-2">
              <Button type="submit" variant="primary" disabled={loading} className="w-full h-11">
                {loading ? 'Creating Account...' : 'Sign Up'}
              </Button>
            </div>
          </form>

          {/* Redirect to login */}
          <div className="pt-4 border-t border-border text-center text-xs text-text-secondary">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-primary hover:underline">
              Log In
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
}
