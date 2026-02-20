# API Route Map

Primary source: `Server/server.js`.

This map lists mounted route prefixes and their router modules.

## Core Middleware

- CORS with origin allowlist from `CORS_ORIGIN`
- `express.json` + `express.urlencoded`
- `cookie-parser`
- `express-session`
- `passport.initialize()` + `passport.session()`

## Mounts

### Create / Domain APIs

| Prefix | Router Module |
| --- | --- |
| `/api/v1/auth` | `Routes/Auth/Combined/Auth.js` |
| `/api/v1/activity` | `Routes/ActivityLog/ActivityLog.js` |
| `/api/v1/create-blog` | `Routes/Blog/Combined.js` |
| `/api/v1/fields` | `Routes/Fields/Combined.js` |
| `/api/v1/create-form` | `Routes/Form/Form.js` |
| `/api/v1/create-tenant` | `Routes/Tenant/Combined/Tenant.js` |
| `/api/v1/create-footer` | `Routes/Footer/Combined.js` |
| `/api/v1/create-media` | `Routes/Media/Media.js` |
| `/api/v1/media` | `Routes/Media/Media.js` |
| `/api/v1/create-menu` | `Routes/Menu/Combined.js` |
| `/api/v1/create-page` | `Routes/Page/Combined.js` |
| `/api/v1/create-page-version` | `Routes/Page/PageVersion.js` |
| `/api/v1/create-theme` | `Routes/Theme/Theme.js` |
| `/api/v1/create-version` | `Routes/Version/Version.js` |
| `/api/v1/create-seo` | `Routes/Seo/Seo.js` |
| `/api/v1/backup` | `Routes/Backup/Backup.js` |
| `/api/v1/oAuth` | `Routes/Auth/oAuth/oAuth.js` |

### Fetch / Load APIs

| Prefix | Router Module |
| --- | --- |
| `/api/v1/tenants` | `Routes/Tenant/Combined/Tenant.js` |
| `/api/v1/page` | `Routes/Page/Services.js` |
| `/api/v1/blog` | `Routes/Load/blog.js` |
| `/api/v1/load-menu` | `Routes/Load/menu.js` |
| `/api/v1/user-blog` | `Routes/Load/blog.js` |
| `/api/v1/footer` | `Routes/Load/footer.js` |
| `/api/v1/page/belong` | `Routes/Load/pageBelong.js` |
| `/api/v1/seo/load-seo` | `Routes/Load/Seo.js` |
| `/api/v1/form` | `Routes/Load/form.js` |
| `/api/v1/integrations` | `Routes/integrationsApi/integrationsApi.js` |
| `/api/v1/api-keys` | `Routes/Load/getApi.js` |
| `/api/v1/admin` | `Routes/Load/adminLoad.js` |

### Utility / Services

| Prefix | Router Module |
| --- | --- |
| `/api/v1/check-slug` | `Routes/Page/Services.js` |
| `/api/v2/check-slug` | `Services/slugServices.js` |
| `/api/v1/feedback` | `Services/feedBack.js` |
| `/api/v1/notifications` | `Routes/Notifications/notifications.js` |
| `/api/v1/user/password` | `Services/changePassword.js` |
| `/api/v1/user/validate` | `Services/validateUser.js` |

### Delete APIs

| Prefix | Router Module |
| --- | --- |
| `/api/v1/delete` | `Routes/Delete/pageDelete.js` |
| `/api/v1/delete-blog` | `Routes/Delete/blogDelete.js` |
| `/api/v1/delete-menu` | `Routes/Delete/menuDelete.js` |
| `/api/v1/delete-tenant` | `Routes/Delete/tenantDelete.js` |
| `/api/v1/delete-seo` | `Routes/Delete/seoDelete.js` |
| `/api/v1/delete-form` | `Routes/Delete/formDelete.js` |
| `/api/v1/delete-footer` | `Routes/Delete/footerDelete.js` |
| `/api/v1/user/delete` | `Routes/Delete/deleteUser.js` |

### Update / Modification APIs

| Prefix | Router Module |
| --- | --- |
| `/api/v1/update-page` | `Routes/Page/Combined.js` |
| `/api/v1/restore-page-version` | `Routes/Page/PageVersion.js` |
| `/api/v1/blog` | `Routes/Blog/Combined.js` |
| `/api/v1/update-menu` | `Routes/Menu/Combined.js` |
| `/api/v1/update-tenant` | `Routes/Tenant/Combined/Tenant.js` |
| `/api/v1/update-footer` | `Routes/Footer/Combined.js` |
| `/api/v1/update-seo` | `Routes/Seo/Seo.js` |
| `/api/v1/update-form` | `Routes/Form/Form.js` |
| `/api/v1/statistics` | `Routes/Stats/Stats.js` |

### External Content API

| Prefix | Middleware | Router Module |
| --- | --- | --- |
| `/api/v1/external-request` | `rateLimiter`, `extractDomain` | `Routes/Api/oneRoutes.js` |

## Health

- `GET /health` returns `{ status: "ok" }`
