"use server";

import { loginApplication, verifyOtpAndLogin, sendOtp, getCurrentApplication, loginAdmin, signupUser, loginUser, getCurrentUser, forgotPassword, resetPassword } from "@/functions/authFunctions";
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
    // Call loginApplication to validate user and send OTP
    const { tempToken, applicationId } = await loginApplication(userName, password);

    // Save the temporary token to be used for OTP verification
    const cookieStore = await cookies();
    cookieStore.set("tempToken", tempToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 10, // Temp token valid for 10 minutes
    });

    return { data: { applicationId } }; // Only return applicationId for OTP verification step
  } catch (error: any) {
    return { error: { message: [error.message || "Login failed"] } };
  }
}

/**
 * Send OTP (Separate Server Action)
 * This action only sends OTP to user's email, given the applicationId
 */
export async function sendOtpAction(applicationId: string): Promise<ApplicationAuthFormState> {
  await connectToDatabase();
  console.log(applicationId)
  try {
    // Call the sendOtp function with the applicationId to send OTP to the registered email
    await sendOtp(applicationId);

    return { data: { message: "OTP sent successfully to your registered email." } };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to send OTP"] } };
  }
}

/**
 * Verify OTP and get the final JWT token (Server Action)
 * After the user enters OTP, this will validate it and return the actual JWT token
 */
export async function verifyOtpAction(
  prevState: ApplicationAuthFormState,
  formData: FormData | Record<string, any>
): Promise<ApplicationAuthFormState> {
  await connectToDatabase();

  // Extract form data
  const otp =
    typeof (formData as any).get === "function"
      ? (formData as FormData).get("otp")?.toString()
      : (formData as any).otp;

  if (!otp) {
    return { error: { message: ["OTP is required"] } };
  }

  // Retrieve temporary token from cookies
  const cookieStore = await cookies();
  const tempToken = cookieStore.get("tempToken")?.value;

  if (!tempToken) {
    return { error: { message: ["Temporary token is missing or expired"] } };
  }

  try {
    // Call verifyOtpAndLogin to validate OTP and return JWT token
    const { token, application } = await verifyOtpAndLogin(tempToken, otp);

    // Save the final token to the cookie for further requests
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days for final JWT token
    });

    return { data: { application } };
  } catch (error: any) {
    return { error: { message: [error.message || "OTP verification failed"] } };
  }
}

/**
 * LOGOUT Application (Server Action)
 */
export async function logoutApplicationAction() {
  const cookieStore = await cookies();
  cookieStore.delete({ name: "token", path: "/" });
  cookieStore.delete({ name: "tempToken", path: "/" }); // Delete tempToken as well
  return { success: true };
}

/**
 * Get CURRENT logged-in application (Server Action)
 */
export async function getCurrentApplicationAction() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const application = await getCurrentApplication(token);
    return application;
  } catch (err) {
    console.error("Failed to get current application:", err);
    return null;
  }
}


/**
 * LOGIN Admin (Direct token, no OTP)
 */
export async function loginAdminAction(
  prevState: ApplicationAuthFormState,
  formData: FormData | Record<string, any>
): Promise<ApplicationAuthFormState> {
  await connectToDatabase();

  // Extract form data - can be username or email
  const usernameOrEmail =
    typeof (formData as any).get === "function"
      ? (formData as FormData).get("username")?.toString() || (formData as FormData).get("email")?.toString()
      : (formData as any).username || (formData as any).email;

  const password =
    typeof (formData as any).get === "function"
      ? (formData as FormData).get("password")?.toString()
      : (formData as any).password;

  if (!usernameOrEmail || !password) {
    return { error: { message: ["Admin username/email and password are required"] } };
  }

  try {
    // Call loginAdmin function that uses bcrypt and Admin schema
    const { token, admin } = await loginAdmin(usernameOrEmail, password);

    // Save token in httpOnly cookie
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return { data: { admin } };
  } catch (error: any) {
    return { error: { message: [error.message || "Admin login failed"] } };
  }
}

