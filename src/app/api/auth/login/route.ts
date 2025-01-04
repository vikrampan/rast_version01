import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';
import { SignJWT } from 'jose';

// Schema for admin/users
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,
  organization: String,
  accessLevel: String,
  isAdmin: { type: Boolean, default: false },
  isSuperAdmin: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  lastLogin: Date
}, { collection: 'users' });

// Schema for pending users
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

const Users = mongoose.models.users || mongoose.model('users', userSchema);
const PendingUsers = mongoose.models.pendingusers || mongoose.model('pendingusers', pendingUserSchema);

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    console.log('Login attempt for:', email);

    await connectDB();
    
    // First check active users
    const user = await Users.findOne({ email });
    
    if (user) {
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return NextResponse.json(
          { success: false, message: 'Invalid credentials' },
          { status: 401 }
        );
      }

      // Create JWT token
      const token = await new SignJWT({
        userId: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
        isSuperAdmin: user.isSuperAdmin,
        accessLevel: user.accessLevel
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('24h')
        .sign(new TextEncoder().encode(process.env.NEXTAUTH_SECRET));

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      const response = NextResponse.json({
        success: true,
        user: {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isAdmin: user.isAdmin,
          isSuperAdmin: user.isSuperAdmin,
          accessLevel: user.accessLevel
        }
      });

      // Set auth token cookie
      response.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 // 24 hours
      });

      return response;
    }

    // Check if user is pending
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

    // No user found
    return NextResponse.json(
      { success: false, message: 'Invalid credentials' },
      { status: 401 }
    );

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Login failed' },
      { status: 500 }
    );
  }
}