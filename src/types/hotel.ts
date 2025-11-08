import { Document, Types } from "mongoose";

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
  star: number;
  createdAt: Date;
  updatedAt: Date;
}
