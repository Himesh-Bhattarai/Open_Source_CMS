# API Endpoints - Simple Explanation

## What is an API?

Think of an API (Application Programming Interface) as a **waiter in a restaurant**:

- You (the client website) are the customer
- The kitchen (our CMS database) has all the food (content)
- The waiter (API) takes your order and brings back what you asked for

APIs allow external websites to talk to our CMS and get content without accessing the database directly.

---

## Why Do We Need These APIs?

**The Problem:**
Your client already has a website built with React, WordPress, or plain HTML. They want to:
- Change navigation menu items
- Update footer links
- Edit page content
- Change theme colors

**Without API:** They'd have to edit code files, redeploy, and risk breaking things.

**With API:** They log into our CMS dashboard, make changes visually, and their website automatically fetches the new content through our API.

---

## How It Works - Real World Example

### Scenario: Client Wants to Update Their Navigation Menu

**Step 1: Client Updates in CMS**
```
Client logs into ContentFlow CMS → 
Goes to "Global" → "Menus" →
Changes "Products" link to "Solutions" →
Clicks "Publish"
```

**Step 2: CMS Saves to Database**
```
Our database now has:
{
  menu_items: [
    { label: "Home", url: "/" },
    { label: "Solutions", url: "/solutions" },  // Changed from "Products"
    { label: "About", url: "/about" }
  ]
}
```

**Step 3: Client's Website Fetches New Menu**
```
Their website code calls:
GET /api/v1/acme-corp/menu

Our API responds with the updated menu data

Their website automatically shows "Solutions" instead of "Products"
```

**Result:** No code changes needed. No redeployment. Instant update.

---

## The 5 APIs I Created

### 1. MENU API
**Purpose:** Get navigation menu items for header, footer, or mobile menus

**Endpoint:** `GET /api/v1/{tenant}/menu?location=header`

**What It Returns:**
```json
{
  "id": "main-nav",
  "location": "header",
  "tenant": "acme-corp",
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
  "lastModified": "2025-01-21T10:30:00Z"
}
```

**Real Use Case:**
```javascript
// Client's website code (React example)
function Navbar() {
  const [menuItems, setMenuItems] = useState([])
  
  useEffect(() => {
    // Fetch menu from our API
    fetch('https://cms.example.com/api/v1/acme-corp/menu?location=header', {
      headers: { 'x-api-key': 'your-secret-key' }
    })
    .then(res => res.json())
    .then(data => setMenuItems(data.items))
  }, [])
  
  return (
    <nav>
      {menuItems.map(item => (
        <a key={item.id} href={item.url}>{item.label}</a>
      ))}
    </nav>
  )
}
```

**When Client Changes Menu in CMS:**
- They go to CMS → Global → Menus
- Add/remove/reorder items visually
- Click Publish
- Their website automatically shows new menu (on next page load)

---

### 2. FOOTER API
**Purpose:** Get footer layout, blocks, and bottom bar content

**Endpoint:** `GET /api/v1/{tenant}/footer`

**What It Returns:**
```json
{
  "id": "main-footer",
  "tenant": "acme-corp",
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
        "text": "Building the future of web platforms."
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
    }
  ],
  "bottomBar": {
    "copyright": "© 2025 Company Inc.",
    "legalLinks": [
      { "label": "Privacy Policy", "url": "/privacy" }
    ]
  }
}
```

**Real Use Case:**
```javascript
// Client's website code
function Footer() {
  const [footer, setFooter] = useState(null)
  
  useEffect(() => {
    fetch('https://cms.example.com/api/v1/acme-corp/footer', {
      headers: { 'x-api-key': 'your-secret-key' }
    })
    .then(res => res.json())
    .then(data => setFooter(data))
  }, [])
  
  return (
    <footer className="grid grid-cols-4">
      {footer?.blocks.map(block => {
        if (block.type === 'logo') {
          return <img src={block.data.imageUrl || "/placeholder.svg"} alt={block.data.alt} />
        }
        if (block.type === 'menu') {
          return (
            <div>
              <h4>{block.data.title}</h4>
              {block.data.links.map(link => (
                <a href={link.url}>{link.label}</a>
              ))}
            </div>
          )
        }
      })}
    </footer>
  )
}
```

**When Client Changes Footer in CMS:**
- They go to CMS → Global → Footer
- Add/remove blocks, change copyright text
- Click Publish
- Their website footer updates automatically

---

### 3. PAGE CONTENT API
**Purpose:** Get full page content including all blocks for any page

