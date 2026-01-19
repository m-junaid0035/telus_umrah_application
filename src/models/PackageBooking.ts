import mongoose, { Schema, Document, Model, Types } from "mongoose";

// Booking Status Enum
export enum BookingStatus {
  Pending = "pending",
  Confirmed = "confirmed",
  Cancelled = "cancelled",
  Completed = "completed",
}

// Interface for PackageBooking document
export interface IPackageBooking extends Document {
  _id: Types.ObjectId;
  
  // Package Reference
  packageId: string; // Reference to UmrahPackage _id
  
  // Customer Information
  customerEmail: string;
  
  // Booking Details
  adults?: Array<{
    name: string;
    gender?: "male" | "female" | "";
    nationality?: string;
    passportNumber?: string;
    age?: number;
    phone?: string;
    isHead?: boolean;
  }>;
  children?: Array<{
    name: string;
    gender?: "male" | "female" | "";
    nationality?: string;
    passportNumber?: string;
    age?: number;
  }>;
  infants?: Array<{
    name: string;
    gender?: "male" | "female" | "";
    nationality?: string;
    passportNumber?: string;
    age?: number;
  }>;
  rooms: number;
  checkInDate?: Date;
  checkOutDate?: Date;
  
  // Additional Services
  umrahVisa?: boolean;
  transport?: boolean;
  zaiarat?: boolean;
  meals?: boolean;
  esim?: boolean;
  
  // Booking Status
  status: BookingStatus;
  notes?: string;
  
  // Payment Information (optional for now)
  totalAmount?: number;
  paidAmount?: number;
  paymentStatus?: "pending" | "partial" | "paid";
  paymentMethod?: "cash" | "online";
  
  // Invoice Information
  invoiceGenerated?: boolean;
  invoiceSent?: boolean;
  invoiceUrl?: string;
  invoiceNumber?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

// Define the PackageBooking schema
const packageBookingSchema = new Schema<IPackageBooking>(
  {
    packageId: {
      type: String,
      required: [true, "Package ID is required"],
      trim: true,
    },
    customerEmail: {
      type: String,
      required: [true, "Customer email is required"],
      trim: true,
      lowercase: true,
    },
    adults: {
      type: [
        new Schema({
          name: { type: String, required: true, trim: true },
          gender: { type: String, enum: ["male", "female", ""], default: "" },
          nationality: { type: String, trim: true },
          passportNumber: { type: String, trim: true },
          age: { type: Number, min: 0 },
          phone: { type: String, trim: true },
          isHead: { type: Boolean, default: false },
        }),
      ],
      default: [],
    },
    children: {
      type: [
        new Schema({
          name: { type: String, required: true, trim: true },
          gender: { type: String, enum: ["male", "female", ""], default: "" },
          nationality: { type: String, trim: true },
          passportNumber: { type: String, trim: true },
          age: { type: Number, min: 0, max: 16 },
        }),
      ],
      default: [],
    },
    infants: {
      type: [
        new Schema({
          name: { type: String, required: true, trim: true },
          gender: { type: String, enum: ["male", "female", ""], default: "" },
          nationality: { type: String, trim: true },
          passportNumber: { type: String, trim: true },
          // Age captured in months on the client (0-23 months)
          age: { type: Number, min: 0, max: 23 },
        }),
      ],
      default: [],
    },
    rooms: {
      type: Number,
      required: true,
      min: [1, "At least one room is required"],
    },
    checkInDate: {
      type: Date,
    },
    checkOutDate: {
      type: Date,
    },
    umrahVisa: {
      type: Boolean,
      default: false,
    },
    transport: {
      type: Boolean,
      default: false,
    },
    zaiarat: {
      type: Boolean,
      default: false,
    },
    meals: {
      type: Boolean,
      default: false,
    },
    esim: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: Object.values(BookingStatus),
      default: BookingStatus.Pending,
    },
    notes: {
      type: String,
      trim: true,
    },
    totalAmount: {
      type: Number,
      min: [0, "Total amount cannot be negative"],
    },
    paidAmount: {
      type: Number,
      default: 0,
      min: [0, "Paid amount cannot be negative"],
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "partial", "paid"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "online"],
    },
    invoiceGenerated: {
      type: Boolean,
      default: false,
    },
    invoiceSent: {
      type: Boolean,
      default: false,
    },
    invoiceUrl: {
      type: String,
      trim: true,
    },
    invoiceNumber: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);

// Export model
export const PackageBooking: Model<IPackageBooking> =
  mongoose.models.PackageBooking ||
  mongoose.model<IPackageBooking>("PackageBooking", packageBookingSchema);

