import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import authRoutes from './routes/auth';
import contentRoutes from './routes/content';
import studioProRoutes from './routes/studioPro';
import generalContentRoutes from './routes/generalContent';
import uploadRoutes from './routes/upload';
import pageSettingsRoutes from './routes/pageSettings';
import './config/env';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '256kb' }));

// Database connection with better error handling
const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI || process.env.DATABASE_URL;
        console.log('🔄 Attempting MongoDB connection...');
        console.log('📋 URI configured:', uri ? 'Yes' : 'No');
        console.log('🔍 URI preview:', uri ? `${uri.substring(0, 30)}...` : 'N/A');
        
        if (!uri) {
            throw new Error('MONGO_URI environment variable is not defined');
        }
        
        await mongoose.connect(uri);
        
        console.log('✅ MongoDB connected successfully');
        console.log('📊 Connected to database:', mongoose.connection.db.databaseName);
    } catch (err) {
        console.error('❌ MongoDB connection error:', err);
        console.error('Make sure:');
        console.error('  1. MongoDB Atlas cluster is active');
        console.error('  2. IP address is whitelisted (0.0.0.0/0 for testing)');
        console.error('  3. Connection string is correct');
        // Don't exit - let server run without DB for now
    }
};

connectDB();

// Routes
const imagesDir = path.join(process.cwd(), '../client/public/images');
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}
app.use('/images', express.static(imagesDir));
app.use('/api/images', express.static(imagesDir));

// API Routes - MUST come before static file serving
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/studioPro', studioProRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/page-settings', pageSettingsRoutes);
app.use('/api', generalContentRoutes);

// Frontend static files and catch-all - MUST come after API routes
// Checked per request so redeploying the frontend never needs a backend restart.
const frontendDir = path.resolve(process.cwd(), '../dance-react/dist');
app.use(express.static(frontendDir));
app.get('*', (req, res, next) => {
    res.sendFile(path.join(frontendDir, 'index.html'), (err) => {
        if (err) next();
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});