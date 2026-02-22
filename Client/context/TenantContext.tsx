"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { getUserTenants } from "@/Api/Tenant/Fetch";
import { useAuth } from "@/hooks/useAuth";

type Tenant = {
  _id: string;
  name: string;
  domain: string;
};

type TenantContextType = {
  tenants: Tenant[];
  activeTenant: Tenant | null;
  selectedTenantId: string | null; // 👈 add this
  setActiveTenant: (t: Tenant) => void;
  refreshTenants: () => Promise<void>;
};

const TenantContext = createContext<TenantContextType | null>(null);

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isCmsRoute = pathname?.startsWith("/cms") ?? false;
  const { user } = useAuth({ enabled: isCmsRoute });
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [activeTenant, setActiveTenant] = useState<Tenant | null>(null);

  const refreshTenants = async () => {
    if (!user) return;
    const data = await getUserTenants();

    setTenants(data?.tenants);
    setActiveTenant(data?.tenants[0] ?? null);
  };

  useEffect(() => {
    if (!isCmsRoute) return;
    refreshTenants();
  }, [user, isCmsRoute]);

  return (
    <TenantContext.Provider
      value={{
        tenants,
        activeTenant,
        setActiveTenant,
        refreshTenants,
        selectedTenantId: activeTenant?._id ?? null,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
}

export const useTenant = () => {
  const ctx = useContext(TenantContext);
  if (!ctx) throw new Error("useTenant must be used inside TenantProvider");
  return ctx;
};
