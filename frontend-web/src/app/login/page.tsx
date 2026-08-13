"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

import { api } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();

  // Mode: login or signup
  const [isSignup, setIsSignup] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("mode") === "signup") {
        setIsSignup(true);
      }
    }
  }, []);
  
  // Login fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Signup fields
  const [signupEmail, setSignupEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("🇮🇳 +91");
  const [postalCode, setPostalCode] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const response = await api.post("/auth/login", {
        identifier: loginEmail,
        password: loginPassword,
      });
      
      const { access_token, user } = response.data;
      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("userProfile", JSON.stringify(user));
      document.cookie = `accessToken=${access_token}; path=/; max-age=86400;`;
      
      router.push("/dashboard");
    } catch (err: any) {
      if (!err.response) {
        setError("Network error: Server is offline or updating. Please try again in 2-3 minutes.");
      } else if (err.response.status >= 500) {
        setError(`Server error (${err.response.status}): The backend is currently updating. Please wait a few minutes.`);
      } else {
        setError(err.response?.data?.message || "Invalid credentials");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate Phone Number
    const phoneRegex = /^\d{10}$/; // Basic 10 digit validation
    if (!phoneRegex.test(phone.replace(/\s+/g, ''))) {
      setError("Please enter a valid 10-digit mobile number without spaces.");
      return;
    }

    // Validate Password Strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(signupPassword)) {
      setError("Password must be at least 8 characters, with 1 uppercase, 1 lowercase, 1 number, and 1 special character.");
      return;
    }

    setLoading(true);
    
    try {
      await api.post("/auth/request-otp", {
        identifier: signupEmail,
      });
      setOtpStep(true);
    } catch (err: any) {
      if (!err.response) {
        setError("Network error: Server is offline or updating.");
      } else {
        setError(err.response?.data?.message || "Failed to send OTP.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const response = await api.post("/auth/verify-otp", {
        identifier: signupEmail,
        otpCode: otpCode,
        newPassword: signupPassword,
        name: `${firstName} ${lastName}`.trim(),
        phone: `${countryCode.split(" ")[1]} ${phone}`.trim(),
        postalCode: postalCode
      });
      
      const { access_token, user } = response.data;
      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("userProfile", JSON.stringify(user));
      document.cookie = `accessToken=${access_token}; path=/; max-age=86400;`;
      
      router.push("/dashboard");
    } catch (err: any) {
      if (!err.response) {
        setError("Network error: Server is offline or updating.");
      } else {
        setError(err.response?.data?.message || "Invalid OTP.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (providerName: "google") => {
    setError("");
    setLoading(true);
    try {
      // Dynamically import Firebase to avoid Turbopack compiler issues
      const { signInWithPopup, GoogleAuthProvider } = await import("firebase/auth");
      const { auth } = await import("@/lib/firebase");
      
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      
      const response = await api.post("/auth/oauth", { idToken });
      
      const { access_token, user } = response.data;
      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("userProfile", JSON.stringify(user));
      document.cookie = `accessToken=${access_token}; path=/; max-age=86400;`;
      
      router.push("/dashboard");
    } catch (err: any) {
      if (err.code === 'auth/cancelled-popup-request' || err.code === 'auth/popup-closed-by-user') {
        // User closed the popup or clicked twice, ignore it gracefully
        return;
      }
      if (err.code === 'auth/account-exists-with-different-credential') {
        setError("An account already exists with the same email address. Please sign in using the original provider (e.g., Google or Email) you used to create the account.");
        return;
      }
      console.error(err);
      setError(err.message || `Failed to log in with ${providerName}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-sans">
      {/* Branding / Visual Side */}
      <div className="lg:w-1/2 relative flex flex-col justify-between p-8 sm:p-12 lg:p-16 text-white min-h-[40vh] lg:min-h-screen">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1920&auto=format&fit=crop"
            alt="Local Service Professional Background"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>


        <div className="py-12 lg:py-0 relative z-10 mt-auto mb-8 lg:mb-16">
          <h1 className="text-[40px] sm:text-[48px] lg:text-[56px] font-black leading-[1] tracking-[-0.02em] uppercase">
            Your Home,<br />Handled.
          </h1>
          <p className="mt-6 text-[16px] sm:text-[18px] text-paper/80 max-w-sm font-medium">
            Find trusted local professionals for cleaning, handyman work, and everyday tasks. Reliable help is just a click away.
          </p>
        </div>
        <div className="text-[11px] font-bold tracking-widest text-paper/60 uppercase hidden lg:block relative z-10">
          © 2026 QuickMate
        </div>
      </div>

      {/* Form Side */}
      <div className="lg:w-1/2 bg-paper flex items-center justify-center p-8 sm:p-12 lg:p-16 relative">
        <div className="w-full max-w-[440px]">
          <div className="mb-8">
            <Link href="/">
              <img src="/logo.png" alt="QuickMate Logo" className="h-10 sm:h-12 w-auto" />
            </Link>
          </div>
          <h2 className="text-[32px] sm:text-[40px] font-bold tracking-tight text-ink mb-10">
            {isSignup ? (otpStep ? "Verify Email" : "Create account") : "Log in"}
          </h2>

          {error && (
            <div className="mb-8 p-4 text-[14px] font-medium text-ink bg-mist border-l-4 border-coral">
              {error}
            </div>
          )}

          {!isSignup ? (
            /* LOGIN FORM */
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold tracking-widest uppercase text-slate mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full rounded-full border border-hairline px-4 py-3 text-[15px] font-medium text-ink outline-none focus:border-moss focus:ring-1 focus:ring-moss transition-all placeholder:text-smoke"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-[11px] font-bold tracking-widest uppercase text-slate">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-[12px] font-bold text-ink hover:text-moss hover:underline underline-offset-4">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-full border border-hairline pl-4 pr-10 py-3 text-[15px] font-medium text-ink outline-none focus:border-moss focus:ring-1 focus:ring-moss transition-all placeholder:text-smoke"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-smoke hover:text-ink transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <button
                  type="submit"
                  disabled={loading || !loginEmail || !loginPassword}
                  className="w-full rounded-full bg-moss py-3 text-[15px] font-bold text-paper shadow-md hover:shadow-lg hover:bg-moss/90 hover:-translate-y-0.5 disabled:opacity-50 transition-all"
                >
                  {loading ? "Loading..." : "Log In"}
                </button>

                <div className="relative flex items-center justify-center py-1">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-hairline"></div>
                  </div>
                  <div className="relative bg-paper px-4 text-[11px] font-bold tracking-widest text-smoke uppercase">
                    OR
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <button
                    type="button"
                    onClick={() => handleOAuth('google')}
                    disabled={loading}
                    className="w-full rounded-full border border-hairline bg-paper py-2.5 text-[14px] font-bold text-ink hover:bg-mist transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27c3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10c5.35 0 9.25-3.67 9.25-9.09c0-1.15-.15-1.81-.15-1.81Z"/></svg>
                    Google
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSignup(true)}
                  className="w-full rounded-full border border-hairline bg-paper py-3 text-[15px] font-bold text-ink hover:bg-mist transition-colors shadow-sm"
                >
                  Create an account
                </button>
              </div>
            </form>
          ) : otpStep ? (
            /* OTP VERIFICATION FORM */
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <label className="block text-[11px] font-bold tracking-widest uppercase text-slate mb-2">
                  Verification Code
                </label>
                <p className="text-[14px] text-gray-500 mb-4">
                  We've sent a 6-digit code to <strong>{signupEmail}</strong>.
                </p>
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

              <div className="pt-6 space-y-4">
                <button
                  type="submit"
                  disabled={loading || otpCode.length !== 6}
                  className="w-full rounded-full bg-moss py-4 text-[16px] font-bold text-paper shadow-md hover:shadow-lg hover:bg-moss/90 hover:-translate-y-0.5 disabled:opacity-50 transition-all"
                >
                  {loading ? "Verifying..." : "Verify & Create Account"}
                </button>
                <button
                  type="button"
                  onClick={() => setOtpStep(false)}
                  disabled={loading}
                  className="w-full rounded-full border border-hairline bg-paper py-4 text-[16px] font-bold text-ink hover:bg-mist transition-colors shadow-sm"
                >
                  Back to signup
                </button>
              </div>
            </form>
          ) : (
            /* SIGNUP FORM */
            <form onSubmit={handleSignup} className="space-y-6">
              <div>
                <label className="block text-[11px] font-bold tracking-widest uppercase text-slate mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full rounded-full border border-hairline px-5 py-4 text-[16px] font-medium text-ink outline-none focus:border-moss focus:ring-1 focus:ring-moss transition-all placeholder:text-smoke"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold tracking-widest uppercase text-slate mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First"
                    className="w-full rounded-full border border-hairline px-5 py-4 text-[16px] font-medium text-ink outline-none focus:border-moss focus:ring-1 focus:ring-moss transition-all placeholder:text-smoke"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold tracking-widest uppercase text-slate mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last"
                    className="w-full rounded-full border border-hairline px-5 py-4 text-[16px] font-medium text-ink outline-none focus:border-moss focus:ring-1 focus:ring-moss transition-all placeholder:text-smoke"
                  />
                </div>
              </div>

              <div className="grid grid-cols-[100px_1fr] gap-2">
                <div>
                  <label className="block text-[11px] font-bold tracking-widest uppercase text-slate mb-2">
                    Code
                  </label>
                  <select 
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-full appearance-none rounded-full border border-hairline bg-paper px-3 py-4 text-[16px] font-medium text-ink text-center outline-none focus:border-moss focus:ring-1 focus:ring-moss transition-all cursor-pointer"
                  >
                    <option>🇮🇳 +91</option>
                    <option>🇺🇸 +1</option>
                    <option>🇬🇧 +44</option>
                    <option>🇦🇺 +61</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold tracking-widest uppercase text-slate mb-2">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="98765 43210"
                    className="w-full rounded-full border border-hairline px-5 py-4 text-[16px] font-medium text-ink outline-none focus:border-moss focus:ring-1 focus:ring-moss transition-all placeholder:text-smoke"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold tracking-widest uppercase text-slate mb-2">
                  Postal Code
                </label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="e.g. 110001"
                  className="w-full rounded-full border border-hairline px-5 py-4 text-[16px] font-medium text-ink outline-none focus:border-moss focus:ring-1 focus:ring-moss transition-all placeholder:text-smoke"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold tracking-widest uppercase text-slate mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="Create a password"
                    className="w-full rounded-full border border-hairline pl-5 pr-12 py-4 text-[16px] font-medium text-ink outline-none focus:border-moss focus:ring-1 focus:ring-moss transition-all placeholder:text-smoke"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-smoke hover:text-ink transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2">
                <input
                  type="checkbox"
                  required
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 h-5 w-5 rounded-[4px] border-hairline text-ink focus:ring-ink accent-ink"
                />
                <span className="text-[14px] text-slate leading-tight font-medium">
                  I agree to the <Link href="/terms-of-service" className="font-bold text-ink hover:text-moss hover:underline underline-offset-4">Terms of Service</Link> and have reviewed the <Link href="/privacy-policy" className="font-bold text-ink hover:text-moss hover:underline underline-offset-4">Privacy Policy</Link>.
                </span>
              </div>

              <div className="pt-6 space-y-4">
                <button
                  type="submit"
                  disabled={!signupEmail || !firstName || !lastName || !phone || !postalCode || !signupPassword || !agreed}
                  className="w-full rounded-full bg-moss py-4 text-[16px] font-bold text-paper shadow-md hover:shadow-lg hover:bg-moss/90 hover:-translate-y-0.5 disabled:opacity-50 transition-all"
                >
                  Create Account
                </button>

                <div className="relative flex items-center justify-center py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-hairline"></div>
                  </div>
                  <div className="relative bg-paper px-4 text-[11px] font-bold tracking-widest text-smoke uppercase">
                    OR
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleOAuth('google')}
                  disabled={loading}
                  className="w-full rounded-full border border-hairline bg-paper py-4 text-[16px] font-bold text-ink hover:bg-mist transition-colors flex items-center justify-center gap-3 disabled:opacity-50 shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27c3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10c5.35 0 9.25-3.67 9.25-9.09c0-1.15-.15-1.81-.15-1.81Z"/></svg>
                  Continue with Google
                </button>
                <button
                  type="button"
                  onClick={() => setIsSignup(false)}
                  className="w-full rounded-full border border-hairline bg-paper py-4 text-[16px] font-bold text-ink hover:bg-mist transition-colors shadow-sm"
                >
                  Log in instead
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Floating Help Button */}
      <div className="fixed bottom-6 right-6 lg:left-6 lg:right-auto z-50">
        <button className="flex items-center gap-2 rounded-full bg-paper lg:bg-ink border border-hairline lg:border-none px-4 py-3 text-[12px] font-bold text-ink lg:text-paper shadow-xl hover:scale-105 transition-transform uppercase tracking-widest">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          Help
        </button>
      </div>
    </div>
  );
}
