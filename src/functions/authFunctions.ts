"use server";

import { connectToDatabase } from "@/lib/db";
import { Application } from "@/models/Application";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IApplication } from "@/models/Application";
import { sendOtpEmail } from "@/lib/sendOtpEmail";  // Import the OTP email sending function
import { generateOtp } from "@/lib/generateOtp";  // Import the OTP generation function
import { Admin, IAdmin } from "@/models/Admin";
import { User, IUser } from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) throw new Error("JWT_SECRET not defined");

/**
 * Serialize application object for client usage
 */
const serializeApplication = (app: IApplication) => ({
  _id: app._id.toString(),
  userName: app.userName,
  applicationType: app.applicationType,
  applicationNumber: app.applicationNumber,
  applicantName: app.applicantName,
  dateOfSubmission: app.dateOfSubmission?.toISOString() || null,
  status: app.status,
  uniqueClientIdentifier: app.uniqueClientIdentifier,
  createdAt: app.createdAt?.toISOString() || null,
  updatedAt: app.updatedAt?.toISOString() || null,
});

/**
 * Login application using username + password
 * Returns a temporary token to track 2FA state
 */
export const loginApplication = async (userName: string, password: string) => {
  await connectToDatabase();

  const app = await Application.findOne({ userName }).select("+password") as IApplication | null;
  if (!app) throw new Error("Invalid username or password");

  // Check if password is correct
  if (app.userName !== userName || app.password !== password) {
    throw new Error("Invalid username or password");
  }

  // Generate temporary token for tracking 2FA state
  const tempToken = jwt.sign({ _id: app._id.toString(), userName: app.userName }, JWT_SECRET, { expiresIn: "10m" });

  return {
    message: "Login successful. Please proceed with OTP verification.",
    tempToken, // Temporary token for 2FA verification
    applicationId: app._id.toString(), // Return the application ID to be used for OTP verification
  };
};
/**
 * Admin login function - accepts username or email
 */
export const loginAdmin = async (usernameOrEmail: string, password: string) => {
  await connectToDatabase();

  // Find admin by username or email
  const admin = await Admin.findOne({ 
    $or: [
      { userName: usernameOrEmail },
      { email: usernameOrEmail }
    ]
  }).select("+password") as IAdmin | null;
  
  if (!admin) throw new Error("Invalid admin username/email or password");

  // Compare password with hashed password
  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) throw new Error("Invalid admin username/email or password");

  // Generate JWT token for admin
  const token = jwt.sign(
    { _id: admin._id.toString(), email: admin.email, userName: admin.userName, role: "admin" },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {
    message: "Admin login successful",
    token,
    admin: {
      _id: admin._id.toString(),
      userName: admin.userName,
      email: admin.email,
      createdAt: admin.createdAt?.toISOString(),
      updatedAt: admin.updatedAt?.toISOString(),
    },
  };
};

/**
 * Initialize admin user if it doesn't exist
 */
export const initializeAdmin = async () => {
  await connectToDatabase();

  const adminExists = await Admin.findOne({ userName: "admin" });
  if (adminExists) {
    return { message: "Admin user already exists" };
  }

  const admin = new Admin({
    userName: "admin",
    email: "admin@telusumrah.com",
    password: "admin", // Will be hashed by pre-save hook
  });

  await admin.save();
  return { message: "Admin user created successfully" };
};
/**
 * Send OTP to user's email for 2FA verification
 * Generates and sends OTP to email
 */
export const sendOtp = async (applicationId: string) => {
  await connectToDatabase();

  // Find the application by ID
  const app = await Application.findById(applicationId).select("+applicationNumber") as IApplication | null;
  if (!app) throw new Error("Application not found");
  console.log(app)

  // Generate OTP and save it temporarily in DB
  const otp = generateOtp(8); // OTP length is 6
  (app as any).otpCode = otp;
  (app as any).otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry
  await app.save();

  // Send OTP email
  await sendOtpEmail(app.email, otp);

  return {
    message: "OTP sent to your registered email. Please verify to continue.",
  };
};

