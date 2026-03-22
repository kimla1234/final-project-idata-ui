"use client";
import React, { useState, useEffect } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { Mail, Timer, RefreshCcw } from "lucide-react"; // Added for better UI
import Button from "./ButtonComponentForAuth";
import {
  useVerifyCodeRegisterMutation,
  useResendCodeResetPasswordMutation,
} from "@/redux/service/auth";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import OTPValidation from "./OTPValidation";

function OTPComponent() {
  const emailFromRedux = useAppSelector((state) => state.verify.email);
  const [email, setEmail] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(90);

  const [verifyCodeRegister] = useVerifyCodeRegisterMutation();
  const [resendCode] = useResendCodeResetPasswordMutation();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (emailFromRedux) {
      setEmail(emailFromRedux);
      localStorage.setItem("verificationEmail", emailFromRedux);
    } else {
      const savedEmail = localStorage.getItem("verificationEmail");
      if (savedEmail) {
        setEmail(savedEmail);
      } else {
        toast({
          title: "Email Not Found",
          description: "Please register again to continue.",
          variant: "destructive",
          duration: 3000,
        });
        setTimeout(() => router.push(`/register`), 3000);
      }
    }
  }, [emailFromRedux, router, toast]);

  useEffect(() => {
    let countdown: NodeJS.Timeout;
    if (timer > 0) {
      countdown = setTimeout(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(countdown);
  }, [timer]);

  const handleOTPComplete = (otpValue: string) => setOtp(otpValue);

  const handleSubmit = async () => {
    if (!email) return;
    const cleanOtp = otp.trim();
    if (cleanOtp.length < 6) {
      toast({
        title: "Incomplete Code",
        description: "Please enter the full 6-digit verification code.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await verifyCodeRegister({
        email: email,
        verificationCode: cleanOtp,
      }).unwrap();

      toast({
        title: "Verification Successful!",
        description: "Your account has been created. Redirecting to login...",
        variant: "success",
        duration: 3000,
      });

      localStorage.removeItem("verificationEmail");
      setTimeout(() => router.push(`/login`), 2000);
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error?.data?.message || "Invalid or expired code.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) return;
    setResending(true);
    try {
      await resendCode({ email }).unwrap();
      toast({
        title: "Code Resent",
        description: "Please check your email inbox for the new code.",
        variant: "success",
        duration: 3000,
      });
      setTimer(90);
    } catch (error) {
      toast({
        title: "Request Failed",
        description: "Unable to resend code. Please try again later.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <section className="flex min-h-screen w-full items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-6">
          <Link href="/">
            <Image
              src="/IDATA_LOGO.png"
              width={120}
              height={40}
              alt="Logo"
              className="h-auto w-24 md:w-28"
            />
          </Link>
          <button
            className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            onClick={() => router.push("/register")}
          >
            <IoCloseSharp size={24} />
          </button>
        </div>

        <div className="p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
              Verify your Email
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              We've sent a 6-digit verification code to:
            </p>
            {email && (
              <div className="mt-2 flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700">
                <Mail size={14} />
                {email}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center space-y-4">
              <OTPValidation length={6} onComplete={handleOTPComplete} />
              
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-400">
                <Timer size={14} className={timer < 10 ? "text-red-500 animate-pulse" : ""} />
                Expires in: <span className={timer < 10 ? "text-red-500" : "text-slate-600"}>{timer}s</span>
              </div>
            </div>

            <div className="flex items-center justify-center pt-2">
              <button
                className={`flex items-center gap-2 text-sm font-semibold transition-all ${
                  timer > 0 
                    ? "cursor-not-allowed text-slate-300" 
                    : "text-blue-600 hover:text-blue-700 active:scale-95"
                }`}
                onClick={handleResendCode}
                disabled={resending || timer > 0}
              >
                <RefreshCcw size={14} className={resending ? "animate-spin" : ""} />
                {resending ? "Resending..." : "Resend Code"}
              </button>
            </div>

            <Button
              type="submit"
              text="Verify Code"
              onClick={handleSubmit}
              isLoading={isLoading}
              className="mt-4 w-full rounded-xl bg-blue-600 py-4 text-base font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 active:scale-[0.98]"
            />
          </div>

          <p className="mt-8 text-center text-xs text-slate-400">
            Didn't receive the email? Check your spam folder or try resending.
          </p>
        </div>
      </div>
    </section>
  );
}

export default OTPComponent;