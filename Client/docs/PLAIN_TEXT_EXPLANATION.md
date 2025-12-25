# ContentFlow CMS - Database Structure Explained (Plain English)

## Overview
This document explains how ContentFlow stores all website data in MongoDB. Think of MongoDB as a filing cabinet where each type of information has its own drawer (collection).

---

## Collections (Data Storage Areas)

### 1. TENANTS (Websites)
**What it stores:** Information about each website created on the platform

**Think of it as:** A filing folder for each customer's website

**Contains:**
- Website ID (unique identifier)
- Website name (e.g., "ACME Corporation")
- Domain name (e.g., "acme.example.com")
- API key (secret password for the website to talk to the CMS)
- Owner's email address
- Status (active, suspended, or inactive)
- Plan type (free, starter, pro, enterprise)
- Settings (site name, timezone, language, date format)
- When it was created and last updated

**Example:**
```
Website #1:
- ID: "acme-corp-123"
- Name: "ACME Corporation"
- Domain: "acme.example.com"
- Owner: "john@acme.com"
- Status: "active"
- Plan: "pro"
```

**Why we need this:** So each website is completely separate and customers can't see each other's content.

---

### 2. USERS
**What it stores:** People who can log into the CMS

**Think of it as:** Employee badge system

**Contains:**
- User ID
- Email address (used to log in)
- Password (encrypted for security)
- Full name
- Profile picture URL
- Role (admin, owner, manager, editor, viewer)
- Account status (active, inactive, suspended)
- Last time they logged in
- Two-factor authentication enabled/disabled

**Example:**
```
User:
- ID: "user-456"
- Email: "sarah@acme.com"
- Name: "Sarah Johnson"
- Role: "manager"
- Status: "active"
```

**Why we need this:** To track who can access the CMS and what they're allowed to do.

---

### 3. TENANT_USERS (Team Assignments)
**What it stores:** Which users belong to which websites and their roles

**Think of it as:** Company org chart

**Contains:**
- Assignment ID
- Website ID (which website)
- User ID (which person)
- Role for THIS website (owner, manager, editor, viewer)
- Who invited them
- When they were invited
- When they accepted

**Example:**
```
Sarah works on ACME website:
- Tenant: "acme-corp-123"
- User: "user-456"
- Role: "manager"
- Invited by: John (owner)
- Accepted: Yes
```

**Why we need this:** Because one person can work on multiple websites with different roles on each.

---

### 4. MENUS (Navigation)
**What it stores:** All navigation menus (header, footer, etc.)

**Think of it as:** Table of contents for the website

**Contains:**
- Menu ID
- Website ID
- Menu name (e.g., "Main Navigation")
- Location (header, footer, mobile, sidebar)
- List of menu items:
  - Label (what visitors see)
  - Type (internal page, external link, dropdown)
  - Link URL
  - Enabled/disabled
  - Order number
  - Child items (for dropdowns)
- Status (draft or published)
- When it was published and by whom

**Example:**
```
Main Menu:
- Home (link to /)
- About (link to /about)
- Products (dropdown)
  - Software (link to /products/software)
  - Hardware (link to /products/hardware)
- Contact (link to /contact)
```

**Why we need this:** So clients can change their navigation without coding.

---

### 5. FOOTERS
**What it stores:** Website footer content and layout

**Think of it as:** Bottom section of every page

**Contains:**
- Footer ID
- Website ID
- Layout type (2-column, 3-column, 4-column, custom)
- Blocks (flexible content sections):
  - Block type (text, menu, logo, social icons, newsletter form, custom HTML)
  - Order and column position
  - Block-specific content
- Bottom bar:
  - Copyright text
  - Social media links
- Status (draft or published)

**Example:**
```
Footer:
Column 1: Company logo + about text
Column 2: Quick links menu
Column 3: Product links menu
Column 4: Contact info
Bottom: "© 2025 ACME Corp" + social icons
```

**Why we need this:** Gives clients flexibility to design their footer without code.

---

### 6. PAGES
**What it stores:** All website pages (homepage, about, etc.)

**Think of it as:** Pages of a book

**Contains:**
- Page ID
- Website ID
- Title (e.g., "About Us")
- Slug (URL path, e.g., "about-us")
- Blocks (content sections):
  - Block type (hero, text, features, gallery, etc.)
  - Order on page
  - Block data (title, text, images, etc.)
- SEO settings:
  - Meta title
  - Meta description
  - Keywords
  - Social sharing image
  - Index or hide from search engines
- Status (draft, published, scheduled)
- Published date and who published it
- Author information

