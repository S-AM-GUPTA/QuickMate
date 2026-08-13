"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const oobCode = searchParams.get('oobCode');

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!oobCode) {
      setError('Invalid or missing action code. Please try resetting your password again.');
      setLoading(false);
      return;
    }

    // Verify the code and get the user's email
    verifyPasswordResetCode(auth, oobCode)
      .then((email) => {
        setEmail(email);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('The password reset link is invalid or has expired.');
        setLoading(false);
      });
  }, [oobCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !oobCode) return;
    
    if (newPassword.length < 6) {
      setError('Password should be at least 6 characters.');
      return;
    }

    setSubmitting(true);
    setError('');
    
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-10 h-10 border-4 border-ink border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-smoke font-medium">Verifying link...</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center py-4 animate-fade-in-up">
        <div className="w-16 h-16 bg-moss/20 text-moss rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-ink mb-2">Password Reset Successful</h2>
        <p className="text-smoke mb-8">
          Your password has been successfully updated. You can now log in with your new password.
        </p>
        <button
          onClick={() => router.push('/login')}
          className="w-full rounded-full bg-moss py-4 text-[16px] font-bold text-paper shadow-md hover:shadow-lg hover:bg-moss/90 hover:-translate-y-0.5 transition-all"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight text-ink mb-2">Set New Password</h1>
      {email && (
        <p className="text-[14px] text-smoke mb-8 font-medium">
          For <span className="text-ink font-bold">{email}</span>
        </p>
      )}

      {error && (
        <div className="mb-6 p-4 text-[14px] font-medium text-ink bg-mist border-l-4 border-coral flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-coral shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {!error || email ? (
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in-up">
          <div>
            <label className="block text-[11px] font-bold tracking-widest uppercase text-slate mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full rounded-full border border-hairline pl-5 pr-12 py-4 text-[16px] font-medium text-ink outline-none focus:border-moss focus:ring-1 focus:ring-moss transition-all placeholder:text-smoke"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-smoke hover:text-ink transition-colors p-1"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={!newPassword || submitting}
            className="w-full rounded-full bg-moss py-4 text-[16px] font-bold text-paper shadow-md hover:shadow-lg hover:bg-moss/90 hover:-translate-y-0.5 disabled:opacity-50 transition-all"
          >
            {submitting ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      ) : (
        <button
          onClick={() => router.push('/forgot-password')}
          className="w-full mt-4 rounded-full bg-charcoal py-4 text-[16px] font-bold text-paper shadow-md hover:bg-charcoal/90 transition-all"
        >
          Request a new link
        </button>
      )}
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-mist p-8 sm:p-10 rounded-3xl border border-hairline shadow-xl">
        <Link href="/login" className="inline-flex items-center gap-2 text-moss hover:text-moss/80 transition-colors font-medium mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to login
        </Link>
        
        <Suspense fallback={
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-moss border-t-transparent rounded-full animate-spin"></div>
          </div>
        }>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
