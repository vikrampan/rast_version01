const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb://protubex.rast.in:27017/rast';

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
}, { collection: 'users' }); // Explicitly set collection name

const Users = mongoose.models.users || mongoose.model('users', userSchema);

async function createSuperAdmin() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    
    console.log('Checking for existing admin...');
    const existingAdmin = await Users.findOne({ email: 'admin@rast.in' });
    if (existingAdmin) {
      console.log('Updating existing admin...');
      existingAdmin.isActive = true;
      await existingAdmin.save();
      console.log('Admin updated successfully');
      return;
    }

    console.log('Creating new admin...');
    const hashedPassword = await bcrypt.hash('Rast@2024', 12);
    const superAdmin = new Users({
      firstName: 'Super',
      lastName: 'Admin',
      email: 'admin@rast.in',
      password: hashedPassword,
      organization: 'RAST',
      accessLevel: 'admin',
      isAdmin: true,
      isSuperAdmin: true,
      isActive: true,
      lastLogin: new Date()
    });

    await superAdmin.save();
    console.log('Super admin created successfully!');
    console.log('Email: admin@rast.in');
    console.log('Password: Rast@2024');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

createSuperAdmin();