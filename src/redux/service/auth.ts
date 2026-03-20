import { OrganizerRequest, OrganizerResponse } from "@/types/organizer";
import { normPlovApi } from "../api";

// Define more specific types for the responses and requests
type RegisterResponse = { message: string }; // Example response type
type VerifyCodeRegisterResponse = {
  email: string;
  verificationCode: string;
  message?: string;
};
type ResendVerifyCodeRegisterResponse = { message: string };
type ForgotPasswordResponse = { message: string };
type ResetPasswordResponse = { message: string };

type VerifyCodeResetPasswordResponse = {
  email: string;
  resetToken: string; // ✅ add this
  message?: string; // Include message if needed
};
type ResendCodeResetPasswordResponse = {
  email: string;
  reset_code: string;
  message?: string; // Include message if needed
};

// Define the request data types
type RegisterRequest = {
  data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
};
type VerifyCodeRegisterRequest = {
  email: string;
  verificationCode: string;
};
type ResendVerifyCodeRegisterRequest = { email: string };
type ForgotPasswordRequest = { email: string };
type ResetPasswordRequest = {
  email: string;
  reset_code: string;
  new_password: string;
  confirm_password: string;
};

type VerifyCodeResetPasswordRequest = {
  email: string;
  verifyCode: string;
};
type ResendCodeResetPasswordRequest = { email: string };

export const authApi = normPlovApi.injectEndpoints({
  overrideExisting: true, 
  endpoints: (builder) => ({
    // register user
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: ({ data }) => ({
        url: `api/v1/auth/register`,
        method: "POST",
        body: data,
      }),
    }),

    // VerifyCode For Register
    VerifyCodeRegister: builder.mutation<
      VerifyCodeRegisterResponse,
      VerifyCodeRegisterRequest
    >({
      query: (data) => ({
        url: `api/v1/auth/verify`,
        method: "POST",
        body: data,
        
      }),
    }),

    // Resend VerifyCode for Register
    ResendVerifyCodeRegister: builder.mutation<
      ResendVerifyCodeRegisterResponse,
      ResendVerifyCodeRegisterRequest
    >({
      query: ({ email }) => ({
        url: `api/v1/auth/resend-verification-code`,
        method: "POST",
        body: { email },
      }),
    }),

    // forgot password
    forgotPassword: builder.mutation<ForgotPasswordResponse, { email: string }>(
      {
        query: ({ email }) => ({
          // Use backticks to inject the email variable directly into the URL path
          url: `api/v1/auth/${encodeURIComponent(email)}/send-verify-code`,
          method: "POST",
          body: {},
        }),
      },
    ),

    //verify code for reset password (forgot password)
    VerifyCodeResetPassword: builder.mutation<
      VerifyCodeResetPasswordResponse,
      VerifyCodeResetPasswordRequest
    >({
      query: (data) => ({
        url: "api/v1/auth/reset-token",
        method: "POST",
        body: data, // sends { email, verifyCode }
      }),
    }),

    //resend code for reset password
    ResendCodeResetPassword: builder.mutation<
      ResendCodeResetPasswordResponse,
      ResendCodeResetPasswordRequest
    >({
      query: ({ email }) => ({
        url: `api/v1/auth/resend-reset-password`,
        method: "POST",
        body: { email },
      }),
    }),

    // reset password
    resetPassword: builder.mutation<
      ResetPasswordResponse,
      { newPassword: string; confirmPassword: string; resetToken: string }
    >({
      query: ({ newPassword, confirmPassword, resetToken }) => ({
        url: "api/v1/auth/reset-password",
        method: "POST",
        body: { newPassword, confirmPassword, resetToken },
      }),
    }),

    createOrganizer: builder.mutation<OrganizerResponse, OrganizerRequest>({
      query: (data) => ({
        url: "api/v1/organizer/create",
        method: "POST",
        body: data,
      }),
    }),

    getGoogle: builder.query({
      query: () => ({
        url: `api/v1/auth/google`,
        method: "GET",
      }),
    }),
    getGoogleCallback: builder.query({
      query: () => ({
        url: `api/v1/auth/google/callback`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useVerifyCodeRegisterMutation,
  useResendVerifyCodeRegisterMutation,
  useForgotPasswordMutation,
  useResendCodeResetPasswordMutation,
  useVerifyCodeResetPasswordMutation,
  useResetPasswordMutation,
  useCreateOrganizerMutation,
  useGetGoogleCallbackQuery,
  useGetGoogleQuery,
} = authApi;
