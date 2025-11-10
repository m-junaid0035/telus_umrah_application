import mongoose, { Schema, Document, Model, Types } from "mongoose";

// Interface for PackagePolicy document
export interface IPackagePolicy extends Document {
  _id: Types.ObjectId;
  heading: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the PackagePolicy schema
const packagePolicySchema = new Schema<IPackagePolicy>(
  {
    heading: {
      type: String,
      required: [true, "Heading is required"],
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
export const PackagePolicy: Model<IPackagePolicy> =
  mongoose.models.PackagePolicy ||
  mongoose.model<IPackagePolicy>("PackagePolicy", packagePolicySchema);
