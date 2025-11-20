import mongoose, { Schema, Document, Model, Types } from "mongoose";

export enum FormOptionType {
  FromCity = "fromCity",
  ToCity = "toCity",
  Airline = "airline",
  AirlineClass = "airlineClass",
  Nationality = "nationality",
}

export interface IFormOption extends Document {
  _id: Types.ObjectId;
  type: FormOptionType;
  name: string;
  value: string; // The actual value used in forms
  displayOrder?: number; // For sorting
  isActive?: boolean;
  logo?: string; // For airlines
  createdAt: Date;
  updatedAt: Date;
}

const formOptionSchema = new Schema<IFormOption>(
  {
    type: {
      type: String,
      enum: Object.values(FormOptionType),
      required: [true, "Option type is required"],
    },
    name: {
      type: String,
      required: [true, "Option name is required"],
      trim: true,
    },
    value: {
      type: String,
      required: [true, "Option value is required"],
      trim: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    logo: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
formOptionSchema.index({ type: 1, isActive: 1, displayOrder: 1 });

// Export model
export const FormOption: Model<IFormOption> =
  (mongoose.models && (mongoose.models.FormOption as Model<IFormOption>)) ||
  mongoose.model<IFormOption>("FormOption", formOptionSchema);

