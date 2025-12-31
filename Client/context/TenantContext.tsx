"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { getUserTenants } from "@/Api/Fetch/allFetch";
import { useAuth } from "@/hooks/useAuth";

type Tenant = {
    _id: string;
    name: string;
    domain: string;
};

type TenantContextType = {
    tenants: Tenant[];
    activeTenant: Tenant | null;
    setActiveTenant: (t: Tenant) => void;
    refreshTenants: () => Promise<void>;
};

const TenantContext = createContext<TenantContextType | null>(null);

export function TenantProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [activeTenant, setActiveTenant] = useState<Tenant | null>(null);

    const refreshTenants = async () => {
        if (!user) return;
        const data = await getUserTenants();
        setTenants(data.tenants);
        setActiveTenant(data.tenants[0] ?? null);
    };

    useEffect(() => {
        refreshTenants();
    }, [user]);

    return (
        <TenantContext.Provider
            value={{ tenants, activeTenant, setActiveTenant, refreshTenants }}
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
