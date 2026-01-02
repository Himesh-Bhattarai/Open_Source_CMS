"use client";

import { createContext,useContext, useEffect, useState } from "react";
import {getUserMenus} from "@/Api/Fetch/allFetch";

import { useAuth } from "@/hooks/useAuth";

const MenusContext = createContext<MenusContextType | null>(null);

export function MenusProvider({ children }: { children: React.ReactNode }) {

    const {user} = useAuth();
    const [menus, setMenus] = useState<Menu[]>([]);
    const [activeMenu, setActiveMenu] = useState<Menu | null>(null);

    const refreshMenus = async () => {
        if (!user) return;
        const data = await getUserMenus();
        setMenus(data.menus);
        setActiveMenu(data.menus[0] ?? null);
    };

    useEffect(() => {
        refreshMenus();
    }, [user]);
    return (
        <MenusContext.Provider value={{menus, activeMenu, setActiveMenu, refreshMenus}}>
            {Children}
        </MenusContext.Provider>
    )


}

export const useMenus = () => {
    const context = useContext(MenusContext);
    if (!context) throw new Error("useMenus must be used inside MenusProvider");
    return context;
}


