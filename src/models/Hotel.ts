import mongoose, { Schema, Document, Model, Types } from "mongoose";

// Enum for hotel type
export enum HotelType {
  Makkah = "Makkah",
  Madina = "Madina",
}

// Interface for Hotel document
export interface IHotel extends Document {
  _id: Types.ObjectId;
  type: HotelType;
  name: string;
  location: string;
  star: number; // e.g., 3, 4, 5 stars
  description?: string;
  distance?: string; // e.g., "300m from Haram", "Walking Distance to Masjid Nabawi"
  amenities?: string[]; // Array of amenity names
  images?: string[]; // Array of image URLs
  availableBedTypes?: string[]; // e.g., ["single", "double", "twin", "triple", "quad"]
  standardRoomPrice?: number; // Price for standard room
  deluxeRoomPrice?: number; // Price for deluxe room
  familySuitPrice?: number; // Price for family suite
  transportPrice?: number; // Price for transport service
  mealsPrice?: number; // Price for meals per room per night
  contact?: {
    phone?: string;
    email?: string;
    address?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Define the Hotel schema
const hotelSchema = new Schema<IHotel>(
  {
    type: {
      type: String,
      enum: Object.values(HotelType),
      required: [true, "Hotel type is required"],
    },
    name: {
      type: String,
      required: [true, "Hotel name is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Hotel location is required"],
      trim: true,
    },
    star: {
      type: Number,
      required: [true, "Hotel star rating is required"],
      min: [1, "Star rating must be at least 1"],
      max: [5, "Star rating cannot exceed 5"],
    },
    description: {
      type: String,
      trim: true,
    },
    distance: {
      type: String,
      trim: true,
    },
    amenities: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    availableBedTypes: {
      type: [String],
      default: [],
      enum: ["single", "double", "twin", "triple", "quad"],
    },
    standardRoomPrice: {
      type: Number,
      min: [0, "Price must be non-negative"],
    },
    deluxeRoomPrice: {
      type: Number,
      min: [0, "Price must be non-negative"],
    },
    familySuitPrice: {
      type: Number,
      min: [0, "Price must be non-negative"],
    },
    transportPrice: {
      type: Number,
      min: [0, "Transport price must be non-negative"],
      default: 10000, // Default 10,000 PKR
    },
    mealsPrice: {
      type: Number,
      min: [0, "Meals price must be non-negative"],
      default: 5000, // Default 5,000 PKR per room per night
    },
    contact: {
      phone: {
        type: String,
        trim: true,
      },
      email: {
        type: String,
        trim: true,
      },
      address: {
        type: String,
        trim: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Export model - delete existing model to ensure schema changes are picked up
if (mongoose.models.Hotel) {
  delete mongoose.models.Hotel;
}
export const Hotel: Model<IHotel> = mongoose.model<IHotel>("Hotel", hotelSchema);
