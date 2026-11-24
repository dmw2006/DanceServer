const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['staff', 'admin'], default: 'staff' },
}, {
    timestamps: true,
});

const User = mongoose.model('User', UserSchema);

async function createAdminUser() {
    try {
        const uri = process.env.DATABASE_URL || process.env.MONGO_URI;
        
        if (!uri) {
            console.error('❌ DATABASE_URL or MONGO_URI not found in .env file');
            process.exit(1);
        }

        console.log('🔄 Connecting to MongoDB...');
        await mongoose.connect(uri);
        console.log('✅ Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@dance-academy.com' });
        
        if (existingAdmin) {
            console.log('⚠️  Admin user already exists');
            console.log('Email: admin@dance-academy.com');
            await mongoose.connection.close();
            return;
        }

        // Create admin user
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const adminUser = new User({
            username: 'admin',
            email: 'admin@dance-academy.com',
            password: hashedPassword,
            role: 'admin'
        });

        await adminUser.save();
        
        console.log('✅ Admin user created successfully!');
        console.log('');
        console.log('Login credentials:');
        console.log('  Email: admin@dance-academy.com');
        console.log('  Password: admin123');
        console.log('');
        console.log('⚠️  IMPORTANT: Change this password after first login!');
        
        await mongoose.connection.close();
        console.log('✅ Database connection closed');
    } catch (error) {
        console.error('❌ Error creating admin user:', error);
        process.exit(1);
    }
}

createAdminUser();