export async function logoutAdminAction() {
  const cookieStore = await cookies();

  // Correct usage: pass an object with name and options
  cookieStore.delete({ name: "token", path: "/" });

  return { success: true, message: "Admin logged out successfully" };
}

/**
 * User Signup Action
 */
export async function signupUserAction(
  prevState: ApplicationAuthFormState,
  formData: FormData | Record<string, any>
): Promise<ApplicationAuthFormState> {
  await connectToDatabase();

  // Extract form data
  const name =
    typeof (formData as any).get === "function"
      ? (formData as FormData).get("name")?.toString()
      : (formData as any).name;

  const email =
    typeof (formData as any).get === "function"
      ? (formData as FormData).get("email")?.toString()
      : (formData as any).email;

  const password =
    typeof (formData as any).get === "function"
      ? (formData as FormData).get("password")?.toString()
      : (formData as any).password;

  if (!name || !email || !password) {
    return { error: { message: ["Name, email, and password are required"] } };
  }

  try {
    const { token, user } = await signupUser(name, email, password);

    // Save token in httpOnly cookie
    const cookieStore = await cookies();
    cookieStore.set("userToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return { data: { user } };
  } catch (error: any) {
    return { error: { message: [error.message || "Signup failed"] } };
  }
}

/**
 * User Login Action
 */
export async function loginUserAction(
  prevState: ApplicationAuthFormState,
  formData: FormData | Record<string, any>
): Promise<ApplicationAuthFormState> {
  await connectToDatabase();

  // Extract form data
  const email =
    typeof (formData as any).get === "function"
      ? (formData as FormData).get("email")?.toString()
      : (formData as any).email;

  const password =
    typeof (formData as any).get === "function"
      ? (formData as FormData).get("password")?.toString()
      : (formData as any).password;

  if (!email || !password) {
    return { error: { message: ["Email and password are required"] } };
  }

  try {
    const { token, user } = await loginUser(email, password);

    // Save token in httpOnly cookie
    const cookieStore = await cookies();
    cookieStore.set("userToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return { data: { user } };
  } catch (error: any) {
    return { error: { message: [error.message || "Login failed"] } };
  }
}

/**
 * User Logout Action
 */
export async function logoutUserAction() {
  const cookieStore = await cookies();
  cookieStore.delete({ name: "userToken", path: "/" });
  return { success: true };
}

/**
 * Get Current User Action
 */
export async function getCurrentUserAction() {
  const cookieStore = await cookies();
  const token = cookieStore.get("userToken")?.value;

  if (!token) return null;

  try {
    const user = await getCurrentUser(token);
    return user;
  } catch (err) {
    console.error("Failed to get current user:", err);
    return null;
  }
}

/**
 * Forgot Password Action
 */
export async function forgotPasswordAction(
  prevState: ApplicationAuthFormState,
  formData: FormData | Record<string, any>
): Promise<ApplicationAuthFormState> {
  await connectToDatabase();

  const email =
    typeof (formData as any).get === "function"
      ? (formData as FormData).get("email")?.toString()
      : (formData as any).email;

  if (!email) {
    return { error: { message: ["Email is required"] } };
  }

  try {
    const result = await forgotPassword(email);
    return { data: { message: result.message } };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to send password reset email"] } };
  }
}

/**
 * Reset Password Action
 */
export async function resetPasswordAction(
  prevState: ApplicationAuthFormState,
  formData: FormData | Record<string, any>
): Promise<ApplicationAuthFormState> {
  await connectToDatabase();

  const token =
    typeof (formData as any).get === "function"
      ? (formData as FormData).get("token")?.toString()
      : (formData as any).token;

  const password =
    typeof (formData as any).get === "function"
      ? (formData as FormData).get("password")?.toString()
      : (formData as any).password;

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