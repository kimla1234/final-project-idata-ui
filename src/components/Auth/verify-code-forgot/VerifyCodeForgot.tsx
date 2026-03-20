"use client";

import React, { useEffect, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useRouter } from "next/navigation";
import Image from "next/image";

// UI Components
import Button from "../register/ButtonComponentForAuth";


// Redux & API
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setResetCode } from "@/redux/feature/verify/verifySlice";
import {
  useVerifyCodeResetPasswordMutation,
  useResendCodeResetPasswordMutation,
} from "@/redux/service/auth";

import { useToast } from "@/hooks/use-toast";
import OTPValidation from "../register/OTPValidation";

export default function VerifyCodeForgot() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const emailFromRedux = useAppSelector((state) => state.verify.email);

  const [email, setEmail] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(90);
  const [isLoading, setIsLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const [verifyCodeResetPassword] = useVerifyCodeResetPasswordMutation();
  const [resendCodeResetPassword] = useResendCodeResetPasswordMutation();

  // Get email
  useEffect(() => {
    if (emailFromRedux) {
      setEmail(emailFromRedux);
      localStorage.setItem("verificationEmail", emailFromRedux);
    } else {
      const saved = localStorage.getItem("verificationEmail");
      if (saved) setEmail(saved);
      else {
        toast({
          title: "Email missing",
          description: "Redirecting to forgot password.",
          variant: "destructive",
        });
        router.push("/forgot-password");
      }
    }
  }, [emailFromRedux]);

  // Timer
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = async () => {
    if (!email || otp.length < 4) {
      toast({
        title: "Invalid code",
        description: "Please enter the verification code.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
    // Backend returns a JWT, not the OTP
    const result = await verifyCodeResetPassword({
      email,
      verifyCode: otp,
    }).unwrap();

    const jwtToken = result.resetToken; // <-- JWT from backend

    dispatch(setResetCode(jwtToken)); // ✅ store JWT, not OTP
    localStorage.setItem("resetToken", jwtToken);

    toast({ title: "Verified successfully", description: "Redirecting...", variant: "success" });

    setTimeout(() => router.push("/reset-password"), 1500);
    } catch {
      toast({
        title: "Verification failed",
        description: "Invalid or expired code.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;

    setResending(true);
    try {
      await resendCodeResetPassword({ email }).unwrap();
      toast({
        title: "Code resent",
        description: "Check your email.",
        variant: "success",
      });
      setTimer(90);
    } catch {
      toast({
        title: "Failed",
        description: "Could not resend code.",
        variant: "destructive",
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* LEFT SIDE */}
      <div className="relative hidden h-screen w-[60%] bg-blue-600 md:block">
        <img
          src="https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&q=80"
          alt="Security"
          className="h-full w-full object-cover opacity-40 mix-blend-multiply"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center text-white">
          <h1 className="mb-4 text-4xl font-bold">Verify your account</h1>
          <p className="text-lg text-blue-100">
            Enter the code sent to your email
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex w-full h-screen flex-col p-8 md:w-1/2 lg:p-12">
        {/* Header */}
        <div className="flex items-center justify-end py-6">
          <button
            onClick={() => router.push("/forgot-password")}
            className="rounded-full p-2 bg-purple-100 text-gray-500 hover:bg-red-100"
          >
            <IoCloseSharp size={24} />
          </button>
        </div>

        {/* Center */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800">
              Verify your code
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Enter the 6-digit code sent to your email.  
              <span className="font-semibold text-primary"> {timer}s</span>
            </p>

            <div className="mt-6">
              <OTPValidation length={6} onComplete={setOtp} />

              <div className="text-right mt-3">
                <button
                  disabled={resending}
                  onClick={handleResend}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  {resending ? "Sending..." : "Resend code"}
                </button>
              </div>
            </div>

            <div className="mt-6">
              <Button
                type="button"
                text="Verify code"
                isLoading={isLoading}
                onClick={handleVerify}
                className="w-full rounded-xl bg-primary py-3 font-semibold text-white hover:opacity-90"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
