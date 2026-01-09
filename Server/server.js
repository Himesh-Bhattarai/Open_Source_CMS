// server.js or index.js
import cors from "cors";
import express from 'express';
import cookieParser from 'cookie-parser';
import { connectDB } from './Database/db.js';
import { errorHandler } from './Utils/Logger/errorHandler.js';
import dotenv from "dotenv";
dotenv.config();


// Import routes
import authRoutes from './Routes/Auth/Combined/Auth.js';
import tenantRoutes from './Routes/Tenant/Combined/Tenant.js';
import activityLogRoutes from './Routes/ActivityLog/ActivityLog.js';
import blogRoutes from './Routes/Blog/Combined.js';
import combinedRoutes from './Routes/Fields/Combined.js';
import mediaRoutes from './Routes/Media/Media.js';
import menuRoutes from './Routes/Menu/Combined.js';
import pageRoutes from './Routes/Page/Combined.js';
import footerRoutes from './Routes/Footer/Combined.js';
import themeRoutes from './Routes/Theme/Theme.js';
import versionRoutes from './Routes/Version/Version.js';
import seoRoutes from "./Routes/Seo/Seo.js";
import formRoutes from "./Routes/Form/Form.js";



dotenv.config();
const app = express();

// Middleware
app.use(cors({
    origin: "http://localhost:3000", // your frontend
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/activity', activityLogRoutes)
app.use('/api/v1/create-blog', blogRoutes);
app.use('/api/v1/fields', combinedRoutes);
app.use('/api/v1/create-form', formRoutes);
app.use('/api/v1/create-tenant', tenantRoutes);
app.use('/api/v1/create-footer', footerRoutes);
app.use('/api/v1/create-media', mediaRoutes);
app.use('/api/v1/create-menu', menuRoutes);
app.use('/api/v1/create-page', pageRoutes);
app.use('/api/v1/create-theme', themeRoutes);
app.use('/api/v1/create-version', versionRoutes);
app.use('/api/v1/create-seo', seoRoutes);

//fetch routes
app.use('/api/v1/tenants', tenantRoutes);


//helper / services
app.use('/api/v1/check-slug', pageRoutes);

// Error handler
app.use(errorHandler);

// Connect to DB
connectDB();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
