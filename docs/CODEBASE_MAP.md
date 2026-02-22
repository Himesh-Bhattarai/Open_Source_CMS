# Codebase Map

This file helps locate where to make changes quickly.

## Frontend (`Client/`)

- `app/`: App Router pages
  - `app/cms/*`: CMS admin pages
  - `app/site/[tenant]/[[...slug]]`: tenant website rendering
- `Api/`: frontend HTTP clients grouped by domain
  - `Api/Page/*`, `Api/Blog/*`, `Api/Tenant/*`, etc.
- `components/`: reusable UI and CMS components
- `context/`: global context providers (tenant, auth-related helpers)
- `hooks/`: reusable hooks (e.g. auth/session helpers)
- `proxy.ts`: route guard for `/cms/admin/*`

## Backend (`Server/`)

- `server.js`: app bootstrap, middleware, route mounts, scheduler startup
- `Routes/`: HTTP routers by module (`Page`, `Blog`, `Menu`, `Backup`, etc.)
- `CheckPoint/`: request handlers / core controller-like logic
- `Validation/`: schema validators + middleware
- `Models/`: Mongoose schemas
- `Services/`: cross-cutting services (notifications, backup scheduler, etc.)
- `Database/db.js`: MongoDB connection

## Common Change Paths

- Add/update an API endpoint:
  1. Add route in `Server/Routes/<Module>/...`
  2. Add/adjust handler in `Server/CheckPoint/<Module>/...` (or inline route handler)
  3. Register mount in `Server/server.js` if needed
  4. Wire frontend call in `Client/Api/<Module>/...`
  5. Use in page/component under `Client/app/...` or `Client/components/...`

- Add/update CMS screen:
  1. Page entry in `Client/app/cms/...`
  2. Reusable bits in `Client/components/cms/...`
  3. API client in `Client/Api/...`

- Add/update external content API:
  1. Update `Server/Routes/Api/*`
  2. Ensure route remains behind `rateLimiter + extractDomain` at
     `/api/v1/external-request` in `Server/server.js`
