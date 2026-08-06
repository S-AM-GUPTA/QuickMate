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

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-sans">
      {/* Branding / Visual Side */}
      <div className="lg:w-1/2 relative flex flex-col justify-between p-8 sm:p-12 lg:p-16 text-white min-h-[40vh] lg:min-h-screen">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1920&auto=format&fit=crop"
            alt="Campus Background"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10">
          <Link href="/">
            <img src="/logo.png" alt="QuickMate Logo" className="h-10 sm:h-12 w-auto" />
          </Link>
        </div>
        <div className="py-12 lg:py-0 relative z-10">
          <h1 className="text-[56px] sm:text-[72px] lg:text-[88px] font-black leading-[0.9] tracking-[-0.04em] uppercase">
            Get It<br />Done.<br />Now.
          </h1>
          <p className="mt-6 text-[16px] sm:text-[18px] text-[#cccccc] max-w-sm font-medium">
            Book a trusted mate. No hassle, no wait. Pure efficiency for your startup.
          </p>
        </div>
        <div className="text-[11px] font-bold tracking-widest text-[#cccccc] uppercase hidden lg:block relative z-10">
          © 2026 QuickMate
        </div>
      </div>

      {/* Form Side */}
      <div className="lg:w-1/2 bg-white flex items-center justify-center p-8 sm:p-12 lg:p-16 relative">
        <div className="w-full max-w-[440px]">
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
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-[11px] font-bold tracking-widest uppercase text-[#595959] mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="founder@startup.co"
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
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
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

              <div className="pt-2">
                <Link href="#" className="text-[14px] font-bold text-black hover:underline underline-offset-4">
                  Forgot password?
                </Link>
              </div>

              <div className="pt-6 space-y-4">
                <button
                  type="submit"
                  disabled={loading || !loginEmail || !loginPassword}
                  className="w-full rounded-full bg-black py-4 text-[16px] font-bold text-white hover:bg-[#333333] disabled:opacity-50 transition-colors"
                >
                  {loading ? "Loading..." : "Log In"}
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
                  onClick={() => setIsSignup(true)}
                  className="w-full rounded-full border border-[#d9d9d9] bg-white py-4 text-[16px] font-bold text-black hover:bg-[#eeeeee] transition-colors"
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
                  placeholder="founder@startup.co"
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
