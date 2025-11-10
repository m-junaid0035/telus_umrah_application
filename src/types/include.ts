import { Document, Types } from "mongoose";

// Interface for PackageInclude document
export interface IPackageInclude extends Document {
  _id: Types.ObjectId;
  include_text: string;
  createdAt: Date;
  updatedAt: Date;
}

// Optional: type alias for the ID
export type PackageIncludeId = Types.ObjectId;

// Optional: DTO type for creating a new include
export type PackageIncludeInput = {
  include_text: string;
};
