import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import PendingUser from '@/models/PendingUser';
import { isOrganizationEmail } from '@/utils/emailValidation';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received registration request:', body);

    const { email, password, firstName, lastName, organization, accessLevel } = body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !organization || !accessLevel) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email domain
    if (!isOrganizationEmail(email)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Please use your organization email address. Personal email domains are not allowed.' 
        },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Check if email already exists in pending registrations
    const existingPendingUser = await PendingUser.findOne({ email });
    if (existingPendingUser) {
      return NextResponse.json(
        { success: false, message: 'Registration request already pending for this email' },
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new pending user
    const pendingUser = new PendingUser({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      organization,
      accessLevel,
      status: 'pending',
      registrationDate: new Date()
    });

    // Save to database
    await pendingUser.save();
    console.log('Pending user registration saved:', pendingUser.email);

    return NextResponse.json({
      success: true,
      message: 'Registration request submitted successfully. Pending admin approval.',
      data: {
        email: pendingUser.email,
        firstName: pendingUser.firstName,
        lastName: pendingUser.lastName,
        organization: pendingUser.organization,
        accessLevel: pendingUser.accessLevel,
        status: pendingUser.status
      }
    });

  } catch (error) {
    console.error('Error in registration process:', error);
    return NextResponse.json(
      { success: false, message: 'Registration failed' },
      { status: 500 }
    );
  }
}