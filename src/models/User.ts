
import mongoose, { Schema, Document, models, Model } from 'mongoose';

export type UserRole = "admin" | "manager" | "client" | "contractor";

export interface IUser extends Document {
  email: string;
  name: string;
  password?: string;
  avatarUrl?: string;
  role: UserRole;
  location?: string;
  joinedDate: Date;
  
  // Client-specific fields
  companyName?: string;
  projectInterest?: string;

  // Contractor-specific fields
  professionalTitle?: string;
  skills?: string[];
  portfolioLink?: string;
  bio?: string;
}

const UserSchema: Schema<IUser> = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, select: false }, // Hide password by default
  avatarUrl: { type: String },
  role: { type: String, enum: ['admin', 'manager', 'client', 'contractor'], required: true },
  location: { type: String },
  joinedDate: { type: Date, default: Date.now },

  // Client-specific fields
  companyName: { type: String },
  projectInterest: { type: String },

  // Contractor-specific fields
  professionalTitle: { type: String },
  skills: [{ type: String }],
  portfolioLink: { type: String },
  bio: { type: String },
});

const User: Model<IUser> = models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
