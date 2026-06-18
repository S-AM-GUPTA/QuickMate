"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

import { api } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();

  // Mode: login or signup
  const [isSignup, setIsSignup] = useState(false);
  
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
      console.error(err);
      setError(err.response?.data?.message || "Invalid credentials");
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
      console.error(err);
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
    <div className="min-h-screen relative flex items-center justify-center font-sans">
      {/* Full screen background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1920&auto=format&fit=crop"
          alt="Professional working"
          className="h-full w-full object-cover"
        />
        {/* Subtle overlay to ensure card pops */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Floating Card */}
      <div className="relative z-10 w-full max-w-[440px] bg-white rounded-[24px] shadow-2xl p-8 sm:p-10 my-8 mx-4">
        <div className="flex justify-center mb-10 mt-4">
          <Link href="/">
            <div className="flex items-center gap-2">
              <img src="/logo-v4.png" alt="QuickMate Logo" className="h-14 sm:h-16 w-auto object-contain" />
            </div>
          </Link>
        </div>

        <h1 className="text-[32px] font-extrabold text-[#212529] mb-8">
          {isSignup ? "Create your account" : "Welcome"}
        </h1>

        {error && (
          <div className="mb-6 p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
            {error}
          </div>
        )}

        {!isSignup ? (
          /* LOGIN FORM */
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-[#212529] mb-1.5">
                Email Address*
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-[24px] border border-[#ced4da] px-4 py-3 text-[15px] text-[#212529] outline-none focus:border-[#0D7F64] transition-colors placeholder:text-[#6c757d]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#212529] mb-1.5">
                Password*
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter a password"
                  className="w-full rounded-[24px] border border-[#ced4da] pl-4 pr-12 py-3 text-[15px] text-[#212529] outline-none focus:border-[#0D7F64] transition-colors placeholder:text-[#6c757d]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6c757d] hover:text-[#212529]"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <Link href="#" className="text-sm font-bold text-[#0D7F64] hover:underline">
                Need help with your password?
              </Link>
            </div>

            <div className="pt-4 space-y-4">
              <button
                type="submit"
                disabled={loading || !loginEmail || !loginPassword}
                className="w-full rounded-[24px] bg-[#0D7F64] py-3 text-[15px] font-bold text-white hover:bg-[#0a6650] disabled:opacity-50 transition-colors"
              >
                {loading ? "Loading..." : "Continue"}
              </button>

              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#ced4da]"></div>
                </div>
                <div className="relative bg-white px-4 text-xs font-semibold text-[#6c757d] uppercase">
                  OR
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsSignup(true)}
                className="w-full rounded-[24px] border border-[#ced4da] bg-white py-3 text-[15px] font-semibold text-[#212529] hover:bg-[#f8f9fa] transition-colors"
              >
                Sign up instead
              </button>
            </div>
          </form>
        ) : (
          /* SIGNUP FORM */
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#212529] mb-1.5">
                Email Address*
              </label>
              <input
                type="email"
                required
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-[24px] border border-[#ced4da] px-4 py-3 text-[15px] text-[#212529] outline-none focus:border-[#0D7F64] transition-colors placeholder:text-[#6c757d]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#212529] mb-1.5">
                First Name*
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
                className="w-full rounded-[24px] border border-[#ced4da] px-4 py-3 text-[15px] text-[#212529] outline-none focus:border-[#0D7F64] transition-colors placeholder:text-[#6c757d]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#212529] mb-1.5">
                Last Name*
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
                className="w-full rounded-[24px] border border-[#ced4da] px-4 py-3 text-[15px] text-[#212529] outline-none focus:border-[#0D7F64] transition-colors placeholder:text-[#6c757d]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#212529] mb-1.5">
                Phone Number*
              </label>
              <div className="flex">
                <select 
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="flex items-center justify-center px-4 py-3 border border-[#ced4da] border-r-0 rounded-l-[24px] bg-white text-[15px] text-[#212529] outline-none focus:border-[#0D7F64] transition-colors cursor-pointer appearance-none text-center min-w-[80px]"
                >
                  <option>🇮🇳 +91</option>
                  <option>🇺🇸 +1</option>
                  <option>🇬🇧 +44</option>
                  <option>🇦🇺 +61</option>
                </select>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-r-[24px] border border-[#ced4da] px-4 py-3 text-[15px] text-[#212529] outline-none focus:border-[#0D7F64] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#212529] mb-1.5">
                Postal Code*
              </label>
              <input
                type="text"
                required
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="Postal code"
                className="w-full rounded-[24px] border border-[#ced4da] px-4 py-3 text-[15px] text-[#212529] outline-none focus:border-[#0D7F64] transition-colors placeholder:text-[#6c757d]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#212529] mb-1.5">
                Password*
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="Enter a password"
                  className="w-full rounded-[24px] border border-[#ced4da] pl-4 pr-12 py-3 text-[15px] text-[#212529] outline-none focus:border-[#0D7F64] transition-colors placeholder:text-[#6c757d]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6c757d] hover:text-[#212529]"
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
                className="mt-1 h-4 w-4 rounded border-gray-300 text-[#0D7F64] focus:ring-[#0D7F64]"
              />
              <span className="text-xs text-[#212529] leading-tight">
                I agree to the <Link href="#" className="font-bold text-[#0D7F64] hover:underline">Terms of Service</Link> and have reviewed the <Link href="#" className="font-bold text-[#0D7F64] hover:underline">Privacy Policy</Link>.
              </span>
            </div>

            <div className="pt-6 space-y-4">
              <button
                type="submit"
                disabled={!signupEmail || !firstName || !lastName || !phone || !postalCode || !signupPassword || !agreed}
                className="w-full rounded-[24px] bg-[#0D7F64] py-3 text-[15px] font-bold text-white disabled:bg-[#e9ecef] disabled:text-[#adb5bd] transition-colors"
              >
                Sign Up
              </button>

              <button
                type="button"
                onClick={() => setIsSignup(false)}
                className="w-full rounded-[24px] border border-[#ced4da] bg-white py-3 text-[15px] font-semibold text-[#212529] hover:bg-[#f8f9fa] transition-colors"
              >
                Log in instead
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Floating Help Button */}
      <div className="fixed bottom-6 left-6 z-50">
        <button className="flex items-center gap-2 rounded-full bg-[#0D7F64] px-4 py-2.5 text-sm font-bold text-white shadow-lg hover:bg-[#0a6650] transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          Help
        </button>
      </div>
    </div>
  );
}
