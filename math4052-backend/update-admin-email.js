const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

async function updateAdminEmail() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Find the admin user with email "admin"
    const oldAdmin = await User.findOne({ email: 'admin' });
    
    if (oldAdmin) {
      // Update the email to admin@admin.com
      oldAdmin.email = 'admin@admin.com';
      await oldAdmin.save();
      console.log('Admin email updated to admin@admin.com');
    } else {
      // Create new admin user if not found
      const adminUser = new User({
        email: 'admin@admin.com',
        password: 'admin',
        role: 'admin'
      });
      
      await adminUser.save();
      console.log('New admin user created with email admin@admin.com');
    }
    
    // Also check if admin@admin.com already exists and update password
    const existingAdminEmail = await User.findOne({ email: 'admin@admin.com' });
    if (existingAdminEmail && existingAdminEmail.email === 'admin@admin.com') {
      existingAdminEmail.password = 'admin';
      existingAdminEmail.role = 'admin';
      await existingAdminEmail.save();
      console.log('admin@admin.com password confirmed as "admin"');
    }
    
    console.log('\n=== UPDATED LOGIN CREDENTIALS ===');
    console.log('Email: admin@admin.com');
    console.log('Password: admin');
    console.log('Role: admin');
    console.log('==================================\n');
    
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

updateAdminEmail();