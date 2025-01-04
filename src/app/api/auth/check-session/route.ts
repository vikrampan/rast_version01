import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';

// Define the schema to match the database
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

// Initialize the model
const User = mongoose.models.users || mongoose.model('users', userSchema);

export async function GET() {
  try {
    // Get cookie store and wait for it
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');

    if (!token) {
      console.log('No token found');
      return NextResponse.json(
        { success: false, message: 'No token found' },
        { status: 401 }
      );
    }

    try {
      const { payload } = await jwtVerify(
        token.value,
        new TextEncoder().encode(process.env.NEXTAUTH_SECRET)
      );

      await connectDB();
      
      const user = await User.findById(payload.userId).select('-password');

      if (!user) {
        console.log('User not found');
        return NextResponse.json(
          { success: false, message: 'User not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isAdmin: user.isAdmin,
          isSuperAdmin: user.isSuperAdmin
        }
      });
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError);
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json(
      { success: false, message: 'Session check failed' },
      { status: 500 }
    );
  }
}