**Example:**
```
About Us Page:
- Block 1: Hero with "Our Story" title
- Block 2: Text with company history
- Block 3: Team member profiles
- Block 4: Call-to-action button
SEO: "Learn about ACME Corporation"
Status: Published
```

**Why we need this:** The core of the visual page builder system.

---

### 7. BLOG_POSTS
**What it stores:** All blog articles

**Think of it as:** Magazine articles

**Contains:**
- Post ID
- Website ID
- Title
- Slug (URL)
- Content (full article text with formatting)
- Excerpt (short preview)
- Featured image
- Author
- Category
- Tags (keywords)
- SEO settings
- Status (draft, published, scheduled)
- Publish date (now or future)
- View count

**Example:**
```
Blog Post:
- Title: "10 Ways to Improve Your Website"
- Content: "In this article..."
- Category: "Web Design"
- Tags: ["tips", "design", "ux"]
- Featured Image: "/blog/website-tips.jpg"
- Status: Published
- Views: 1,247
```

**Why we need this:** Professional blogging capabilities for content marketing.

---

### 8. BLOG_CATEGORIES
**What it stores:** Blog post categories

**Think of it as:** Magazine sections

**Contains:**
- Category ID
- Website ID
- Name (e.g., "Web Design")
- Slug (URL-friendly name)
- Description
- Number of posts in category

**Why we need this:** Organize blog posts into topics.

---

### 9. MEDIA
**What it stores:** All uploaded files (images, videos, documents)

**Think of it as:** Photo album / file cabinet

