// File: app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import connectDB from '@/lib/db';
import { Schema, model, models, Document, Model } from 'mongoose';

// Interfaces for type safety
interface UserDocument extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  organization: string;
  accessLevel: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isActive: boolean;
  lastLogin: Date;
}

interface PendingUserDocument extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  organization: string;
  accessLevel: string;
  registrationDate: Date;
  status: string;
}

// Schema for admin/users
const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  organization: { type: String, required: true },
  accessLevel: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  isSuperAdmin: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  lastLogin: Date
}, {
  collection: 'users',
  timestamps: true
});

// Schema for pending users
const pendingUserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  organization: { type: String, required: true },
  accessLevel: { type: String, required: true },
  registrationDate: { type: Date, default: Date.now },
  status: { type: String, default: 'pending' }
}, {
  collection: 'pendingusers',
  timestamps: true
});

// Initialize models with proper typing
const Users: Model<UserDocument> = models.users || model<UserDocument>('users', userSchema);

const PendingUsers: Model<PendingUserDocument> = models.pendingusers ||
  model<PendingUserDocument>('pendingusers', pendingUserSchema);

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await Users.findOne({ email });

    if (user) {
      if (!user.isActive) {
        return NextResponse.json(
          { success: false, message: 'Account is inactive' },
          { status: 403 }
        );
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return NextResponse.json(
          { success: false, message: 'Invalid credentials' },
          { status: 401 }
        );
      }

      const token = await new SignJWT({
        userId: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
        isSuperAdmin: user.isSuperAdmin,
        accessLevel: user.accessLevel
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(new TextEncoder().encode(process.env.NEXTAUTH_SECRET));

      user.lastLogin = new Date();
      await user.save();

      const response = NextResponse.json({
        success: true,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          name: `${user.firstName} ${user.lastName}`,
          isAdmin: user.isAdmin,
          isSuperAdmin: user.isSuperAdmin,
          accessLevel: user.accessLevel,
          organization: user.organization,
          isActive: user.isActive,
          lastLogin: user.lastLogin
        }
      });

      response.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60
      });

      return response;
    }

    const pendingUser = await PendingUsers.findOne({ email });
    if (pendingUser) {
      return NextResponse.json(
        {
          success: false,
          message: 'Your account is pending approval. Please wait for admin confirmation.'
        },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Invalid credentials' },
      { status: 401 }
    );

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Login failed',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}