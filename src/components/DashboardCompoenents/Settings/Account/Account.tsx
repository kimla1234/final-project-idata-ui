"use client";

import { useToast } from "@/hooks/use-toast";
import { useGetUserQuery, usePostImageMutation, useUpdateProfileUserMutation } from "@/redux/service/user";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { HiOutlinePhoto } from "react-icons/hi2";

export default function Account() {
  const { toast } = useToast();
  
  // 🎯 1. Fetch User Data from API
  const { data: userProfile, isLoading } = useGetUserQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileUserMutation();
  const [postImage, { isLoading: isUploading }] = usePostImageMutation();

  // Local state for form handling
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    profileImage: ""
  });

  // 🎯 2. Sync API data to local state when loaded
  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || "",
        phone: userProfile.phone || "",
        address: userProfile.address || "",
        profileImage: userProfile.profileImage || ""
      });
    }
  }, [userProfile]);


 //  Handle Photo Upload (Flow: Upload -> Get URI -> Patch Profile Immediately)
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !userProfile?.uuid) return;
    
    const file = e.target.files[0];

    // ១. ឆែកទំហំរូបភាព (២MB ខ្លាច Server Error)
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max size is 2MB", variant: "destructive" });
      return;
    }

    const body = new FormData();
    body.append("file", file);

    try {
      // --- STEP 1: Upload រូបភាពទៅកាន់ Server ---
      const uploadRes = await postImage(body).unwrap();
      
      // ទាញយក URI/URL មកវិញ (ឆែកតាម Response Backend របស់បង)
      const imageUri = uploadRes?.uri || uploadRes?.payload;

      if (imageUri) {
        // --- STEP 2: Update ចូល Database ភ្លាមៗ (ដូច MyProfile) ---
        await updateProfile({
          uuid: userProfile.uuid,
          user: { profileImage: imageUri } // Patch តែ field រូបភាពមួយក៏បាន
        }).unwrap();

        // --- STEP 3: Update Local State ដើម្បីបង្ហាញរូបថ្មី ---
        setFormData((prev) => ({ ...prev, profileImage: imageUri }));
        
        toast({ 
          title: "Profile Picture Updated", 
          description: "Your photo has been saved successfully.",
          className: "bg-green-600 text-white" 
        });
      }
    } catch (error) {
      console.error("Upload Error:", error);
      toast({ title: "Update Failed", description: "Could not update profile picture.", variant: "destructive" });
    }
  };

  // 🎯 4. Save Profile Changes
  const handleSave = async () => {
    if (!userProfile?.uuid) return;

    try {
      await updateProfile({
        uuid: userProfile.uuid,
        user: {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          profileImage: formData.profileImage
        }
      }).unwrap();

      toast({
        title: "Success",
        description: "Your profile has been updated successfully.",
        className: "bg-green-600 text-white",
      });
    } catch (error) {
      toast({ 
        title: "Update Failed", 
        description: "Something went wrong while saving.", 
        variant: "destructive" 
      });
    }
  };

  if (isLoading) return <p className="p-10 text-center text-gray-500">Loading profile...</p>;

  return (
    <div className="mx-auto w-full rounded-md bg-white p-6 shadow-sm">
      <h2 className="mb-2 text-xl font-semibold text-gray-800">Profile Information</h2>
      <p className="mb-10 text-gray-500">Update your personal details and preferences.</p>

      {/* Avatar Section */}
      <div className="mb-6 flex items-center space-x-5">
        <div className="relative h-24 w-24 overflow-hidden rounded-full border border-gray-100">
          <Image
            unoptimized
            src={formData.profileImage || "/placeholder.png"}
            alt="Profile"
            width={1000}
            height={1000}
            className="object-cover"
          />
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-[10px] text-white">
              Uploading...
            </div>
          )}
        </div>

        <div>
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all">
            <HiOutlinePhoto className="text-xl" />
            Change Photo
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
              disabled={isUploading}
            />
          </label>
        </div>
      </div>

      {/* Form Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Input
            label="Full Name"
            value={formData.name}
            placeholder="Enter your name"
            onChange={(v) => setFormData(prev => ({ ...prev, name: v }))}
          />
          <Input
            label="Phone Number"
            value={formData.phone}
            placeholder="e.g. 012345678"
            onChange={(v) => setFormData(prev => ({ ...prev, phone: v }))}
          />
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">Email (Read-only)</label>
            <input
              type="text"
              value={userProfile?.email || ""}
              disabled
              className="w-full rounded border border-gray-200 bg-gray-50 px-3 py-2 text-gray-400 cursor-not-allowed"
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="mb-1 block text-sm font-medium text-gray-700">Address / Bio</label>
          <textarea
            value={formData.address}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            className="min-h-[162px] w-full rounded border border-gray-200 bg-white px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
            placeholder="Tell us about yourself or your location..."
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSave}
          disabled={isUpdating}
          className="rounded-lg bg-purple-600 px-8 py-2.5 text-white font-medium hover:bg-purple-700 disabled:bg-purple-300 transition-colors shadow-md"
        >
          {isUpdating ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

/* ---------- Reusable Input Component ---------- */
function Input({ label, value, placeholder, onChange }: { label: string; value: string; placeholder?: string; onChange: (v: string) => void }) {
  return (
    <div className="mb-4">
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded border border-gray-200 bg-white px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
      />
    </div>
  );
}