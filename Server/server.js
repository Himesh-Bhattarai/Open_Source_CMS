// server.js or index.js
import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectDB } from './Database/db.js';
import { errorHandler } from './Utils/Logger/errorHandler.js';

// Import routes
import authRoutes from './Routes/Auth/Combined/Auth.js';
import tenantRoutes from './Routes/Tenant/Combined/Tenant.js';
import activityLogRoutes from './Routes/ActivityLog/ActivityLog.js';
import blogRoutes from './Routes/Blog/Combined.js';
import collectionRoutes from './Routes/Collection/Collection.js';
import combinedRoutes from './Routes/Fields/Combined.js';
import footerRoutes from './Routes/Footer/Combined.js';
import mediaRoutes from './Routes/Media/Media.js';
import menuRoutes from './Routes/Menu/Combined.js';

dotenv.config();
const app = express();

// Middleware
app.use(express.json()); 
app.use(cookieParser()); 

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/activity', activityLogRoutes)
app.use('/api/v1/blog', blogRoutes);
app.use('/api/v1/new', collectionRoutes);
app.use('/api/v1/fields', combinedRoutes);
app.use('/api/v1/create-tenant', tenantRoutes);
app.use('/api/v1/create-footer', footerRoutes);
app.use('/api/v1/create-media', mediaRoutes);
app.use('/api/v1/create-menu', menuRoutes);

// Error handler
app.use(errorHandler);

// Connect to DB
connectDB();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
