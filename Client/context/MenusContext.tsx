"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { loadMenus } from "@/Api/Menu/Load";
import { useAuth } from "@/hooks/useAuth";

type MenuItem = {
  _id: string;
  label: string;
  type?: string;
  link?: string;
  enabled?: boolean;
  order?: number;
  children?: MenuItem[];
};

type Menu = {
  _id: string;
  title?: string;
  menuLocation?: string;
  status?: string;
  items: MenuItem[];
};

type MenusContextType = {
  menus: Menu[];
  activeMenu: Menu | null;
  setActiveMenu: (menu: Menu | null) => void;
  refreshMenus: () => Promise<void>;
};

const MenusContext = createContext<MenusContextType | null>(null);

export function MenusProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [activeMenu, setActiveMenu] = useState<Menu | null>(null);

  const refreshMenus = async () => {
    if (!user) return;
    const data = await loadMenus();
    const resolvedMenus = Array.isArray(data?.menus) ? data.menus : [];
    setMenus(resolvedMenus);
    setActiveMenu(resolvedMenus[0] ?? null);
  };

  useEffect(() => {
    refreshMenus();
  }, [user]);
  return (
    <MenusContext.Provider value={{ menus, activeMenu, setActiveMenu, refreshMenus }}>
      {children}
    </MenusContext.Provider>
  );
}

export const useMenus = () => {
  const context = useContext(MenusContext);
  if (!context) throw new Error("useMenus must be used inside MenusProvider");
  return context;
};
