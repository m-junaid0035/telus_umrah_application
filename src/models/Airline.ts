import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IAirline extends Document {
  _id: Types.ObjectId;
  name: string;
  logo?: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const airlineSchema = new Schema<IAirline>(
  {
    name: {
      type: String,
      required: [true, "Airline name is required"],
      trim: true,
      unique: true,
    },
    logo: {
      type: String,
      trim: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

airlineSchema.index({ isActive: 1, displayOrder: 1, name: 1 });

export const Airline: Model<IAirline> =
  (mongoose.models && (mongoose.models.Airline as Model<IAirline>)) ||
  mongoose.model<IAirline>("Airline", airlineSchema);
