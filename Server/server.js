import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import "./Services/notification.js";


import { connectDB } from "./Database/db.js";
import { errorHandler } from "./Utils/Logger/errorHandler.js";

// Import routes
import authRoutes from "./Routes/Auth/Combined/Auth.js";
import tenantRoutes from "./Routes/Tenant/Combined/Tenant.js";
import activityLogRoutes from "./Routes/ActivityLog/ActivityLog.js";
import blogRoutes from "./Routes/Blog/Combined.js";
import combinedRoutes from "./Routes/Fields/Combined.js";
import mediaRoutes from "./Routes/Media/Media.js";
import menuRoutes from "./Routes/Menu/Combined.js";
import pageRoutes from "./Routes/Page/Combined.js";
import footerRoutes from "./Routes/Footer/Combined.js";
import themeRoutes from "./Routes/Theme/Theme.js";
import versionRoutes from "./Routes/Version/Version.js";
import seoRoutes from "./Routes/Seo/Seo.js";
import formRoutes from "./Routes/Form/Form.js";
import FetchPageRoutes from "./Routes/Page/Services.js";
import deleteRoutes from "./Routes/Delete/pageDelete.js";
import slugServices from "./Services/slugServices.js";
import loadRoutes from "./Routes/Load/blog.js";
import blogDelete from "./Routes/Delete/blogDelete.js";
import deleteMenu from "./Routes/Delete/menuDelete.js";
import menuLoad from "./Routes/Load/menu.js";
import statsRoutes from "./Routes/Stats/Stats.js";
import deleteTenant from "./Routes/Delete/tenantDelete.js";
import updateTenant from "./Routes/Tenant/Combined/Tenant.js";
import loadFooter from "./Routes/Load/footer.js";
import updateFooter from "./Routes/Footer/Combined.js";
import loadBelongPage from "./Routes/Load/pageBelong.js";
import loadSeo from "./Routes/Load/Seo.js";
import deleteSeo from "./Routes/Delete/seoDelete.js";
import deleteForm from "./Routes/Delete/formDelete.js";
import loadForms from "./Routes/Load/form.js";
import updateForm from "./Routes/Form/Form.js";
import deleteFooter from "./Routes/Delete/footerDelete.js";
import integrationsApi from "./Routes/integrationsApi/integrationsApi.js";
import adminLoad from "./Routes/Load/adminLoad.js";
import notificationRoutes from "./Routes/Notifications/notifications.js";
import oAuth from "./Routes/Auth/oAuth/oAuth.js";
import { extractDomain } from "./Validation/middleware/extractDomain.js";
import deleteUser from "./Routes/Delete/deleteUser.js";
import externalRequest from "./Routes/Api/oneRoutes.js";
import validateUser from "./Services/validateUser.js"

const app = express();
import passport from "./config/password.js";

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "some_secret",
    resave: false,
    saveUninitialized: false,
  }),
);

// Passport middlewares
app.use(passport.initialize());
app.use(passport.session());

//Create Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/activity", activityLogRoutes);
app.use("/api/v1/create-blog", blogRoutes);
app.use("/api/v1/fields", combinedRoutes);
app.use("/api/v1/create-form", formRoutes);
app.use("/api/v1/create-tenant", tenantRoutes);
app.use("/api/v1/create-footer", footerRoutes);
app.use("/api/v1/create-media", mediaRoutes);
app.use("/api/v1/create-menu", menuRoutes);
app.use("/api/v1/create-page", pageRoutes);
app.use("/api/v1/create-theme", themeRoutes);
app.use("/api/v1/create-version", versionRoutes);
app.use("/api/v1/create-seo", seoRoutes);

//create -- oAuth
app.use("/api/v1/oAuth", oAuth);

//fetch routes
app.use("/api/v1/tenants", tenantRoutes);
app.use("/api/v1/page", FetchPageRoutes);
app.use("/api/v1/blog", loadRoutes);
app.use("/api/v1/load-menu", menuLoad);
app.use("/api/v1/user-blog", loadRoutes);
app.use("/api/v1/footer", loadFooter);
app.use("/api/v1/page/belong", loadBelongPage);
app.use("/api/v1/seo/load-seo", loadSeo);
app.use("/api/v1/form", loadForms);
app.use("/api/v1/integrations", integrationsApi);

//fetch routes for ADMIN
app.use("/api/v1/admin/get-all-users", adminLoad);

//helper / services
app.use("/api/v1/check-slug", FetchPageRoutes);
app.use("/api/v2/check-slug", slugServices);
app.use("/api/v1/notifications", notificationRoutes);

//deletion routes
app.use("/api/v1/delete", deleteRoutes);
app.use("/api/v1/delete-blog", blogDelete);
app.use("/api/v1/delete-menu", deleteMenu);
app.use("/api/v1/delete-tenant", deleteTenant);
app.use("/api/v1/delete-seo", deleteSeo);
app.use("/api/v1/delete-form", deleteForm);
app.use("/api/v1/delete-footer", deleteFooter);
// Delete-Whole Account 
app.use("/api/v1/user/delete", deleteUser);
app.use("/api/v1/user/validate/user-payload", validateUser);

//Edit / modification routes
app.use("/api/v1/update-page", pageRoutes);
app.use("/api/v1/blog", blogRoutes);
app.use("/api/v1/update-menu", menuRoutes);
app.use("/api/v1/update-tenant", updateTenant);
app.use("/api/v1/update-footer", updateFooter);
app.use("/api/v1/update-seo", seoRoutes);
app.use("/api/v1/update-form", updateForm);
//stats routes
app.use("/api/v1/statistics", statsRoutes);


//external request routes
app.use("/api/v1/external-request", extractDomain, externalRequest);

// Error handler
app.use(errorHandler);

// Connect to DB
connectDB();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
