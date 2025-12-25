# ContentFlow CMS - API Integration Guide

## Overview

ContentFlow CMS can work in **two modes**:

### 1. Integrated Mode (Default)
- CMS manages both backend and frontend
- Everything in one Next.js application
- `/cms` = Admin dashboard
- `/site/[tenant]` = Public website
- **Best for:** New websites built from scratch

### 2. Headless Mode (API Integration)
- CMS acts as content API
- Your existing website fetches content via API
- Client edits in CMS, changes appear on their site
- **Best for:** Existing websites that want CMS features

---

## Can Client Edit Existing Website?

**YES!** Here's how:

### Scenario: Client has React/Next.js website at `myclient.com`

1. **Client creates tenant in ContentFlow CMS**
   - Tenant ID: `myclient`
   - Gets API key: `cms_live_abc123xyz`

2. **Client uses CMS to manage content**
   - Edits navbar items in Menu Builder
   - Updates footer in Footer Builder
   - Manages blog posts
   - Changes theme colors

3. **Client's website fetches from API**
   - `GET /api/v1/myclient/menu?location=header`
   - `GET /api/v1/myclient/footer`
   - `GET /api/v1/myclient/blog`

4. **Changes appear instantly**
   - Client saves in CMS → API updates → Website refreshes

---

## API Architecture

### Base URL
```
https://cms.yourplatform.com/api/v1
```

### Authentication
All API requests require API key in header:
```http
X-API-Key: cms_live_abc123xyz
```

### Rate Limits
- 1000 requests/hour per tenant
- 100 requests/minute per endpoint

---

## API Endpoints

### 1. Menu API

**GET** `/api/v1/[tenant]/menu?location=header`

Fetch navigation menu for specific location.

**Parameters:**
- `location` (optional): `header`, `footer`, `sidebar` (default: `header`)

**Response:**
```json
{
  "id": "main-nav",
  "location": "header",
  "tenant": "myclient",
  "items": [
    {
      "id": "1",
      "label": "Home",
      "type": "internal",
      "url": "/",
      "order": 1,
      "enabled": true,
      "children": []
    },
    {
      "id": "2",
      "label": "Products",
      "type": "dropdown",
      "url": "#",
      "order": 2,
      "enabled": true,
      "children": [
        {
          "id": "2-1",
          "label": "SaaS Solutions",
          "type": "internal",
          "url": "/products/saas",
          "order": 1,
          "enabled": true
        }
      ]
    }
  ],
  "lastModified": "2025-01-21T10:30:00Z",
  "publishedAt": "2025-01-21T10:30:00Z"
}
```

**Menu Item Types:**
- `internal`: Link to page on same domain
- `external`: Link to external website
- `dropdown`: Parent item with children

---

### 2. Footer API

**GET** `/api/v1/[tenant]/footer`

Fetch footer content and structure.

**Response:**
```json
{
  "id": "main-footer",
  "tenant": "myclient",
  "layout": "4-column",
  "blocks": [
    {
      "id": "block-1",
      "type": "logo",
      "column": 1,
      "order": 1,
      "data": {
        "imageUrl": "/logo.svg",
        "alt": "Company Logo",
        "text": "Building the future."
      }
    },
    {
      "id": "block-2",
      "type": "menu",
      "column": 2,
      "order": 2,
      "data": {
        "title": "Quick Links",
        "links": [
          { "label": "Home", "url": "/" },
          { "label": "About", "url": "/about" }
        ]
      }
    },
    {
      "id": "block-3",
      "type": "social",
      "column": 4,
      "order": 4,
      "data": {
        "title": "Follow Us",
        "platforms": [
          { "name": "Twitter", "url": "https://twitter.com/company", "icon": "twitter" }
        ]
      }
    }
  ],
  "bottomBar": {
    "copyright": "© 2025 Company Inc.",
    "legalLinks": [
      { "label": "Privacy", "url": "/privacy" }
    ]
  },
  "lastModified": "2025-01-21T10:30:00Z",
  "publishedAt": "2025-01-21T10:30:00Z"
}
```

**Footer Block Types:**
- `logo`: Logo + text
- `menu`: List of links
- `social`: Social media icons
- `newsletter`: Email signup form
- `text`: Rich text content

---

### 3. Pages API

**GET** `/api/v1/[tenant]/pages/[slug]`

Fetch page content by slug.

