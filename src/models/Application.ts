import mongoose, { Schema, Document, Model, Types } from "mongoose";

// Application Status Enum
export enum ApplicationStatus {
  Pending = "Pending",
  Approved = "Approved",
  Rejected = "Rejected",
  InReview = "InReview",
}

// Biometrics Status Enum
export enum BiometricsStatus {
  Completed = "Completed",
  NotCompleted = "NotCompleted",
  Expired = "Expired",
}

// Interface for Application document
export interface IApplication extends Document {
  _id: Types.ObjectId;
  userName: string;
  password: string;
  email: string;
  applicationType: string;
  applicationNumber: string;
  applicantName: string;
  dateOfSubmission: Date;
  status: ApplicationStatus;

  messages: {
    subject: string;   // ✅ renamed from content
    sentAt: Date;
    readAt?: Date | null;
  }[];

  // ✅ Security questions
  securityQuestions: {
    question: string;
    answer: string;
  }[];

  uniqueClientIdentifier: string;

  biometrics: {
    number: string;
    enrolmentDate: Date;
    expiryDate: Date;
    status: BiometricsStatus;
  };

  // 🔑 OTP-related fields
  otpCode?: string;
  otpExpires?: Date;

  // ✅ New fields
  reviewOfEligibility: string;
  medical: string;
  documents: string;
  interview: string;
  biometricsStatusText: string;
  backgroundCheck: string;
  finalDecision: string;

  createdAt: Date;
  updatedAt: Date;
}

// Define the Application schema
const applicationSchema = new Schema<IApplication>(
  {
    userName: {
      type: String,
      required: [true, "User name is required"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    applicationType: {
      type: String,
      required: [true, "Application type is required"],
      trim: true,
    },
    applicationNumber: {
      type: String,
      required: [true, "Application number is required"],
      unique: true,
    },
    applicantName: {
      type: String,
      required: [true, "Applicant name is required"],
      trim: true,
    },
    dateOfSubmission: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(ApplicationStatus),
      default: ApplicationStatus.Pending,
    },
    messages: [
      {
        subject: { type: String, required: true }, // ✅ renamed
        sentAt: { type: Date, default: Date.now },
        readAt: { type: Date, default: null },
      },
    ],

    // ✅ Security questions field
    securityQuestions: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true, select: false }, // hide answers unless explicitly selected
      },
    ],

    uniqueClientIdentifier: {
      type: String,
      required: true,
      trim: true,
    },
    biometrics: {
      number: { type: String, required: true },
      enrolmentDate: { type: Date, required: true },
      expiryDate: { type: Date, required: true },
      status: {
        type: String,
        enum: Object.values(BiometricsStatus),
        default: BiometricsStatus.NotCompleted,
      },
    },

    // 🔑 OTP fields
    otpCode: {
      type: String,
      select: false,
    },
    otpExpires: {
      type: Date,
      select: false,
    },

    // ✅ New fields
    reviewOfEligibility: { type: String, default: "" },
    medical: { type: String, default: "" },
    documents: { type: String, default: "" },
    interview: { type: String, default: "" },
    biometricsStatusText: { type: String, default: "" },
    backgroundCheck: { type: String, default: "" },
    finalDecision: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

// Export model
export const Application: Model<IApplication> =
  mongoose.models.Application ||
  mongoose.model<IApplication>("Application", applicationSchema);
