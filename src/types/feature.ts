import { Document, Types } from "mongoose";

// Interface for PackageFeature document
export interface IPackageFeature extends Document {
  _id: Types.ObjectId;
  feature_text: string;
  createdAt: Date;
  updatedAt: Date;
}

// Optional: type alias for the ID
export type PackageFeatureId = Types.ObjectId;

// Optional: DTO type for creating/updating a feature
export type PackageFeatureInput = {
  feature_text: string;
};
