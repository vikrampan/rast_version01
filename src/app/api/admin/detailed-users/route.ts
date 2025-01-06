import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';

// User Schema
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

interface JWTPayload {
  userId: string;
  email: string;
  isAdmin: boolean;
}

export async function GET() {
  try {
    console.log('Detailed users API called');
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');

    if (!token) {
      console.log('No auth token found');
      return NextResponse.json(
        { success: false, message: 'No token found' },
        { status: 401 }
      );
    }

    // Verify JWT token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token.value, secret) as { payload: JWTPayload };

    // Check if user is admin
    if (!payload.isAdmin) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized access' },
        { status: 403 }
      );
    }

    await connectDB();
    console.log('Database connected');


    const users = await User.find()
      .select('firstName lastName email organization accessLevel lastLogin isActive')
      .lean();

    console.log('Users query completed. Found:', users.length, 'users');

    return NextResponse.json({
      success: true,
      users: users
    });

  } catch (error: unknown) {
    console.error('Detailed error:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch user details',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}