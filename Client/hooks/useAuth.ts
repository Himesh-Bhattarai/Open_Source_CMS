"use client";

import { useEffect, useState } from "react";
import { verifyMe } from "@/Api/Auth/VerifyAuth";

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [impersonatedTenant, setImpersonatedTenant] = useState<any>(null);

  useEffect(() => {
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
  }, []);

  const startImpersonation = (tenant: any) => {
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
