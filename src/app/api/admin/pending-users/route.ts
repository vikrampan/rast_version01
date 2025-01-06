import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';
import { ensureIndexes } from '@/lib/createIndexes';

// Define interfaces for type safety
interface IPendingUser {
  _id: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  organization: string;
  accessLevel: string;
  registrationDate: Date;
  status: string;
}

interface FormattedPendingUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  organization: string;
  accessLevel: string;
  registrationDate: Date;
  status: string;
}

interface CacheItem {
  data: FormattedPendingUser[];
  timestamp: number;
}

const pendingUserSchema = new mongoose.Schema<IPendingUser>({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,
  organization: String,
  accessLevel: String,
  registrationDate: { type: Date, default: Date.now },
  status: { type: String, default: 'pending' }
}, {
  collection: 'pendingusers',
  timestamps: true
});

const PendingUsers = mongoose.models.pendingusers || 
  mongoose.model<IPendingUser>('pendingusers', pendingUserSchema);

// Cache object with proper typing
const cache: Record<string, CacheItem> = {};
const CACHE_DURATION = 30000; // 30 seconds

export async function GET() {
  try {
    // Check cache
    const cacheKey = 'pending_users';
    const now = Date.now();
    if (cache[cacheKey] && now - cache[cacheKey].timestamp < CACHE_DURATION) {
      console.log('📦 Returning cached data');
      return NextResponse.json({
        success: true,
        users: cache[cacheKey].data,
        fromCache: true
      });
    }

    console.log('🔄 Fetching fresh data');
    await connectDB();

    // Ensure indexes exist
    await ensureIndexes();

    // Fetch users with optimized query
    const users = await PendingUsers
      .find({ status: 'pending' })
      .select('-password -__v')
      .lean()
      .sort({ registrationDate: -1 })
      .limit(50) as unknown as (Omit<IPendingUser, 'password'> & { _id: mongoose.Types.ObjectId })[];

    // Format the response data
    const formattedUsers: FormattedPendingUser[] = users.map(user => ({
      _id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      organization: user.organization,
      accessLevel: user.accessLevel,
      registrationDate: user.registrationDate,
      status: user.status
    }));

    // Update cache
    cache[cacheKey] = {
      data: formattedUsers,
      timestamp: now
    };

    return NextResponse.json({
      success: true,
      users: formattedUsers,
      fromCache: false
    });

  } catch (error) {
    console.error('Error fetching pending users:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}