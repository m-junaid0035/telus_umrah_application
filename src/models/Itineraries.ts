import mongoose, { Schema, Document, Model, Types } from "mongoose";

// Interface for Itinerary document
export interface IItinerary extends Document {
  _id: Types.ObjectId;
  day_start: number;
  day_end?: number; // optional for ranges like 3-7
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the Itinerary schema
const itinerarySchema = new Schema<IItinerary>(
  {
    day_start: {
      type: Number,
      required: [true, "Start day is required"],
      min: [1, "Day start must be at least 1"],
    },
    day_end: {
      type: Number,
      min: [1, "Day end must be at least 1"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt
  }
);

// Export model
export const Itinerary: Model<IItinerary> =
  mongoose.models.Itinerary || mongoose.model<IItinerary>("Itinerary", itinerarySchema);
