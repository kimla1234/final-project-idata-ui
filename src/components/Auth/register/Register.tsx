"use client";
import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { IoCloseSharp } from "react-icons/io5";

// Redux & Hooks
import { useAppDispatch } from "@/redux/hooks";
import { useRegisterMutation } from "@/redux/service/auth";

import { useToast } from "@/hooks/use-toast";

// Components
import Label from "./LabelComponent";
import DynamicField from "./AuthField";
import ErrorDynamic from "./ErrorComponent";
import PasswordField from "./PasswordField";
import Button from "./ButtonComponentForAuth";
import CustomCheckbox from "./CustomCheckBox";
import { setEmail } from "@/redux/feature/verify/verifySlice";

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
      .max(60, "ឈ្មោះរបស់អ្នកវែងពេក")
      .required("អ្នកត្រូវបញ្ជូលឈ្មោះរបស់អ្នក"),
    email: Yup.string()
      .email("អ៉ីម៉ែលរបស់អ្នកមិនត្រឹមត្រូវ")
      .required("អ្នកត្រូវបញ្ជូលអ៉ីម៉ែលរបស់អ្នក"),
    password: Yup.string()
      .min(8, "ពាក្យសម្ងាត់យ៉ាងតិច 8 តួរ")
      .matches(strongPasswordRegex, "ត្រូវមានអក្សរធំ តូច និងនិមិត្តសញ្ញាពិសេស")
      .required("ពាក្យសម្ងាត់ត្រូវតែបញ្ជូល"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "ពាក្យសម្ងាត់មិនដូចគ្នាទេ")
      .required("អ្នកត្រូវបញ្ជាក់ពាក្យសម្ងាត់"),
    terms: Yup.bool().oneOf([true], "អ្នកត្រូវតែយល់ព្រមតាមលក្ខខណ្ឌ"),
  });

  const handleSubmit = async (values: ValueTypes) => {
    setIsLoading(true);
    try {
      const { name, email, password, confirmPassword } = values;
      const response = await register({
        data: {
          name,
          email,
          password,
          confirmPassword,
        },
      }).unwrap();

      dispatch(setEmail(email));
      toast({
        title: "ចុះឈ្មោះជោគជ័យ!",
        description: response.message || "សូមពិនិត្យមើលអ៉ីម៉ែលរបស់អ្នក។",
        variant: "success",
        duration: 4000,
      });

      // ប្តូរទៅកាន់ទំព័រផ្ទៀងផ្ទាត់លេខកូដ (OTP)
      router.push(`/verify-code-register`);
    } catch (error: any) {
      // RTK Query errors usually look like this: { status: 400, data: { detail: "..." } }
      const errorMessage =
        error?.data?.detail ||
        error?.data?.message ||
        "ការចុះឈ្មោះមានបញ្ហា (Error: " + error?.status + ")";

      toast({
        title: "បរាជ័យ",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="h-full w-full md:p-20 lg:bg-gray-100 lg:p-9">
      <div className="m-auto h-screen w-full overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg">
        <div className="h-full justify-between lg:flex">
          {/* ផ្នែកខាងឆ្វេង: រូបភាព និង ការពិពណ៌នា */}
          <div className="hidden w-full bg-blue-50/50 lg:block lg:w-7/12">
            <div className="flex justify-center pt-10">
              <Image
                src="/auth/1.png"
                width={500}
                height={500}
                alt="Register Banner"
                className="object-contain"
              />
            </div>
            <div className="mx-auto px-10 text-center">
              <h1 className="mb-4 text-3xl font-bold text-blue-600">
                បង្កើតគណនីថ្មី
              </h1>
              <p className="mx-auto max-w-md text-lg text-gray-500">
                ចូលរួមជាមួយយើងដើម្បីទទួលបានបទពិសោធន៍ថ្មីៗ
                និងការផ្ដល់ជូនពិសេសៗជាច្រើន។
              </p>
            </div>
          </div>

          {/* ផ្នែកខាងស្តាំ: Form ចុះឈ្មោះ */}
          <div className="flex w-full flex-col lg:w-5/12">
            <div className="flex justify-end p-4">
              <button
                onClick={() => router.back()}
                className="text-3xl text-gray-400 transition-colors hover:text-red-500"
              >
                <IoCloseSharp />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 pb-10 lg:px-12">
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">ចុះឈ្មោះ</h1>
                <p className="text-gray-500">សូមបំពេញព័ត៌មានខាងក្រោម</p>
              </div>

              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ errors, touched }) => (
                  <Form className="space-y-4">
                    <div>
                      <Label
                        htmlFor="name"
                        text="ឈ្មោះអ្នកប្រើប្រាស់"
                        required
                      />
                      <DynamicField
                        type="text"
                        id="name"
                        name="name"
                        placeholder="បញ្ជូលឈ្មោះរបស់អ្នក"
                      />
                      <ErrorDynamic name="name" component="div" />
                    </div>

                    <div>
                      <Label htmlFor="email" text="អ៉ីម៉ែល" required />
                      <DynamicField
                        name="email"
                        type="email"
                        id="email"
                        placeholder="ឧទាហរណ៍: name@gmail.com"
                      />
                      <ErrorDynamic name="email" component="div" />
                    </div>

                    <div>
                      <Label htmlFor="password" text="ពាក្យសម្ងាត់" required />
                      <PasswordField
                        name="password"
                        id="password"
                        placeholder="បញ្ជូលពាក្យសម្ងាត់"
                      />
                      <ErrorDynamic name="password" component="div" />
                    </div>

                    <div>
                      <Label
                        htmlFor="confirmPassword"
                        text="បញ្ជាក់ពាក្យសម្ងាត់"
                        required
                      />
                      <PasswordField
                        name="confirmPassword"
                        id="password"
                        placeholder="បញ្ជូលពាក្យសម្ងាត់ម្ដងទៀត"
                      />
                      <ErrorDynamic name="confirmPassword" component="div" />
                    </div>

                    <div className="flex items-start space-x-2 pt-2">
                      <CustomCheckbox id="terms" name="terms" />
                      <label htmlFor="terms" className="text-sm text-gray-600">
                        ខ្ញុំយល់ព្រមតាម{" "}
                        <Link
                          href="/privacy-policy"
                          className="font-medium text-blue-600 hover:underline"
                        >
                          គោលការណ៍ និងលក្ខខណ្ឌ
                        </Link>
                      </label>
                    </div>
                    {errors.terms && touched.terms && (
                      <div className="text-xs text-red-500">{errors.terms}</div>
                    )}

                    <Button
                      type="submit"
                      text="ចុះឈ្មោះឥឡូវនេះ"
                      isLoading={isLoading}
                      className="mt-4 w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition-all hover:bg-blue-700"
                    />

                    <div className="my-6 flex items-center">
                      <div className="flex-grow border-t border-gray-200"></div>
                      <span className="px-3 text-sm italic text-gray-400">
                        ឬ
                      </span>
                      <div className="flex-grow border-t border-gray-200"></div>
                    </div>

                    <p className="text-center text-gray-600">
                      មានគណនីរួចហើយមែនទេ?
                      <Link
                        href="/login"
                        className="ml-2 font-bold text-blue-600 hover:underline"
                      >
                        ចូលប្រើប្រាស់
                      </Link>
                    </p>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
