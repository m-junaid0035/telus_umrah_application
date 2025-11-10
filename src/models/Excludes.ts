import mongoose, { Schema, Document, Model, Types } from "mongoose";

// Interface for PackageExclude document
export interface IPackageExclude extends Document {
  _id: Types.ObjectId;
  exclude_text: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the PackageExclude schema
const packageExcludeSchema = new Schema<IPackageExclude>(
  {
    exclude_text: {
      type: String,
      required: [true, "Exclude text is required"],
      trim: true,
    },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt
  }
);

// Export model
export const PackageExclude: Model<IPackageExclude> =
  mongoose.models.PackageExclude ||
  mongoose.model<IPackageExclude>("PackageExclude", packageExcludeSchema);
