// File: app/api/auth/check-session/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';

interface UserDocument extends mongoose.Document {
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

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  organization: { type: String, required: true },
  accessLevel: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  isSuperAdmin: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date }
}, {
  collection: 'users',
  timestamps: true
});

const User = (mongoose.models.users as mongoose.Model<UserDocument>) ||
  mongoose.model<UserDocument>('users', userSchema);

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: 'Authentication required',
          redirect: '/auth/login'
        },
        {
          status: 401,
          headers: {
            'WWW-Authenticate': 'Bearer realm="Protected Area"'
          }
        }
      );
    }

    try {
      const { payload } = await jwtVerify(
        token.value,
        new TextEncoder().encode(process.env.NEXTAUTH_SECRET)
      );

      await connectDB();

      const user = await User.findById(payload.userId)
        .select('-password -__v')
        .lean();

      if (!user) {
        return NextResponse.json(
          {
            success: false,
            message: 'User not found',
            redirect: '/auth/login'
          },
          { status: 404 }
        );
      }

      if (!user.isActive) {
        return NextResponse.json(
          {
            success: false,
            message: 'Account is inactive',
            redirect: '/auth/login'
          },
          { status: 403 }
        );
      }

      const response = NextResponse.json({
        success: true,
        user: {
          id: user._id,
          name: `${user.firstName} ${user.lastName}`,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          accessLevel: user.accessLevel.charAt(0).toUpperCase() + user.accessLevel.slice(1),
          isAdmin: user.isAdmin,
          isSuperAdmin: user.isSuperAdmin,
          organization: user.organization,
          isActive: user.isActive,
          lastLogin: user.lastLogin
        }
      });

      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
      response.headers.set('Pragma', 'no-cache');
      response.headers.set('X-Content-Type-Options', 'nosniff');

      return response;

    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError);
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid session',
          redirect: '/auth/login'
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}
