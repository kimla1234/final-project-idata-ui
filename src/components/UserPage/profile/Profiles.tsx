"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Camera,
  MapPin,
  Plus,
  FilePlus2,
  Pencil,
  Loader2,
  Mail,
  Users,
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/DashboardCompoenents/ui/tabs";
import {
  useGetUserQuery,
  usePostImageMutation,
  useUpdateProfileUserMutation,
} from "@/redux/service/user";
import Image from "next/image";
import { useGetApiSchemesByFolderQuery } from "@/redux/service/apiScheme";

export default function MyProfile() {
  // ១. ទាញយកទិន្នន័យពី API
  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = useGetUserQuery(undefined);

  // ២. Mutation សម្រាប់ Upload រូបភាព និង Update Profile
  const [postImage, { isLoading: isUploading }] = usePostImageMutation();
  const [updateProfile, { isLoading: isUpdatingProfile }] =
    useUpdateProfileUserMutation();

  const [avatar, setAvatar] = useState<string>();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  //const { data: user, isLoading, isError, refetch } = useGetUserQuery(undefined);

  // ២. ទាញយកបញ្ជី API Schemes (ឧទាហរណ៍៖ folderId = 1 ឬយកពី state ណាមួយ)
  // បងអាចប្តូរលេខ 1 ទៅតាម Folder ជាក់ស្តែងរបស់ User
  const { data: schemes, isLoading: isLoadingSchemes } =
    useGetApiSchemesByFolderQuery(14);
  // ៣. Sync រូបភាពពី API ចូល State (Preview)
  useEffect(() => {
    if (user?.profileImage) {
      setAvatar(user.profileImage);
    } else {
      setAvatar("https://api.dicebear.com/7.x/avataaars/svg?seed=Kimla");
    }
  }, [user]);

  // ៤. 🎯 Flow សំខាន់: Upload រូបភាព -> Get URL -> Update User Profile
  // ៤. 🎯 Flow: Upload រូបភាព -> Get URL -> Update User Profile
  const handleUploadProcess = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "profile" | "cover",
  ) => {
    const file = event.target.files?.[0];
    if (!file || !user?.uuid) return;

    const uploadFormData = new FormData();
    uploadFormData.append("file", file);

    try {
      // --- ១. Upload រូបភាព ---
      const uploadRes = await postImage(uploadFormData).unwrap();

      // ទាញយក URI (តាមរយៈ Response របស់បងគឺ uploadRes.uri)
      const imageUri = uploadRes?.uri;

      if (imageUri) {
        // --- ២. Update User Profile ---
        // ចំណាំ៖ ត្រូវប្រាកដថា Key image_profile និង coverImage ត្រូវតាម Backend របស់បង
        const updatePayload =
          type === "profile"
            ? { profileImage: imageUri }
            : { coverImage: imageUri };

        console.log("Updating profile with payload:", updatePayload);

        await updateProfile({
          uuid: user.uuid,
          user: updatePayload, // ផ្ញើ Object ទៅកាន់ Mutation
        }).unwrap();

        // ជោគជ័យ៖ ទាញទិន្នន័យថ្មី
        refetch();
        alert("ជោគជ័យ៖ រូបភាពត្រូវបានផ្លាស់ប្តូរ!");
      }
    } catch (error: any) {
      console.error("Update Error Details:", error);
      if (error.status === 403) {
        alert("បរាជ័យ៖ អ្នកមិនមានសិទ្ធិកែប្រែព័ត៌មាននេះទេ (403 Forbidden)");
      } else {
        alert("មានបញ្ហាក្នុងការ Update ទិន្នន័យ");
      }
    }
  };
  if (isLoading) {
    return (
      <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-[#0057ff]" />
        <p className="text-sm font-medium text-gray-500">
          កំពុងទាញយកទិន្នន័យ...
        </p>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center text-sm font-bold text-red-500">
        មានបញ្ហាក្នុងការទាញយកទិន្នន័យ។ សូមសាកល្បងម្តងទៀត!
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f9f9] font-sans text-[#191919]">
      {/* --- Banner Section --- */}
      <div
        onClick={() => !isUploading && bannerInputRef.current?.click()}
        className="group relative flex h-[250px] w-full cursor-pointer flex-col items-center justify-center overflow-hidden border-b border-gray-200 bg-[#e8e8e8] transition-all hover:bg-gray-200"
      >
        {user.coverImage ? (
          <img
            src={user.coverImage}
            alt="Banner"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-400 group-hover:text-gray-600">
            <Camera className="h-8 w-8" />
            <p className="text-sm font-bold">Add a Banner Image</p>
          </div>
        )}

        {/* Hover Overlay for Banner */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
          {isUploading ? (
            <Loader2 className="animate-spin text-white" />
          ) : (
            <Camera className="h-10 w-10 text-white" />
          )}
        </div>

        <input
          type="file"
          ref={bannerInputRef}
          className="hidden"
          accept="image/*"
          onChange={(e) => handleUploadProcess(e, "cover")}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 -mt-14 flex flex-col gap-8 lg:flex-row">
          {/* --- Sidebar --- */}
          <aside className="w-full space-y-6 lg:w-[350px]">
            <div className="flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:items-start">
              {/* Profile Image */}
              <div
                onClick={() => !isUploading && avatarInputRef.current?.click()}
                className="group relative mb-4 flex h-32 w-32 cursor-pointer items-center justify-center overflow-hidden rounded-full border-[3px] border-purple-50 bg-blue-100"
              >
                <Image
                  unoptimized
                  src={avatar || ""}
                  alt="Profile"
                  width={1000}
                  height={1000}
                  className="h-full w-full object-cover"
                />

                {isUploading ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <Loader2 className="h-6 w-6 animate-spin text-white" />
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                    <Pencil className="h-5 w-5 text-white" />
                  </div>
                )}

                <input
                  type="file"
                  ref={avatarInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleUploadProcess(e, "profile")}
                />
              </div>

              <h1 className="text-2xl font-bold">{user.name || "User Name"}</h1>

              <div className="mt-4 flex w-full gap-4 border-y border-gray-50 py-3">
                <div className="flex flex-1 flex-col items-center border-r border-gray-50">
                  <span className="text-sm font-bold">
                    {user.followersCount || 0}
                  </span>
                  <span className="text-[10px] font-bold uppercase text-gray-400">
                    Followers
                  </span>
                </div>
                <div className="flex flex-1 flex-col items-center">
                  <span className="text-sm font-bold">0</span>
                  <span className="text-[10px] font-bold uppercase text-gray-400">
                    Following
                  </span>
                </div>
              </div>

              <div className="mt-4 flex w-full flex-col gap-2.5">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="truncate">
                    {user.address || user.city || "Location unknown"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="truncate">{user.email}</span>
                </div>
              </div>

              <div className="mt-6 w-full space-y-2">
                <button className="w-full rounded-full bg-[#0057ff] py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-blue-700 active:scale-95">
                  Edit Profile Info
                </button>
              </div>

              <div className="mt-8 w-full border-t border-gray-50 pt-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
                  MEMBER SINCE:{" "}
                  {user.createdAt
                    ? new Date(user.createdAt).getFullYear()
                    : "N/A"}
                </p>
              </div>
            </div>
          </aside>

          {/* --- Main Content --- */}
          <main className="mt-6 flex-1 lg:mt-6">
            <Tabs defaultValue="work" className="w-full">
              <TabsList className="h-auto w-full justify-start space-x-10 rounded-none border-b border-gray-200 bg-transparent p-0">
                {["Work", "Services", "Moodboards", "Drafts"].map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab.toLowerCase()}
                    className="rounded-none border-b-2 border-transparent bg-transparent px-0 pb-4 pt-0 text-[15px] font-bold text-gray-500 shadow-none transition-all hover:text-black data-[state=active]:border-black data-[state=active]:text-black"
                  >
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="work" className="pt-8 outline-none">
                <div className="mb-8 flex items-center justify-between">
                  <h2 className="text-xl font-bold tracking-tight">
                    My API Schemes
                  </h2>
                  <button className="flex items-center gap-2 rounded-full bg-[#0057ff] px-6 py-2 text-xs font-bold text-white shadow-md transition-all hover:bg-blue-700 active:scale-95">
                    <Plus className="h-4 w-4" /> Create a Scheme
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {/* ប៊ូតុងសម្រាប់បង្កើតថ្មី */}
                  <div className="group flex aspect-[4/3] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 transition-all hover:border-blue-400 hover:bg-blue-50/50">
                    <FilePlus2 className="h-8 w-8 text-gray-400 group-hover:text-blue-500" />
                    <p className="mt-4 text-sm font-bold text-gray-500 group-hover:text-blue-600">
                      Post new scheme
                    </p>
                  </div>

                  {/* ៣. បង្ហាញបញ្ជីដែលទាញបានពី API */}
                  {isLoadingSchemes ? (
                    <div className="flex aspect-[4/3] items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                    </div>
                  ) : (
                    schemes?.map((scheme) => (
                      <div
                        key={scheme.id}
                        className="group relative flex aspect-[4/3] flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-blue-200 hover:shadow-md"
                      >
                        <div>
                          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                            <Users className="h-5 w-5" />
                          </div>
                          <h3 className="line-clamp-1 text-lg font-bold text-gray-800">
                            {scheme.name || "Untitled Scheme"}
                          </h3>
                          <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                            {scheme.description ||
                              "No description provided for this API schema."}
                          </p>
                        </div>

                        <div className="flex items-center justify-between border-t border-gray-50 pt-4">
                          <span className="text-[10px] font-bold uppercase text-gray-400">
                            ID: #{scheme.id}
                          </span>
                          <button className="text-xs font-bold text-[#0057ff] hover:underline">
                            View Details
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </div>
  );
}
