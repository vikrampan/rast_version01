import mongoose from 'mongoose';

const pendingUserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters']
  },
  organization: {
    type: String,
    required: [true, 'Organization name is required'],
    trim: true
  },
  accessLevel: {
    type: String,
    required: [true, 'Access level is required'],
    enum: ['inspection', 'maintenance', 'leadership']
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'approved', 'rejected']
  }
});

const PendingUser = mongoose.models.PendingUser || mongoose.model('PendingUser', pendingUserSchema);

export default PendingUser;