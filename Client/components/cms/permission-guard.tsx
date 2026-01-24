"use client";

import type { ReactNode } from "react";
import {
  hasPermission,
  hasAnyPermission,
  type Permission,
  type Role,
} from "@/lib/permissions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShieldAlert } from "lucide-react";

interface PermissionGuardProps {
  children: ReactNode;
  role: Role;
  permission?: Permission;
  anyPermissions?: Permission[];
  fallback?: ReactNode;
  showAlert?: boolean;
}

export function PermissionGuard({
  children,
  role,
  permission,
  anyPermissions,
  fallback,
  showAlert = false,
}: PermissionGuardProps) {
  const hasAccess = permission
    ? hasPermission(role, permission)
    : anyPermissions
      ? hasAnyPermission(role, anyPermissions)
      : false;

  if (!hasAccess) {
    if (showAlert) {
      return (
        <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertDescription>
            You do not have permission to access this content.
          </AlertDescription>
        </Alert>
      );
    }
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
