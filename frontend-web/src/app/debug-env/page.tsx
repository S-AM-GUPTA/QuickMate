"use client";

import React, { useEffect, useState } from "react";

export default function DebugEnvPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const envs = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
  };

  return (
    <div className="p-8 font-mono text-sm max-w-2xl mx-auto mt-20 bg-slate-100 rounded-lg shadow text-black">
      <h1 className="text-xl font-bold mb-6 text-red-600">Environment Variable Debugger</h1>
      <p className="mb-4 text-gray-700">If any of these values say <strong>undefined</strong>, it means Vercel did not inject the environment variable during the build process.</p>
      
      <div className="space-y-4 bg-white p-6 rounded border">
        {Object.entries(envs).map(([key, value]) => (
          <div key={key} className="flex flex-col border-b pb-2">
            <span className="font-bold text-gray-600">{key}:</span>
            <span className={!value ? "text-red-500 font-bold" : "text-green-600"}>
              {value === undefined ? "UNDEFINED ?" : 
               value === "" ? "EMPTY STRING ?" : 
               `"${value}" ?`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