**Response:**
```json
{
  "id": "page-1",
  "tenant": "myclient",
  "slug": "home",
  "title": "Welcome to Our Platform",
  "metaDescription": "The best platform",
  "blocks": [
    {
      "id": "block-1",
      "type": "hero",
      "order": 1,
      "data": {
        "title": "Build Your Dream Website",
        "subtitle": "No code required.",
        "buttonText": "Get Started",
        "buttonLink": "/signup",
        "backgroundImage": "/images/hero.jpg"
      }
    },
    {
      "id": "block-2",
      "type": "features",
      "order": 2,
      "data": {
        "title": "Why Choose Us",
        "features": [
          {
            "icon": "zap",
            "title": "Fast",
            "description": "Lightning speed"
          }
        ]
      }
    }
  ],
  "seo": {
    "title": "Welcome | Company",
    "description": "...",
    "keywords": ["website", "builder"],
    "ogImage": "/og.jpg"
  },
  "publishedAt": "2025-01-21T10:00:00Z",
  "lastModified": "2025-01-21T10:00:00Z"
}
```

**Block Types Available:**
- `hero`, `text`, `features`, `gallery`, `cta`, `testimonials`, `team`, `contact`

---

### 4. Blog API

**GET** `/api/v1/[tenant]/blog`

Fetch blog posts with pagination.

**Parameters:**
- `limit` (optional): Posts per page (default: 10)
- `offset` (optional): Skip posts (default: 0)
- `category` (optional): Filter by category slug
- `tag` (optional): Filter by tag

**Response:**
```json
{
  "posts": [
    {
      "id": "post-1",
      "tenant": "myclient",
      "title": "Getting Started",
      "slug": "getting-started",
      "excerpt": "Learn how...",
      "content": "<p>Full HTML...</p>",
      "featuredImage": "/blog-1.jpg",
      "author": {
        "id": "user-1",
        "name": "John Doe",
        "avatar": "/john.jpg"
      },
      "category": {
        "id": "cat-1",
        "name": "Tutorials",
        "slug": "tutorials"
      },
      "tags": ["beginner", "tutorial"],
      "seo": {
        "title": "Getting Started Guide",
        "description": "..."
      },
      "publishedAt": "2025-01-15T10:00:00Z",
      "updatedAt": "2025-01-15T10:00:00Z"
    }
  ],
  "total": 25,
  "limit": 10,
  "offset": 0,
  "hasMore": true
}
```

**GET** `/api/v1/[tenant]/blog/[slug]`

Fetch single blog post by slug.

---

### 5. Theme API

**GET** `/api/v1/[tenant]/theme`

Fetch theme configuration (colors, fonts, layout).

**Response:**
```json
{
  "id": "theme-1",
  "tenant": "myclient",
  "name": "Company Theme",
  "colors": {
    "primary": "#3B82F6",
    "secondary": "#10B981",
    "background": "#FFFFFF",
    "foreground": "#000000"
  },
  "typography": {
    "fontFamily": {
      "heading": "Inter, sans-serif",
      "body": "Inter, sans-serif"
    },
    "fontSize": {
      "base": "16px",
      "h1": "48px"
    }
  },
  "layout": {
    "containerWidth": "1280px",
    "spacing": "1rem",
    "borderRadius": "8px"
  },
  "header": {
    "style": "centered",
    "position": "sticky",
    "logo": {
      "url": "/logo.svg",
      "height": "40px"
    }
  },
  "updatedAt": "2025-01-21T10:30:00Z"
}
```

---

## Integration Examples

### React/Next.js Integration

#### 1. Fetch Menu in Header Component

```tsx
// components/Header.tsx
'use client'

import { useEffect, useState } from 'react'

interface MenuItem {
  id: string
  label: string
  url: string
  children?: MenuItem[]
}

export function Header() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('https://cms.yourplatform.com/api/v1/myclient/menu?location=header', {
      headers: {
        'X-API-Key': process.env.NEXT_PUBLIC_CMS_API_KEY!
      }
    })
      .then(res => res.json())
      .then(data => {
        setMenuItems(data.items.filter(item => item.enabled))
        setLoading(false)
      })
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4">
        <ul className="flex space-x-8 py-4">
          {menuItems.map(item => (
            <li key={item.id}>
              <a href={item.url} className="hover:text-blue-600">
                {item.label}
              </a>
              {item.children && item.children.length > 0 && (
                <ul className="absolute bg-white shadow-lg mt-2">
                  {item.children.map(child => (
                    <li key={child.id}>
                      <a href={child.url} className="block px-4 py-2">
                        {child.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
```

#### 2. Fetch Footer Content

