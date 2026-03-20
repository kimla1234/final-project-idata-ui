"use client";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { IoCloseSharp } from "react-icons/io5";
import Label from "../register/LabelComponent";
import ErrorDynamic from "../register/ErrorComponent";
import PasswordField from "../register/PasswordField";
import Button from "../register/ButtonComponentForAuth";

import { useAppSelector } from "@/redux/hooks";
import { useResetPasswordMutation } from "@/redux/service/auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import Link from "next/link";

// --- Types ---
type ValueTypes = {
  new_password: string;
  confirm_password: string;
};

// --- Initial values ---
const initialValues: ValueTypes = {
  new_password: "",
  confirm_password: "",
};

// --- Password validation ---
const strongPasswordRegex = new RegExp(
  "^(?=.*[A-Z])(?=.*[a-z])(?=.*[@#$%^&*]).{8,}$",
);

const validationSchema = Yup.object().shape({
  new_password: Yup.string()
    .min(8, "ពាក្យសម្ងាត់ថ្មីគឺខ្លីពេក, សូមបញ្ជូលអោយបាន 8 តួរ")
    .matches(
      strongPasswordRegex,
      "ពាក្យសម្ងាត់របស់អ្នកត្រូវតែមានអក្សរធំ អក្សរតូច និង​និមិត្តសញ្ញាពិសេស",
    )
    .required("ពាក្យសម្ងាត់ថ្មីត្រូវតែបញ្ជូល"),
  confirm_password: Yup.string()
    .oneOf(
      [Yup.ref("new_password")],
      "ពាក្យសម្ងាត់ថ្មីត្រូវតែដូចជាមួយការបញ្ជាក់ពាក្យសម្ងាត់",
    )
    .required("អ្នកត្រូវបញ្ជូលបញ្ជាក់ពាក្យសម្ងាត់របស់អ្នក"),
});

const ResetPasswordComponent = () => {
  const router = useRouter();
  const { toast } = useToast();

  // --- Redux ---
  const email = useAppSelector((state) => state.verify.email);
  const resetToken = useAppSelector((state) => state.verify.reset_code);
  console.log("Sending reset token:", resetToken);

  const [isLoading, setIsLoading] = useState(false);
  const [resetPassword] = useResetPasswordMutation();

  // --- Protect route ---
  useEffect(() => {
    if (!email || !resetToken) {
      toast({
        title: "Missing email or reset code",
        description: "Redirecting to Forgot Password.",
        variant: "destructive",
      });
      setTimeout(() => {
        router.push(`/forgot-password`);
      }, 2000);
    }
  }, [email, resetToken]);

  // --- Submit handler ---
  const handleResetPassword = async (values: ValueTypes) => {
    if (!resetToken) return;

    setIsLoading(true);
    try {
      const response = await resetPassword({
        newPassword: values.new_password,
        confirmPassword: values.confirm_password,
        resetToken, // must match API
      }).unwrap();

      console.log("Sending reset token:", resetToken);
      toast({
        title: response.message || "Password reset successfully.",
        description: "Redirecting to login page.",
        variant: "success",
      });

      setTimeout(() => router.push(`/login`), 1500);
    } catch (error: any) {
      console.error("Reset Password Error:", error);
      const errorMessage =
        error?.data?.detail || "Failed to reset password. Please try again.";
      toast({
        title: errorMessage,
        description: "Your action was not completed.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // --- Close button ---
  const handleClose = () => {
    router.push(`/forgot-password`);
  };

  return (
    <section className="flex min-h-screen w-full">
      {/* LEFT SIDE */}
      <div className="relative hidden h-screen w-[60%] bg-blue-600 md:block">
        <img
          src="https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&q=80"
          alt="Security"
          className="h-full w-full object-cover opacity-40 mix-blend-multiply"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center text-white">
          <h1 className="mb-4 text-4xl font-bold">Reset Your Password</h1>
          <p className="text-lg text-blue-100">
            Enter your new password to secure your account.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex h-screen w-full flex-col p-8 md:w-1/2 lg:p-12">
        {/* Header */}
        <div className="flex items-center justify-end py-6">
          <button
            onClick={handleClose}
            className="rounded-full bg-purple-100 p-2 text-gray-500 hover:bg-red-100"
          >
            <IoCloseSharp size={24} />
          </button>
        </div>

        {/* Form */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <Link href={`/`}>
              <Image
                src="/assets/logo-text.jpg"
                width={1000}
                height={1000}
                alt="Logo"
                className="mb-6 w-28 md:w-48"
              />
            </Link>

            <h2 className="mb-4 text-2xl font-bold text-gray-800">
              Reset Your Password
            </h2>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleResetPassword}
            >
              {() => (
                <Form className="space-y-6">
                  {/* New Password */}
                  <div>
                    <Label
                      htmlFor="new_password"
                      text="New Password"
                      required
                    />
                    <PasswordField
                      id="new_password"
                      name="new_password"
                      placeholder="Enter new password"
                      className="mt-1"
                    />
                    <ErrorDynamic name="new_password" component="div" />
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <Label
                      htmlFor="confirm_password"
                      text="Confirm Password"
                      required
                    />
                    <PasswordField
                      id="confirm_password"
                      name="confirm_password"
                      placeholder="Confirm your password"
                      className="mt-1"
                    />
                    <ErrorDynamic name="confirm_password" component="div" />
                  </div>

                  {/* Submit Button */}
                  <div className="mt-6">
                    <Button
                      type="submit"
                      text="Reset Password"
                      isLoading={isLoading}
                      className="w-full rounded-xl bg-primary py-3 font-semibold text-white hover:opacity-90"
                    />
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResetPasswordComponent;