**Endpoint:** `GET /api/v1/{tenant}/pages/{slug}`

Example: `GET /api/v1/acme-corp/pages/home`

**What It Returns:**
```json
{
  "id": "page-1",
  "tenant": "acme-corp",
  "slug": "home",
  "title": "Welcome to Our Platform",
  "metaDescription": "The best platform for building modern websites",
  "blocks": [
    {
      "id": "block-1",
      "type": "hero",
      "order": 1,
      "data": {
        "title": "Build Your Dream Website",
        "subtitle": "No code required. Just drag, drop, and publish.",
        "buttonText": "Get Started Free",
        "buttonLink": "/signup",
        "backgroundImage": "/images/hero-bg.jpg",
        "alignment": "center"
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
            "title": "Lightning Fast",
            "description": "Optimized for performance"
          },
          {
            "icon": "shield",
            "title": "Secure by Default",
            "description": "Enterprise-grade security"
          }
        ]
      }
    }
  ],
  "seo": {
    "title": "Welcome to Our Platform | Company Name",
    "description": "The best platform for building modern websites",
    "ogImage": "/images/og-image.jpg"
  }
}
```

**Real Use Case:**
```javascript
// Client's website - Dynamic Page Component
function DynamicPage({ slug }) {
  const [page, setPage] = useState(null)
  
  useEffect(() => {
    fetch(`https://cms.example.com/api/v1/acme-corp/pages/${slug}`, {
      headers: { 'x-api-key': 'your-secret-key' }
    })
    .then(res => res.json())
    .then(data => setPage(data))
  }, [slug])
  
  return (
    <div>
      {/* Render SEO meta tags */}
      <Head>
        <title>{page?.seo.title}</title>
        <meta name="description" content={page?.seo.description} />
      </Head>
      
      {/* Render each block dynamically */}
      {page?.blocks.map(block => {
        if (block.type === 'hero') {
          return (
            <HeroSection 
              title={block.data.title}
              subtitle={block.data.subtitle}
              buttonText={block.data.buttonText}
              backgroundImage={block.data.backgroundImage}
            />
          )
        }
        if (block.type === 'features') {
          return (
            <FeaturesSection 
              title={block.data.title}
              features={block.data.features}
            />
          )
        }
        // ... handle other block types
      })}
    </div>
  )
}
```

**When Client Changes Page in CMS:**
- They go to CMS → Tenants → Their Site → Pages → Edit Page
- Add new blocks (testimonials, gallery, etc.)
- Edit text, images, buttons
- Reorder blocks by dragging
- Click Publish
- Their website rebuilds the page with new content

---

### 4. BLOG API
**Purpose:** Get list of blog posts with filtering and pagination

**Endpoint:** `GET /api/v1/{tenant}/blog?limit=10&offset=0&category=tutorials`

**What It Returns:**
```json
{
  "posts": [
    {
      "id": "post-1",
      "title": "Getting Started with Our Platform",
      "slug": "getting-started",
      "excerpt": "Learn how to build your first website in minutes",
      "content": "<p>Full HTML content here...</p>",
      "featuredImage": "/images/blog-1.jpg",
      "author": {
        "id": "user-1",
        "name": "John Doe",
        "avatar": "/avatars/john.jpg"
      },
      "category": {
        "id": "cat-1",
        "name": "Tutorials",
        "slug": "tutorials"
      },
      "tags": ["beginner", "tutorial", "getting-started"],
      "publishedAt": "2025-01-15T10:00:00Z"
    }
  ],
  "total": 25,
  "limit": 10,
  "offset": 0,
  "hasMore": true
}
```

**Real Use Case:**
```javascript
// Client's website - Blog Listing Page
function BlogPage() {
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(0)
  
  useEffect(() => {
    const limit = 10
    const offset = page * limit
    
    fetch(
      `https://cms.example.com/api/v1/acme-corp/blog?limit=${limit}&offset=${offset}`,
      { headers: { 'x-api-key': 'your-secret-key' }}
    )
    .then(res => res.json())
    .then(data => setPosts(data.posts))
  }, [page])
  
  return (
    <div>
      <h1>Our Blog</h1>
      <div className="grid grid-cols-3 gap-4">
        {posts.map(post => (
          <article key={post.id}>
            <img src={post.featuredImage || "/placeholder.svg"} alt={post.title} />
            <h2>{post.title}</h2>
            <p>{post.excerpt}</p>
            <a href={`/blog/${post.slug}`}>Read More</a>
          </article>
        ))}
      </div>
      
      {/* Pagination */}
      <button onClick={() => setPage(page - 1)}>Previous</button>
      <button onClick={() => setPage(page + 1)}>Next</button>
    </div>
  )
}
```

**When Client Creates New Blog Post:**
- They go to CMS → Content → Blog Posts → New Post
- Write title, content, add featured image
- Choose category, add tags
- Click Publish
- New post appears on their website's blog page automatically

---

### 5. THEME API
**Purpose:** Get theme configuration (colors, fonts, layout settings)

**Endpoint:** `GET /api/v1/{tenant}/theme`

**What It Returns:**
```json
{
  "id": "theme-1",
  "tenant": "acme-corp",
  "name": "Company Theme",
  "colors": {
    "primary": "#3B82F6",
    "secondary": "#10B981",
    "background": "#FFFFFF",
    "foreground": "#000000",
    "muted": "#F3F4F6",
    "accent": "#8B5CF6"
  },
  "typography": {
    "fontFamily": {
      "heading": "Inter, sans-serif",
      "body": "Inter, sans-serif"
    },
    "fontSize": {
      "base": "16px",
      "h1": "48px",
      "h2": "36px"
    }
  },
  "layout": {
    "containerWidth": "1280px",
    "spacing": "1rem",
    "borderRadius": "8px"
  },
  "header": {
    "style": "centered",
    "position": "sticky"
  }
}
```

**Real Use Case:**
```javascript
// Client's website - Apply theme dynamically
function App() {
  const [theme, setTheme] = useState(null)
  
  useEffect(() => {
    fetch('https://cms.example.com/api/v1/acme-corp/theme', {
      headers: { 'x-api-key': 'your-secret-key' }
    })
    .then(res => res.json())
    .then(data => {
      setTheme(data)
      
      // Apply theme colors to CSS variables
      document.documentElement.style.setProperty('--color-primary', data.colors.primary)
      document.documentElement.style.setProperty('--color-secondary', data.colors.secondary)
      document.documentElement.style.setProperty('--font-heading', data.typography.fontFamily.heading)
      // ... etc
    })
  }, [])
  
  return <div>{/* Your app content */}</div>
}
```

**When Client Changes Theme in CMS:**
- They go to CMS → Theme
- Change primary color from blue to purple
- Change font from Inter to Roboto
- Click Apply Theme
- Their entire website's colors and fonts update instantly

---

## Security: API Keys

**What's an API Key?**
Think of it like a password for your website to access the API.

**How It Works:**
```javascript
// Client gets API key from CMS dashboard
const apiKey = "sk_live_abc123xyz789"

