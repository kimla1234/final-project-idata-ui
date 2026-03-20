"use client";

import React from "react"; // 🎯 ថែមការ Import React
import { useRouter } from "next/navigation";
import { useJoinWorkspaceMutation } from "@/redux/service/workspace";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function JoinWorkspacePage({ params }: { params: { id: string } }) {
    const workspaceId = params.id;
    // 🎯 ដំណោះស្រាយ៖ ប្រើ React.use() ដើម្បីចាប់យក ID ពី Promise params
    //const resolvedParams = React.use(params); 


    const router = useRouter();
    const { toast } = useToast();
    const [joinWorkspace, { isLoading }] = useJoinWorkspaceMutation();

    const handleJoin = async () => {
        // ឆែកមើលក្រែងលោ workspaceId អត់មានតម្លៃ
        if (!workspaceId) {
            toast({ title: "Error", description: "Invalid Workspace ID", variant: "destructive" });
            return;
        }

        try {
            // ប្រើ Number() សុវត្ថិភាពជាង parseInt()
            await joinWorkspace(Number(workspaceId)).unwrap();
            
            toast({
                title: "Welcome! 🎉",
                description: "You are now a member of this workspace.",
            });
            
            router.push(`/dashbord`);
        } catch (err: any) {
            toast({
                title: "Join Failed",
                description: err?.data?.message || "Something went wrong.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
            <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-100">
                <div className="mb-6 flex justify-center">
                    <div className="bg-orange-100 p-4 rounded-full">
                        <span className="text-4xl">✉️</span>
                    </div>
                </div>
                <h1 className="text-2xl font-bold mb-3 text-gray-800">Workspace Invitation</h1>
                <p className="text-gray-500 mb-8 leading-relaxed">
                    You have been invited to collaborate with the team. 
                    Accept the invitation to start working together!
                </p>
                
                <button
                    onClick={handleJoin}
                    disabled={isLoading}
                    className="w-full bg-[#f07c54] text-white py-3.5 rounded-xl font-bold hover:bg-[#e06b43] transition-all active:scale-[0.98] disabled:opacity-50 flex justify-center items-center gap-2 shadow-lg shadow-orange-200"
                >
                    {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        "Accept Invitation & Join"
                    )}
                </button>
            </div>
        </div>
    );
}