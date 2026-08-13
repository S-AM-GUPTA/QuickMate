"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function ForgotPassword() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
  const [email, setEmail] = useState('');
  
  // Step 2 fields
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validatePassword = (pwd: string) => {
    // Uppercase, lowercase, number, symbol, min 8
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(pwd);
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    setError('');
    
    try {
      await api.post('/auth/forgot-password', { identifier: email });
      setStep(2);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to send password reset email.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (otpCode.length !== 6) {
      setError('Please enter the 6-digit code.');
      return;
    }
    
    if (!validatePassword(newPassword)) {
      setError('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await api.post('/auth/reset-password', {
        identifier: email,
        otpCode: otpCode,
        newPassword: newPassword,
      });
      
      const { access_token, user } = response.data;
      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("userProfile", JSON.stringify(user));
      document.cookie = `accessToken=${access_token}; path=/; max-age=86400;`;
      
      router.push('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to reset password. Invalid or expired code.');
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
        
        {step === 1 ? (
          <>
            <p className="text-smoke mb-8">
              Enter the email address associated with your QuickMate account and we'll send you a 6-digit code to reset your password.
            </p>
            <form onSubmit={handleRequestOtp} className="space-y-6">
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
                {loading ? 'Sending...' : 'Send Reset Code'}
              </button>
            </form>
          </>
        ) : (
          <>
            <p className="text-smoke mb-6">
              We've sent a 6-digit code to <strong>{email}</strong>. Enter it below along with your new password.
            </p>
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <label className="block text-[11px] font-bold tracking-widest uppercase text-slate mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit code"
                  className="w-full rounded-full border border-hairline px-5 py-4 text-[24px] tracking-[0.5em] text-center font-bold text-ink outline-none focus:border-moss focus:ring-1 focus:ring-moss transition-all placeholder:text-smoke placeholder:tracking-normal placeholder:font-normal placeholder:text-[16px]"
                />
              </div>

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
                    placeholder="Create new password"
                    className="w-full rounded-full border border-hairline pl-5 pr-12 py-4 text-[16px] font-medium text-ink outline-none focus:border-moss focus:ring-1 focus:ring-moss transition-all placeholder:text-smoke"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-smoke hover:text-ink transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold tracking-widest uppercase text-slate mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full rounded-full border border-hairline pl-5 pr-12 py-4 text-[16px] font-medium text-ink outline-none focus:border-moss focus:ring-1 focus:ring-moss transition-all placeholder:text-smoke"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-smoke hover:text-ink transition-colors p-1"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || otpCode.length !== 6 || !newPassword || !confirmPassword}
                className="w-full rounded-full bg-moss py-4 text-[16px] font-bold text-paper shadow-md hover:shadow-lg hover:bg-moss/90 hover:-translate-y-0.5 disabled:opacity-50 transition-all"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
              
              <button
                type="button"
                onClick={() => setStep(1)}
                disabled={loading}
                className="w-full rounded-full border border-hairline bg-paper py-4 text-[16px] font-bold text-ink hover:bg-mist transition-colors shadow-sm"
              >
                Back
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
