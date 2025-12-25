// Permission system for role-based access control

export type Role = "admin" | "editor" | "author" | "viewer"

export type Permission =
  | "content.view"
  | "content.create"
  | "content.edit"
  | "content.delete"
  | "content.publish"
  | "media.view"
  | "media.upload"
  | "media.delete"
  | "menu.edit"
  | "theme.edit"
  | "users.view"
  | "users.manage"
  | "settings.view"
  | "settings.edit"
  | "global.publish"

const rolePermissions: Record<Role, Permission[]> = {
  admin: [
    "content.view",
    "content.create",
    "content.edit",
    "content.delete",
    "content.publish",
    "media.view",
    "media.upload",
    "media.delete",
    "menu.edit",
    "theme.edit",
    "users.view",
    "users.manage",
    "settings.view",
    "settings.edit",
    "global.publish",
  ],
  editor: [
    "content.view",
    "content.create",
    "content.edit",
    "content.delete",
    "content.publish",
    "media.view",
    "media.upload",
    "media.delete",
    "menu.edit",
    "theme.edit",
    "users.view",
    "settings.view",
    "global.publish",
  ],
  author: [
    "content.view",
    "content.create",
    "content.edit", // Only own content
    "media.view",
    "media.upload",
  ],
  viewer: ["content.view", "media.view", "settings.view"],
}

export function hasPermission(role: Role, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) ?? false
}

export function hasAnyPermission(role: Role, permissions: Permission[]): boolean {
  return permissions.some((permission) => hasPermission(role, permission))
}

export function hasAllPermissions(role: Role, permissions: Permission[]): boolean {
  return permissions.every((permission) => hasPermission(role, permission))
}

export function canPublishGlobal(role: Role): boolean {
  return hasPermission(role, "global.publish")
}

export function canManageUsers(role: Role): boolean {
  return hasPermission(role, "users.manage")
}

export function canEditContent(role: Role): boolean {
  return hasPermission(role, "content.edit")
}

export function canPublishContent(role: Role): boolean {
  return hasPermission(role, "content.publish")
}
