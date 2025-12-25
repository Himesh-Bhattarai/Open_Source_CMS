# Two-Role System: Admin vs Owner

## Role Hierarchy

ContentFlow uses a simple **2-role system**:

1. **Admin** (Platform Administrator) - You, the CMS developer
2. **Owner** (Website Owner) - Your clients

---

## Admin (Platform Administrator)

**Who:** You, the CMS platform owner/developer

**Full Access To:**

### Website Management
- View all client websites in one dashboard
- Create new websites for clients
- Delete/suspend websites
- Assign website ownership to clients
- View all websites' content and settings

### System Administration
- Platform-wide analytics (all websites combined)
- System activity logs (all actions across all sites)
- Global user management (see all users across all websites)
- Platform settings (billing, storage, API limits)
- System monitoring and health checks

### Client Support
- Access any client's dashboard to help them
- Make changes on behalf of clients
- View client activity and usage

**Navigation Structure:**
```
Dashboard (platform overview)
├── Websites
│   ├── All Websites (list of all client sites)
│   └── Create New (assign to client)
├── System
│   ├── Platform Analytics (all sites)
│   ├── System Logs (all activity)
│   ├── All Users (across all sites)
│   └── Platform Settings
```

---

## Owner (Website Owner)

**Who:** Your clients who purchased a website

**Access Limited To Their Own Website Only:**

### Content Management
- Create/edit/delete their own pages
- Manage their own blog posts
- Create custom content types and collections
- Upload and manage their media library

### Website Customization
- Edit navigation menus (if integrated)
- Customize footer (if integrated)
- Change theme colors and fonts
- Configure SEO settings
- Manage forms and submissions

### Team Management
- Invite team members (future feature)
- View their own activity logs
- See their own analytics

### Tools
- Backup and restore their website
- View notifications
- Access integration guides

**Cannot Access:**
- Other clients' websites
- Platform-wide settings
- System administration
- Other tenants' data

**Navigation Structure:**
```
Dashboard (their website overview)
├── Content
│   ├── Pages
│   ├── Blog Posts
│   ├── Collections
│   └── Content Types
├── Global (highlighted - site-wide changes)
│   ├── Menus
│   ├── Footer
│   ├── SEO Settings
│   └── Layout & Theme
├── Theme
├── Forms
├── Media Library
├── Backups
├── Analytics (their site only)
├── Activity (their actions only)
├── Notifications
├── Team (their members only)
└── Integrations (API status)
```

---

## How Assignment Works

### Step 1: Admin Creates Website
```
Admin logs in → Goes to "Websites" → Clicks "Create New"
Fills in:
- Website Name: "ACME Corporation"
- Domain: "acme.example.com"
- Owner Email: "client@acmecorp.com"
- Initial Theme/Template
```

### Step 2: Client Gets Access
```
Client receives email invitation
Client creates account and sets password
Client logs in → Sees only their website dashboard
```

### Step 3: Client Manages Website
```
Client can now:
- Add content
- Customize theme
- Upload media
- Configure settings
- Invite their team members (future)
```

### Admin Can Always Help
```
Admin can log in to any client's site to provide support
Admin sees a banner: "Viewing as: ACME Corporation"
```

---

## Key Differences

| Feature | Admin | Owner |
|---------|-------|-------|
| View all websites | ✅ Yes | ❌ No |
| Create websites | ✅ Yes | ❌ No |
| Platform settings | ✅ Yes | ❌ No |
| System logs | ✅ All sites | ✅ Their site only |
| Analytics | ✅ All sites | ✅ Their site only |
| Content management | ✅ All sites | ✅ Their site only |
| Theme customization | ✅ All sites | ✅ Their site only |
| User management | ✅ Global | ✅ Their team only |
| Delete website | ✅ Yes | ❌ No |
| API access | ✅ All tenants | ✅ Their tenant only |

---

## Testing in Development

In `lib/auth-context.tsx`, change the mock user's role:

```tsx
// To test as Platform Admin:
const [user, setUser] = useState<User | null>({
  id: "1",
  name: "Admin User",
  email: "admin@contentflow.com",
  role: "admin", // ← Change this
})

// To test as Website Owner:
const [user, setUser] = useState<User | null>({
  id: "2",
  name: "Client Name",
  email: "client@example.com",
  role: "owner", // ← Change this
  tenantId: "acme-corp",
  tenantName: "ACME Corporation",
  integrations: {
    menu: true,
    footer: false,
    pages: true,
    blog: true,
    theme: true,
    seo: false,
  },
})
```

The dashboard and navigation will automatically adapt to show the correct view.

---

## Security

1. **Admin cannot see:**
   - Client passwords (hashed in database)
   - Private API keys (encrypted)

2. **Owner cannot see:**
   - Other tenants' data (filtered by tenant_id in database)
   - Platform admin features (UI hidden + API blocked)
   - System-level settings

3. **Both must authenticate:**
   - Login required for all /cms routes
   - Session-based authentication
   - Auto-logout after inactivity

---

This simple 2-role system keeps the platform secure while giving you full control and your clients the independence to manage their own websites.
