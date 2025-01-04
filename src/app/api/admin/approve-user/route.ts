import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';

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

const PendingUsers = mongoose.models.pendingusers || mongoose.model('pendingusers', pendingUserSchema);

// Schema for approved users
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,
  organization: String,
  accessLevel: String,
  registrationDate: Date,
  approvalDate: Date,
  status: String,
  isActive: Boolean
}, { collection: 'users' });

const Users = mongoose.models.users || mongoose.model('users', userSchema);

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();
    console.log('Approving user:', userId);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find pending user
    const pendingUser = await PendingUsers.findById(userId);
    if (!pendingUser) {
      return NextResponse.json(
        { success: false, message: 'Pending user not found' },
        { status: 404 }
      );
    }

    // Create new user in users collection
    const approvedUser = new Users({
      firstName: pendingUser.firstName,
      lastName: pendingUser.lastName,
      email: pendingUser.email,
      password: pendingUser.password,
      organization: pendingUser.organization,
      accessLevel: pendingUser.accessLevel,
      registrationDate: pendingUser.registrationDate,
      approvalDate: new Date(),
      status: 'active',
      isActive: true
    });

    await approvedUser.save();

    // Remove from pending users
    await PendingUsers.findByIdAndDelete(userId);

    console.log('User approved successfully');

    return NextResponse.json({
      success: true,
      message: 'User approved successfully',
      user: {
        id: approvedUser._id,
        email: approvedUser.email,
        status: approvedUser.status
      }
    });

  } catch (error) {
    console.error('Error approving user:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to approve user' },
      { status: 500 }
    );
  }
}