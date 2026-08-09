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
    setLoading(true);
    
    try {
      const response = await api.post("/auth/register", {
        identifier: signupEmail,
        password: signupPassword,
        name: `${firstName} ${lastName}`.trim(),
        phone: `${countryCode.split(" ")[1]} ${phone}`.trim(),
      });
      
      const { access_token, user } = response.data;
      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("userProfile", JSON.stringify({ ...user, postalCode }));
      document.cookie = `accessToken=${access_token}; path=/; max-age=86400;`;
      
      router.push("/dashboard");
    } catch (err: any) {
      if (err.response?.data?.message === "User already exists" || err.response?.data?.message?.includes("already exists")) {
        // Fallback to login if user already exists
        try {
          const loginRes = await api.post("/auth/login", {
            identifier: signupEmail,
            password: signupPassword,
          });
          const { access_token, user } = loginRes.data;
          localStorage.setItem("accessToken", access_token);
          localStorage.setItem("userProfile", JSON.stringify({ ...user, postalCode }));
          document.cookie = `accessToken=${access_token}; path=/; max-age=86400;`;
          router.push("/dashboard");
          return;
        } catch (loginErr: any) {
          setError("User exists, but password was incorrect. Please log in.");
        }
      } else if (!err.response) {
        setError("Network error: Server is offline or updating. Please try again in 2-3 minutes.");
      } else if (err.response.status >= 500) {
        setError(`Server error (${err.response.status}): The backend is currently updating. Please wait a few minutes.`);
      } else {
        setError(
          err.response?.data?.message || 
          (err.response?.data?.message && Array.isArray(err.response.data.message) ? err.response.data.message[0] : "An error occurred during signup")
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (providerName: "google" | "github") => {
    setError("");
    setLoading(true);
    try {
      // Dynamically import Firebase to avoid Turbopack compiler issues
      const { signInWithPopup, GoogleAuthProvider, GithubAuthProvider } = await import("firebase/auth");
      const { auth } = await import("@/lib/firebase");
      
      const provider = providerName === "google" ? new GoogleAuthProvider() : new GithubAuthProvider();
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
            Get It<br />Done.<br />Now.
          </h1>
          <p className="mt-6 text-[16px] sm:text-[18px] text-[#cccccc] max-w-sm font-medium">
            Book a trusted mate. No hassle, no wait. Pure efficiency for your everyday needs.
          </p>
        </div>
        <div className="text-[11px] font-bold tracking-widest text-[#cccccc] uppercase hidden lg:block relative z-10">
          © 2026 QuickMate
        </div>
      </div>

      {/* Form Side */}
      <div className="lg:w-1/2 bg-white flex items-center justify-center p-8 sm:p-12 lg:p-16 relative">
        <div className="w-full max-w-[440px]">
          <div className="mb-8">
            <Link href="/">
              <img src="/logo.png" alt="QuickMate Logo" className="h-10 sm:h-12 w-auto" />
            </Link>
          </div>
          <h2 className="text-[32px] sm:text-[40px] font-bold tracking-tight text-black mb-10">
            {isSignup ? "Create account" : "Log in"}
          </h2>

          {error && (
            <div className="mb-8 p-4 text-[14px] font-medium text-black bg-[#eeeeee] border-l-4 border-black">
              {error}
            </div>
          )}

          {!isSignup ? (
            /* LOGIN FORM */
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold tracking-widest uppercase text-[#595959] mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full rounded-full border border-[#d9d9d9] px-4 py-3 text-[15px] font-medium text-black outline-none focus:border-black focus:ring-1 focus:ring-black transition-all placeholder:text-[#808080]"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-[11px] font-bold tracking-widest uppercase text-[#595959]">
                    Password
                  </label>
                  <Link href="#" className="text-[12px] font-bold text-black hover:underline underline-offset-4">
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
                    className="w-full rounded-full border border-[#d9d9d9] pl-4 pr-10 py-3 text-[15px] font-medium text-black outline-none focus:border-black focus:ring-1 focus:ring-black transition-all placeholder:text-[#808080]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#808080] hover:text-black transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <button
                  type="submit"
                  disabled={loading || !loginEmail || !loginPassword}
                  className="w-full rounded-full bg-black py-3 text-[15px] font-bold text-white hover:bg-[#333333] disabled:opacity-50 transition-colors"
                >
                  {loading ? "Loading..." : "Log In"}
                </button>

                <div className="relative flex items-center justify-center py-1">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#eeeeee]"></div>
                  </div>
                  <div className="relative bg-white px-4 text-[11px] font-bold tracking-widest text-[#808080] uppercase">
                    OR
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleOAuth('google')}
                    disabled={loading}
                    className="w-full rounded-full border border-[#d9d9d9] bg-white py-2.5 text-[14px] font-bold text-black hover:bg-[#eeeeee] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27c3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10c5.35 0 9.25-3.67 9.25-9.09c0-1.15-.15-1.81-.15-1.81Z"/></svg>
                    Google
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOAuth('github')}
                    disabled={loading}
                    className="w-full rounded-full border border-[#d9d9d9] bg-white py-2.5 text-[14px] font-bold text-black hover:bg-[#eeeeee] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z"/></svg>
                    GitHub
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSignup(true)}
                  className="w-full rounded-full border border-[#d9d9d9] bg-white py-3 text-[15px] font-bold text-black hover:bg-[#eeeeee] transition-colors"
                >
                  Create an account
                </button>
              </div>
            </form>
          ) : (
            /* SIGNUP FORM */
            <form onSubmit={handleSignup} className="space-y-6">
              <div>
                <label className="block text-[11px] font-bold tracking-widest uppercase text-[#595959] mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full rounded-full border border-[#d9d9d9] px-5 py-4 text-[16px] font-medium text-black outline-none focus:border-black focus:ring-1 focus:ring-black transition-all placeholder:text-[#808080]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold tracking-widest uppercase text-[#595959] mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First"
                    className="w-full rounded-full border border-[#d9d9d9] px-5 py-4 text-[16px] font-medium text-black outline-none focus:border-black focus:ring-1 focus:ring-black transition-all placeholder:text-[#808080]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold tracking-widest uppercase text-[#595959] mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last"
                    className="w-full rounded-full border border-[#d9d9d9] px-5 py-4 text-[16px] font-medium text-black outline-none focus:border-black focus:ring-1 focus:ring-black transition-all placeholder:text-[#808080]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-[100px_1fr] gap-2">
                <div>
                  <label className="block text-[11px] font-bold tracking-widest uppercase text-[#595959] mb-2">
                    Code
                  </label>
                  <select 
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-full appearance-none rounded-full border border-[#d9d9d9] bg-white px-3 py-4 text-[16px] font-medium text-black text-center outline-none focus:border-black focus:ring-1 focus:ring-black transition-all cursor-pointer"
                  >
                    <option>🇮🇳 +91</option>
                    <option>🇺🇸 +1</option>
                    <option>🇬🇧 +44</option>
                    <option>🇦🇺 +61</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold tracking-widest uppercase text-[#595959] mb-2">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="98765 43210"
                    className="w-full rounded-full border border-[#d9d9d9] px-5 py-4 text-[16px] font-medium text-black outline-none focus:border-black focus:ring-1 focus:ring-black transition-all placeholder:text-[#808080]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold tracking-widest uppercase text-[#595959] mb-2">
                  Postal Code
                </label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="e.g. 110001"
                  className="w-full rounded-full border border-[#d9d9d9] px-5 py-4 text-[16px] font-medium text-black outline-none focus:border-black focus:ring-1 focus:ring-black transition-all placeholder:text-[#808080]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold tracking-widest uppercase text-[#595959] mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="Create a password"
                    className="w-full rounded-full border border-[#d9d9d9] pl-5 pr-12 py-4 text-[16px] font-medium text-black outline-none focus:border-black focus:ring-1 focus:ring-black transition-all placeholder:text-[#808080]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-[#808080] hover:text-black transition-colors"
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
                  className="mt-1 h-5 w-5 rounded-[4px] border-[#d9d9d9] text-black focus:ring-black accent-black"
                />
                <span className="text-[14px] text-[#595959] leading-tight font-medium">
                  I agree to the <Link href="#" className="font-bold text-black hover:underline underline-offset-4">Terms of Service</Link> and have reviewed the <Link href="#" className="font-bold text-black hover:underline underline-offset-4">Privacy Policy</Link>.
                </span>
              </div>

              <div className="pt-6 space-y-4">
                <button
                  type="submit"
                  disabled={!signupEmail || !firstName || !lastName || !phone || !postalCode || !signupPassword || !agreed}
                  className="w-full rounded-full bg-black py-4 text-[16px] font-bold text-white hover:bg-[#333333] disabled:opacity-50 transition-colors"
                >
                  Create Account
                </button>

                <div className="relative flex items-center justify-center py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#eeeeee]"></div>
                  </div>
                  <div className="relative bg-white px-4 text-[11px] font-bold tracking-widest text-[#808080] uppercase">
                    OR
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleOAuth('google')}
                  disabled={loading}
                  className="w-full rounded-full border border-[#d9d9d9] bg-white py-4 text-[16px] font-bold text-black hover:bg-[#eeeeee] transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27c3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10c5.35 0 9.25-3.67 9.25-9.09c0-1.15-.15-1.81-.15-1.81Z"/></svg>
                  Continue with Google
                </button>
                <button
                  type="button"
                  onClick={() => handleOAuth('github')}
                  disabled={loading}
                  className="w-full rounded-full border border-[#d9d9d9] bg-white py-4 text-[16px] font-bold text-black hover:bg-[#eeeeee] transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z"/></svg>
                  Continue with GitHub
                </button>
                <button
                  type="button"
                  onClick={() => setIsSignup(false)}
                  className="w-full rounded-full border border-[#d9d9d9] bg-white py-4 text-[16px] font-bold text-black hover:bg-[#eeeeee] transition-colors"
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
        <button className="flex items-center gap-2 rounded-full bg-white lg:bg-[#333333] border border-[#d9d9d9] lg:border-none px-4 py-3 text-[12px] font-bold text-black lg:text-white shadow-xl hover:scale-105 transition-transform uppercase tracking-widest">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          Help
        </button>
      </div>
    </div>
  );
}