/**
 * Verify OTP and issue final JWT token
 * After OTP verification, the final token is returned
 */
export const verifyOtpAndLogin = async (tempToken: string, otp: string) => {
  await connectToDatabase();

  // ✅ 1. Decode temp token
  let payload: any;
  try {
    payload = jwt.verify(tempToken, JWT_SECRET);
  } catch (err) {
    throw new Error("Invalid or expired temporary token");
  }

  const applicationId = payload._id;
  if (!applicationId) throw new Error("Invalid token payload");

  // ✅ 2. Find application by decoded _id
  const app = await Application.findById(applicationId)
    .select("+otpCode +otpExpires") as (IApplication & { otpCode?: string; otpExpires?: Date }) | null;

  if (!app) throw new Error("Application not found");

  // ✅ 3. Check OTP
  if (!app.otpCode || !app.otpExpires || app.otpExpires < new Date()) {
    throw new Error("OTP expired. Please login again.");
  }

  if (app.otpCode !== otp) {
    throw new Error("Invalid OTP code");
  }

  // ✅ 4. Clear OTP after successful verification
  (app as any).otpCode = undefined;
  (app as any).otpExpires = undefined;
  await app.save();

  // ✅ 5. Generate final long-term JWT token
  const finalToken = jwt.sign(
    { _id: app._id.toString(), userName: app.userName },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {
    token: finalToken,
    application: serializeApplication(app),
  };
};

/**
 * Get current logged-in application from token
 */
export const getCurrentApplication = async (token: string) => {
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { _id: string; userName: string };
    await connectToDatabase();

    const app = await Application.findById(decoded._id) as IApplication | null;
    if (!app) return null;

    return serializeApplication(app);
  } catch (err) {
    console.error("Invalid or expired token:", err);
    return null;
  }
};

/**
 * Serialize user object for client usage
 */
const serializeUser = (user: IUser) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  avatar: user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
});

/**
 * User signup function
 */
export const signupUser = async (name: string, email: string, password: string, phone: string, countryCode: string) => {
  await connectToDatabase();

  // Validate inputs
  if (!name || !email || !password || !phone || !countryCode) {
    throw new Error("Name, email, password, phone, and country code are required");
  }

  // Check if user already exists by email
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  // Check if phone already exists
  const existingPhone = await User.findOne({ phone });
  if (existingPhone) {
    throw new Error("User with this phone number already exists");
  }

  // Create new user
  const user = new User({
    name,
    email,
    password, // Will be hashed by pre-save hook
    phone,
    countryCode,
  });

  await user.save();

  // Generate JWT token
  const token = jwt.sign(
    { _id: user._id.toString(), email: user.email, role: "user" },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {
    token,
    user: serializeUser(user),
  };
};

/**
 * User login function
 */
export const loginUser = async (email: string, password: string) => {
  await connectToDatabase();

  // Find user by email and include password
  const user = await User.findOne({ email }).select("+password") as IUser | null;
  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Compare password with hashed password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  // Generate JWT token
  const token = jwt.sign(
    { _id: user._id.toString(), email: user.email, role: "user" },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {
    token,
    user: serializeUser(user),
  };
};

/**
 * User login with phone number
 */
export const loginUserWithPhone = async (phone: string, password: string) => {
  await connectToDatabase();

  // Find user by phone and include password
  const user = await User.findOne({ phone }).select("+password") as IUser | null;
  if (!user) {
    throw new Error("Invalid phone number or password");
  }

  // Compare password with hashed password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error("Invalid phone number or password");
  }

  // Generate JWT token
  const token = jwt.sign(
    { _id: user._id.toString(), email: user.email, role: "user" },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {
    token,
    user: serializeUser(user),
  };
};

/**
 * Get current logged-in user from token
 */
export const getCurrentUser = async (token: string) => {
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { _id: string; email: string; role: string };
    await connectToDatabase();

    const user = await User.findById(decoded._id) as IUser | null;
    if (!user) return null;

    return serializeUser(user);
  } catch (err) {
    console.error("Invalid or expired token:", err);
    return null;
  }
};
