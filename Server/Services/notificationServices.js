// services/cms.service.js
import { emitEvent } from "../core/eventBus.js";

// ========================
// USER MANAGEMENT
// ========================
export const loginUser = ({ userId, email }) => {
  emitEvent("USER_LOGIN_SUCCESS", {
    userId,
    email,
    timestamp: new Date(),
  });
};

export const registerUser = ({ userId, email, name }) => {
  emitEvent("USER_REGISTER_SUCCESS", {
    userId,
    email,
    name,
    timestamp: new Date(),
  });
};

export const logoutUser = (userId) => {
  emitEvent("USER_LOGOUT_SUCCESS", {
    userId,
    timestamp: new Date(),
  });
};

// ========================
// WEBSITE MANAGEMENT
// ========================
export const createWebsite = ({ userId, domain, name, websiteId }) => {
  emitEvent("WEBSITE_CREATED", {
    userId,
    domain,
    name,
    websiteId,
    timestamp: new Date(),
  });
};

export const updateWebsite = ({ userId, domain, name, websiteId }) => {
  emitEvent("WEBSITE_UPDATED", {
    userId,
    domain,
    name,
    websiteId,
    timestamp: new Date(),
  });
};

export const deleteWebsite = ({ userId, domain, name, websiteId }) => {
  emitEvent("WEBSITE_DELETED", {
    userId,
    domain,
    name,
    websiteId,
    timestamp: new Date(),
  });
};

// ========================
// PAGE MANAGEMENT
// ========================
export const createPage = ({ userId, slug, title, pageId, websiteId }) => {
  emitEvent("PAGE_CREATED", {
    userId,
    slug,
    title,
    pageId,
    websiteId,
    timestamp: new Date(),
  });
};

export const updatePage = ({ userId, slug, title, pageId, websiteId }) => {
  emitEvent("PAGE_UPDATED", {
    userId,
    slug,
    title,
    pageId,
    websiteId,
    timestamp: new Date(),
  });
};

export const deletePage = ({ userId, slug, title, pageId, websiteId }) => {
  emitEvent("PAGE_DELETED", {
    userId,
    slug,
    title,
    pageId,
    websiteId,
    timestamp: new Date(),
  });
};

// ========================
// BLOG MANAGEMENT
// ========================
export const createBlog = ({ userId, slug, title, blogId, websiteId }) => {
  emitEvent("BLOG_CREATED", {
    userId,
    slug,
    title,
    blogId,
    websiteId,
    timestamp: new Date(),
  });
};

export const updateBlog = ({ userId, slug, title, blogId, websiteId }) => {
  emitEvent("BLOG_UPDATED", {
    userId,
    slug,
    title,
    blogId,
    websiteId,
    timestamp: new Date(),
  });
};

export const deleteBlog = ({ userId, slug, title, blogId, websiteId }) => {
  emitEvent("BLOG_DELETED", {
    userId,
    slug,
    title,
    blogId,
    websiteId,
    timestamp: new Date(),
  });
};

// ========================
// MENU MANAGEMENT
// ========================
export const createMenu = ({ userId, menuName, menuId, websiteId, location }) => {
  emitEvent("MENU_CREATED", {
    userId,
    menuName,
    menuId,
    websiteId,
    location: location || "header",
    timestamp: new Date(),
  });
};

export const updateMenu = ({ userId, menuName, menuId, websiteId, location }) => {
  emitEvent("MENU_UPDATED", {
    userId,
    menuName,
    menuId,
    websiteId,
    location: location || "header",
    timestamp: new Date(),
  });
};

export const deleteMenu = ({ userId, menuName, menuId, websiteId }) => {
  emitEvent("MENU_DELETED", {
    userId,
    menuName,
    menuId,
    websiteId,
    timestamp: new Date(),
  });
};

// ========================
// FOOTER MANAGEMENT
// ========================
export const createFooter = ({ userId, footerName, footerId, websiteId }) => {
  emitEvent("FOOTER_CREATED", {
    userId,
    footerName,
    footerId,
    websiteId,
    timestamp: new Date(),
  });
};

