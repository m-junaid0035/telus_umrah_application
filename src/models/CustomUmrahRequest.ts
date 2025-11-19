import mongoose, { Schema, Document, Model, Types } from "mongoose";

// Interface for CustomUmrahRequest document
export interface ICustomUmrahRequest extends Document {
  _id: Types.ObjectId;
  
  // Contact Information
  name: string;
  email: string;
  phone: string;
  nationality: string;

  // Flight Details
  from: string;
  to: string;
  departDate: Date;
  returnDate: Date;
  airline: string;
  airlineClass: string;

  // Travelers
  adults: number;
  children: number;
  childAges: number[];
  rooms: number;

  // Additional Services
  umrahVisa: boolean;
  transport: boolean;
  zaiarat: boolean;
  meals: boolean;
  esim: boolean;

  // Hotel Selections
  hotels: {
    hotelClass: string;
    hotel: string;
    stayDuration: string;
    bedType: string;
    city: string; // "Makkah" or "Madina"
  }[];

  // Status
  status?: "pending" | "in-progress" | "completed" | "cancelled";
  notes?: string;

  createdAt: Date;
  updatedAt: Date;
}

// Define the schema
const customUmrahRequestSchema = new Schema<ICustomUmrahRequest>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
      trim: true,
    },
    nationality: {
      type: String,
      required: [true, "Nationality is required"],
      trim: true,
    },
    from: {
      type: String,
      required: [true, "Departure city is required"],
      trim: true,
    },
    to: {
      type: String,
      required: [true, "Destination is required"],
      trim: true,
    },
    departDate: {
      type: Date,
      required: [true, "Departure date is required"],
    },
    returnDate: {
      type: Date,
      required: [true, "Return date is required"],
    },
    airline: {
      type: String,
      required: [true, "Airline is required"],
      trim: true,
    },
    airlineClass: {
      type: String,
      required: [true, "Airline class is required"],
      trim: true,
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
    rooms: {
      type: Number,
      required: true,
      min: [1, "At least one room is required"],
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
    hotels: [
      {
        hotelClass: { type: String, required: true },
        hotel: { type: String, required: true },
        stayDuration: { type: String, required: true },
        bedType: { type: String, required: true },
        city: { type: String, required: true, enum: ["Makkah", "Madina"] },
      },
    ],
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed", "cancelled"],
      default: "pending",
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Export model
export const CustomUmrahRequest: Model<ICustomUmrahRequest> =
  mongoose.models.CustomUmrahRequest ||
  mongoose.model<ICustomUmrahRequest>("CustomUmrahRequest", customUmrahRequestSchema);

