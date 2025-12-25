# Role-Based Dashboard System

## Overview

ContentFlow now has **two different dashboard experiences** based on user role:

1. **Platform Admin Dashboard** - For platform owners managing multiple websites
2. **Tenant Dashboard** - For website owners/editors managing their own site

Users are automatically routed to the correct dashboard based on their role and tenant association.

---

## How It Works

### Authentication Context

The system uses React Context (`AuthProvider`) to manage user state and determine dashboard access:

```typescript
export type UserRole = "platform_admin" | "owner" | "manager" | "editor" | "viewer"

interface User {
  id: string
  name: string
  role: UserRole
  tenantId?: string    // null for platform admins
  tenantName?: string  // null for platform admins
}
```

### Role Detection

- **Platform Admin**: `role === "platform_admin"` AND `tenantId === null`
- **Tenant User**: Any role (owner/manager/editor/viewer) AND `tenantId !== null`

---

## Dashboard Differences

### Platform Admin Dashboard (`/cms`)

**What They See:**
- Overview of ALL websites (tenants) on the platform
- Total websites, users, pages across all tenants
- Recent website activity
- Platform-wide statistics

**Navigation:**
```
- Dashboard
- All Websites     (manages all tenant sites)
- Platform Settings (global platform config)
- All Users        (users across all tenants)
```

**Use Case:** SaaS platform owner monitoring the entire service

---

### Tenant Dashboard (`/cms`)

**What They See:**
- Overview of ONLY their website
- Their website's pages, posts, media stats
- Pending changes for their site
- Team activity within their website

**Navigation:**
```
- Dashboard
- Content          (pages, blog, collections)
  - Pages
  - Blog Posts
  - Collections
  - Content Types
- Global           (site-wide settings)
  - Menus
  - Footer
  - Layout & Theme
  - SEO Settings
- Templates
- Theme
- Media Library
- Team            (invite team members)
- Settings        (their website settings)
```

**Visual Indicator:**
A blue banner shows at the top of the sidebar:
```
┌────────────────────────────┐
│ 🏢 Your Website            │
│ ACME Corporation           │
│ acme-corp                  │
└────────────────────────────┘
```

**Use Case:** Business owner managing their own website

---

## Testing Different Roles

To test different dashboard views, modify the mock user in `lib/auth-context.tsx`:

### Test as Platform Admin
```typescript
const [user, setUser] = useState<User | null>({
  id: "1",
  name: "Platform Admin",
  role: "platform_admin",
  tenantId: undefined,  // No tenant = platform admin
})
```

### Test as Tenant Owner
```typescript
const [user, setUser] = useState<User | null>({
  id: "2",
  name: "John Doe",
  role: "owner",
  tenantId: "acme-corp",
  tenantName: "ACME Corporation",
})
```

### Test as Editor (Limited Permissions)
```typescript
const [user, setUser] = useState<User | null>({
  id: "3",
  name: "Jane Writer",
  role: "editor",
  tenantId: "acme-corp",
  tenantName: "ACME Corporation",
})
```

---

## Visual Differences

| Feature | Platform Admin | Tenant User |
|---------|---------------|-------------|
| Dashboard Title | "Platform Dashboard" | "Welcome back, [Name]!" |
| Stats | All sites combined | Their site only |
| Primary Action | "View All Websites" | "New Page" / "New Post" |
| Sidebar Context Banner | None | Shows tenant name |
| Navigation Scope | Platform-wide | Tenant-specific |
| Role Badge | Crown icon (👑) | Role name only |

---

## Client Use Case Example

**Scenario:** ACME Corporation is a client with an existing website.

### Login Experience:

1. **Client logs in** with credentials
2. System checks: `user.tenantId === "acme-corp"` → Tenant User
3. **Redirected to Tenant Dashboard**
4. Sees sidebar banner: "Your Website: ACME Corporation"
5. Navigation shows only content management tools (not platform admin)

### Editing Navigation:

1. Click **"Global"** → **"Menus"** in sidebar
2. Edit "Main Navigation" menu
3. Add/remove menu items, reorder
4. Click **"Save Draft"** → **"Publish"**
5. Changes push to API: `POST /api/v1/acme-corp/menu`
6. Live website automatically updates

### No Code Access:

- Client NEVER sees code
- Client NEVER sees other tenants' websites
- Client ONLY manages content through visual editors
- All changes update database (MongoDB/PostgreSQL)
- API delivers content to their live site

---

## Answer to Your Question

> "When a client who is an editor logs in, do they get a different dashboard?"

**YES!** Here's exactly what happens:

### Platform Admin Login:
```
Login → Check Role → "platform_admin" → Platform Admin Dashboard
Shows: All websites, all users, platform settings
```

### Client (Owner/Manager/Editor) Login:
```
Login → Check Role → "owner/manager/editor" + tenantId → Tenant Dashboard
Shows: ONLY their website content, ONLY their team, tenant-specific settings
```

### Key Differences:

1. **Different Navigation** - Admins see platform tools, clients see content tools
2. **Different Data** - Admins see all tenants, clients see only their data
3. **Visual Indicator** - Clients see a "Your Website" banner with their site name
4. **Scoped Permissions** - All queries filter by `tenantId` to ensure data isolation

### When Client Edits Navbar:

1. Client logs in → Sees Tenant Dashboard
2. Clicks "Global" → "Menus"
3. Edits "Main Navigation"
4. Saves → Data goes to: `menus` collection with `{ tenantId: "acme-corp", ... }`
5. API endpoint: `GET /api/v1/acme-corp/menu` reads ONLY their tenant's menu
6. Live site fetches from API and renders updated menu
7. **Zero code touched, zero other sites affected**

---

## Security & Isolation

Every database query includes tenant filtering:

```javascript
// Example: Get pages for tenant
db.pages.find({ 
  tenantId: user.tenantId,  // Automatic filter
  status: "published" 
})

// Client with tenantId="acme-corp" can ONLY see:
// - Pages where tenantId="acme-corp"
// - Menus where tenantId="acme-corp"
// - Media where tenantId="acme-corp"
```

This ensures complete data isolation between clients.

---

## Production Integration

In production, replace the mock user with real authentication:

```typescript
// lib/auth-context.tsx
const [user, setUser] = useState<User | null>(null)

useEffect(() => {
  // Fetch from your auth system
  const fetchUser = async () => {
    const response = await fetch('/api/auth/me')
    const userData = await response.json()
    setUser(userData)
  }
  fetchUser()
}, [])
```

The system will automatically show the correct dashboard based on the authenticated user's role and tenant association.