export const updateFooter = ({ userId, footerName, footerId, websiteId }) => {
  emitEvent("FOOTER_UPDATED", {
    userId,
    footerName,
    footerId,
    websiteId,
    timestamp: new Date(),
  });
};

export const deleteFooter = ({ userId, footerName, footerId, websiteId }) => {
  emitEvent("FOOTER_DELETED", {
    userId,
    footerName,
    footerId,
    websiteId,
    timestamp: new Date(),
  });
};

// ========================
// SEO MANAGEMENT
// ========================
export const createSEO = ({ userId, websiteName, seoId, websiteId }) => {
  emitEvent("SEO_CREATED", {
    userId,
    websiteName: websiteName || "Unknown Website",
    seoId,
    websiteId,
    timestamp: new Date(),
  });
};

export const updateSEO = ({ userId, websiteName, seoId, websiteId }) => {
  emitEvent("SEO_UPDATED", {
    userId,
    websiteName: websiteName || "Unknown Website",
    seoId,
    websiteId,
    timestamp: new Date(),
  });
};

export const deleteSEO = ({ userId, websiteName, seoId, websiteId }) => {
  emitEvent("SEO_DELETED", {
    userId,
    websiteName: websiteName || "Unknown Website",
    seoId,
    websiteId,
    timestamp: new Date(),
  });
};

// ========================
// FORM MANAGEMENT
// ========================
export const createForm = ({ userId, formName, formId, websiteId }) => {
  emitEvent("FORM_CREATED", {
    userId,
    formName,
    formId,
    websiteId,
    timestamp: new Date(),
  });
};

export const updateForm = ({ userId, formName, formId, websiteId }) => {
  emitEvent("FORM_UPDATED", {
    userId,
    formName,
    formId,
    websiteId,
    timestamp: new Date(),
  });
};

export const deleteForm = ({ userId, formName, formId, websiteId }) => {
  emitEvent("FORM_DELETED", {
    userId,
    formName,
    formId,
    websiteId,
    timestamp: new Date(),
  });
};

// ========================
// MEDIA MANAGEMENT
// ========================
export const createMedia = ({ userId, mediaName, mediaId, websiteId }) => {
  emitEvent("MEDIA_CREATED", {
    userId,
    mediaName,
    mediaId,
    websiteId,
    timestamp: new Date(),
  });
};

export const deleteMedia = ({ userId, mediaName, mediaId, websiteId }) => {
  emitEvent("MEDIA_DELETED", {
    userId,
    mediaName,
    mediaId,
    websiteId,
    timestamp: new Date(),
  });
};

// ========================
// BACKUP MANAGEMENT
// ========================
export const createBackup = ({ userId, backupName, backupId, websiteId }) => {
  emitEvent("BACKUP_CREATED", {
    userId,
    backupName,
    backupId,
    websiteId,
    timestamp: new Date(),
  });
};

export const restoreBackup = ({ userId, backupName, backupId, websiteId }) => {
  emitEvent("BACKUP_RESTORED", {
    userId,
    backupName,
    backupId,
    websiteId,
    timestamp: new Date(),
  });
};

export const deleteBackup = ({ userId, backupName, backupId, websiteId }) => {
  emitEvent("BACKUP_DELETED", {
    userId,
    backupName,
    backupId,
    websiteId,
    timestamp: new Date(),
  });
};

// ========================
// EXPORT ALL FUNCTIONS
// ========================
export const cmsEventService = {
  // User
  loginUser,
  registerUser,
  logoutUser,

  // Website
  createWebsite,
  updateWebsite,
  deleteWebsite,

  // Page
  createPage,
  updatePage,
  deletePage,

  // Blog
  createBlog,
  updateBlog,
  deleteBlog,

  // Menu
  createMenu,
  updateMenu,
  deleteMenu,

  // Footer
  createFooter,
  updateFooter,
  deleteFooter,

  // SEO
  createSEO,
  updateSEO,
  deleteSEO,

  // Form
  createForm,
  updateForm,
  deleteForm,
  createMedia,
  deleteMedia,

  // Backup
  createBackup,
  restoreBackup,
  deleteBackup,
};

export default cmsEventService;
