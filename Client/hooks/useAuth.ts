"use client";

import { useEffect, useState } from "react";
import { verifyMe } from "@/Api/Auth/VerifyAuth";

export type AuthUserRole = "admin" | "web-owner" | "manager" | "editor" | "viewer" | string;

export interface AuthUser {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
  role?: AuthUserRole;
  tenantName?: string;
  [key: string]: unknown;
}

export interface ImpersonatedTenant {
  _id?: string;
  id?: string;
  name?: string;
  domain?: string;
  [key: string]: unknown;
}

interface UseAuthOptions {
  enabled?: boolean;
}

export function useAuth(options: UseAuthOptions = {}) {
  const enabled = options.enabled ?? true;
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [impersonatedTenant, setImpersonatedTenant] = useState<ImpersonatedTenant | null>(null);

  useEffect(() => {
    if (!enabled) {
      setUser(null);
      setLoading(false);
      return;
    }

    verifyMe()
      .then((data) => {
        setUser(data);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [enabled]);

  const startImpersonation = (tenant: ImpersonatedTenant) => {
    setImpersonatedTenant(tenant);
  };

  const stopImpersonation = () => {
    setImpersonatedTenant(null);
  };

  return {
    user,
    loading,
    email: user?.email,
    // roles
    isAdmin: user?.role === "admin",
    isOwner: user?.role === "web-owner",

    // impersonation state
    isImpersonating: Boolean(impersonatedTenant),
    impersonatedTenant,

    // impersonation actions
    startImpersonation,
    stopImpersonation,
  };
}
