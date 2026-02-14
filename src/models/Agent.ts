import mongoose, { Schema, Document, Types } from "mongoose";
import bcrypt from "bcrypt";

export interface IAgent extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  phone: string;
  countryCode: string;
  companyName: string;
  registrationType: 'IATA' | 'Non-IATA';
  ptsNumber: string;
  businessAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  avatar?: string;
  createdAt?: Date;
  updatedAt?: Date;

  comparePassword(candidatePassword: string): Promise<boolean>;
}

const AgentSchema = new Schema<IAgent>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true, select: false },
    phone: { type: String, required: true, trim: true },
    countryCode: { type: String, required: true, trim: true },
    companyName: { type: String, required: true, trim: true },
    registrationType: { 
      type: String, 
      required: true, 
      enum: ['IATA', 'Non-IATA'] 
    },
    ptsNumber: { type: String, required: true, trim: true },
    businessAddress: {
      street: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      state: { type: String, required: true, trim: true },
      country: { type: String, required: true, trim: true },
      postalCode: { type: String, required: true, trim: true },
    },
    status: { 
      type: String, 
      required: true, 
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending' 
    },
    rejectionReason: { type: String, trim: true },
    avatar: { type: String, trim: true },
  },
  { timestamps: true }
);

// Hash password before save
AgentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare passwords
AgentSchema.methods.comparePassword = async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Delete existing model to force recompilation
if (mongoose.models.Agent) {
  delete mongoose.models.Agent;
}

export default mongoose.model<IAgent>("Agent", AgentSchema);
