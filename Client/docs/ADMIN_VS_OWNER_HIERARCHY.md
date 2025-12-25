# Platform Admin vs Website Owner - Role Hierarchy

## The Two-Tier System Explained

ContentFlow uses a **two-tier role system** to separate platform management from website management.

---

## Tier 1: Platform Level (CMS Developer)

### **Platform Admin**
**Who they are:** The CMS platform developer/owner who built and operates ContentFlow

**What they control:**
- The entire ContentFlow platform
- All tenant websites created on the platform
- Platform-wide settings and configurations
- User account creation and tenant assignments
- Billing and subscription management
- Platform analytics and monitoring

**Real-world example:**
- **You** (the developer) are the Platform Admin
- You create the ContentFlow platform
- You acquire clients who want websites
- You create tenant accounts for each client
- You assign an "Owner" from their team to manage their site

**Dashboard access:**
```
/cms → Platform Admin Dashboard
├── Tenants (All Websites)
│   ├── ACME Corp (acme.example.com)
│   ├── Smith Legal (smithlaw.example.com)
│   └── Joe's Pizza (joespizza.example.com)
├── Platform Settings
├── Billing & Analytics
└── All Content Across All Tenants
```

**Permissions:**
- ✅ Create/delete tenant websites
- ✅ Access any tenant's dashboard
- ✅ Modify any content on any website
- ✅ Change platform-wide settings
- ✅ Assign website owners to clients
- ✅ View analytics for all tenants

---

## Tier 2: Tenant Level (Client Team)

### **Owner** (Assigned by Platform Admin)
**Who they are:** The client's main contact person assigned by you (the platform admin)

**What they control:**
- **Only their own website** (completely isolated from other tenants)
- Their website's theme, settings, and content
- Team members who can access their website
- Their website's pages, blog, menus, footer
- SEO and analytics for their site

**Real-world example:**
- You (Platform Admin) sign a contract with ACME Corporation
- You create a tenant: "acme-corp"
- You assign their Marketing Director as the "Owner"
- Marketing Director logs in and only sees ACME's website dashboard
- They can invite their team (managers, editors)

**Dashboard access:**
```
/cms → Tenant Dashboard (ACME Corp Only)
├── Your Website: ACME Corp
│   ├── Pages
│   ├── Blog Posts
│   ├── Media Library
│   ├── Menus & Footer
│   ├── Theme Settings
│   └── Team Members
└── (Cannot see other tenants)
```

**Permissions:**
- ✅ Manage all content for their website
- ✅ Customize their website's theme
- ✅ Invite team members (managers, editors, viewers)
- ✅ Publish content to their website
- ✅ Configure SEO and settings for their site
- ❌ Cannot see or access other tenant websites
- ❌ Cannot create new tenant websites
- ❌ Cannot access platform settings

### **Manager** (Invited by Owner)
**Who they are:** Team members who manage day-to-day content

**Permissions:**
- ✅ Edit and publish content
- ✅ Manage pages, blog, media
- ✅ Edit menus and footer
- ❌ Cannot change theme or settings
- ❌ Cannot invite/remove team members

### **Editor** (Invited by Owner)
**Who they are:** Content creators and writers

**Permissions:**
- ✅ Create and edit content (draft only)
- ✅ Upload media
- ❌ Cannot publish (needs approval)
- ❌ Cannot change any settings

### **Viewer** (Invited by Owner)
**Who they are:** Stakeholders who need read-only access

**Permissions:**
- ✅ View all content and analytics
- ❌ Cannot edit or publish anything

---

## Visual Hierarchy

```
Platform Admin (You - CMS Developer)
│
├── Tenant 1: ACME Corp
│   ├── Owner (Client's Marketing Director)
│   ├── Manager (Content Manager)
│   ├── Editor (Copywriter)
│   └── Viewer (CEO)
│
├── Tenant 2: Smith Legal
│   ├── Owner (Law Firm Partner)
│   └── Editor (Paralegal)
│
└── Tenant 3: Joe's Pizza
    └── Owner (Restaurant Owner)
```

---

## Workflow Example

### Scenario: You Sign a New Client

**Step 1: Platform Admin (You) Creates Tenant**
```
1. You sign contract with ACME Corporation
2. You log in as Platform Admin
3. Navigate to "Tenants" → "New Tenant"
4. Create tenant:
   - Name: ACME Corporation
   - Domain: acme.example.com
   - Owner Email: marketing@acme.com
5. Click "Create Tenant"
```