**Contains:**
- File ID
- Website ID
- Filename (stored name)
- Original filename (user's name)
- File type (image/jpeg, video/mp4, etc.)
- File size (in bytes)
- Image dimensions (width and height)
- URL (where file is stored)
- Alt text (for accessibility and SEO)
- Folder organization
- Who uploaded it
- When it was uploaded

**Example:**
```
Image File:
- Name: "hero-background-2024.jpg"
- Size: 2.5 MB
- Dimensions: 1920x1080
- Folder: "Homepage"
- Alt Text: "Modern office building"
- Uploaded by: Sarah
```

**Why we need this:** Central place to manage all website files.

---

### 10. THEMES
**What it stores:** Visual styling for each website

**Think of it as:** Paint and decoration choices

**Contains:**
- Theme ID
- Website ID
- Theme name
- Colors:
  - Primary (main brand color)
  - Secondary (accent color)
  - Background
  - Text color
  - Accent color
- Typography:
  - Body font (e.g., "Inter")
  - Heading font
  - Font size
- Layout:
  - Container width
  - Spacing (tight, normal, spacious)
  - Border radius (sharp or rounded corners)
- Header settings:
  - Style (fixed, sticky, standard)
  - Variant (centered logo, left logo, split)
- Footer settings:
  - Variant (multi-column, minimal, centered)
- Custom CSS (advanced users)

**Example:**
```
Theme:
- Primary Color: Blue (#0066FF)
- Background: White
- Body Font: "Inter"
- Heading Font: "Poppins"
- Layout: Wide container, rounded corners
```

**Why we need this:** Let clients customize their website's look without coding.

---

### 11. CONTENT_TYPES (Custom Data Structures)
**What it stores:** Templates for custom content (products, team members, etc.)

**Think of it as:** Form templates

**Contains:**
- Content Type ID
- Website ID
- Name (e.g., "Products")
- Slug (URL-friendly)
- Fields (list of form fields):
  - Field name
  - Field type (text, number, image, date, etc.)
  - Required or optional
  - Order on form
  - Options (for dropdown fields)
- Icon
- Description
- System type or custom

**Example:**
```
Product Content Type:
- Field 1: Name (text, required)
- Field 2: Price (number, required)
- Field 3: Description (rich text)
- Field 4: Image (image upload)
- Field 5: In Stock (yes/no)
- Field 6: Category (dropdown)
```

**Why we need this:** Flexibility to create any type of content beyond pages and blogs.

---

### 12. COLLECTIONS (Custom Content Items)
**What it stores:** Individual items of custom content types

**Think of it as:** Filled-out forms

**Contains:**
- Item ID
- Website ID
- Content Type ID (which template)
- Data (all the filled-in fields)
- Status (draft or published)
- Publish date
- Author

**Example:**
```
Product Item (using Product content type):
Data:
- Name: "Premium Widget"
- Price: 99.99
- Description: "High-quality widget for..."
- Image: "/products/widget.jpg"
- In Stock: Yes
- Category: "Hardware"
Status: Published
```

**Why we need this:** Store the actual content for custom data structures.

---

### 13. ACTIVITY_LOGS
**What it stores:** History of everything that happens in the CMS

**Think of it as:** Security camera footage

**Contains:**
- Log ID
- Website ID
- User ID (who did it)
- Action (create, update, delete, publish, login, etc.)
- Entity type (page, blog, menu, etc.)
- Entity ID (which specific item)
- Details (what changed)
- IP address
- Browser information
- Timestamp

**Example:**
```
Activity:
- User: Sarah (manager)
- Action: Published
- Entity: Blog Post "10 Website Tips"
- Time: 2024-01-15 10:30 AM
- IP: 192.168.1.100
```

**Why we need this:** Audit trail for security and tracking changes.

---

### 14. VERSIONS (Change History)
**What it stores:** Previous versions of content for rollback

**Think of it as:** Track changes in Microsoft Word

**Contains:**
- Version ID
- Website ID
- Entity type (what was changed)
- Entity ID (which item)
- Data (complete snapshot of content at that time)
- Who made the change
- When it was saved

**Example:**
```
Version History for "About Us" page:
Version 3: 2024-01-15 (current)
Version 2: 2024-01-10 (can restore)
Version 1: 2024-01-05 (can restore)
```

**Why we need this:** Safety net to undo mistakes.

---

### 15. WEBHOOKS
**What it stores:** Connections to external services

**Think of it as:** Notification system to other apps

**Contains:**
- Webhook ID
- Website ID
- URL (where to send notifications)
- Events (what triggers the notification):
  - Page created, updated, published
  - Blog post created, updated, published
  - Menu updated
  - Footer updated
- Secret key (for security)
- Status (active or inactive)
- Last time it was triggered
- Failure count

**Example:**
```
Webhook:
- URL: "https://acme.com/api/cms-update"
- Events: [page.published, blog.published]
- Status: Active
- Last Triggered: 2 hours ago
```

**Why we need this:** Notify external systems when content changes.

---

## How It All Works Together

### Example: Client Updates Their Navigation

1. **Client logs in** → Check USERS and TENANT_USERS
2. **Client edits main menu** → Load from MENUS
3. **Client adds "Products" link** → Update MENUS data
4. **Client saves as draft** → MENUS status = "draft"
5. **Client previews** → API reads draft MENUS
6. **Client publishes** → MENUS status = "published", publishedAt = now
7. **System logs action** → Create entry in ACTIVITY_LOGS
8. **System saves version** → Create snapshot in VERSIONS
9. **System triggers webhook** → Notify external site via WEBHOOKS
10. **Visitor views site** → API reads published MENUS and displays new navigation

### Example: Multi-Tenant Isolation

**ACME Corp (tenant-123) has:**
- 5 pages (in PAGES with tenantId: tenant-123)
- 10 blog posts (in BLOG_POSTS with tenantId: tenant-123)
- 1 main menu (in MENUS with tenantId: tenant-123)
- 50 images (in MEDIA with tenantId: tenant-123)

**Tech Solutions (tenant-456) has:**
- Different pages, posts, menus, images
- All with tenantId: tenant-456
- Completely isolated from ACME's content

**Security:** Every database query MUST filter by tenantId to ensure data isolation.

---

## Key Concepts

### 1. Tenant ID
Every piece of content is tagged with a tenant ID (website ID). This ensures:
- Content from different websites never mixes
- Queries are fast (indexed by tenant ID)
- Security and privacy

### 2. Draft vs Published
Most content has two states:
- **Draft:** Work in progress, only visible in CMS
- **Published:** Live on the website for visitors
This lets clients preview before going live.

### 3. Relationships
Data is connected:
- Pages belong to Tenants
- Blog Posts belong to Tenants and Categories
- Menus belong to Tenants
- Users can access multiple Tenants

### 4. Flexible Data (Schema.Types.Mixed)
Some fields store JSON/objects:
- **Page blocks:** Each page has different blocks with different data
- **Collection data:** Custom content types have custom fields
- **Theme settings:** Colors, fonts, etc.

This flexibility allows the CMS to handle any type of content without changing the database structure.

---

## Performance Optimizations

**Indexes:** Special markers that make searches fast
- Tenant ID + Slug: Quickly find pages by URL
- Tenant ID + Status: Quickly find published content
- Entity Type + Entity ID: Quickly find version history

**Why indexes matter:** Without them, finding one page among 100,000 would be slow. With indexes, it's instant.

---

## Summary

This database structure supports:
- Multiple isolated websites (multi-tenant)
- Flexible content (blocks and custom types)
- Team collaboration (users and roles)
- Version control (history and rollback)
- External integrations (webhooks)
- Audit trails (activity logs)

All designed so clients can build and manage professional websites without writing code.
