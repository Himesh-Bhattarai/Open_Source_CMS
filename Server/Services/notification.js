// services/notification.service.js
import { onEvent } from "../core/eventBus.js";
import Notification from "../Models/Notification/Notification.js";

// Helper function to create notification
async function createNotification({ userId, type, title, message, entity }) {
  return Notification.create({
    userId,
    type, // CREATION, UPDATE, DELETION, INFO
    title,
    message,
    entity: entity || null,
    read: false,
    createdAt: new Date(),
  });
}

// -------------------------
// USER EVENTS
// -------------------------
onEvent("USER_LOGIN_SUCCESS", async ({ userId, email, timestamp }) => {
  await createNotification({
    userId,
    type: "INFO",
    title: "Login Successful",
    message: `You have logged in successfully from ${email}`,
    entity: { type: "user", action: "login" },
  });
});

onEvent("USER_REGISTER_SUCCESS", async ({ userId, email, name, timestamp }) => {
  await createNotification({
    userId,
    type: "INFO",
    title: "Registration Successful",
    message: `Welcome ${name}! Your account has been created successfully`,
    entity: { type: "user", action: "register" },
  });
});

onEvent("USER_LOGOUT_SUCCESS", async ({ userId, timestamp }) => {
  await createNotification({
    userId,
    type: "INFO",
    title: "Logout Successful",
    message: "You have logged out successfully",
    entity: { type: "user", action: "logout" },
  });
});

// -------------------------
// WEBSITE EVENTS
// -------------------------
onEvent("WEBSITE_CREATED", async ({ userId, domain, name, websiteId, timestamp }) => {
  await createNotification({
    userId,
    type: "CREATION",
    title: "Website Created",
    message: `Website "${name}" has been created. Domain: ${domain}`,
    entity: { type: "website", id: websiteId, domain },
  });
});

onEvent("WEBSITE_UPDATED", async ({ userId, domain, name, websiteId, timestamp }) => {
  await createNotification({
    userId,
    type: "UPDATE",
    title: "Website Updated",
    message: `Website "${name}" has been updated.`,
    entity: { type: "website", id: websiteId, domain },
  });
});

onEvent("WEBSITE_DELETED", async ({ userId, domain, name, websiteId, timestamp }) => {
  await createNotification({
    userId,
    type: "DELETION",
    title: "Website Deleted",
    message: `Website "${name}" has been deleted.`,
    entity: { type: "website", id: websiteId, domain },
  });
});

// -------------------------
// PAGE EVENTS
// -------------------------
onEvent("PAGE_CREATED", async ({ userId, slug, title, pageId, websiteId, timestamp }) => {
  await createNotification({
    userId,
    type: "CREATION",
    title: "Page Created",
    message: `Page "${title}" with slug "${slug}" has been created.`,
    entity: { type: "page", id: pageId, slug },
  });
});

onEvent("PAGE_UPDATED", async ({ userId, slug, title, pageId, websiteId, timestamp }) => {
  await createNotification({
    userId,
    type: "UPDATE",
    title: "Page Updated",
    message: `Page "${title}" with slug "${slug}" has been updated.`,
    entity: { type: "page", id: pageId, slug },
  });
});

onEvent("PAGE_DELETED", async ({ userId, slug, title, pageId, websiteId, timestamp }) => {
  await createNotification({
    userId,
    type: "DELETION",
    title: "Page Deleted",
    message: `Page "${title}" with slug "${slug}" has been deleted.`,
    entity: { type: "page", id: pageId, slug },
  });
});

// -------------------------
// BLOG EVENTS
// -------------------------
onEvent("BLOG_CREATED", async ({ userId, slug, title, blogId, websiteId, timestamp }) => {
  await createNotification({
    userId,
    type: "CREATION",
    title: "Blog Created",
    message: `Blog "${title}" has been created.`,
    entity: { type: "blog", id: blogId, slug },
  });
});

onEvent("BLOG_UPDATED", async ({ userId, slug, title, blogId, websiteId, timestamp }) => {
  await createNotification({
    userId,
    type: "UPDATE",
    title: "Blog Updated",
    message: `Blog "${title}" has been updated.`,
    entity: { type: "blog", id: blogId, slug },
  });
});

onEvent("BLOG_DELETED", async ({ userId, slug, title, blogId, websiteId, timestamp }) => {
  await createNotification({
    userId,
    type: "DELETION",
    title: "Blog Deleted",
    message: `Blog "${title}" has been deleted.`,
    entity: { type: "blog", id: blogId, slug },
  });
});

// -------------------------
// MENU EVENTS
// -------------------------
onEvent("MENU_CREATED", async ({ userId, menuName, menuId, websiteId, location, timestamp }) => {
  await createNotification({
    userId,
    type: "CREATION",
    title: "Menu Created",
    message: `Menu "${menuName}" has been created in ${location}.`,
    entity: { type: "menu", id: menuId, name: menuName },
  });
});

