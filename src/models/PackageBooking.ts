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
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerNationality?: string;
  
  // Booking Details
  travelers: {
    adults: number;
    children: number;
    childAges?: number[];
  };
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
    customerName: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
    },
    customerEmail: {
      type: String,
      required: [true, "Customer email is required"],
      trim: true,
      lowercase: true,
    },
    customerPhone: {
      type: String,
      required: [true, "Customer phone is required"],
      trim: true,
    },
    customerNationality: {
      type: String,
      trim: true,
    },
    travelers: {
      adults: {
        type: Number,
        required: true,
        min: [1, "At least one adult is required"],
      },
      children: {
        type: Number,
        default: 0,
        min: [0, "Children count cannot be negative"],
      },
      childAges: {
        type: [Number],
        default: [],
      },
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
  },
  {
    timestamps: true,
  }
);

// Export model
export const PackageBooking: Model<IPackageBooking> =
  mongoose.models.PackageBooking ||
  mongoose.model<IPackageBooking>("PackageBooking", packageBookingSchema);

