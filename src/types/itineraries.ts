import { Document, Types } from "mongoose";

// Interface for Itinerary document
export interface IItinerary extends Document {
  _id: Types.ObjectId;
  day_start: number;
  day_end?: number; // optional
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

// Optional: type alias for the ID
export type ItineraryId = Types.ObjectId;

// Optional: DTO type for creating a new itinerary
export type ItineraryInput = {
  day_start: number;
  day_end?: number;
  title: string;
  description: string;
};
