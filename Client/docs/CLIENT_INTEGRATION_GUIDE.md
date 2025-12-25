# Client Integration Guide - ContentFlow CMS

This guide shows developers how to integrate their existing website with ContentFlow CMS so clients can manage content through the CMS dashboard.

## Prerequisites

- Existing React/Next.js website
- ContentFlow CMS account
- API key from ContentFlow

## Installation

### Step 1: Install the SDK (Optional)

Copy the SDK files into your project:

```
/lib
  /cms-sdk
    index.ts       # Main SDK
    hooks.ts       # React hooks
```

Or fetch directly from API without SDK (shown below).

### Step 2: Configure Environment Variables

Add to \`.env.local\`:

```env
# ContentFlow CMS Configuration
NEXT_PUBLIC_CMS_BASE_URL=https://cms.yourplatform.com
NEXT_PUBLIC_CMS_TENANT=myclient
NEXT_PUBLIC_CMS_API_KEY=cms_live_abc123xyz

# Server-side only (more secure)
CMS_API_KEY=cms_live_abc123xyz
```

## Quick Start Examples

### Example 1: Navbar Integration

**Before (Hardcoded):**
```tsx
// components/Navbar.tsx
export function Navbar() {
  return (
    <nav>
      <a href="/">Home</a>
      <a href="/about">About</a>
      <a href="/contact">Contact</a>
    </nav>
  )
}
```

**After (CMS-Managed):**
```tsx
// components/Navbar.tsx
'use client'

import { useMenu } from '@/lib/cms-sdk/hooks'

