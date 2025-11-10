import mongoose, { Schema, Document, Model, Types } from "mongoose";

// Interface for PackageFeature document
export interface IPackageFeature extends Document {
  _id: Types.ObjectId;
  feature_text: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the PackageFeature schema
const packageFeatureSchema = new Schema<IPackageFeature>(
  {
    feature_text: {
      type: String,
      required: [true, "Feature text is required"],
      trim: true,
    },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt
  }
);

// Export model
export const PackageFeature: Model<IPackageFeature> =
  mongoose.models.PackageFeature ||
  mongoose.model<IPackageFeature>("PackageFeature", packageFeatureSchema);
