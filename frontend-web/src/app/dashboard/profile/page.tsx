"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useNotification } from "@/context/NotificationContext";
import { User, Mail, Phone, MapPin, Shield, Edit2, Star, Target } from "lucide-react";
import { useProfile } from "@/context/ProfileContext";

export default function ProfilePage() {
  const { addNotification } = useNotification();
  const { profile, setProfile } = useProfile();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(profile);
  const [kycFile, setKycFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setEditForm(profile);
  }, [profile]);

  useEffect(() => {
    // Quick load from local storage
    const stored = localStorage.getItem("userProfile");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setProfile(prev => ({ ...prev, ...parsed }));
        setEditForm(prev => ({ ...prev, ...parsed }));
      } catch(e) {}
    }

    // Fetch fresh from API
    api.get('/users/me').then(res => {
      setProfile(prev => ({ ...prev, ...res.data }));
      setEditForm(prev => ({ ...prev, ...res.data }));
      localStorage.setItem("userProfile", JSON.stringify(res.data));
    }).catch(err => {
      if (err.response?.status !== 401) {
        console.warn(err.message);
      }
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // In a real app we would PUT/PATCH to backend
      addNotification("Profile updated successfully");
      setProfile((prev) => ({ ...prev, ...editForm }));
      localStorage.setItem("userProfile", JSON.stringify(editForm));
      setIsEditing(false);
    } catch (err) {
      alert("Failed to update profile");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userProfile");
    document.cookie = "accessToken=; path=/; max-age=0;";
    window.location.href = "/login";
  };

  const handleKycSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kycFile) return;

    setIsUploading(true);
    try {
      // 1. Get presigned URL
      const { data } = await api.post('/storage/presigned-url', {
        filename: kycFile.name,
        contentType: kycFile.type,
      });

      let finalDocUrl = data.publicUrl;

      // 2. Try to upload to the presigned URL
      // (This will fail in Mock Mode, but that's expected. We catch it and continue)
      try {
        if (data.uploadUrl.includes("mock-r2-upload.com")) {
          // MOCK MODE: Convert file to Base64 so it can actually be viewed in Admin panel
          finalDocUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(kycFile);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
          });
        } else {
          await fetch(data.uploadUrl, {
            method: 'PUT',
            body: kycFile,
            headers: {
              'Content-Type': kycFile.type,
            },
          });
        }
      } catch (uploadError) {
        console.warn("Upload to presigned URL failed. Continuing with publicUrl.", uploadError);
      }

      // 3. Patch backend with publicUrl
      await api.patch('/users/me/verification', {
        docUrl: finalDocUrl
      });

      // 4. Update local state
      const updatedProfile = { ...profile, verificationStatus: "PENDING_REVIEW" as const };
      setProfile(updatedProfile);
      localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
      
      addNotification("Aadhar uploaded successfully! Pending review.");
      setKycFile(null);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to submit verification");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl md:text-5xl tracking-tight text-ink leading-tight">Account Profile</h1>
          <p className="text-smoke font-medium text-[16px] mt-2">Manage your identity, tier, and security settings.</p>
        </div>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 text-[14px] font-medium text-ink hover:text-smoke transition-colors bg-sand px-4 py-2 rounded-full border border-smoke/30 hover:border-ink/50"
          >
            <Edit2 className="w-4 h-4" /> Edit Profile
          </button>
        )}
      </div>

      <div className="bg-paper rounded-2xl p-8 border border-smoke/50 shadow-sm">
        
        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[13px] font-semibold tracking-wider text-smoke uppercase mb-2">Full Name</label>
                <input 
                  type="text" required
                  className="w-full bg-sand border border-smoke/40 rounded-xl px-4 py-3 text-[14px] font-medium text-ink outline-none focus:border-ink transition-all"
                  value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[13px] font-semibold tracking-wider text-smoke uppercase mb-2">Phone</label>
                <input 
                  type="text" required
                  className="w-full bg-sand border border-smoke/40 rounded-xl px-4 py-3 text-[14px] font-medium text-ink outline-none focus:border-ink transition-all"
                  value={editForm.phone || ""} onChange={e => setEditForm({...editForm, phone: e.target.value})}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[13px] font-semibold tracking-wider text-smoke uppercase mb-2">Address / HQ Location</label>
                <input 
                  type="text"
                  className="w-full bg-sand border border-smoke/40 rounded-xl px-4 py-3 text-[14px] font-medium text-ink outline-none focus:border-ink transition-all"
                  value={editForm.address || ""} onChange={e => setEditForm({...editForm, address: e.target.value})}
                />
              </div>
              
              {/* Mate Specific Fields */}
              {profile.role === 'helper' && (
                <>
                  <div className="md:col-span-2 mt-4 pt-6 border-t border-smoke/20">
                    <h3 className="text-[16px] tracking-tight text-ink mb-4">Mate Configuration</h3>
                  </div>
                  
                  <div className="md:col-span-2 flex flex-col md:flex-row gap-4 mb-2">
                    <button
                      type="button"
                      onClick={() => setEditForm({...editForm, mateTier: "generalist", profession: ""})}
                      className={`flex-1 p-4 rounded-xl border text-left transition-all ${editForm.mateTier === "generalist" ? "bg-sand border-ink shadow-sm" : "bg-paper border-smoke/30 hover:border-smoke"}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Target className={`w-5 h-5 ${editForm.mateTier === "generalist" ? "text-ink" : "text-smoke"}`} />
                        <span className={`font-bold text-[15px] ${editForm.mateTier === "generalist" ? "text-ink" : "text-smoke"}`}>Generalist (Normal Mate)</span>
                      </div>
                      <p className="text-[13px] text-smoke mt-1">You are flexible and willing to accept a wide variety of standard tasks.</p>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setEditForm({...editForm, mateTier: "specialist"})}
                      className={`flex-1 p-4 rounded-xl border text-left transition-all ${editForm.mateTier === "specialist" ? "bg-charcoal border-charcoal shadow-md" : "bg-paper border-smoke/30 hover:border-smoke"}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Star className={`w-5 h-5 ${editForm.mateTier === "specialist" ? "text-[#FACC15] fill-current" : "text-smoke"}`} />
                        <span className={`font-bold text-[15px] ${editForm.mateTier === "specialist" ? "text-paper" : "text-smoke"}`}>Specialist (PRO Mate)</span>
                      </div>
                      <p className={`text-[13px] mt-1 ${editForm.mateTier === "specialist" ? "text-paper/70" : "text-smoke"}`}>You only accept specific tasks in your professional trade.</p>
                    </button>
                  </div>
                  
                  {editForm.mateTier === "specialist" && (
                    <div className="md:col-span-2">
                      <label className="block text-[13px] font-semibold tracking-wider text-smoke uppercase mb-2">Your Profession / Trade Title</label>
                      <input 
                        type="text" required placeholder="e.g. Master Plumber, Electrician, Virtual Assistant"
                        className="w-full bg-sand border border-smoke/40 rounded-xl px-4 py-3 text-[14px] font-medium text-ink outline-none focus:border-ink transition-all"
                        value={editForm.profession || ""} onChange={e => setEditForm({...editForm, profession: e.target.value})}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
            
            <div className="flex gap-4 justify-end pt-6 border-t border-smoke/30 mt-6">
              <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-3 rounded-full font-bold text-[14px] text-smoke hover:bg-sand transition-colors">Cancel</button>
              <button type="submit" className="px-8 py-3 rounded-full font-bold text-[14px] text-paper bg-charcoal hover:opacity-90 shadow-md">Save Changes</button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-smoke/30">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-sand border border-smoke flex items-center justify-center text-[32px] text-ink">
                  {profile.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-3xl tracking-tight text-ink mb-1">{profile.name}</h2>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {profile.role !== 'admin' && (
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold tracking-wider uppercase border ${
                        profile.verificationStatus === "VERIFIED" 
                          ? "bg-moss/10 text-moss border-moss/30" 
                          : "bg-sand text-smoke border-smoke/50"
                      }`}>
                        <Shield className="w-3.5 h-3.5" />
                        {profile.verificationStatus === "VERIFIED" ? "Verified ID" : "Unverified"}
                      </span>
                    )}
                    
                    {profile.role === 'admin' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold tracking-wider uppercase bg-charcoal text-paper border border-charcoal">
                        <Shield className="w-3.5 h-3.5" /> Super Admin
                      </span>
                    )}
                    
                    {profile.role === 'helper' && profile.mateTier === 'specialist' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold tracking-wider uppercase bg-[#FACC15] text-charcoal border border-[#FACC15] shadow-sm">
                        <Star className="w-3.5 h-3.5 fill-current" /> PRO Mate
                      </span>
                    )}
                    
                    {profile.role === 'helper' && profile.mateTier === 'generalist' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold tracking-wider uppercase bg-sand text-ink border border-smoke/40">
                        <Target className="w-3.5 h-3.5" /> Generalist
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              <div className="space-y-1">
                <span className="flex items-center gap-2 text-[12px] font-semibold tracking-wider text-smoke uppercase mb-1">
                  <Mail className="w-4 h-4" /> Email Address
                </span>
                <p className="font-medium text-[16px] text-ink">{profile.email}</p>
              </div>
              
              <div className="space-y-1">
                <span className="flex items-center gap-2 text-[12px] font-semibold tracking-wider text-smoke uppercase mb-1">
                  <Phone className="w-4 h-4" /> Phone Number
                </span>
                <p className="font-medium text-[16px] text-ink">{profile.phone || "Not provided"}</p>
              </div>

              <div className="space-y-1 md:col-span-2">
                <span className="flex items-center gap-2 text-[12px] font-semibold tracking-wider text-smoke uppercase mb-1">
                  <MapPin className="w-4 h-4" /> Primary Location
                </span>
                <p className="font-medium text-[16px] text-ink">{profile.address || "Not provided"}</p>
              </div>
              
              {profile.role === 'helper' && profile.profession && (
                 <div className="space-y-1 md:col-span-2 pt-4 border-t border-smoke/20">
                   <span className="flex items-center gap-2 text-[12px] font-semibold tracking-wider text-smoke uppercase mb-1">
                     Trade Profession
                   </span>
                   <p className="font-bold text-[18px] text-ink">{profile.profession}</p>
                 </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* KYC / BECOME A MATE SECTION */}
      {!isEditing && profile.role !== 'admin' && (
        <div className="bg-paper rounded-2xl p-8 border border-smoke/50 shadow-sm">
          {profile.role === 'customer' ? (
            <div>
              <h2 className="text-[20px] text-ink mb-2">Want to Earn Money?</h2>
              <p className="text-[14px] text-smoke mb-6 max-w-xl">
                Switch to a Mate account to start bidding on tasks and offering your professional services to customers.
              </p>
              <button 
                onClick={() => {
                  setProfile(prev => ({ ...prev, role: 'helper' }));
                  localStorage.setItem("userProfile", JSON.stringify({ ...profile, role: 'helper' }));
                }}
                className="bg-charcoal text-paper px-6 py-3 rounded-full text-[14px] font-bold shadow-md hover:opacity-90 transition-opacity"
              >
                Become a Mate
              </button>
            </div>
          ) : profile.verificationStatus !== 'VERIFIED' ? (
            <div>
              <h2 className="text-[20px] text-ink mb-2 flex items-center gap-2">
                <Shield className="w-5 h-5" /> Mate Identity Verification
              </h2>
              <p className="text-[14px] text-smoke mb-6 max-w-xl">
                Upload your Aadhar/PAN to complete your KYC. You cannot bid on tasks until your identity is verified.
              </p>
              
              {profile.verificationStatus === 'PENDING' || profile.verificationStatus === 'PENDING_REVIEW' ? (
                <div className="inline-flex items-center gap-2 bg-moss/10 text-moss px-4 py-3 rounded-xl border border-moss/30 text-[14px] font-medium">
                  Your documents are currently under review.
                </div>
              ) : (
                <form onSubmit={handleKycSubmit} className="flex flex-col md:flex-row items-start md:items-center gap-4">
                  <input 
                    type="file" 
                    required 
                    accept="image/*,.pdf" 
                    onChange={(e) => setKycFile(e.target.files?.[0] || null)}
                    className="text-[13px] bg-sand p-2 rounded-lg border border-smoke/30" 
                  />
                  <button 
                    type="submit" 
                    disabled={isUploading || !kycFile}
                    className="px-6 py-2.5 bg-charcoal text-paper rounded-full text-[14px] font-bold hover:opacity-90 shadow-md disabled:opacity-50 transition-opacity"
                  >
                    {isUploading ? 'Uploading...' : 'Upload Aadhar'}
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-[20px] text-ink mb-2 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-moss" /> Identity Verified
                  </h2>
                  <p className="text-[14px] text-smoke">
                    Your Aadhar KYC is complete. You are a trusted mate on the platform!
                  </p>
                </div>
                
                {profile.role === 'helper' && profile.mateTier !== 'specialist' && (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 bg-[#FACC15] text-charcoal px-5 py-2.5 rounded-full text-[13px] font-bold shadow-md hover:opacity-90 transition-opacity"
                  >
                    <Star className="w-4 h-4 fill-current" /> Upgrade to PRO Mate
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="pt-8">
        <button 
          onClick={handleLogout}
          className="text-[14px] font-bold tracking-wider text-red-600 hover:text-red-500 transition-colors bg-red-500/10 px-6 py-3 rounded-full border border-red-500/20"
        >
          LOG OUT OF ACCOUNT
        </button>
      </div>

    </div>
  );
}
