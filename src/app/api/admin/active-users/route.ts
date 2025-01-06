import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';

// Define interfaces for better type safety
interface ISession {
  userId: string;
  lastActive: Date;
}

interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  organization: string;
  accessLevel: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isActive: boolean;
  lastLogin: Date;
}

// Session Schema
const sessionSchema = new mongoose.Schema<ISession>({
  userId: { type: String, required: true },
  lastActive: { type: Date, required: true },
}, { 
  collection: 'sessions',
  timestamps: true 
});

// User Schema with proper typing
const userSchema = new mongoose.Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
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

// Model definitions with proper typing
const Session = mongoose.models.sessions || mongoose.model<ISession>('sessions', sessionSchema);
const User = mongoose.models.users || mongoose.model<IUser>('users', userSchema);

// Type for user document without password
interface UserProjection {
  _id: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  organization: string;
  accessLevel: string;
  lastLogin: Date | null;
}

export async function GET() {
  try {
    // Fix for the cookies() promise
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');

    if (!token) {
      console.log('No auth token found');
      return NextResponse.json(
        { success: false, message: 'No token found' },
        { status: 401 }
      );
    }

    await connectDB();

    // Get active sessions from last 15 minutes
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const activeSessions = await Session.find({
      lastActive: { $gte: fifteenMinutesAgo }
    }).lean();

    console.log('Active sessions found:', activeSessions.length);

    if (activeSessions.length === 0) {
      return NextResponse.json({
        success: true,
        users: []
      });
    }

    // Get user details for active sessions with proper type handling
    const activeUserIds = activeSessions
      .map(session => {
        try {
          return new mongoose.Types.ObjectId(session.userId);
        } catch {
          console.error('Invalid ObjectId:', session.userId);
          return null;
        }
      })
      .filter((id): id is mongoose.Types.ObjectId => id !== null);

    console.log('Active user IDs:', activeUserIds);

    // Fix for the User.find() type assertion
    const activeUsers = await User.find(
      {
        _id: { $in: activeUserIds },
        isActive: true
      },
      {
        password: 0,
        _id: 1,
        firstName: 1,
        lastName: 1,
        email: 1,
        phone: 1,
        organization: 1,
        accessLevel: 1,
        lastLogin: 1
      }
    ).lean().exec() as unknown as UserProjection[];

    console.log('Active users found:', activeUsers.length);

    return NextResponse.json({
      success: true,
      users: activeUsers
    });

  } catch (error: unknown) {
    console.error('Error fetching active users:', error);

    let errorMessage = 'Failed to fetch active users';
    
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = String(error.message);
    } else if (typeof error === 'string') {
      errorMessage = error;
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch active users',
        error: errorMessage
      },
      { status: 500 }
    );
  }
}