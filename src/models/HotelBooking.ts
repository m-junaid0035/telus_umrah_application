import mongoose, { Schema, Document, Model, Types } from "mongoose";

// Booking Status Enum
export enum HotelBookingStatus {
  Pending = "pending",
  Confirmed = "confirmed",
  Cancelled = "cancelled",
  Completed = "completed",
}

// Interface for HotelBooking document
export interface IHotelBooking extends Document {
  _id: Types.ObjectId;
  
  // Hotel Reference
  hotelId: string; // Reference to Hotel _id
  hotelName?: string; // Hotel name for display
  
  // Customer Information
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerNationality?: string;
  
  // Booking Details
  checkInDate: Date;
  checkOutDate: Date;
  rooms: number;
  adults: number;
  children?: number;
  childAges?: number[];
  bedType?: string; // single, double, twin, triple, quad
  
  // Additional Services
  meals?: boolean;
  transport?: boolean;
  
  // Booking Status
  status: HotelBookingStatus;
  notes?: string;
  
  // Payment Information
  totalAmount?: number;
  paidAmount?: number;
  paymentStatus?: "pending" | "partial" | "paid";
  
  createdAt: Date;
  updatedAt: Date;
}

// Define the HotelBooking schema
const hotelBookingSchema = new Schema<IHotelBooking>(
  {
    hotelId: {
      type: String,
      required: [true, "Hotel ID is required"],
      trim: true,
    },
    hotelName: {
      type: String,
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
    checkInDate: {
      type: Date,
      required: [true, "Check-in date is required"],
    },
    checkOutDate: {
      type: Date,
      required: [true, "Check-out date is required"],
    },
    rooms: {
      type: Number,
      required: true,
      min: [1, "At least one room is required"],
    },
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
    bedType: {
      type: String,
      enum: ["single", "double", "twin", "triple", "quad"],
    },
    meals: {
      type: Boolean,
      default: false,
    },
    transport: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: Object.values(HotelBookingStatus),
      default: HotelBookingStatus.Pending,
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
export const HotelBooking: Model<IHotelBooking> =
  mongoose.models.HotelBooking ||
  mongoose.model<IHotelBooking>("HotelBooking", hotelBookingSchema);

