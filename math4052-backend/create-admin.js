const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      // Update password anyway
      existingAdmin.password = 'admin';
      await existingAdmin.save();
      console.log('Admin password updated to "admin"');
    } else {
      // Create new admin user
      const adminUser = new User({
        email: 'admin',
        password: 'admin',
        role: 'admin'
      });
      
      await adminUser.save();
      console.log('Admin user created successfully!');
    }
    
    console.log('\n=== LOGIN CREDENTIALS ===');
    console.log('Email: admin');
    console.log('Password: admin');
    console.log('Role: admin');
    console.log('========================\n');
    
    // List all users for verification
    const users = await User.find({});
    console.log('All users in database:');
    users.forEach(user => {
      console.log(`- ${user.email} (${user.role})`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

createAdmin();