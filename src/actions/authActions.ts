"use server";

import {
  loginApplication,
  verifyOtpAndLogin,
  sendOtp,
  getCurrentApplication,
  loginAdmin,
  signupUser,
  loginUser,
  loginUserWithPhone,
  getCurrentUser,
  forgotPassword,
  resetPassword,
} from "@/functions/authFunctions";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/db";

// Define ApplicationAuthFormState type
export type ApplicationAuthFormState = {
  error?: { message?: string[] };
  data?: any;
};

/**
 * LOGIN Application (Server Action)
 * First, it validates the username & password, and then sends OTP to email
 */
export async function loginApplicationAction(
  prevState: ApplicationAuthFormState,
  formData: FormData | Record<string, any>
): Promise<ApplicationAuthFormState> {
  await connectToDatabase();

  // Extract form data
  const userName =
    typeof (formData as any).get === "function"
      ? (formData as FormData).get("userName")?.toString()
      : (formData as any).userName;

  const password =
    typeof (formData as any).get === "function"
      ? (formData as FormData).get("password")?.toString()
      : (formData as any).password;

  if (!userName || !password) {
    return { error: { message: ["Username and password are required"] } };
  }

  try {
    const { tempToken, applicationId } = await loginApplication(userName, password);

    const cookieStore = await cookies();
    cookieStore.set("tempToken", tempToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 10,
    });

    return { data: { applicationId } };
  } catch (error: any) {
    return { error: { message: [error.message || "Login failed"] } };
  }
}

/**
 * Send OTP
 */
export async function sendOtpAction(applicationId: string): Promise<ApplicationAuthFormState> {
  await connectToDatabase();
  try {
    await sendOtp(applicationId);
    return { data: { message: "OTP sent successfully to your registered email." } };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to send OTP"] } };
  }
}

/**
 * Verify OTP
 */
export async function verifyOtpAction(
  prevState: ApplicationAuthFormState,
  formData: FormData | Record<string, any>
): Promise<ApplicationAuthFormState> {
  await connectToDatabase();

  const otp =
    typeof (formData as any).get === "function"
      ? (formData as FormData).get("otp")?.toString()
      : (formData as any).otp;

  if (!otp) return { error: { message: ["OTP is required"] } };

  const cookieStore = await cookies();
  const tempToken = cookieStore.get("tempToken")?.value;

  if (!tempToken) {
    return { error: { message: ["Temporary token is missing or expired"] } };
  }

  try {
    const { token, application } = await verifyOtpAndLogin(tempToken, otp);

    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return { data: { application } };
  } catch (error: any) {
    return { error: { message: [error.message || "OTP verification failed"] } };
  }
}

/**
 * Logout Application
 */
export async function logoutApplicationAction() {
  const cookieStore = await cookies();
  cookieStore.delete({ name: "token", path: "/" });
  cookieStore.delete({ name: "tempToken", path: "/" });
  return { success: true };
}

/**
 * Get Current Application
 */
export async function getCurrentApplicationAction() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const application = await getCurrentApplication(token);
    return application;
  } catch {
    return null;
  }
}

/**
 * LOGIN Admin
 */
export async function loginAdminAction(
  prevState: ApplicationAuthFormState,
  formData: FormData | Record<string, any>
): Promise<ApplicationAuthFormState> {
  await connectToDatabase();

  const usernameOrEmail =
    typeof (formData as any).get === "function"
      ? (formData as FormData).get("username")?.toString() ||
        (formData as FormData).get("email")?.toString()
      : (formData as any).username || (formData as any).email;

  const password =
    typeof (formData as any).get === "function"
      ? (formData as FormData).get("password")?.toString()
      : (formData as any).password;

  if (!usernameOrEmail || !password) {
    return { error: { message: ["Admin username/email and password are required"] } };
  }

  try {
    const { token, admin } = await loginAdmin(usernameOrEmail, password);

    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return { data: { admin } };
  } catch (error: any) {
    return { error: { message: [error.message || "Admin login failed"] } };
  }
}

export async function logoutAdminAction() {
  const cookieStore = await cookies();
  cookieStore.delete({ name: "token", path: "/" });
  return { success: true };
}

/**
 * User Signup
 */
export async function signupUserAction(
  prevState: ApplicationAuthFormState,
  formData: FormData
): Promise<ApplicationAuthFormState> {
  await connectToDatabase();

  const name = formData.get("name")?.toString();
  const email = formData.get("email")?.toString();
  const phone = formData.get("phone")?.toString();
  const password = formData.get("password")?.toString();
  const countryCode = formData.get("countryCode")?.toString();

  if (!name || !email || !password || !phone || !countryCode) {
    return { error: { message: ["Name, email, password, phone, and country code are required"] } };
  }

  try {
    const { token, user } = await signupUser(name, email, password, phone, countryCode);

    const cookieStore = await cookies();
    cookieStore.set("userToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return { data: { user } };
  } catch (error: any) {
    return { error: { message: [error.message || "Signup failed"] } };
  }
}

/**
 * User Login
 */
export async function loginUserAction(
  prevState: ApplicationAuthFormState,
  formData: FormData
): Promise<ApplicationAuthFormState> {
  await connectToDatabase();

  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return { error: { message: ["Email and password are required"] } };
  }

  try {
    const { token, user } = await loginUser(email, password);

    const cookieStore = await cookies();
    cookieStore.set("userToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return { data: { user } };
  } catch (error: any) {
    return { error: { message: [error.message || "Login failed"] } };
  }
}

/**
 * Login with Phone
 */
export async function loginUserWithPhoneAction(
  prevState: ApplicationAuthFormState,
  formData: FormData
): Promise<ApplicationAuthFormState> {
  await connectToDatabase();

  const phone = formData.get("phone")?.toString();
  const password = formData.get("password")?.toString();

  if (!phone || !password) {
    return { error: { message: ["Phone number and password are required"] } };
  }

  try {
    const { token, user } = await loginUserWithPhone(phone, password);

    const cookieStore = await cookies();
    cookieStore.set("userToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return { data: { user } };
  } catch (error: any) {
    return { error: { message: [error.message || "Login failed"] } };
  }
}

/**
 * Logout User
 */
export async function logoutUserAction() {
  const cookieStore = await cookies();
  cookieStore.delete({ name: "userToken", path: "/" });
  return { success: true };
}

/**
 * Get Current User
 */
export async function getCurrentUserAction() {
  const cookieStore = await cookies();
  const token = cookieStore.get("userToken")?.value;

  if (!token) return null;

  try {
    return await getCurrentUser(token);
  } catch {
    return null;
  }
}

/**
 * Forgot Password
 */
export async function forgotPasswordAction(
  prevState: ApplicationAuthFormState,
  formData: FormData
): Promise<ApplicationAuthFormState> {
  await connectToDatabase();

  const email = formData.get("email")?.toString();
  if (!email) return { error: { message: ["Email is required"] } };

  try {
    const result = await forgotPassword(email);
    return { data: { message: result.message } };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to send password reset email"] } };
  }
}

/**
 * Reset Password
 */
export async function resetPasswordAction(
  prevState: ApplicationAuthFormState,
  formData: FormData
): Promise<ApplicationAuthFormState> {
  await connectToDatabase();

  const token = formData.get("token")?.toString();
  const password = formData.get("password")?.toString();

  if (!token || !password) {
    return { error: { message: ["Token and password are required"] } };
  }

  if (password.length < 6) {
    return { error: { message: ["Password must be at least 6 characters"] } };
  }

  try {
    const result = await resetPassword(token, password);
    return { data: { message: result.message } };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to reset password"] } };
  }
}
