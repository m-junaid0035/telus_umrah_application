import { Document, Types } from "mongoose";

// Interface for PackageExclude document
export interface IPackageExclude extends Document {
  _id: Types.ObjectId;
  exclude_text: string;
  createdAt: Date;
  updatedAt: Date;
}

// Optional: you can define a type alias for the ID
export type PackageExcludeId = Types.ObjectId;

// Optional: DTO type for creating a new exclude
export type PackageExcludeInput = {
  exclude_text: string;
};
