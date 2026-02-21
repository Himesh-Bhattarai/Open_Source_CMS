"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Eye, Trash2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useEffect, useState } from "react";
import { loadMenus } from "@/Api/Menu/Load";
import { deleteMenuById } from "@/Api/Menu/Delete";
import { toast } from "sonner";

interface MenuSummary {
  _id: string;
  title?: string;
  description?: string;
  items?: unknown[];
  menuLocation?: string;
  status?: string;
  updatedAt?: string;
}

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export default function MenusPage() {
  const [loading, setLoading] = useState(false);
  const [menusData, setMenusData] = useState<MenuSummary[]>([]);

  // Keep card text compact in the grid layout.
  const truncate = (text = "", length = 50) =>
    text.length > length ? `${text.slice(0, length)}...` : text;

  useEffect(() => {
    const loadMenu = async () => {
      try {
        setLoading(true);
        const response = await loadMenus();
        if (!response?.ok) throw new Error("Failed to load menus");
        const rawMenus = Array.isArray(response.menus)
          ? (response.menus as Array<Partial<MenuSummary>>)
          : [];
        const safeMenus = rawMenus.filter(
          (menu): menu is MenuSummary => typeof menu?._id === "string",
        );
        setMenusData(safeMenus);
      } catch (err) {
        toast.error(getErrorMessage(err, "Failed to load menus"));
      } finally {
        setLoading(false);
      }
    };

    loadMenu();
  }, []);

  const deleteMenu = async (menuId: string) => {
    const previous = menusData;

    // Optimistic UI update with rollback on failure.
    setMenusData((prev) => prev.filter((m) => m._id !== menuId));

    try {
      const response = await deleteMenuById(menuId);
      if (!response?.ok) throw new Error("Delete failed");
      toast.success("Menu deleted");
    } catch (err) {
      setMenusData(previous);
      toast.error(getErrorMessage(err, "Failed to delete menu"));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-balance text-3xl font-bold tracking-tight">Menus</h1>
          <p className="text-pretty text-muted-foreground mt-1">
            Manage site navigation and menu structures
          </p>
        </div>
        <Button asChild>
          <Link href="/cms/global/menus/new">
            <Plus className="h-4 w-4 mr-2" />
            New Menu
          </Link>
        </Button>
      </div>

      {loading && (
        <div className="flex justify-center py-12 text-muted-foreground">Loading menus...</div>
      )}

      {!loading && menusData.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">No menus found</div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {menusData.map((menu) => (
          <Card key={menu._id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold">{menu.items?.length || 0}</span>
                  </div>
                  <div>
                    <CardTitle className="text-lg">{menu.title}</CardTitle>
                    <CardDescription className="text-xs text-muted-foreground flex flex-col gap-1">
                      <p>{truncate(menu.description || "", 50)}</p>
                      {menu.menuLocation && (
                        <p className="text-[10px] text-gray-400 uppercase font-medium">
                          Location: {menu.menuLocation}
                        </p>
                      )}
                    </CardDescription>
                  </div>
                </div>
                <Badge variant={menu.status === "published" ? "default" : "secondary"}>
                  {menu.status || "draft"}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                <Clock className="h-3.5 w-3.5" />
                <span>Last edited {menu.updatedAt || "-"}</span>
              </div>

              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm" className="flex-1">
                  <Link href={`/cms/global/menus/${menu._id}`}>
                    <Edit className="h-3.5 w-3.5 mr-1" />
                    Edit
                  </Link>
                </Button>

                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-3.5 w-3.5 mr-1" />
                  Preview
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-destructive"
                  onClick={() => deleteMenu(menu._id)}
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
