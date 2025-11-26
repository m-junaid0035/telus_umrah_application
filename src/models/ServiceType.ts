import mongoose, { Schema, Document, Model, Types } from "mongoose";

// Interface for ServiceType document
export interface IServiceType extends Document {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema
const serviceTypeSchema = new Schema<IServiceType>(
  {
    name: {
      type: String,
      required: [true, "Type name is required"],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
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
  },
  {
    timestamps: true,
  }
);

// Export model
export const ServiceType: Model<IServiceType> =
  mongoose.models.ServiceType ||
  mongoose.model<IServiceType>("ServiceType", serviceTypeSchema);

