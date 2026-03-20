"use client";
import React, { useState, useEffect } from "react";
import { IoCloseSharp } from "react-icons/io5";
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

  // Retrieve email logic
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
          title: "រកមិនឃើញអ៉ីម៉ែល",
          description: "សូមចុះឈ្មោះម្ដងទៀត។",
          variant: "destructive",
          duration: 3000,
        });
        setTimeout(() => {
          router.push(`/register`);
        }, 3000);
      }
    }
  }, [emailFromRedux, router]);

  // Timer logic
  useEffect(() => {
    let countdown: NodeJS.Timeout;
    if (timer > 0) {
      countdown = setTimeout(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(countdown);
  }, [timer]);

  const handleOTPComplete = (otpValue: string) => {
    setOtp(otpValue);
  };

  const handleSubmit = async () => {
    console.log("Sending to Backend:", { email, verificationCode: otp });

    if (!email) return;
    const cleanOtp = otp.trim();
    if (cleanOtp.length < 6) {
      toast({
        title: "សូមបញ្ចូលលេខកូដ",
        description: "លេខកូដផ្ទៀងផ្ទាត់ត្រូវមាន ៦ ខ្ទង់",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Added await here to ensure we wait for the server response
      await verifyCodeRegister({
  email: email,
  verificationCode: cleanOtp,
}).unwrap();

      toast({
        title: "ផ្ទៀងផ្ទាត់ជោគជ័យ!",
        description: "គណនីរបស់អ្នកត្រូវបានបង្កើត។",
        variant: "success",
        duration: 3000,
      });

      localStorage.removeItem("verificationEmail");

      setTimeout(() => {
        router.push(`/login`);
      }, 2000);
    } catch (error: any) {
      //console.error("Verification Error:", error);
      toast({
        title: "ការផ្ទៀងផ្ទាត់បរាជ័យ",
        description:
          error?.data?.message ||
          error?.response?.data?.message ||
          "លេខកូដមិនត្រឹមត្រូវ ឬហួសសុពលភាព។",
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
      // Added await here
      await resendCode({ email }).unwrap();
      toast({
        title: "ផ្ញើលេខកូដសារជាថ្មីជោគជ័យ",
        description: "សូមពិនិត្យមើលប្រអប់សំបុត្រអ៉ីម៉ែលរបស់អ្នក។",
        variant: "success",
        duration: 3000,
      });

      setTimer(90); // Reset timer
    } catch (error) {
      toast({
        title: "មិនអាចផ្ញើលេខកូដបានទេ",
        description: "សូមព្យាយាមម្ដងទៀតនៅពេលបន្តិចទៀតនេះ។",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <section className="flex h-screen w-full items-center justify-center bg-gray-50">
      <div className="m-auto rounded-xl border border-slate-200 bg-white py-7 shadow-sm">
        <div className="px-6 sm:px-8 md:px-6 xl:px-10">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Image
                src="/assets/logo-text.jpg"
                width={1000}
                height={1000}
                alt="Logo"
                className="w-24 md:w-32"
              />
            </Link>
            <button
              className="text-2xl text-gray-400 transition-colors hover:text-red-500"
              onClick={() => router.push("/register")}
            >
              <IoCloseSharp />
            </button>
          </div>

          <div className="h-fit w-fit pb-5 pt-9">
            <h1 className="text-2xl font-bold text-blue-600 md:text-3xl">
              ផ្ទៀងផ្ទាត់លេខកូដ
            </h1>
            <p className="pt-4 text-slate-500">
              យើងបានផ្ញើលេខកូដទៅកាន់អ៉ីម៉ែលរបស់អ្នក។ <br />{" "}
              លេខកូដនឹងហួសសុពលភាពក្នុងរយៈពេល:
              <span className="font-bold text-red-500">{` ${timer}s`}</span>
            </p>

            <div className="mt-8">
              <OTPValidation length={6} onComplete={handleOTPComplete} />

              <div className="mt-4 text-right">
                <button
                  className={`text-sm font-bold ${timer > 0 ? "cursor-not-allowed text-gray-400" : "text-blue-600 hover:underline"}`}
                  onClick={handleResendCode}
                  disabled={resending || timer > 0}
                >
                  {resending ? "កំពុងផ្ញើរ..." : "ផ្ញើលេខកូដម្ដងទៀត"}
                </button>
              </div>
            </div>

            <div className="mt-8">
              <Button
                type="submit"
                text="បញ្ជាក់លេខកូដ"
                onClick={handleSubmit}
                isLoading={isLoading}
                className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default OTPComponent;
