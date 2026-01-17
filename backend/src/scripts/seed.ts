import migrateData from './migrate';
import { UserModel } from '../models/User';
import { connectDatabase } from '../utils/database';

async function createAdminUser(): Promise<void> {
  console.log('👑 Creating admin user...');
  
  try {
    // Check if admin user already exists
    const existingAdmin = await UserModel.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('🔹 Admin user already exists:', existingAdmin.email);
      return;
    }

    // Create default admin user
    const adminUser = new UserModel({
      email: process.env.ADMIN_EMAIL || 'admin@edtech.com',
      password: process.env.ADMIN_PASSWORD || 'admin123456',
      name: process.env.ADMIN_NAME || 'Admin User',
      role: 'admin'
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully:', adminUser.email);
  } catch (error) {
    console.error('❌ Failed to create admin user:', error);
    throw error;
  }
}

async function seedDatabase(): Promise<void> {
  console.log('🌱 Starting complete database seeding...');
  
  try {
    // Connect to database if not already connected
    await connectDatabase();
    
    // Create admin user first
    await createAdminUser();
    
    // Run comprehensive migration (now includes all data)
    await migrateData();
    
    console.log('🎉 Complete database seeding finished successfully!');
  } catch (error) {
    console.error('💥 Database seeding failed:', error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('✅ Database seeding process completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Database seeding process failed:', error);
      process.exit(1);
    });
}

export default seedDatabase;
