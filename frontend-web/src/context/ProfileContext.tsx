"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "@/lib/api";

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  address: string;
  role: "customer" | "helper";
  isVerified: boolean;
  verificationStatus: "UNVERIFIED" | "PENDING" | "VERIFIED" | "REJECTED";
  mateTier?: "generalist" | "specialist";
  profession?: string;
}

interface ProfileContextType {
  profile: ProfileData;
  setProfile: React.Dispatch<React.SetStateAction<ProfileData>>;
  toggleRole: () => void;
  isLoading: boolean;
}

const defaultProfile: ProfileData = {
  name: "User",
  email: "",
  phone: "",
  address: "",
  role: "customer",
  isVerified: true,
  verificationStatus: "VERIFIED",
  mateTier: "generalist",
  profession: ""
};

const ProfileContext = createContext<ProfileContextType>({
  profile: defaultProfile,
  setProfile: () => {},
  toggleRole: () => {},
  isLoading: true,
});

export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      // Try local storage first
      const stored = localStorage.getItem("userProfile");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setProfile((prev) => ({ ...prev, ...parsed }));
        } catch (e) {}
      }

      // Fetch fresh
      try {
        const res = await api.get("/users/me");
        setProfile((prev) => ({ ...prev, ...res.data }));
        localStorage.setItem("userProfile", JSON.stringify(res.data));
      } catch (err: any) {
        if (err.response?.status !== 401) {
          console.warn("Failed to fetch profile", err.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (typeof window !== "undefined" && localStorage.getItem("accessToken")) {
      loadProfile();
    } else {
      setIsLoading(false);
    }
  }, []);

  const toggleRole = () => {
    setProfile((prev) => {
      const newRole = prev.role === "customer" ? "helper" : "customer";
      const newProfile = { ...prev, role: newRole };
      localStorage.setItem("userProfile", JSON.stringify(newProfile));
      return newProfile;
    });
  };

  return (
    <ProfileContext.Provider value={{ profile, setProfile, toggleRole, isLoading }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
