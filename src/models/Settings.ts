import mongoose, { Schema, Document } from "mongoose";

export interface ISettings extends Document {
  key: string;
  agentDiscountPercent: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const SettingsSchema = new Schema<ISettings>(
  {
    key: { type: String, required: true, unique: true, default: "global" },
    agentDiscountPercent: { type: Number, default: 0, min: 0, max: 100 },
  },
  { timestamps: true }
);

export const Settings = mongoose.models.Settings || mongoose.model<ISettings>("Settings", SettingsSchema);
