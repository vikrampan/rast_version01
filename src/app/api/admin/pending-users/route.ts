import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';
import { ensureIndexes } from '@/lib/createIndexes';

const pendingUserSchema = new mongoose.Schema({
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

const PendingUsers = mongoose.models.pendingusers || mongoose.model('pendingusers', pendingUserSchema);

// Cache object
const cache: { [key: string]: { data: any; timestamp: number } } = {};
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
      .limit(50);

    // Format the response data
    const formattedUsers = users.map(user => ({
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