```tsx
// components/Footer.tsx
'use client'

import { useEffect, useState } from 'react'

export function Footer() {
  const [footer, setFooter] = useState<any>(null)

  useEffect(() => {
    fetch('https://cms.yourplatform.com/api/v1/myclient/footer', {
      headers: {
        'X-API-Key': process.env.NEXT_PUBLIC_CMS_API_KEY!
      }
    })
      .then(res => res.json())
      .then(data => setFooter(data))
  }, [])

  if (!footer) return null

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-4 gap-8">
          {footer.blocks.map(block => {
            if (block.type === 'logo') {
              return (
                <div key={block.id}>
                  <img src={block.data.imageUrl || "/placeholder.svg"} alt={block.data.alt} className="h-10 mb-4" />
                  <p>{block.data.text}</p>
                </div>
              )
            }
            
            if (block.type === 'menu') {
              return (
                <div key={block.id}>
                  <h3 className="font-bold mb-4">{block.data.title}</h3>
                  <ul className="space-y-2">
                    {block.data.links.map((link, i) => (
                      <li key={i}>
                        <a href={link.url} className="hover:underline">
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            }
            
            return null
          })}
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p>{footer.bottomBar.copyright}</p>
        </div>
      </div>
    </footer>
  )
}
```

#### 3. Fetch Blog Posts

```tsx
// app/blog/page.tsx
import { Suspense } from 'react'

async function getBlogPosts() {
  const res = await fetch(
    'https://cms.yourplatform.com/api/v1/myclient/blog?limit=10',
    {
      headers: {
        'X-API-Key': process.env.CMS_API_KEY!
      },
      next: { revalidate: 60 } // Cache for 60 seconds
    }
  )
  return res.json()
}

export default async function BlogPage() {
  const { posts } = await getBlogPosts()

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      
      <div className="grid md:grid-cols-3 gap-8">
        {posts.map(post => (
          <article key={post.id} className="border rounded-lg overflow-hidden">
            <img src={post.featuredImage || "/placeholder.svg"} alt={post.title} className="w-full h-48 object-cover" />
            <div className="p-6">
              <h2 className="text-xl font-bold mb-2">{post.title}</h2>
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
              <a href={`/blog/${post.slug}`} className="text-blue-600 hover:underline">
                Read more →
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
```

#### 4. Apply Theme Dynamically

```tsx
// lib/useCMSTheme.ts
'use client'

import { useEffect } from 'react'

export function useCMSTheme() {
  useEffect(() => {
    fetch('https://cms.yourplatform.com/api/v1/myclient/theme', {
      headers: {
        'X-API-Key': process.env.NEXT_PUBLIC_CMS_API_KEY!
      }
    })
      .then(res => res.json())
      .then(theme => {
        // Apply CSS variables
        document.documentElement.style.setProperty('--color-primary', theme.colors.primary)
        document.documentElement.style.setProperty('--color-secondary', theme.colors.secondary)
        document.documentElement.style.setProperty('--font-heading', theme.typography.fontFamily.heading)
      })
  }, [])
}

// In your root layout:
// app/layout.tsx
import { useCMSTheme } from '@/lib/useCMSTheme'

export default function RootLayout({ children }) {
  useCMSTheme()
  
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}
```

---

## Database Schema

