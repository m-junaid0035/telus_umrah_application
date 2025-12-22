import mongoose, { Schema, Document, Model, Types } from "mongoose";

// Interface for UmrahPackage document
export interface IUmrahPackage extends Document {
  name: string;
  price: number;
  duration: number;
  badge?: string;
  airline: string;
  departureCity: string;
  image?: string;
  popular?: boolean;

  // Store IDs from other collections
  hotels: {
    makkah: string; // hotel _id from Hotel collection
    madinah: string; // hotel _id from Hotel collection
  };
  features: string[];  // array of Feature IDs
  travelers: string;
  rating?: number;
  reviews?: number;
  itinerary: string[]; // array of Itinerary IDs
  includes: string[];  // array of Include IDs
  excludes: string[];  // array of Exclude IDs
  policies: string[];  // array of Policy IDs
  flights?: {
    departure?: {
      flight?: string;
      sector?: string;
      departureTime?: string;
      arrivalTime?: string;
    };
    arrival?: {
      flight?: string;
      sector?: string;
      departureTime?: string;
      arrivalTime?: string;
    };
  };
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the schema
const umrahPackageSchema = new Schema<IUmrahPackage>(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    duration: { type: Number, required: true },
    badge: { type: String, trim: true },
    airline: { type: String, required: true, trim: true },
    departureCity: { type: String, required: true, trim: true },
    image: { type: String, trim: true },
    popular: { type: Boolean, default: false },

    // Hotel IDs from Hotel collection
    hotels: {
      makkah: { type: String, required: true },
      madinah: { type: String, required: true },
    },

    // Multiple IDs from other collections
    features: [{ type: String, ref: "Feature" }],
    travelers: { type: String, required: true },
    rating: { type: Number },
    reviews: { type: Number },
    itinerary: [{ type: String, ref: "Itinerary" }],
    includes: [{ type: String, ref: "Include" }],
    excludes: [{ type: String, ref: "Exclude" }],
    policies: [{ type: String, ref: "PackagePolicy" }],
    flights: {
      departure: {
        flight: { type: String, trim: true },
        sector: { type: String, trim: true },
        departureTime: { type: String, trim: true },
        arrivalTime: { type: String, trim: true },
      },
      arrival: {
        flight: { type: String, trim: true },
        sector: { type: String, trim: true },
        departureTime: { type: String, trim: true },
        arrivalTime: { type: String, trim: true },
      },
    },
  },
  { timestamps: true }
);

// Export the model
export const UmrahPackage: Model<IUmrahPackage> =
  mongoose.models.UmrahPackage || mongoose.model<IUmrahPackage>("UmrahPackage", umrahPackageSchema);
