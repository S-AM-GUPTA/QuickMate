"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    setError('');
    
    try {
      const actionCodeSettings = {
        url: window.location.origin + '/reset-password',
      };
      await sendPasswordResetEmail(auth, email, actionCodeSettings);
      setSubmitted(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to send password reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-mist p-8 rounded-3xl border border-hairline shadow-xl">
        <Link href="/login" className="inline-flex items-center gap-2 text-moss hover:text-moss/80 transition-colors font-medium mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to login
        </Link>
        
        <h1 className="text-3xl font-bold tracking-tight text-ink mb-4">Reset Password</h1>
        
        {error && (
          <div className="mb-6 p-4 text-[14px] font-medium text-ink bg-mist border-l-4 border-coral">
            {error}
          </div>
        )}
        
        {!submitted ? (
          <>
            <p className="text-smoke mb-8">
              Enter the email address associated with your QuickMate account and we'll send you a link to reset your password.
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[11px] font-bold tracking-widest uppercase text-slate mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full rounded-full border border-hairline px-5 py-4 text-[16px] font-medium text-ink outline-none focus:border-moss focus:ring-1 focus:ring-moss transition-all placeholder:text-smoke"
                />
              </div>
              <button
                type="submit"
                disabled={!email || loading}
                className="w-full rounded-full bg-moss py-4 text-[16px] font-bold text-paper shadow-md hover:shadow-lg hover:bg-moss/90 hover:-translate-y-0.5 disabled:opacity-50 transition-all"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-moss/20 text-moss rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2">Check your email</h2>
            <p className="text-smoke">
              If an account exists for <strong>{email}</strong>, we have sent password reset instructions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
