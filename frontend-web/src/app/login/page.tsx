"use client";

import React, { useState } from "react";
import {
  Mail,
  Phone,
  Lock,
  ArrowRight,
  Shield,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [step, setStep] = useState<
    "IDENTIFIER" | "PASSWORD" | "OTP" | "CREATE_PASSWORD"
  >("IDENTIFIER");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [name, setName] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const checkUserExists = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate API call to check if user exists
    try {
      const res = await fetch("http://localhost:3005/auth/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier }),
      });

      const data = await res.json();

      if (data.exists) {
        setStep("PASSWORD");
      } else {
        // Automatically request OTP for new user
        await requestOtp();
      }
    } catch (err) {
      setError("Could not connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const requestOtp = async () => {
    try {
      if (!identifier.includes("@")) {
        const isPhone = /^\d{10}$/.test(identifier);
        if (!isPhone) {
          setError("Please enter a valid 10-digit phone number or email.");
          return;
        }
      }

      const res = await fetch("http://localhost:3005/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier }),
      });

      if (res.ok) {
        setMessage("OTP sent to your console/email!");
        setStep("OTP");
      } else {
        setError("Failed to send OTP.");
      }
    } catch (err: any) {
      console.error(err);
      setError("Failed to send OTP: " + err.message);
    }
  };

  const loginWithPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3005/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.access_token);
        router.push("/dashboard");
      } else {
        setError("Invalid password.");
      }
    } catch (err) {
      setError("Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (otp.length < 6) {
      setError("OTP must be 6 digits.");
      return;
    }

    // We will verify the OTP along with the password in the next step.
    setMessage("OTP format valid. Please create a password.");
    setStep("CREATE_PASSWORD");
  };

  const registerNewUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!name.trim()) {
      setError("Please enter your full name.");
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:3005/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, otpCode: otp, newPassword, name }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.access_token);
        router.push("/dashboard");
      } else {
        setError("Registration failed. Invalid OTP or user exists.");
      }
    } catch (err) {
      setError("Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-zinc-950 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl shadow-blue-500/10 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 transition-all duration-300">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/30 mb-4">
            <Shield className="h-7 w-7 fill-current" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-50">
            {step === "IDENTIFIER" && "Welcome to QuickMate"}
            {step === "PASSWORD" && "Welcome Back"}
            {step === "OTP" && "Verify Your Identity"}
            {step === "CREATE_PASSWORD" && "Secure Your Account"}
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">
            {step === "IDENTIFIER" &&
              "Enter your email or phone number to continue."}
            {step === "PASSWORD" && "Enter your password to sign in."}
            {step === "OTP" &&
              "We've sent a 6-digit code. Please enter it below."}
            {step === "CREATE_PASSWORD" &&
              "Create a strong password for future logins."}
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-sm text-rose-600 border border-rose-100 dark:bg-rose-950/30 dark:border-rose-900/50">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {message && (
          <div className="mb-6 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-600 border border-emerald-100 dark:bg-emerald-950/30 dark:border-emerald-900/50">
            <CheckCircle className="h-4 w-4 shrink-0" />
            <p>{message}</p>
          </div>
        )}

        {/* STEP 1: Enter Identifier */}
        {step === "IDENTIFIER" && (
          <form onSubmit={checkUserExists} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2">
                Email or Phone
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
                  {identifier.includes("@") ? (
                    <Mail className="h-5 w-5" />
                  ) : (
                    <Phone className="h-5 w-5" />
                  )}
                </div>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="name@example.com or 9876543210"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-50 dark:focus:bg-zinc-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !identifier}
              className="group w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-500 disabled:opacity-50 transition-all cursor-pointer"
            >
              {loading ? "Checking..." : "Continue"}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        )}

        {/* STEP 2: Password Login (Existing User) */}
        {step === "PASSWORD" && (
          <form onSubmit={loginWithPassword} className="space-y-5">
            <div className="rounded-xl border border-slate-200 p-3 bg-slate-50 dark:bg-zinc-900 dark:border-zinc-800 flex justify-between items-center text-sm">
              <span className="text-slate-600 dark:text-zinc-300 font-medium truncate">
                {identifier}
              </span>
              <button
                type="button"
                onClick={() => setStep("IDENTIFIER")}
                className="text-blue-600 dark:text-blue-400 font-semibold text-xs uppercase cursor-pointer"
              >
                Edit
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-50 dark:focus:bg-zinc-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-500 disabled:opacity-50 transition-all cursor-pointer"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        )}

        {/* STEP 3: OTP Verification (New User) */}
        {step === "OTP" && (
          <form onSubmit={verifyOtp} className="space-y-5">
            <div className="rounded-xl border border-slate-200 p-3 bg-slate-50 dark:bg-zinc-900 dark:border-zinc-800 flex justify-between items-center text-sm">
              <span className="text-slate-600 dark:text-zinc-300 font-medium truncate">
                {identifier}
              </span>
              <button
                type="button"
                onClick={() => setStep("IDENTIFIER")}
                className="text-blue-600 dark:text-blue-400 font-semibold text-xs uppercase cursor-pointer"
              >
                Change
              </button>
            </div>

            <div>
              <label className="block text-center text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-4">
                Enter 6-Digit Code
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="000000"
                className="w-full text-center tracking-[0.5em] font-mono text-2xl rounded-xl border border-slate-200 bg-slate-50 py-4 px-4 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-50 dark:focus:bg-zinc-900"
              />
            </div>

            <button
              type="submit"
              disabled={otp.length !== 6}
              className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-500 disabled:opacity-50 transition-all cursor-pointer"
            >
              Verify OTP
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={requestOtp}
                className="text-xs text-slate-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 cursor-pointer"
              >
                Didn't receive code? Resend
              </button>
            </div>
          </form>
        )}

        {/* STEP 4: Create Profile & Password (New User) */}
        {step === "CREATE_PASSWORD" && (
          <form onSubmit={registerNewUser} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 px-4 text-sm text-slate-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-50 dark:focus:bg-zinc-900 mb-4"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2">
                Create a Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Must be at least 6 characters"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-50 dark:focus:bg-zinc-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || newPassword.length < 6}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-500/20 hover:bg-emerald-500 disabled:opacity-50 transition-all cursor-pointer"
            >
              {loading ? "Creating Account..." : "Complete Registration"}
              <CheckCircle className="h-4 w-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
