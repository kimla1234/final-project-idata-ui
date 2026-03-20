"use client";

import React, { useEffect, useState } from "react";
import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

import Label from "../register/LabelComponent";
import DynamicField from "../register/AuthField";
import ErrorDynamic from "../register/ErrorComponent";
import Button from "../register/ButtonComponentForAuth";
import { useCreateOrganizerMutation } from "@/redux/service/auth";
import { usePostImageMutation } from "@/redux/service/organizer";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

// 1. Interface for Type Safety
interface OrganizerValues {
  name: string;
  email: string;
  phone: string;
  about: string;
  logo: File | null;
}

// 2. Initial Values
const initialValues: OrganizerValues = {
  name: "",
  email: "",
  phone: "",
  about: "",
  logo: null,
};

// 3. Validation Schema
const OrganizerSchema = Yup.object().shape({
  name: Yup.string().required("Organizer name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string().required("Phone number is required"),
  about: Yup.string()
    .min(20, "Description should be at least 20 characters")
    .required("About section is required"),
  logo: Yup.mixed().required("Please upload a logo"),
});

export default function CreateOrganizer() {
  const router = useRouter();

  const { toast } = useToast();
  const [postImage] = usePostImageMutation();
  const [createOrganizer, { isLoading }] = useCreateOrganizerMutation();

 
  

  const handleSubmit = async (values: OrganizerValues) => {
    try {
      let imageUrl = "";

      // 1. Upload image first
      if (values.logo) {
        const formData = new FormData();
        formData.append("file", values.logo);

        const uploadRes = await postImage(formData).unwrap();
        imageUrl = uploadRes.uri; // 👈 from API response
      }

      // 2. Create organizer using image URL
      await createOrganizer({
        name: values.name,
        email: values.email,
        phoneNumber: values.phone,
        description: values.about,
        logoImage: imageUrl,
        // address: values.address,
      }).unwrap();

      toast({
        title: "Success!",
        description: "Organizer created successfully",
        variant: "success",
        duration: 2000,
      });
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-6 md:p-12">
      <div className="w-full max-w-xl rounded-3xl border border-gray-100 bg-white p-10 shadow-xl">
        <h2 className="mb-8 text-center text-3xl font-extrabold text-gray-800">
          Create Organizer
        </h2>

        <Formik<OrganizerValues>
          initialValues={initialValues}
          validationSchema={OrganizerSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, errors, touched }) => (
            <Form className="flex flex-col gap-6">
              {/* Logo Upload */}
              <div>
                <Label htmlFor="logo" text="Logo Image" />
                <input
                  id="logo"
                  name="logo"
                  type="file"
                  accept="image/*"
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    const file = event.currentTarget.files?.[0] || null;
                    setFieldValue("logo", file);
                  }}
                  className="mt-2 w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-600 transition-all file:mr-4 file:rounded-lg file:border-0 file:bg-blue-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-200"
                />
                <ErrorDynamic name="logo" component="div" />
              </div>

              {/* Name */}
              <div>
                <Label htmlFor="name" text="Organizer Name" />
                <DynamicField
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Company or Organization Name"
                />
                <ErrorDynamic name="name" component="div" />
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email" text="Email" />
                <DynamicField
                  type="email"
                  name="email"
                  id="email"
                  placeholder="example@org.com"
                />
                <ErrorDynamic name="email" component="div" />
              </div>

              {/* Phone */}
              <div>
                <Label htmlFor="phone" text="Phone Number" />
                <DynamicField
                  type="text"
                  name="phone"
                  id="phone"
                  placeholder="+1 234 567 890"
                />
                <ErrorDynamic name="phone" component="div" />
              </div>

              {/* About */}
              <div>
                <Label htmlFor="about" text="About the Organization" />
                <textarea
                  name="about"
                  rows={4}
                  onChange={(e) => setFieldValue("about", e.target.value)}
                  placeholder="Describe your mission, values, and vision..."
                  className="mt-2 w-full rounded-lg border border-gray-300 p-3 text-sm shadow-sm outline-none transition-all hover:shadow-md focus:border-blue-500 focus:ring-blue-500"
                />
                <ErrorDynamic name="about" component="div" />
              </div>

              {/* Submit Button */}
              <div>
                <Button
                  type="submit"
                  text={isLoading ? "Creating..." : "Create Organizer"}
                  isLoading={isLoading}
                  className="w-full rounded-xl bg-blue-600 py-3 font-bold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg"
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </section>
  );
}
