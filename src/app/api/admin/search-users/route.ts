import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';

const pendingUserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,
  organization: String,
  accessLevel: String,
  registrationDate: Date,
  status: String
}, { collection: 'pendingusers' });

const PendingUsers = mongoose.models.pendingusers || mongoose.model('pendingusers', pendingUserSchema);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const status = searchParams.get('status') || 'all';
    
    console.log('Search query:', query);
    console.log('Status filter:', status);

    await connectDB();

    let filter: any = {};

    // Add search query if provided
    if (query) {
      filter.$or = [
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { organization: { $regex: query, $options: 'i' } }
      ];
    }

    // Add status filter if not 'all'
    if (status !== 'all') {
      filter.status = status;
    }

    const users = await PendingUsers.find(filter)
      .select('-password')
      .sort({ registrationDate: -1 });

    console.log('Found users:', users.length);

    return NextResponse.json({
      success: true,
      users: users.map(user => ({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        organization: user.organization,
        accessLevel: user.accessLevel,
        registrationDate: user.registrationDate,
        status: user.status
      }))
    });

  } catch (error) {
    console.error('Error searching users:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to search users' },
      { status: 500 }
    );
  }
}