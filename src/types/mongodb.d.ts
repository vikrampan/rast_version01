import { Connection, Model } from 'mongoose';

declare global {
  // We use 'let' instead of 'var' here as it's block-scoped
  let mongoose: {
    conn: Connection | null;
    promise: Promise<Connection> | null;
  };
}

export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  organization: string;
  accessLevel: 'inspection' | 'maintenance' | 'leadership';
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

export interface Models {
  User: Model<IUser>;
}