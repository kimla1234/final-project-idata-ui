"use client";

import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { IoCloseSharp } from "react-icons/io5";

// Redux & Hooks
import { useAppDispatch } from "@/redux/hooks";
import { useRegisterMutation } from "@/redux/service/auth";
import { setEmail } from "@/redux/feature/verify/verifySlice";
import { useToast } from "@/hooks/use-toast";

// Components
import Label from "./LabelComponent";
import DynamicField from "./AuthField";
import ErrorDynamic from "./ErrorComponent";
import PasswordField from "./PasswordField";
import CustomCheckbox from "./CustomCheckBox";
import Button from "./ButtonComponentForAuth";

type ValueTypes = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
};

const initialValues: ValueTypes = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  terms: false,
};

const strongPasswordRegex = new RegExp(
  "^(?=.*[A-Z])(?=.*[a-z])(?=.*[@#$%^&*]).{8,}$",
);

export const Register = () => {
  const dispatch = useAppDispatch();
  const [register] = useRegisterMutation();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const workspaceId = searchParams.get("workspaceId");

  const [isLoading, setIsLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .max(60, "Name is too long")
      .required("Name is required"),
    email: Yup.string()
      .email("Invalid email")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Minimum 8 characters")
      .matches(
        strongPasswordRegex,
        "Must include uppercase, lowercase, and special character",
      )
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords do not match")
      .required("Confirm your password"),
    terms: Yup.bool().oneOf([true], "You must accept terms"),
  });

  const handleSubmit = async (values: ValueTypes) => {
    setIsLoading(true);
    try {
      const { name, email, password, confirmPassword } = values;

      const response = await register({
        data: { name, email, password, confirmPassword },
      }).unwrap();

      dispatch(setEmail(email));

      toast({
        title: "Registration Successful 🎉",
        description: response.message || "Please check your email.",
        variant: "success",
      });

      router.push(`/verify-code-register`);
    } catch (error: any) {
      const errorMessage =
        error?.data?.detail ||
        error?.data?.message ||
        `Registration failed (Error: ${error?.status})`;

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-gray-50 md:bg-white">
      {/* LEFT SIDE (LIKE LOGIN) */}
      <div className="relative hidden w-[60%] bg-blue-600 md:block">
        <img
          src="https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&q=80"
          alt="Register Visual"
          className="h-full w-full object-cover opacity-40 mix-blend-multiply"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center text-white">
          <h1 className="mb-4 text-4xl font-bold">
            Create Your Account
          </h1>
          <p className="text-lg text-blue-100">
            Join us and start your journey today 🚀
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex h-screen w-full flex-col justify-center p-8 md:w-1/2 lg:p-12">
        {/* CLOSE BUTTON */}
        <div className="flex justify-end py-6">
          <button
            onClick={() => router.push("/")}
            className="rounded-full bg-gray-100 p-2 text-gray-500 transition hover:bg-red-100"
          >
            <IoCloseSharp size={24} />
          </button>
        </div>

        <div className="w-full p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              Sign Up
            </h2>
            <p className="mt-2 text-gray-500">
              Please fill in the information below.
            </p>
          </div>

          {/* GOOGLE BUTTON */}
          <button
            type="button"
            className="mb-6 flex w-full items-center justify-center rounded-xl border border-gray-300 px-4 py-3 font-medium text-gray-700 transition hover:bg-gray-50 active:scale-95"
          >
            <img
              src="https://logowik.com/content/uploads/images/985_google_g_icon.jpg"
              alt="Google"
              className="mr-3 h-5"
            />
            Continue with Google
          </button>

          {/* DIVIDER */}
          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="mx-4 text-xs font-bold text-gray-400">
              OR
            </span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form className="space-y-4">
                {/* NAME */}
                <div>
                  <Label htmlFor="name" text="Full Name" required />
                  <DynamicField
                    name="name"
                    type="text"
                    id="name"
                    placeholder="Enter your name"
                  />
                  <ErrorDynamic name="name" component="div" />
                </div>

                {/* EMAIL */}
                <div>
                  <Label htmlFor="email" text="Email" required />
                  <DynamicField
                    name="email"
                    type="email"
                    id="email"
                    placeholder="name@gmail.com"
                  />
                  <ErrorDynamic name="email" component="div" />
                </div>

                {/* PASSWORD */}
                <div>
                  <Label htmlFor="password" text="Password" required />
                  <PasswordField
                    name="password"
                    id="password"
                    placeholder="Enter password"
                  />
                  <ErrorDynamic name="password" component="div" />
                </div>

                {/* CONFIRM PASSWORD */}
                <div>
                  <Label
                    htmlFor="confirmPassword"
                    text="Confirm Password"
                    required
                  />
                  <PasswordField
                    name="confirmPassword"
                    id="confirmPassword"
                    placeholder="Re-enter password"
                  />
                  <ErrorDynamic name="confirmPassword" component="div" />
                </div>

                {/* TERMS */}
                <div className="flex items-start space-x-2 pt-2">
                  <CustomCheckbox id="terms" name="terms" />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    I agree to the{" "}
                    <Link
                      href="/privacy-policy"
                      className="font-medium text-blue-600 hover:underline"
                    >
                      Terms & Conditions
                    </Link>
                  </label>
                </div>
                {errors.terms && touched.terms && (
                  <div className="text-xs text-red-500">
                    {errors.terms}
                  </div>
                )}

                {/* SUBMIT */}
                <Button
                  type="submit"
                  text="Create Account"
                  isLoading={isLoading}
                  className="w-full rounded-xl bg-primary py-3 font-bold text-white shadow-lg transition hover:bg-primary active:scale-[0.98]"
                />

                {/* LOGIN LINK */}
                <p className="mt-6 text-center text-sm text-gray-600">
                  Already have an account?
                  <Link
                    href="/login"
                    className="ml-1 font-bold text-primary hover:underline"
                  >
                    Sign In
                  </Link>
                </p>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};