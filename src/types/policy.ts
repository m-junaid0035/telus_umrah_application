import { Document, Types } from "mongoose";

// Interface for PackagePolicy document
export interface IPackagePolicy extends Document {
  _id: Types.ObjectId;
  heading: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

// Optional: type alias for the ID
export type PackagePolicyId = Types.ObjectId;

// Optional: DTO type for creating/updating a policy
export type PackagePolicyInput = {
  heading: string;
  description: string;
};