### Tenants Table
```sql
CREATE TABLE tenants (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  domain VARCHAR(255) UNIQUE NOT NULL,
  api_key VARCHAR(255) UNIQUE NOT NULL,
  owner_email VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Menus Table
```sql
CREATE TABLE menus (
  id VARCHAR(255) PRIMARY KEY,
  tenant_id VARCHAR(255) REFERENCES tenants(id),
  name VARCHAR(255) NOT NULL,
  location VARCHAR(100),
  items JSON NOT NULL,
  status VARCHAR(50) DEFAULT 'draft',
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Pages Table
```sql
CREATE TABLE pages (
  id VARCHAR(255) PRIMARY KEY,
  tenant_id VARCHAR(255) REFERENCES tenants(id),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  blocks JSON NOT NULL,
  seo JSON,
  status VARCHAR(50) DEFAULT 'draft',
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(tenant_id, slug)
);
```

### Blog Posts Table
```sql
CREATE TABLE blog_posts (
  id VARCHAR(255) PRIMARY KEY,
  tenant_id VARCHAR(255) REFERENCES tenants(id),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image VARCHAR(500),
  author_id VARCHAR(255) REFERENCES users(id),
  category_id VARCHAR(255),
  tags JSON,
  seo JSON,
  status VARCHAR(50) DEFAULT 'draft',
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(tenant_id, slug)
);
```

### Footers Table
```sql
CREATE TABLE footers (
  id VARCHAR(255) PRIMARY KEY,
  tenant_id VARCHAR(255) REFERENCES tenants(id),
  layout VARCHAR(100),
  blocks JSON NOT NULL,
  bottom_bar JSON,
  status VARCHAR(50) DEFAULT 'draft',
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Themes Table
```sql
CREATE TABLE themes (
  id VARCHAR(255) PRIMARY KEY,
  tenant_id VARCHAR(255) REFERENCES tenants(id),
  name VARCHAR(255),
  colors JSON NOT NULL,
  typography JSON NOT NULL,
  layout JSON NOT NULL,
  header JSON,
  footer JSON,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## Webhooks (Optional)

Subscribe to real-time updates when content changes.

**POST** `/api/v1/webhooks/subscribe`

```json
{
  "tenant": "myclient",
  "url": "https://myclient.com/api/cms-webhook",
  "events": ["menu.updated", "footer.updated", "page.published"]
}
```

When content updates, we POST to your webhook:

```json
{
  "event": "menu.updated",
  "tenant": "myclient",
  "data": {
    "id": "main-nav",
    "updatedAt": "2025-01-21T10:30:00Z"
  },
  "timestamp": "2025-01-21T10:30:00Z"
}
```

Your site can then refetch the menu data.

---

## Caching Strategy

### Client-Side
```tsx
// Use SWR for auto-revalidation
import useSWR from 'swr'

function useMenu() {
  const { data, error } = useSWR('/api/menu', fetcher, {
    revalidateOnFocus: false,
    refreshInterval: 60000 // Refresh every minute
  })
  
  return { menu: data, isLoading: !error && !data, error }
}
```

### Server-Side (Next.js)
```tsx
// Use Next.js caching
const res = await fetch('https://cms.../menu', {
  next: { 
    revalidate: 60, // ISR: Revalidate every 60 seconds
    tags: ['menu'] // Tag for on-demand revalidation
  }
})
```

### On-Demand Revalidation
When client publishes changes in CMS, call:
```tsx
// In API route
import { revalidateTag } from 'next/cache'

revalidateTag('menu')
```

---

## Security Best Practices

1. **API Key Storage**
   - Store in environment variables
   - Never commit to git
   - Use different keys for dev/prod

2. **CORS Configuration**
   - Whitelist your domains
   - Set proper headers

3. **Rate Limiting**
   - Implement on client side
   - Use caching aggressively

4. **Content Validation**
   - Sanitize HTML content
   - Validate JSON structure

---

## Complete Integration Workflow

### Step 1: Client Setup in CMS
1. Client signs up for ContentFlow
2. Creates tenant: "myclient"
3. Gets API key: `cms_live_abc123xyz`
4. Configures menu in Menu Builder
5. Configures footer in Footer Builder
6. Sets theme colors

### Step 2: Developer Integration
1. Add API key to `.env`:
   ```
   CMS_API_KEY=cms_live_abc123xyz
   NEXT_PUBLIC_CMS_API_KEY=cms_live_abc123xyz
   ```

2. Create API client:
   ```tsx
   // lib/cms-client.ts
   const CMS_BASE = 'https://cms.yourplatform.com/api/v1'
   const TENANT = 'myclient'
   
   export async function fetchFromCMS(endpoint: string) {
     const res = await fetch(`${CMS_BASE}/${TENANT}${endpoint}`, {
       headers: {
         'X-API-Key': process.env.CMS_API_KEY!
       },
       next: { revalidate: 60 }
     })
     return res.json()
   }
   ```

3. Use in components:
   ```tsx
   import { fetchFromCMS } from '@/lib/cms-client'
   
   const menu = await fetchFromCMS('/menu?location=header')
   const footer = await fetchFromCMS('/footer')
   const theme = await fetchFromCMS('/theme')
   ```

### Step 3: Client Edits Content
1. Client logs into CMS
2. Goes to "Global" → "Menus"
3. Adds new item: "Careers"
4. Clicks "Publish"
5. Changes appear on website within 60 seconds (or instantly with webhooks)

---

## Summary

**YES, clients can edit their existing websites using ContentFlow CMS!**

The CMS provides RESTful APIs that your existing website can consume. Clients manage content through the visual CMS interface, and your site fetches the latest content via API. This is called "Headless CMS" architecture.

**Key Points:**
- No need to rebuild existing site
- Client uses visual CMS interface
- Developer integrates API endpoints
- Changes reflect automatically
- Supports menus, footers, pages, blogs, themes
- Secure with API key authentication
- Tenant isolation ensures data security
```

```tsx file="" isHidden
