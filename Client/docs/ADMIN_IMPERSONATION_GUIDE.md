# Admin Impersonation Feature - Complete Guide

## Overview

The Admin Impersonation feature allows you (the Platform Admin) to view and troubleshoot your clients' websites exactly as they see them, without losing your admin privileges.

---

## How It Works

### For Platform Admins

**Your Normal View:**
- Admin dashboard showing all websites
- Platform-wide settings and analytics
- Access to create/delete websites
- System logs and user management

**When Impersonating a Client:**
- You see their exact dashboard and navigation
- Only their website content is visible
- You can test all their features
- Easy "Exit View" button to return to admin mode

---

## How to Use

### Step 1: Start Impersonation

1. Go to **Websites** page (`/cms/tenants`)
2. Find the client's website you want to view
3. Click the **three-dot menu** (⋮) on their website card
4. Select **"View As Owner"**

### Step 2: You're Now Viewing As That Client

**Visual Indicators:**
- **Yellow banner** at the top: "Viewing as: [Client Name]"
- **Yellow badge** in sidebar showing the tenant name
- Dashboard shows their website stats only
- Navigation shows only features they have integrated

**What You Can Do:**
- Edit their pages, menus, blog posts
- Upload to their media library
- Change their theme settings
- Test their workflows
- Identify issues they're reporting

### Step 3: Exit Impersonation

Click **"Exit View"** button in the yellow banner at the top, and you'll return to your admin dashboard.

---

## Use Cases

### 1. Client Support
**Scenario:** Client says "I can't find where to add a blog post"

**Solution:**
1. Impersonate their account
2. Navigate their dashboard exactly as they see it
3. Guide them step-by-step or fix the issue yourself
4. Exit impersonation

### 2. Training New Clients
**Scenario:** New client needs onboarding

**Solution:**
1. Screen share while impersonating their account
2. Show them exactly what they'll see
3. Walk through their specific setup
4. They see the same interface you're showing

### 3. Testing Integrations
**Scenario:** Need to verify menu integration is working

**Solution:**
1. Impersonate the client
2. Check if "Menus" appears in their navigation
3. Test editing their menu
4. Confirm changes appear on their live site

### 4. Debugging Issues
**Scenario:** Client reports "My footer disappeared"

**Solution:**
1. Impersonate their account
2. Check their footer settings
3. See if they have footer integration enabled
4. Fix or explain the issue

---

## Important Notes

### Security
- Only Platform Admins can impersonate
- All actions taken while impersonating are logged with your admin credentials
- Clients cannot see that you impersonated their account
- You maintain full admin privileges even while impersonating

### Data Isolation
- When impersonating, you only see THAT client's data
- No risk of editing the wrong website
- Automatic filtering by tenant ID

### Current Session
- Impersonation is temporary (session-based)
- Closing browser exits impersonation
- Logging out exits impersonation
- Clicking "Exit View" returns to admin mode

---

## Technical Details

### How It's Implemented

**Auth Context State:**
```typescript
{
  user: { role: "admin", name: "Admin User" },
  impersonatedTenant: { 
    id: "acme-corp", 
    name: "ACME Corporation" 
  },
  isImpersonating: true
}
```

**Navigation Logic:**
```typescript
// If admin AND impersonating → show owner navigation
const navigation = isAdmin && !isImpersonating 
  ? adminNavigation 
  : getTenantNavigation()
```

**Dashboard Logic:**
```typescript
// If admin NOT impersonating → admin dashboard
// Otherwise → owner dashboard
if (isAdmin && !isImpersonating) {
  return <AdminDashboard />
}
return <OwnerDashboard />
```

---

## Quick Reference

| Your Role | Impersonating? | You See |
|-----------|----------------|---------|
| Admin | No | Platform dashboard, all websites |
| Admin | Yes | Client's dashboard, their content only |
| Owner | N/A | Their dashboard, their content only |

---

## Answer to Your Question

> "When admin of CMS login, does he/she see all things that website owner sees or what?"

**Answer:** By default, NO. As an admin, you see the platform admin dashboard with all websites.

**But with impersonation:** YES. You can click "View As Owner" on any website, and you'll see EXACTLY what that client sees - their dashboard, navigation, content, everything. This is how you can help them troubleshoot or test their setup.

---

## Testing the Feature

**To test as Admin:**
1. In `lib/auth-context.tsx`, ensure `role: "admin"`
2. Go to `/cms/tenants`
3. Click "View As Owner" on any website
4. You'll see the owner view with yellow banner
5. Click "Exit View" to return to admin dashboard

**To test as Owner:**
1. In `lib/auth-context.tsx`, change to `role: "owner"`
2. Refresh the page
3. You'll see only your website dashboard
4. No access to other websites or platform settings
