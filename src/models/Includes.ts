import mongoose, { Schema, Document, Model, Types } from "mongoose";

// Interface for PackageInclude document
export interface IPackageInclude extends Document {
  _id: Types.ObjectId;
  include_text: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the PackageInclude schema
const packageIncludeSchema = new Schema<IPackageInclude>(
  {
    include_text: {
      type: String,
      required: [true, "Include text is required"],
      trim: true,
    },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt
  }
);

// Export model
export const PackageInclude: Model<IPackageInclude> =
  mongoose.models.PackageInclude ||
  mongoose.model<IPackageInclude>("PackageInclude", packageIncludeSchema);