**Step 2: Client Receives Access**
```
1. Marketing Director at ACME receives email invitation
2. They create their password
3. They log in to ContentFlow
4. They automatically see ONLY their website dashboard
5. They see banner: "Your Website: ACME Corporation"
```

**Step 3: Client Invites Their Team**
```
1. Owner goes to "Users & Roles"
2. Invites:
   - Content Manager (Manager role)
   - Copywriter (Editor role)
   - CEO (Viewer role)
3. Each team member logs in and sees same isolated dashboard
4. Each has different permissions based on role
```

**Step 4: Client Manages Website**
```
1. Owner customizes theme with brand colors
2. Manager creates pages and blog posts
3. Editor writes content (saves as drafts)
4. Manager reviews and publishes
5. Viewer monitors analytics
```

**All happen within ACME's isolated tenant. They never see:**
- Smith Legal's content
- Joe's Pizza's pages
- Other tenant websites
- Platform admin features

---

## Key Benefits of This System

### For You (Platform Admin):
- **Scalability:** Add unlimited clients without conflicts
- **Control:** Full oversight of all tenants from one dashboard
- **Revenue:** Charge each client separately (SaaS model)
- **Efficiency:** One platform, many customers

### For Clients (Website Owners):
- **Simplicity:** Only see their own website, not overwhelmed
- **Independence:** Full control of their content
- **Security:** Complete isolation from other clients
- **Collaboration:** Can invite their team with appropriate permissions

### For Security:
- **Data Isolation:** Each tenant's data completely separated by tenant_id
- **No Cross-Contamination:** Client A cannot access Client B's data
- **Permission Boundaries:** Clear separation of platform vs tenant permissions
- **Audit Trail:** Track who (platform admin vs tenant user) made changes

---

## Technical Implementation

### Database Level Isolation
Every piece of content has a `tenant_id`:

```javascript
// Example: Page document
{
  "_id": "page-123",
  "tenant_id": "acme-corp",  // ← Ensures isolation
  "title": "About Us",
  "content": [...]
}
```

When tenant user queries database:
```javascript
// Automatic filtering by tenant_id
db.pages.find({ tenant_id: currentUser.tenantId })
```

When platform admin queries:
```javascript
// Can access all tenants
db.pages.find({}) // All pages from all tenants
// OR
db.pages.find({ tenant_id: "acme-corp" }) // Specific tenant
```

### UI Level Separation

**Platform Admin sees:**
```tsx
<Sidebar>
  <TenantList /> {/* All websites */}
  <PlatformSettings />
</Sidebar>
```

**Tenant User sees:**
```tsx
<Sidebar>
  <TenantBanner tenant="ACME Corp" /> {/* Their website only */}
  <ContentMenu /> {/* Pages, Blog, Media */}
  <GlobalMenu /> {/* Menus, Footer, Theme */}
</Sidebar>
```

---

## Switching Between Roles (Testing)

To test different role views, edit `lib/auth-context.tsx`:

```typescript
// Test as Platform Admin
const [user, setUser] = useState<User | null>({
  id: "1",
  name: "Sarah K.",
  email: "sarah@example.com",
  role: "platform_admin",
  tenantId: undefined,
  tenantName: undefined,
})

// Test as Website Owner (Client)
const [user, setUser] = useState<User | null>({
  id: "2",
  name: "John Smith",
  email: "john@acme.com",
  role: "owner",
  tenantId: "acme-corp",
  tenantName: "ACME Corporation",
})

// Test as Editor (Client's team member)
const [user, setUser] = useState<User | null>({
  id: "3",
  name: "Jane Doe",
  email: "jane@acme.com",
  role: "editor",
  tenantId: "acme-corp",
  tenantName: "ACME Corporation",
})
```

---

## Summary

| Aspect | Platform Admin | Website Owner |
|--------|---------------|---------------|
| **Who assigns them?** | Self (you created the platform) | Platform Admin assigns |
| **What they manage** | Entire platform + all tenants | Only their website |
| **Dashboard view** | All websites list | Single website content |
| **Can create tenants?** | ✅ Yes | ❌ No |
| **Can invite users?** | ✅ Yes (for any tenant) | ✅ Yes (only for their tenant) |
| **Data access** | All tenants' data | Only their tenant's data |
| **Real-world role** | CMS Developer/Platform Owner | Client/Customer |

**Bottom line:** You (Platform Admin) are the SaaS provider. Website Owners are your customers who get isolated dashboards to manage only their site.