// Include it in every request
fetch('https://cms.example.com/api/v1/acme-corp/menu', {
  headers: {
    'x-api-key': apiKey  // This proves you're authorized
  }
})
```

**Why We Need It:**
- Prevents random people from accessing your content
- Tracks API usage per tenant
- Allows us to rate limit (prevent abuse)
- Can be revoked if compromised

**Where Clients Get API Key:**
- CMS Dashboard → Settings → API
- Click "Generate New Key"
- Copy and use in their website code

---

## Caching: Making It Fast

**The Problem:**
If 1000 visitors load your website, we'd make 1000 database queries for the same menu. That's slow and expensive.

**The Solution: Caching**
```javascript
// In our API response, we set cache headers
return NextResponse.json(menuData, {
  headers: {
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
  }
})
```

**What This Means:**
- `s-maxage=60`: Cache the menu for 60 seconds
- First visitor hits database
- Next 59 seconds, all visitors get cached version (instant!)
- After 60 seconds, cache expires and we fetch fresh data
- `stale-while-revalidate=120`: If cache expires, serve old version while fetching new one in background (no delay for users)

**For Client:**
- Super fast website (no waiting for database)
- Still gets updates within 60 seconds of changing content in CMS
- Can configure cache duration in API settings

---

## How Client Integrates: Step-by-Step

### Method 1: Using Our React SDK (Easiest)

**Step 1: Install SDK**
```bash
npm install @contentflow/cms-sdk
```

**Step 2: Configure**
```javascript
// _app.js or layout.js
import { CMSProvider } from '@contentflow/cms-sdk'

function App({ children }) {
  return (
    <CMSProvider 
      tenant="acme-corp" 
      apiKey="your-api-key"
      apiUrl="https://cms.example.com/api/v1"
    >
      {children}
    </CMSProvider>
  )
}
```

**Step 3: Use Hooks**
```javascript
import { useMenu, usePage, useTheme } from '@contentflow/cms-sdk'

