# ContentFlow Authentication Flow

## Complete User Journey

### 1. Landing Page (`/`)
- **Public Access**: Anyone can view
- **Features**:
  - Hero section explaining ContentFlow
  - Features grid showcasing capabilities
  - Use cases for different user types
  - Pricing plans
  - Call-to-action buttons
- **Actions**:
  - "Sign In" button → `/login`
  - "Get Started" button → `/signup`

### 2. Sign Up (`/signup`)
- **Public Access**: Anyone can create account
- **Features**:
  - Full name input
  - Email input
  - Password with strength requirements
    - Minimum 8 characters
    - Contains a number
    - Contains uppercase letter
  - Visual password strength indicators
  - Terms of Service agreement
- **Flow**:
  1. User fills form
  2. Validates password requirements
  3. Creates account (simulated)
  4. Sets `cms_auth` token in localStorage
  5. Redirects to `/cms` dashboard

### 3. Sign In (`/login`)
- **Public Access**: Anyone can login
- **Features**:
  - Email input
  - Password input with show/hide toggle
  - "Remember me" checkbox
  - "Forgot password?" link
  - Error handling for invalid credentials
- **Flow**:
  1. User enters credentials
  2. Validates inputs
  3. Authenticates (simulated)
  4. Sets `cms_auth` token in localStorage
  5. Redirects to `/cms` dashboard

### 4. CMS Dashboard (`/cms/*`)
- **Protected Access**: Requires authentication
- **Authentication Check**:
  ```typescript
  useEffect(() => {
    const authToken = localStorage.getItem("cms_auth")
    if (!authToken) {
      router.push("/login") // Redirect to login
    } else {
      setIsAuthenticated(true)
    }
  }, [])
  ```
- **Features**:
  - Full CMS functionality
  - Role-based access control
  - Sidebar navigation
  - Content management tools
- **Logout Flow**:
  1. User clicks profile dropdown
  2. Clicks "Log Out"
  3. Removes `cms_auth` from localStorage
  4. Redirects to `/login`

## Authentication States

### Not Authenticated
- Can access: `/`, `/login`, `/signup`, `/docs`, `/pricing`
- Cannot access: `/cms/*`
- Attempting to access `/cms/*` → Redirects to `/login`

### Authenticated
- Can access: All public pages + `/cms/*`
- Logout removes authentication
- Session persists across page refreshes

## Implementation Details

### Client-Side Authentication
```typescript
// Store auth token
localStorage.setItem("cms_auth", "authenticated")

// Check auth token
const authToken = localStorage.getItem("cms_auth")

// Remove auth token (logout)
localStorage.removeItem("cms_auth")
```

### Protected Routes
All routes under `/cms/*` are protected by the layout component that checks for authentication before rendering.

### User Context
The `AuthProvider` manages user state and role information:
```typescript
interface User {
  id: string
  name: string
  email: string
  role: "platform_admin" | "owner" | "manager" | "editor" | "viewer"
  tenantId?: string
  tenantName?: string
}
```

## Security Notes

### Current Implementation (Demo)
- Uses localStorage for auth token
- Simple boolean authentication check
- No actual API calls or encryption

### Production Recommendations
1. **Use HTTP-only cookies** instead of localStorage
2. **Implement JWT tokens** with expiration
3. **Add refresh token rotation**
4. **Use secure backend API** for authentication
5. **Implement CSRF protection**
6. **Add rate limiting** on login attempts
7. **Enable 2FA** for admin accounts
8. **Hash passwords** with bcrypt (server-side)
9. **Use HTTPS** only in production
10. **Implement session timeout** and auto-logout

## Testing the Flow

### Test Scenario 1: New User
1. Visit `/` (landing page)
2. Click "Get Started"
3. Fill signup form
4. Submit → Automatically logged in → Redirected to `/cms`

### Test Scenario 2: Existing User
1. Visit `/` (landing page)
2. Click "Sign In"
3. Enter credentials
4. Submit → Logged in → Redirected to `/cms`

### Test Scenario 3: Direct CMS Access (Not Logged In)
1. Try to visit `/cms` directly
2. Automatically redirected to `/login`
3. After login → Back to `/cms`

### Test Scenario 4: Logout
1. While in `/cms` dashboard
2. Click user profile dropdown
3. Click "Log Out"
4. Redirected to `/login`
5. Cannot access `/cms` anymore without logging in again

## Role-Based Dashboard Views

### Platform Admin
- Sees all tenants
- Can manage platform settings
- Access to user management
- Full system access

### Tenant Owner
- Sees only their website
- Can manage team members
- Access to all website settings
- Publishing permissions

### Manager
- Sees only their website
- Can edit and publish content
- Cannot change settings
- Cannot manage users

### Editor
- Can create and edit content
- Cannot publish (draft only)
- Limited access

### Viewer
- Read-only access
- Can view analytics
- Cannot edit anything

## API Endpoints (Future)

When connecting to a real backend:

```
POST /api/auth/signup
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
GET  /api/auth/me
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

## Environment Variables (Production)

```env
NEXT_PUBLIC_API_URL=https://api.contentflow.com
JWT_SECRET=your-secret-key
SESSION_TIMEOUT=3600000
