import mongoose, { Schema, Document, Model, Types } from "mongoose";

// Interface for AdditionalService document
export interface IAdditionalService extends Document {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  price: number;
  serviceType: "umrahVisa" | "transport" | "zaiarat" | "meals" | "esim"; // One of the 5 predefined types
  isActive: boolean;
  icon?: string; // Optional icon identifier (e.g., "umrahVisa", "transport", "zaiarat", "meals", "esim")
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema
const additionalServiceSchema = new Schema<IAdditionalService>(
  {
    name: {
      type: String,
      required: [true, "Service name is required"],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be non-negative"],
    },
    serviceType: {
      type: String,
      required: [true, "Service type is required"],
      trim: true,
      enum: {
        values: ["umrahVisa", "transport", "zaiarat", "meals", "esim"],
        message: "Service type must be one of: umrahVisa, transport, zaiarat, meals, esim"
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    icon: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Export model
export const AdditionalService: Model<IAdditionalService> =
  mongoose.models.AdditionalService ||
  mongoose.model<IAdditionalService>("AdditionalService", additionalServiceSchema);

