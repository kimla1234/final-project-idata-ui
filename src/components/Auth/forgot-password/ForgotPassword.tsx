"use client";
import React from "react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { IoCloseSharp } from "react-icons/io5";
import { useRouter } from "next/navigation";

// Custom Components
import Label from "../register/LabelComponent";
import DynamicField from "../register/AuthField";
import ErrorDynamic from "../register/ErrorComponent";
import Button from "../register/ButtonComponentForAuth";

// Redux & Hooks
import { useForgotPasswordMutation } from "@/redux/service/auth";
import { useAppDispatch } from "@/redux/hooks";
import { setEmail } from "@/redux/feature/verify/verifySlice";
import { useToast } from "@/hooks/use-toast";

type ValueTypes = {
  email: string;
};

const initialValues: ValueTypes = {
  email: "",
};

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Your email is invalid.")
    .required("You must enter your email."),
});

const ForgotPassword = () => {
  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  // Destructure isLoading directly from the mutation hook
  const [forgotPassword, { isLoading: isMutationLoading }] = useForgotPasswordMutation();

  const handleForgotPassword = async (values: ValueTypes) => {
    try {
      const { email } = values;
      
      // Trigger the mutation and unwrap the promise
      const response = await forgotPassword({ email }).unwrap();
      
      toast({
        title: response.message || "ជោគជ័យ!",
        description: "យើងបានផ្ញើកូដទៅកាន់អ៉ីម៉ែលរបស់អ្នកហើយ។",
        variant: "success",
      });

      // Save email to global state for use in the verification page
      dispatch(setEmail(email));

      // Navigate to verification page after a short delay
      setTimeout(() => {
        router.push("/verify-code-forgot");
      }, 1000);
    } catch (error: any) {
      const errorMessage = error?.data?.detail || "មានបញ្ហាអ្វីមួយ។ សូមព្យាយាមម្តងទៀត។";
      toast({
        title: "បរាជ័យ!",
        description: errorMessage,
        variant: "destructive", 
      });
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 md:bg-white">
      <div className="flex h-full w-full bg-white">
        
        {/* LEFT SIDE: VISUAL */}
        <div className="relative hidden h-screen w-[60%] bg-blue-600 md:block">
          <img
            src="https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&q=80"
            alt="Security Visual"
            className="h-full w-full object-cover opacity-40 mix-blend-multiply"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center text-white">
            <h1 className="mb-4 text-4xl font-bold">Secure Your Account</h1>
            <p className="text-lg text-blue-100">
              Don't worry, it happens to the best of us. Let's get you back in.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE: FORM */}
        <div className="flex w-full flex-col h-screen justify-center p-8 md:w-1/2 lg:p-12">
          {/* Close / Back to Login Button */}
          <div className="flex items-center justify-end py-6">
            <button
              onClick={() => router.push("/login")}
              className="rounded-full p-2 bg-purple-100 text-gray-500 transition hover:bg-red-100"
            >
              <IoCloseSharp size={24} />
            </button>
          </div>

          <div className="flex flex-1 items-center justify-center">
            <div className="w-full p-8 ">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Forgot your password?
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  Enter your email address and we’ll send you a verification
                  code to reset your password.
                </p>
              </div>

              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                  handleForgotPassword(values);
                }}
              >
                {() => (
                  <Form className="space-y-6">
                    <div>
                      <Label htmlFor="email" text="Email address" required />
                      <div className="mt-2">
                        <DynamicField
                          type="email"
                          name="email"
                          id="email"
                          placeholder="you@example.com"
                        />
                      </div>
                      <ErrorDynamic name="email" component="div" />
                    </div>

                    <Button
                      type="submit"
                      text="Send verification code"
                      isLoading={isMutationLoading} // Using the loading state from RTK Query
                      className="w-full rounded-xl bg-primary py-3 font-semibold text-white transition hover:opacity-90 active:scale-[0.98]"
                    />
                  </Form>
                )}
              </Formik>

              <div className="mt-6 text-center">
                <button
                  onClick={() => router.push("/login")}
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  Back to Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;