onEvent("MENU_UPDATED", async ({ userId, menuName, menuId, websiteId, location, timestamp }) => {
  await createNotification({
    userId,
    type: "UPDATE",
    title: "Menu Updated",
    message: `Menu "${menuName}" has been updated.`,
    entity: { type: "menu", id: menuId, name: menuName },
  });
});

onEvent("MENU_DELETED", async ({ userId, menuName, menuId, websiteId, timestamp }) => {
  await createNotification({
    userId,
    type: "DELETION",
    title: "Menu Deleted",
    message: `Menu "${menuName}" has been deleted.`,
    entity: { type: "menu", id: menuId, name: menuName },
  });
});

// -------------------------
// FOOTER EVENTS
// -------------------------
onEvent("FOOTER_CREATED", async ({ userId, footerName, footerId, websiteId, timestamp }) => {
  await createNotification({
    userId,
    type: "CREATION",
    title: "Footer Created",
    message: `Footer "${footerName}" has been created.`,
    entity: { type: "footer", id: footerId, name: footerName },
  });
});

onEvent("FOOTER_UPDATED", async ({ userId, footerName, footerId, websiteId, timestamp }) => {
  await createNotification({
    userId,
    type: "UPDATE",
    title: "Footer Updated",
    message: `Footer "${footerName}" has been updated.`,
    entity: { type: "footer", id: footerId, name: footerName },
  });
});

onEvent("FOOTER_DELETED", async ({ userId, footerName, footerId, websiteId, timestamp }) => {
  await createNotification({
    userId,
    type: "DELETION",
    title: "Footer Deleted",
    message: `Footer "${footerName}" has been deleted.`,
    entity: { type: "footer", id: footerId, name: footerName },
  });
});

// -------------------------
// SEO EVENTS
// -------------------------
onEvent("SEO_CREATED", async ({ userId, websiteName, seoId, websiteId, timestamp }) => {
  await createNotification({
    userId,
    type: "CREATION",
    title: "SEO Created",
    message: `SEO settings created for website "${websiteName}".`,
    entity: { type: "seo", id: seoId, website: websiteName },
  });
});

onEvent("SEO_UPDATED", async ({ userId, websiteName, seoId, websiteId, timestamp }) => {
  await createNotification({
    userId,
    type: "UPDATE",
    title: "SEO Updated",
    message: `SEO settings updated for website "${websiteName}".`,
    entity: { type: "seo", id: seoId, website: websiteName },
  });
});

onEvent("SEO_DELETED", async ({ userId, websiteName, seoId, websiteId, timestamp }) => {
  await createNotification({
    userId,
    type: "DELETION",
    title: "SEO Deleted",
    message: `SEO settings deleted for website "${websiteName}".`,
    entity: { type: "seo", id: seoId, website: websiteName },
  });
});

// -------------------------
// FORM EVENTS
// -------------------------
onEvent("FORM_CREATED", async ({ userId, formName, formId, websiteId, timestamp }) => {
  await createNotification({
    userId,
    type: "CREATION",
    title: "Form Created",
    message: `Form "${formName}" has been created.`,
    entity: { type: "form", id: formId, name: formName },
  });
});

onEvent("FORM_UPDATED", async ({ userId, formName, formId, websiteId, timestamp }) => {
  await createNotification({
    userId,
    type: "UPDATE",
    title: "Form Updated",
    message: `Form "${formName}" has been updated.`,
    entity: { type: "form", id: formId, name: formName },
  });
});

onEvent("FORM_DELETED", async ({ userId, formName, formId, websiteId, timestamp }) => {
  await createNotification({
    userId,
    type: "DELETION",
    title: "Form Deleted",
    message: `Form "${formName}" has been deleted.`,
    entity: { type: "form", id: formId, name: formName },
  });
});

// -------------------------
// BACKUP EVENTS
// -------------------------
onEvent("BACKUP_CREATED", async ({ userId, backupName, backupId, websiteId, timestamp }) => {
  await createNotification({
    userId,
    type: "CREATION",
    title: "Backup Created",
    message: `Backup "${backupName}" has been created.`,
    entity: { type: "backup", id: backupId, name: backupName },
  });
});

onEvent("BACKUP_RESTORED", async ({ userId, backupName, backupId, websiteId, timestamp }) => {
  await createNotification({
    userId,
    type: "UPDATE",
    title: "Backup Restored",
    message: `Backup "${backupName}" has been restored.`,
    entity: { type: "backup", id: backupId, name: backupName },
  });
});

onEvent("BACKUP_DELETED", async ({ userId, backupName, backupId, websiteId, timestamp }) => {
  await createNotification({
    userId,
    type: "DELETION",
    title: "Backup Deleted",
    message: `Backup "${backupName}" has been deleted.`,
    entity: { type: "backup", id: backupId, name: backupName },
  });
});

// Export the notification service
export const notificationService = {
  createNotification,
};

export default notificationService;
