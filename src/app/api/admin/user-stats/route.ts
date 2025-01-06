import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';

// Define interfaces
interface UserSession {
  userId: string;
  lastActive: Date;
}

interface AccessLevelCount {
  _id: string;
  count: number;
}

interface AccessLevelStats {
  [key: string]: number;
}

interface JWTPayload {
  sub?: string;
  isAdmin?: boolean;
  isSuperAdmin?: boolean;
}

// Define the schema for tracking user sessions
const sessionSchema = new mongoose.Schema<UserSession>({
  userId: String,
  lastActive: Date,
}, { collection: 'sessions' });

const Session = mongoose.models.sessions || mongoose.model('sessions', sessionSchema);

// User schema
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,
  organization: String,
  accessLevel: String,
  isAdmin: Boolean,
  isSuperAdmin: Boolean,
  isActive: Boolean,
  lastLogin: Date
}, { collection: 'users' });

const User = mongoose.models.users || mongoose.model('users', userSchema);

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'No token found' },
        { status: 401 }
      );
    }

    // Verify admin access
    const { payload } = await jwtVerify(
      token.value,
      new TextEncoder().encode(process.env.NEXTAUTH_SECRET)
    );

    // Type cast the payload and verify admin access
    const jwtPayload = payload as JWTPayload;
    if (!jwtPayload.isAdmin && !jwtPayload.isSuperAdmin) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    await connectDB();

    // Get total users
    const totalUsers = await User.countDocuments({ isActive: true });

    // Get active users (active in last 15 minutes)
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const activeUsers = await Session.countDocuments({
      lastActive: { $gte: fifteenMinutesAgo }
    });

    // Get users by access level
    const usersByAccessLevel = await User.aggregate<AccessLevelCount>([
      { $match: { isActive: true } },
      { $group: { _id: '$accessLevel', count: { $sum: 1 } } }
    ]);

    // Format access level data
    const accessLevelStats: AccessLevelStats = {};
    usersByAccessLevel.forEach(({ _id, count }) => {
      if (_id) {
        accessLevelStats[_id] = count;
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        usersByAccessLevel: accessLevelStats
      }
    });

  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch user statistics' },
      { status: 500 }
    );
  }
}