export function Navbar() {
  const { data: menu, loading } = useMenu('header', {
    baseUrl: process.env.NEXT_PUBLIC_CMS_BASE_URL!,
    tenant: process.env.NEXT_PUBLIC_CMS_TENANT!,
    apiKey: process.env.NEXT_PUBLIC_CMS_API_KEY!,
  })

  if (loading) return <NavbarSkeleton />

  return (
    <nav className="flex items-center gap-6">
      {menu?.items.filter(item => item.enabled).map(item => (
        <div key={item.id}>
          <a href={item.url} className="hover:text-primary">
            {item.label}
          </a>
          
          {/* Dropdown support */}
          {item.children && item.children.length > 0 && (
            <div className="absolute hidden group-hover:block">
              {item.children.map(child => (
                <a key={child.id} href={child.url}>
                  {child.label}
                </a>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  )
}
```

Now client can edit navbar in CMS:
1. Go to CMS → Global → Menus
2. Edit items, add dropdown, reorder
3. Click Publish
4. Changes appear on website instantly

---

### Example 2: Footer Integration

```tsx
// components/Footer.tsx
'use client'

import { useFooter } from '@/lib/cms-sdk/hooks'

export function Footer() {
  const { data: footer, loading } = useFooter({
    baseUrl: process.env.NEXT_PUBLIC_CMS_BASE_URL!,
    tenant: process.env.NEXT_PUBLIC_CMS_TENANT!,
    apiKey: process.env.NEXT_PUBLIC_CMS_API_KEY!,
  })

  if (loading || !footer) return null

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto">
        {/* Render blocks dynamically */}
        <div className={\`grid gap-8 grid-cols-\${footer.layout === '4-column' ? '4' : '3'}\`}>
          {footer.blocks.map(block => {
            switch (block.type) {
              case 'logo':
                return (
                  <div key={block.id}>
                    <img src={block.data.imageUrl || "/placeholder.svg"} alt={block.data.alt} className="h-10 mb-4" />
                    <p className="text-sm text-gray-400">{block.data.text}</p>
                  </div>
                )
              
              case 'menu':
                return (
                  <div key={block.id}>
                    <h3 className="font-bold mb-4">{block.data.title}</h3>
                    <ul className="space-y-2">
                      {block.data.links.map((link, i) => (
                        <li key={i}>
                          <a href={link.url} className="text-sm text-gray-400 hover:text-white">
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              
              case 'social':
                return (
                  <div key={block.id}>
                    <h3 className="font-bold mb-4">{block.data.title}</h3>
                    <div className="flex gap-4">
                      {block.data.platforms.map((platform, i) => (
                        <a key={i} href={platform.url} className="text-gray-400 hover:text-white">
                          {platform.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )
              
              default:
                return null
            }
          })}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex justify-between items-center">
          <p className="text-sm text-gray-400">{footer.bottomBar.copyright}</p>
          <div className="flex gap-4">
            {footer.bottomBar.legalLinks.map((link, i) => (
              <a key={i} href={link.url} className="text-sm text-gray-400 hover:text-white">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
```

---

### Example 3: Server-Side Data Fetching (Recommended)

For better performance, fetch on server:

```tsx
// app/layout.tsx
import { createCMSClient } from '@/lib/cms-sdk'

const cms = createCMSClient({
  baseUrl: process.env.NEXT_PUBLIC_CMS_BASE_URL!,
  tenant: process.env.NEXT_PUBLIC_CMS_TENANT!,
  apiKey: process.env.CMS_API_KEY!, // Server-side key (more secure)
  cacheTime: 60, // Cache for 60 seconds
})

export default async function RootLayout({ children }) {
  // Fetch menu and footer on server (fast, cached)
  const [menu, footer, theme] = await Promise.all([
    cms.getMenu('header'),
    cms.getFooter(),
    cms.getTheme(),
  ])

  return (
    <html>
      <head>
        <style>{\`
          :root {
            --color-primary: \${theme.colors.primary};
            --color-secondary: \${theme.colors.secondary};
            --font-heading: \${theme.typography.fontFamily.heading};
            --font-body: \${theme.typography.fontFamily.body};
          }
        \`}</style>
      </head>
      <body>
        <Navbar menu={menu} />
        <main>{children}</main>
        <Footer footer={footer} />
      </body>
    </html>
  )
}
```

---

## Client Workflow

### Before CMS Integration:
1. Client: "I want to add a menu item"
2. Client emails developer
3. Developer edits code, commits, deploys
4. **Time: Hours to days**

### After CMS Integration:
1. Client logs into CMS
2. Goes to Global → Menus
3. Clicks "Add Item"
4. Fills in label and URL
5. Clicks "Publish"
6. **Changes live in 60 seconds (or instantly with on-demand revalidation)**

---

## Advanced: On-Demand Revalidation

For instant updates (no cache delay):

```tsx
// app/api/revalidate/route.ts
import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-revalidate-secret')
  
  // Security check
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
  }

  const body = await request.json()
  
  // Revalidate based on what changed
  if (body.type === 'menu') {
    revalidateTag('menu')
  } else if (body.type === 'footer') {
    revalidateTag('footer')
  } else if (body.type === 'page') {
    revalidatePath(\`/\${body.slug}\`)
  }

  return NextResponse.json({ revalidated: true })
}
```

Configure webhook in CMS:
- URL: \`https://yoursite.com/api/revalidate\`
- Secret: \`revalidate_secret_xyz\`
- Events: menu.updated, footer.updated, page.published

Now changes appear **instantly** when client publishes.

---

## Testing Checklist

- [ ] Navbar loads from CMS
- [ ] Footer loads from CMS
- [ ] Changes in CMS appear on website
- [ ] Dropdown menus work
- [ ] Mobile responsive
- [ ] Loading states display properly
- [ ] Error handling works
- [ ] SEO meta tags from CMS
- [ ] Theme colors applied correctly
- [ ] Cache/revalidation working

---

## Troubleshooting

**Problem: Menu not loading**
- Check API key is correct
- Check tenant ID matches
- Check network tab for 401/403 errors
- Verify CORS settings

**Problem: Changes not appearing**
- Clear Next.js cache: delete \`.next\` folder
- Check revalidation time (default 60 seconds)
- Use on-demand revalidation for instant updates

**Problem: Styles broken**
- Check theme CSS variables are applied
- Verify Tailwind config includes CMS classes
- Check that block types match renderer

---

## Cost Calculation

**Without CMS:**
- Developer time: $100/hour
- Simple change: 1 hour = $100
- 10 changes/month = $1,000/month

**With CMS:**
- One-time integration: 8 hours = $800
- Monthly cost: $0 (client self-serves)
- **ROI: Break-even in first month**

---

## Summary

ContentFlow CMS transforms your static website into a client-managed platform. Clients get visual editing power, you get freed up time, and the website gets faster updates.

**Key Benefits:**
- Client independence (no more "change this" emails)
- Faster updates (seconds instead of days)
- Version control (undo any change)
- Team collaboration (roles & permissions)
- SEO optimization (built-in)
- Professional workflow (draft → preview → publish)
