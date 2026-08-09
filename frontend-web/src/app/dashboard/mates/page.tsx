"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { ShieldCheck, Upload, AlertCircle, Users, Star } from "lucide-react";
import HelperCard, { Helper } from "@/components/HelperCard";
import { useProfile } from "@/context/ProfileContext";

export default function MatesPage() {
  const [helpers, setHelpers] = useState<Helper[]>([]);
  const { profile, setProfile } = useProfile();
  
  const [kycFile, setKycFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<"pro" | "all">("pro");

  useEffect(() => {
    // Mock fetching available helpers/mates for customers
    setHelpers([
      {
        id: "m1",
        name: "Alex M.",
        email: "alex@example.com",
        role: "helper",
        profession: "Master Plumber",
        mateTier: "specialist",
        rating: 4.9,
        completedTasksCount: 142,
        skills: ["Pipe Fitting", "Leak Repair", "Installations"],
        isVerified: true,
        distanceMeters: 2400,
        latitude: 28.6139,
        longitude: 77.2090,
      },
      {
        id: "m2",
        name: "Priya S.",
        email: "priya@example.com",
        role: "helper",
        mateTier: "generalist",
        rating: 4.8,
        completedTasksCount: 89,
        skills: ["Data Entry", "Scheduling", "Delivery"],
        isVerified: true,
        distanceMeters: 1100,
        latitude: 28.6139,
        longitude: 77.2090,
      },
      {
        id: "m3",
        name: "Rahul T.",
        email: "rahul@example.com",
        role: "helper",
        profession: "Expert Carpenter",
        mateTier: "specialist",
        rating: 5.0,
        completedTasksCount: 204,
        skills: ["Furniture Repair", "Custom Woodwork", "Assembly"],
        isVerified: true,
        distanceMeters: 3100,
        latitude: 28.6139,
        longitude: 77.2090,
      },
      {
        id: "m4",
        name: "David K.",
        email: "david@example.com",
        role: "helper",
        mateTier: "generalist",
        rating: 4.6,
        completedTasksCount: 34,
        skills: ["Errands", "Heavy Lifting", "Cleaning"],
        isVerified: false,
        distanceMeters: 4500,
        latitude: 28.6139,
        longitude: 77.2090,
      }
    ] as Helper[]);
  }, []);

  const handleKycUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kycFile) return;
    
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setProfile((prev) => ({ ...prev, verificationStatus: "PENDING" }));
      alert("Documents uploaded successfully! We will review them within 24 hours.");
    }, 1500);
  };

  const proMates = helpers.filter(h => h.mateTier === "specialist" || (!h.mateTier && h.rating >= 4.9 && h.isVerified));
  const regularMates = helpers.filter(h => !(h.mateTier === "specialist" || (!h.mateTier && h.rating >= 4.9 && h.isVerified)));

  return (
    <div className="space-y-8 animate-fade-in-up">
      
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif tracking-tight text-ink leading-tight">
            {profile.role === "customer" ? "Mates Network" : "Mate Verification"}
          </h1>
          <p className="text-smoke text-[16px] mt-2">
            {profile.role === "customer" 
              ? "Hire trusted talent or become a verified mate."
              : "Complete your KYC to unlock task bidding."}
          </p>
        </div>
      </div>

      {/* Become a Mate KYC Section */}
      {profile.verificationStatus !== "VERIFIED" && (
        <div className="bg-sand border border-smoke/30 rounded-2xl p-8 shadow-sm">
          <div className="flex items-start gap-6 flex-col md:flex-row">
            
            <div className="flex-1">
              <h2 className="text-2xl font-serif text-ink mb-2 flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-ink" /> Become a Verified Mate
              </h2>
              <p className="text-smoke text-[15px] mb-6 max-w-xl">
                Ready to earn by offering your professional services? Upload your identity documents to complete your KYC and unlock task bidding.
              </p>
              
              {profile.verificationStatus === "PENDING" ? (
                <div className="inline-flex items-center gap-2 bg-moss/20 text-moss px-4 py-3 rounded-full border border-moss/50 text-[14px] font-medium">
                  <AlertCircle className="w-4 h-4" />
                  Your documents are currently under review.
                </div>
              ) : (
                <form onSubmit={handleKycUpload} className="flex flex-col gap-4 max-w-md">
                  <div className="relative border-2 border-dashed border-smoke/40 rounded-2xl p-6 text-center hover:bg-paper hover:border-ink transition-colors cursor-pointer bg-paper/50 group">
                    <input 
                      type="file" 
                      accept="image/*,.pdf" 
                      onChange={(e) => setKycFile(e.target.files?.[0] || null)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload className="w-6 h-6 text-smoke mx-auto mb-2 group-hover:text-ink transition-colors" />
                    <span className="text-[14px] font-medium text-ink block">
                      {kycFile ? kycFile.name : "Tap to upload Aadhar/PAN"}
                    </span>
                    <span className="text-[12px] text-smoke mt-1 block">JPG, PNG, PDF up to 5MB</span>
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={!kycFile || isUploading}
                    className="w-full bg-charcoal text-paper rounded-full py-3.5 text-[14px] font-medium hover:opacity-90 transition-opacity disabled:opacity-50 shadow-md"
                  >
                    {isUploading ? "Uploading..." : "Submit KYC"}
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      )}
      
      {profile.role === "helper" && profile.verificationStatus === "VERIFIED" && (
        <div className={`rounded-2xl p-8 shadow-sm ${profile.mateTier === "specialist" ? "bg-charcoal text-paper border border-charcoal" : "bg-sand border-smoke/30 text-ink"}`}>
          <div className="flex flex-col items-center justify-center text-center py-8">
            {profile.mateTier === "specialist" ? (
              <>
                <div className="w-20 h-20 bg-[#FACC15]/20 rounded-full flex items-center justify-center mb-4 border border-[#FACC15]/50">
                  <Star className="w-10 h-10 text-[#FACC15] fill-current" />
                </div>
                <h2 className="text-3xl font-serif text-paper mb-2">You are a Professional Mate!</h2>
                <p className="text-paper/70 text-[16px] max-w-lg mb-4">
                  As a {profile.profession || "Specialist"}, your profile is highlighted to customers looking for premium, verified tradesmen.
                </p>
                <div className="inline-flex items-center gap-2 bg-[#FACC15] text-charcoal px-4 py-1.5 rounded-full text-[12px] font-bold uppercase tracking-wider">
                  Specialist Tier
                </div>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-moss/20 rounded-full flex items-center justify-center mb-4 border border-moss/50">
                  <ShieldCheck className="w-8 h-8 text-moss" />
                </div>
                <h2 className="text-2xl font-serif text-ink mb-2">You are a Verified Mate!</h2>
                <p className="text-smoke text-[15px] max-w-md mb-4">
                  Your identity has been verified. You can now browse tasks in the Tasks Market and submit bids for any flexible job.
                </p>
                <div className="inline-flex items-center gap-2 bg-paper text-ink border border-smoke/50 px-4 py-1.5 rounded-full text-[12px] font-bold uppercase tracking-wider shadow-sm">
                  Generalist Tier
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Available Mates Feed (Customer Only) */}
      {profile.role === "customer" && (
        <div className="space-y-6">
          
          {/* Tabs for Pro vs All */}
          <div className="flex items-center gap-2 border-b border-smoke/30 pb-4">
            <button 
              onClick={() => setActiveTab("pro")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-[14px] font-bold transition-all ${activeTab === 'pro' ? 'bg-[#FACC15] text-charcoal' : 'bg-transparent text-smoke hover:bg-sand'}`}
            >
              <Star className="w-4 h-4 fill-current" />
              Professional Mates
            </button>
            <button 
              onClick={() => setActiveTab("all")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-[14px] font-bold transition-all ${activeTab === 'all' ? 'bg-charcoal text-paper' : 'bg-transparent text-smoke hover:bg-sand'}`}
            >
              <Users className="w-4 h-4" />
              All Mates
            </button>
          </div>

          <div className="pt-4">
            {activeTab === "pro" && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-[#FACC15]/20 rounded-xl border border-[#FACC15]/30">
                    <Star className="w-6 h-6 text-[#FACC15] fill-current" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif text-ink">Professional Mates</h3>
                    <p className="text-[13px] font-medium text-smoke">Top-rated, verified experts. Guaranteed quality.</p>
                  </div>
                </div>
                {proMates.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {proMates.map(helper => (
                      <HelperCard key={helper.id} helper={helper} onHire={() => {}} />
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-smoke border border-dashed border-smoke/30 rounded-2xl">
                    No Professional Mates available in your area right now.
                  </div>
                )}
              </div>
            )}

            {activeTab === "all" && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-sand rounded-xl border border-smoke/30">
                    <Users className="w-6 h-6 text-ink" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif text-ink">All Available Mates</h3>
                    <p className="text-[13px] font-medium text-smoke">Browse all verified and unverified mates nearby.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {helpers.map(helper => (
                    <HelperCard key={helper.id} helper={helper} onHire={() => {}} />
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
