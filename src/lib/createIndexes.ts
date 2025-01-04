import mongoose from 'mongoose';
import connectDB from './db';

export async function createIndexes() {
  try {
    await connectDB();
    const db = mongoose.connection;

    console.log('Creating indexes for pendingusers collection...');
    
    // Create indexes for pendingusers collection
    await db.collection('pendingusers').createIndexes([
      { key: { email: 1 }, unique: true },
      { key: { status: 1 } },
      { key: { registrationDate: -1 } },
      { 
        key: { 
          firstName: 'text', 
          lastName: 'text', 
          email: 'text', 
          organization: 'text' 
        },
        name: 'search_index'
      }
    ]);

    // Create indexes for users collection
    console.log('Creating indexes for users collection...');
    await db.collection('users').createIndexes([
      { key: { email: 1 }, unique: true },
      { key: { status: 1 } },
      { key: { registrationDate: -1 } }
    ]);

    console.log('✅ All indexes created successfully');
  } catch (error) {
    console.error('❌ Error creating indexes:', error);
    throw error;
  }
}

// Create a function to run the indexing
export async function ensureIndexes() {
  try {
    await createIndexes();
  } catch (error) {
    console.error('Failed to create indexes:', error);
  }
}