function Navbar() {
  const { data: menu, loading, error } = useMenu('header')
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error loading menu</div>
  
  return (
    <nav>
      {menu.items.map(item => (
        <a href={item.url}>{item.label}</a>
      ))}
    </nav>
  )
}

function HomePage() {
  const { data: page } = usePage('home')
  const { data: theme } = useTheme()
  
  return (
    <div>
      {page?.blocks.map(block => (
        <BlockRenderer block={block} theme={theme} />
      ))}
    </div>
  )
}
```

**That's it!** Navbar, footer, pages all update from CMS.

---

### Method 2: Direct API Calls (Any Framework)

**WordPress Example (PHP):**
```php
<?php
// In your theme's header.php
$api_key = 'your-api-key';
$tenant = 'acme-corp';

$response = wp_remote_get(
  "https://cms.example.com/api/v1/$tenant/menu?location=header",
  array('headers' => array('x-api-key' => $api_key))
);

$menu = json_decode(wp_remote_retrieve_body($response), true);

foreach ($menu['items'] as $item) {
  echo "<a href='{$item['url']}'>{$item['label']}</a>";
}
?>
```

**Plain JavaScript Example:**
```html
<!-- In your HTML -->
<nav id="main-nav"></nav>

<script>
  fetch('https://cms.example.com/api/v1/acme-corp/menu?location=header', {
    headers: { 'x-api-key': 'your-api-key' }
  })
  .then(res => res.json())
  .then(data => {
    const nav = document.getElementById('main-nav')
    data.items.forEach(item => {
      const link = document.createElement('a')
      link.href = item.url
      link.textContent = item.label
      nav.appendChild(link)
    })
  })
</script>
```

---

## Common Questions

**Q: Does the client's website need to be rebuilt every time they change content?**
A: No! The API provides content dynamically. The website fetches content on page load, so changes appear immediately (within cache expiration time).

**Q: What if the API is down?**
A: The client's website should:
- Cache responses locally (localStorage or service worker)
- Show fallback/cached content if API fails
- Implement retry logic

**Q: Can I limit what content is public via API?**
A: Yes! In the CMS, each page/post has a "Published" status. The API only returns published content. Drafts remain private.

**Q: Can multiple websites use the same tenant?**
A: Yes! You can have:
- Main website: https://acme.com
- Marketing site: https://marketing.acme.com
- Docs site: https://docs.acme.com

All fetching content from the same tenant via API, but with different layouts/designs.

**Q: How do I handle images and media?**
A: The API returns image URLs. You can:
- Host images on our CMS (we provide CDN URLs)
- Host on client's server (API returns relative paths)
- Use external CDN (Cloudinary, etc.)

---

## Benefits Recap

**For Platform Owner (You):**
- One CMS powers unlimited client websites
- Clients can't break your code (they only consume API)
- Easy to add new features (just update API)
- Centralized analytics and monitoring

**For Clients:**
- Edit content without touching code
- Changes go live immediately
- No risk of breaking their website
- Can hire non-technical content managers

**For Developers (Client's developers):**
- Clean API to integrate with any framework
- Documentation and SDK provided
- Can focus on frontend design, not CMS integration
- Flexible: Use all API features or just some

---

## Next Steps for Client

1. **Get API Key**: Log into CMS → Settings → API → Generate Key
2. **Choose Integration Method**: React SDK, direct API, or webhook
3. **Test in Development**: Use staging environment first
4. **Implement**: Add to their website code
5. **Go Live**: Enable API integration in production
6. **Train Team**: Show content editors how to use CMS dashboard

---

## Summary

These 5 APIs transform our CMS from a standalone admin panel into a **headless CMS** that can power any website, regardless of technology:

1. **Menu API**: Navigation bars that update from CMS
2. **Footer API**: Footer content that updates from CMS
3. **Page API**: Entire pages built from blocks in CMS
4. **Blog API**: Blog posts managed in CMS, displayed anywhere
5. **Theme API**: Colors and fonts controlled from CMS

**The Magic:** Client's website becomes a "view layer" that displays content from our CMS. They edit in our visual dashboard, we store in database, API delivers to their website, visitors see updated content.

**Real World:** It's like Netflix:
- Content (movies) stored in Netflix servers (our database)
- Apps (TV, phone, web) fetch content via API (our APIs)
- UI looks different per device, but content is same (client's design, our data)
- Netflix updates catalog, all apps show it instantly (client updates CMS, their site shows it)

That's exactly what these APIs enable.
