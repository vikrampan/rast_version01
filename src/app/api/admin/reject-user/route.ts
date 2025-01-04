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

const rejectedUserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  organization: String,
  accessLevel: String,
  registrationDate: Date,
  rejectionDate: Date,
  status: String,
  reason: String
}, { collection: 'rejectedusers' });

const RejectedUsers = mongoose.models.rejectedusers || mongoose.model('rejectedusers', rejectedUserSchema);

export async function POST(request: Request) {
  try {
    const { userId, reason = 'No reason provided' } = await request.json();
    console.log('Rejecting user:', userId);

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

    // Create rejected user record
    const rejectedUser = new RejectedUsers({
      firstName: pendingUser.firstName,
      lastName: pendingUser.lastName,
      email: pendingUser.email,
      organization: pendingUser.organization,
      accessLevel: pendingUser.accessLevel,
      registrationDate: pendingUser.registrationDate,
      rejectionDate: new Date(),
      status: 'rejected',
      reason: reason
    });

    await rejectedUser.save();

    // Remove from pending users
    await PendingUsers.findByIdAndDelete(userId);

    console.log('User rejected successfully');

    return NextResponse.json({
      success: true,
      message: 'User rejected successfully'
    });

  } catch (error) {
    console.error('Error rejecting user:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to reject user' },
      { status: 500 }
    );
  }
}