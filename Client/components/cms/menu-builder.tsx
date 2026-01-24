"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  GripVertical,
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  ExternalLink,
  FileText,
  Save,
  AlertCircle,
  Image as ImageIcon,
  Type,
  ChevronRightCircle,
  Layers,
  PanelLeft,
  Menu,
  Hash,
  ArrowRight,
  Globe,
  Maximize2,
  Link,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createMenuItem, updateMenu } from "@/Api/Menu/Combined";
import { useRouter } from "next/navigation";
import { loadMenuById } from "@/Api/Menu/Load";

// ==================== FIXED TYPE DEFINITIONS ====================
type NavbarType = "static" | "dropdown" | "mega" | "breadcrumb";
type LinkType = "internal" | "external" | "none";
type MenuLocation = "navbar" | "sidebar";

// Common content blocks that can be added to ANY menu item
interface MenuImage {
  id: string;
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

interface MenuButton {
  id: string;
  label: string;
  action: string;
  variant: "primary" | "secondary" | "outline";
}

interface MenuTextBlock {
  id: string;
  content: string;
  type: "paragraph" | "heading" | "subtitle";
}

// Base interface with common properties
interface BaseMenuItem {
  id: string;
  label: string;
  linkType: LinkType;
  slug?: string;
  enabled: boolean;
  expanded?: boolean;
  // Common content blocks - OPTIONAL for ALL items
  images?: MenuImage[];
  textBlocks?: MenuTextBlock[];
  buttons?: MenuButton[];
}

// ==================== FIXED DISCRIMINATED UNIONS ====================
interface StaticMenuItem extends BaseMenuItem {
  menuType: "static";
  children?: never;
}

// Fixed: DropdownChild now has proper type discriminator
interface DropdownChild extends BaseMenuItem {
  menuType: "dropdown-child";
  children?: never;
}

interface DropdownMenuItem extends BaseMenuItem {
  menuType: "dropdown";
  children: DropdownChild[];
}

// Mega menu supports unlimited nesting
interface MegaMenuItem extends BaseMenuItem {
  menuType: "mega";
  children: MegaMenuItem[];
}

// Breadcrumb supports linear unlimited nesting
interface BreadcrumbMenuItem extends BaseMenuItem {
  menuType: "breadcrumb";
  children?: BreadcrumbMenuItem[];
}

// Sidebar menu
interface SidebarMenuItem extends BaseMenuItem {
  menuType: "sidebar";
  children?: SidebarMenuItem[];
}

// Updated union type to include DropdownChild
type MenuItem =
  | StaticMenuItem
  | DropdownMenuItem
  | MegaMenuItem
  | BreadcrumbMenuItem
  | SidebarMenuItem
  | DropdownChild;

// Menu configuration
interface MenuConfig {
  location: MenuLocation;
  navbarType: NavbarType;
}

// Preview component props
interface MenuPreviewProps {
  menuItems: MenuItem[];
  config: MenuConfig;
}

// ==================== PREVIEW COMPONENT ====================
function MenuPreview({ menuItems, config }: MenuPreviewProps) {
  const renderPreviewItem = (item: MenuItem, depth = 0) => {
    const isStatic = config.navbarType === "static";
    const isDropdown = config.navbarType === "dropdown";
    const isMega = config.navbarType === "mega";
    const isBreadcrumb = config.navbarType === "breadcrumb";
    const isSidebar = config.location === "sidebar";

    if (!item.enabled) return null;

    return (
      <div key={item.id} className="relative">
        {/* Main item */}
        <div
          className={`
            flex items-center gap-2 px-3 py-2 rounded-md transition-colors
            ${depth === 0 ? "font-medium" : "font-normal"}
            ${item.linkType !== "none" ? "hover:bg-accent cursor-pointer" : "cursor-default"}
            ${isSidebar ? "text-sm" : "text-base"}
          `}
          style={{ marginLeft: `${depth * 12}px` }}
        >
          {item.linkType === "external" && <ExternalLink className="h-3 w-3" />}
          <span>{item.label}</span>

          {/* Content indicators */}
          {item.images && item.images.length > 0 && (
            <ImageIcon className="h-3 w-3 text-muted-foreground" />
          )}
          {item.textBlocks && item.textBlocks.length > 0 && (
            <Type className="h-3 w-3 text-muted-foreground" />
          )}

          {/* Child indicator for non-static menus */}
          {!isStatic &&
            item.menuType !== "dropdown-child" &&
            item.menuType !== "static" &&
            "children" in item &&
            item.children &&
            ((isDropdown && depth === 0) || isMega || isBreadcrumb) && (
              <ChevronDown className="h-3 w-3 ml-auto" />
            )}
        </div>

        {/* Render children based on menu type */}
        {!isStatic &&
          item.menuType !== "dropdown-child" &&
          item.menuType !== "static" &&
          "children" in item &&
          item.children && (
            <div
              className={`
            ${isDropdown ? "ml-4 border-l-2 border-muted pl-2" : ""}
            ${isMega ? "grid grid-cols-2 gap-4 ml-6" : ""}
            ${isBreadcrumb ? "flex items-center gap-1 ml-6" : ""}
          `}
            >
              {Array.isArray(item.children)
                ? item.children.map((child) =>
                    renderPreviewItem(child as MenuItem, depth + 1),
                  )
                : renderPreviewItem(item.children, depth + 1)}
            </div>
          )}

        {/* Render content blocks */}
        {item.images && item.images.length > 0 && (
          <div className="flex gap-2 mt-2 ml-3">
            {item.images.slice(0, 2).map((img) => (
              <div
                key={img.id}
                className="w-16 h-16 bg-muted rounded flex items-center justify-center"
              >
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`
      p-4 rounded-lg border bg-background
      ${config.location === "navbar" ? "min-w-75" : "min-w-62.5"}
    `}
    >
      <div className="flex items-center gap-2 mb-4 pb-3 border-b">
        <div
          className={`
          p-1.5 rounded-md
          ${config.location === "navbar" ? "bg-blue-100 dark:bg-blue-900" : "bg-green-100 dark:bg-green-900"}
        `}
        >
          {config.location === "navbar" ? (
            <Menu className="h-4 w-4" />
          ) : (
            <PanelLeft className="h-4 w-4" />
          )}
        </div>
        <div>
          <div className="font-medium text-sm">
            {config.location === "navbar"
              ? `${config.navbarType} Navbar`
              : "Sidebar"}{" "}
            Preview
          </div>
          <div className="text-xs text-muted-foreground">
            {menuItems.length} item{menuItems.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      <div className="space-y-1">
        {menuItems.map((item) => renderPreviewItem(item))}
      </div>

      {menuItems.length === 0 && (
        <div className="text-center py-8 text-muted-foreground text-sm">
          No menu items yet. Add items to see preview.
        </div>
      )}
    </div>
  );
}

// ==================== UPDATED MENU BUILDER ====================
export function MenuBuilder({ menuId }: { menuId: string }) {
  const [config, setConfig] = useState<MenuConfig>({
    location: "navbar",
    navbarType: "static",
  });
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: "1",
      label: "Home",
      menuType: "static",
      linkType: "internal",
      slug: "/home",
      enabled: true,
    },
    {
      id: "2",
      label: "About",
      menuType: "static",
      linkType: "internal",
      slug: "/about",
      enabled: true,
    },
  ]);

  useEffect(() => {
    if (!menuId) return;

    const loadMenu = async () => {
      try {
        setLoading(true);
        const data = await loadMenuById(menuId);

        const resolvedConfig: MenuConfig = {
          location: mapLocation(data.menuLocation),
          navbarType: data.navbarType || "mega",
        };

        setConfig(resolvedConfig);

        setMenuItems(denormalizeMenuItemsFromDB(data.items, 0, resolvedConfig));
      } catch (err) {
        console.error(err);
        setMessage("Failed to load menu");
      } finally {
        setLoading(false);
      }
    };

    loadMenu();
  }, [menuId]);

  const inferMenuType = (
    item: any,
    depth: number,
    config: MenuConfig,
  ): MenuItem["menuType"] => {
    if (config.location === "sidebar") return "sidebar";

    if (config.navbarType === "static") return "static";

    if (config.navbarType === "dropdown") {
      return depth === 0 ? "dropdown" : "dropdown-child";
    }

    if (config.navbarType === "breadcrumb") return "breadcrumb";

    // mega (default)
    return "mega";
  };

  const mapLocation = (location?: string): MenuLocation => {
    if (location === "sidebar") return "sidebar";
    return "navbar"; // default for "header" or undefined
  };

  const denormalizeMenuItemsFromDB = (
    items: any[],
    depth = 0,
    config: MenuConfig,
  ): MenuItem[] => {
    return items
      .sort((a, b) => a.order - b.order)
      .map((item) => {
        const menuType = inferMenuType(item, depth, config);

        return {
          id: generateId(),
          label: item.label,
          linkType: item.type ?? "internal",
          slug: item.link ?? "/",
          enabled: item.enabled ?? true,
          menuType,
          expanded: true,

          images: item.images || [],
          textBlocks: item.textBlocks || [],
          buttons: item.buttons || [],

          children: item.children?.length
            ? denormalizeMenuItemsFromDB(item.children, depth + 1, config)
            : [],
        } as MenuItem;
      });
  };

  const [previewOpen, setPreviewOpen] = useState(false);

  // Fixed: Added type guard for DropdownChild
  const isDropdownChild = (item: MenuItem): item is DropdownChild =>
    item.menuType === "dropdown-child";

  const isStaticItem = (item: MenuItem): item is StaticMenuItem =>
    item.menuType === "static";

  const isDropdownItem = (item: MenuItem): item is DropdownMenuItem =>
    item.menuType === "dropdown";

  const isMegaItem = (item: MenuItem): item is MegaMenuItem =>
    item.menuType === "mega";

  const isBreadcrumbItem = (item: MenuItem): item is BreadcrumbMenuItem =>
    item.menuType === "breadcrumb";

  const isSidebarItem = (item: MenuItem): item is SidebarMenuItem =>
    item.menuType === "sidebar";

  // Find selected item with proper type narrowing
  const selectedItem = selectedItemId
    ? findMenuItem(menuItems, selectedItemId)
    : null;

  // ==================== FIXED UTILITY FUNCTIONS ====================
  function generateId(): string {
    return `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  function createEmptyItem(): MenuItem {
    const base = {
      id: generateId(),
      label: "New Item",
      linkType: "internal" as LinkType,
      slug: "/",
      enabled: true,
    };

    if (config.location === "sidebar") {
      return {
        ...base,
        menuType: "sidebar",
        children: [],
      } as SidebarMenuItem;
    }

    // Navbar types
    switch (config.navbarType) {
      case "static":
        return {
          ...base,
          menuType: "static",
        } as StaticMenuItem;
      case "dropdown":
        return {
          ...base,
          menuType: "dropdown",
          children: [],
        } as DropdownMenuItem;
      case "mega":
        return {
          ...base,
          menuType: "mega",
          children: [],
        } as MegaMenuItem;
      case "breadcrumb":
        return {
          ...base,
          menuType: "breadcrumb",
        } as BreadcrumbMenuItem;
      default:
        return {
          ...base,
          menuType: "static",
        } as StaticMenuItem;
    }
  }

  // FIXED: Proper recursive search for all menu types
  function findMenuItem(items: MenuItem[], id: string): MenuItem | null {
    for (const item of items) {
      if (item.id === id) return item;

      // Check if item has children based on type
      if (isDropdownItem(item) && item.children) {
        for (const child of item.children) {
          if (child.id === id) return child;
        }
      } else if (isMegaItem(item) && item.children) {
        const found = findMenuItem(item.children as MenuItem[], id);
        if (found) return found;
      } else if (isBreadcrumbItem(item) && item.children) {
        const found = findMenuItem(item.children as MenuItem[], id);
        if (found) return found;
      } else if (isSidebarItem(item) && item.children) {
        const found = findMenuItem(item.children as MenuItem[], id);
        if (found) return found;
      }
    }
    return null;
  }

  // FIXED: Update function with proper type handling
  const updateMenuItem = (
    id: string,
    updates: Partial<Omit<MenuItem, "menuType">>,
  ) => {
    setMenuItems((prev) => {
      const updateInTree = (items: MenuItem[]): MenuItem[] => {
        return items.map((item) => {
          if (item.id === id) {
            // Preserve menuType when updating
            return { ...item, ...updates } as MenuItem;
          }

          // Recursively update children based on type
          if (isDropdownItem(item) && item.children) {
            return {
              ...item,
              children: item.children.map((child) =>
                child.id === id
                  ? ({ ...child, ...updates } as DropdownChild)
                  : child,
              ),
            } as DropdownMenuItem;
          }

          if (isMegaItem(item) && item.children) {
            return {
              ...item,
              children: updateInTree(item.children) as MegaMenuItem[],
            } as MegaMenuItem;
          }

          if (isBreadcrumbItem(item) && item.children) {
            return {
              ...item,
              children: updateInTree(item.children) as BreadcrumbMenuItem[],
            } as BreadcrumbMenuItem;
          }

          if (isSidebarItem(item) && item.children) {
            return {
              ...item,
              children: updateInTree(item.children) as SidebarMenuItem[],
            } as SidebarMenuItem;
          }

          return item;
        });
      };

      return updateInTree(prev);
    });
  };

  // FIXED: Add child with proper nesting rules// FIXED: Make sure the function properly updates state
  const addChildItem = (parentId: string) => {
    const parentItem = findMenuItem(menuItems, parentId);
    if (!parentItem) return;

    const newChildBase = {
      id: generateId(),
      label: `Child ${(parentItem.children?.length || 0) + 1}`,
      linkType: "internal" as LinkType,
      slug: "/",
      enabled: true,
    };

    setMenuItems((prev) => {
      const addChildRecursive = (items: MenuItem[]): MenuItem[] => {
        return items.map((item) => {
          if (item.id === parentId) {
            switch (item.menuType) {
              case "dropdown":
                const newDropdownChild: DropdownChild = {
                  ...newChildBase,
                  menuType: "dropdown-child",
                };
                return {
                  ...item,
                  children: [...(item.children || []), newDropdownChild],
                  expanded: true,
                } as DropdownMenuItem;

              case "mega":
                const newMegaChild: MegaMenuItem = {
                  ...newChildBase,
                  menuType: "mega",
                  children: [],
                };
                return {
                  ...item,
                  children: [
                    ...((item as MegaMenuItem).children || []),
                    newMegaChild,
                  ],
                  expanded: true,
                } as MegaMenuItem;

              case "breadcrumb":
                const newBreadcrumbChild: BreadcrumbMenuItem = {
                  ...newChildBase,
                  menuType: "breadcrumb",
                };
                // Breadcrumb can only have one child
                return {
                  ...item,
                  children: [newBreadcrumbChild],
                  expanded: true,
                } as BreadcrumbMenuItem;

              case "sidebar":
                const newSidebarChild: SidebarMenuItem = {
                  ...newChildBase,
                  menuType: "sidebar",
                  children: [],
                };
                return {
                  ...item,
                  children: [
                    ...((item as SidebarMenuItem).children || []),
                    newSidebarChild,
                  ],
                  expanded: true,
                } as SidebarMenuItem;

              default:
                return item;
            }
          }

          // Recursively search for parent in children
          if (isMegaItem(item) && item.children) {
            return {
              ...item,
              children: addChildRecursive(item.children) as MegaMenuItem[],
            };
          }
          if (isSidebarItem(item) && item.children) {
            return {
              ...item,
              children: addChildRecursive(item.children) as SidebarMenuItem[],
            };
          }
          if (isBreadcrumbItem(item) && item.children) {
            return {
              ...item,
              children: addChildRecursive(
                item.children,
              ) as BreadcrumbMenuItem[],
            };
          }
          if (isDropdownItem(item) && item.children) {
            return { ...item, children: item.children }; // No recursion for dropdown children
          }

          return item;
        });
      };

      return addChildRecursive(prev);
    });

    // Auto-select the new child for editing
    setTimeout(() => {
      const newItemId = `${parentId}-child-${(parentItem.children?.length || 0) + 1}`;
      const actualNewItem = findMenuItem(menuItems, newItemId);
      if (actualNewItem) {
        setSelectedItemId(actualNewItem.id);
      }
    }, 100);
  };
  // FIXED: Add nested child for mega menu only
  const addNestedChild = (parentChildId: string) => {
    const newNestedChild: MegaMenuItem = {
      id: generateId(),
      label: "Nested Item",
      menuType: "mega",
      linkType: "internal",
      slug: "/",
      enabled: true,
      children: [],
    };

    const addToMegaChildren = (children: MegaMenuItem[]): MegaMenuItem[] => {
      return children.map((child) => {
        if (child.id === parentChildId) {
          return {
            ...child,
            children: [...(child.children || []), newNestedChild],
          };
        }
        if (child.children) {
          return { ...child, children: addToMegaChildren(child.children) };
        }
        return child;
      });
    };

    setMenuItems((prev) =>
      prev.map((item) => {
        if (isMegaItem(item)) {
          return { ...item, children: addToMegaChildren(item.children) };
        }
        return item;
      }),
    );
  };

  // FIXED: Delete menu item with proper type handling
  const deleteMenuItem = (id: string) => {
    const deleteFromTree = (items: MenuItem[]): MenuItem[] => {
      return items
        .filter((item) => item.id !== id)
        .map((item) => {
          // Handle children deletion based on type
          if (isDropdownItem(item) && item.children) {
            return {
              ...item,
              children: item.children.filter((child) => child.id !== id),
            } as DropdownMenuItem;
          }

          if (isMegaItem(item) && item.children) {
            return {
              ...item,
              children: deleteFromTree(item.children) as MegaMenuItem[],
            } as MegaMenuItem;
          }

          if (isSidebarItem(item) && item.children) {
            return {
              ...item,
              children: deleteFromTree(item.children) as SidebarMenuItem[],
            } as SidebarMenuItem;
          }

          if (isBreadcrumbItem(item) && item.children) {
            // For breadcrumb, if child is deleted, clear the children
            const updatedChildren = deleteFromTree(
              item.children,
            ) as BreadcrumbMenuItem[];
            if (updatedChildren.length === 0) {
              const { children, ...rest } = item;
              return rest as BreadcrumbMenuItem;
            }
            return { ...item, children: updatedChildren } as BreadcrumbMenuItem;
          }

          return item;
        });
    };

    setMenuItems(deleteFromTree(menuItems));
    if (selectedItemId === id) setSelectedItemId(null);
  };

  // FIXED: Add content block to any item
  const addContentBlock = (
    itemId: string,
    type: "image" | "text" | "button",
  ) => {
    setMenuItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;

        const newId = generateId();

        switch (type) {
          case "image":
            return {
              ...item,
              images: [
                ...(item.images || []),
                {
                  id: newId,
                  url: "",
                  alt: "New Image",
                },
              ],
            };
          case "text":
            return {
              ...item,
              textBlocks: [
                ...(item.textBlocks || []),
                {
                  id: newId,
                  content: "New text content",
                  type: "paragraph",
                },
              ],
            };
          case "button":
            return {
              ...item,
              buttons: [
                ...(item.buttons || []),
                {
                  id: newId,
                  label: "New Button",
                  action: "/",
                  variant: "primary",
                },
              ],
            };
          default:
            return item;
        }
      }),
    );
  };

  // FIXED: Update content blocks with controlled inputs
  const updateContentBlock = (
    itemId: string,
    type: "image" | "text" | "button",
    blockId: string,
    updates: Partial<MenuImage | MenuTextBlock | MenuButton>,
  ) => {
    setMenuItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;

        switch (type) {
          case "image":
            return {
              ...item,
              images: item.images?.map((img) =>
                img.id === blockId
                  ? ({ ...img, ...updates } as MenuImage)
                  : img,
              ),
            };
          case "text":
            return {
              ...item,
              textBlocks: item.textBlocks?.map((text) =>
                text.id === blockId
                  ? ({ ...text, ...updates } as MenuTextBlock)
                  : text,
              ),
            };
          case "button":
            return {
              ...item,
              buttons: item.buttons?.map((btn) =>
                btn.id === blockId
                  ? ({ ...btn, ...updates } as MenuButton)
                  : btn,
              ),
            };
          default:
            return item;
        }
      }),
    );
  };

  // FIXED: Normalize menu items for database with proper type handling
  const normalizeMenuItemsForDB = (items: MenuItem[]): any[] => {
    return items.map((item, index) => ({
      label: item.label,
      type: item.linkType ?? "internal",
      link: item.slug ?? "",
      enabled: item.enabled ?? true,
      order: index,
      menuType: item.menuType,
      // Preserve content blocks
      images: item.images || [],
      textBlocks: item.textBlocks || [],
      buttons: item.buttons || [],
      children:
        "children" in item && item.children
          ? normalizeMenuItemsForDB(item.children)
          : [],
    }));
  };

  const router = useRouter();

  const handleSave = async () => {
    // Validate menu structure based on type
    const validationErrors: string[] = [];

    const validateMenu = (
      items: MenuItem[],
      depth = 0,
      parentLabel = "",
    ): void => {
      items.forEach((item) => {
        // First, ensure we're dealing with a valid menu item
        if (!item || typeof item !== "object") {
          validationErrors.push("Invalid menu item detected");
          return;
        }

        // Check static navbar for children
        if (config.navbarType === "static" && item.menuType === "static") {
          // Use type assertion to check if it's a static item with children property
          const staticItem = item as StaticMenuItem;
          if ("children" in staticItem && staticItem.children) {
            validationErrors.push(
              `Static navbar item "${staticItem.label}" cannot have children`,
            );
          }
        }

        // Check dropdown nesting depth
        if (
          config.navbarType === "dropdown" &&
          item.menuType === "dropdown" &&
          depth > 1
        ) {
          validationErrors.push(
            `Dropdown item "${item.label}" exceeds maximum depth of 1`,
          );
        }

        // Recursively validate children based on type
        if (isMegaItem(item) && item.children) {
          validateMenu(item.children, depth + 1, item.label);
        } else if (isSidebarItem(item) && item.children) {
          validateMenu(item.children, depth + 1, item.label);
        } else if (isBreadcrumbItem(item) && item.children) {
          validateMenu(item.children, depth + 1, item.label);
        } else if (isDropdownItem(item) && item.children) {
          // For dropdown, validate children but don't recurse further (dropdown children can't have children)
          item.children.forEach((child) => {
            if (!child.enabled) {
              validationErrors.push(
                `Dropdown child "${child.label}" in "${item.label}" is disabled`,
              );
            }
          });
        }
        // For static items and dropdown children, no recursion needed
      });
    };

    validateMenu(menuItems);

    if (validationErrors.length > 0) {
      setMessage(`Validation errors:\n${validationErrors.join("\n")}`);
      return;
    }

    const menuDataForDB = {
      items: normalizeMenuItemsForDB(menuItems),
      location: config.location,
      navbarType: config.location === "navbar" ? config.navbarType : undefined,
      updatedAt: new Date().toISOString(),
    };

    try {
      setLoading(true);
      const response = await updateMenu(menuId, menuDataForDB);

      if (response.ok) {
        setMessage("Menu saved successfully!");
        // Wait 2 seconds before redirecting to show success message
        setTimeout(() => {
          router.push("/cms/global/menus");
        }, 2000);
      } else {
        setMessage("Failed to save menu");
      }
    } catch (error) {
      console.error("Failed to save menu:", error);
      setMessage("Failed to save menu. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  // FIXED: Render menu item with proper nesting rules
  const renderMenuItem = (item: MenuItem, depth = 0) => {
    const canAddChild =
      !isDropdownChild(item) &&
      ((config.navbarType === "dropdown" && depth === 0) ||
        config.navbarType === "mega" ||
        (config.navbarType === "breadcrumb" && depth < 10) ||
        (config.location === "sidebar" && depth < 3));

    const showAddChildButton =
      canAddChild &&
      config.navbarType !== "static" &&
      !(
        config.navbarType === "breadcrumb" &&
        item.children &&
        item.children.length > 0
      );

    return (
      <div key={item.id} className="space-y-1">
        <div
          className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${
            selectedItemId === item.id
              ? "bg-primary/10 border border-primary/20"
              : "hover:bg-muted"
          }`}
          style={{ paddingLeft: `${depth * 1.5 + 0.5}rem` }}
          onClick={() => setSelectedItemId(item.id)}
        >
          <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />

          {/* Expand/collapse for items with children */}
          {item.menuType !== "dropdown-child" &&
            item.menuType !== "static" &&
            "children" in item &&
            item.children &&
            (isMegaItem(item) ||
              isSidebarItem(item) ||
              (isDropdownItem(item) && depth === 0) ||
              (isBreadcrumbItem(item) && item.children)) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateMenuItem(item.id, { expanded: !item.expanded });
                }}
                className="p-0.5 hover:bg-background rounded"
              >
                {item.expanded ? (
                  <ChevronDown className="h-3.5 w-3.5" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5" />
                )}
              </button>
            )}

          <div className="flex-1 flex items-center gap-2 min-w-0">
            <span className="font-medium text-sm truncate">{item.label}</span>

            {/* Content indicators */}
            {item.images && item.images.length > 0 && (
              <Badge variant="outline" className="h-5 px-1">
                <ImageIcon className="h-3 w-3 mr-1" />
                {item.images.length}
              </Badge>
            )}
            {item.textBlocks && item.textBlocks.length > 0 && (
              <Badge variant="outline" className="h-5 px-1">
                <Type className="h-3 w-3 mr-1" />
                {item.textBlocks.length}
              </Badge>
            )}
            {item.buttons && item.buttons.length > 0 && (
              <Badge variant="outline" className="h-5 px-1">
                <Link className="h-3 w-3 mr-1" />
                {item.buttons.length}
              </Badge>
            )}

            {item.linkType === "external" && (
              <ExternalLink className="h-3 w-3 text-muted-foreground" />
            )}
            {!item.enabled && (
              <EyeOff className="h-3 w-3 text-muted-foreground" />
            )}
          </div>

          {/* Add child button */}
          {showAddChildButton && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log("Adding child to:", item.id, item.label); // Debug log
                addChildItem(item.id);
              }}
              className="p-1 hover:bg-background rounded"
              title="Add child item"
            >
              <Plus className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          )}

          {/* Enable/disable toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              updateMenuItem(item.id, { enabled: !item.enabled });
            }}
            className="p-1 hover:bg-background rounded"
          >
            {item.enabled ? (
              <Eye className="h-4 w-4 text-muted-foreground" />
            ) : (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        </div>

        {/* Render children if expanded */}
        {item.expanded && "children" in item && item.children && (
          <div className="ml-4">
            {isDropdownItem(item) && (
              <div className="space-y-1">
                {item.children.map((child) => (
                  <div
                    key={child.id}
                    className="flex items-center gap-2 p-2 ml-4 rounded-md cursor-pointer hover:bg-muted/50"
                    onClick={() => setSelectedItemId(child.id)}
                  >
                    <GripVertical className="h-3.5 w-3.5 text-muted-foreground cursor-grab" />
                    <span className="text-sm truncate">{child.label}</span>
                  </div>
                ))}
              </div>
            )}

            {isMegaItem(item) && (
              <div className="space-y-1">
                {item.children.map((child) => renderMenuItem(child, depth + 1))}
              </div>
            )}

            {isBreadcrumbItem(item) && item.children && (
              <div className="ml-4">
                {item.children.map((child) => renderMenuItem(child, depth + 1))}
              </div>
            )}

            {isSidebarItem(item) && (
              <div className="space-y-1">
                {item.children.map((child) => renderMenuItem(child, depth + 1))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // ==================== RENDER ====================
  return (
    <div className="space-y-6">
      {/* Header with Preview Dialog */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-balance text-3xl font-bold tracking-tight">
            Menu Builder
          </h1>
          {message && (
            <div
              className={`mt-1 p-2 rounded text-sm ${message.includes("success") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
            >
              {message}
            </div>
          )}

          <p className="text-pretty text-muted-foreground mt-1">
            Build{" "}
            {config.location === "navbar"
              ? `${config.navbarType} navbar`
              : "sidebar"}{" "}
            menu
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Maximize2 className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Menu Preview</DialogTitle>
              </DialogHeader>
              <MenuPreview menuItems={menuItems} config={config} />
            </DialogContent>
          </Dialog>
          <Button onClick={handleSave} disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Saving..." : "Save Menu"}
          </Button>
        </div>
      </div>

      {/* Configuration Card */}
      <Card>
        <CardHeader>
          <CardTitle>Menu Configuration</CardTitle>
          <CardDescription>Configure menu location and type</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Menu Location</Label>
                <RadioGroup
                  value={config.location}
                  onValueChange={(value: MenuLocation) =>
                    setConfig({ location: value, navbarType: "static" })
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="navbar" id="navbar" />
                    <Label
                      htmlFor="navbar"
                      className="font-normal cursor-pointer"
                    >
                      Navbar
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sidebar" id="sidebar" />
                    <Label
                      htmlFor="sidebar"
                      className="font-normal cursor-pointer"
                    >
                      Sidebar
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {config.location === "navbar" && (
                <div className="space-y-2">
                  <Label>Navbar Type</Label>
                  <RadioGroup
                    value={config.navbarType}
                    onValueChange={(value: NavbarType) =>
                      setConfig((prev) => ({ ...prev, navbarType: value }))
                    }
                  >
                    <div className="flex flex-wrap gap-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="static" id="static" />
                        <Label
                          htmlFor="static"
                          className="font-normal cursor-pointer text-xs"
                        >
                          Static (No children)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="dropdown" id="dropdown" />
                        <Label
                          htmlFor="dropdown"
                          className="font-normal cursor-pointer text-xs"
                        >
                          Dropdown (One level)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="mega" id="mega" />
                        <Label
                          htmlFor="mega"
                          className="font-normal cursor-pointer text-xs"
                        >
                          Mega (Unlimited nesting)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="breadcrumb" id="breadcrumb" />
                        <Label
                          htmlFor="breadcrumb"
                          className="font-normal cursor-pointer text-xs"
                        >
                          Breadcrumb (Linear chain)
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              )}
            </div>

            <div className="border-l pl-6">
              <div className="space-y-2">
                <h4 className="font-medium">Nesting Rules</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {config.location === "navbar" ? (
                    config.navbarType === "static" ? (
                      <>
                        <li>• No children allowed</li>
                        <li>• Flat structure only</li>
                      </>
                    ) : config.navbarType === "dropdown" ? (
                      <>
                        <li>• One level of children only</li>
                        <li>• Children cannot have children</li>
                      </>
                    ) : config.navbarType === "mega" ? (
                      <>
                        <li>• Unlimited nesting depth</li>
                        <li>• Children can have children</li>
                      </>
                    ) : (
                      <>
                        <li>• Linear parent→child chain</li>
                        <li>• Each item can have one child</li>
                      </>
                    )
                  ) : (
                    <>
                      <li>• Simple nesting allowed</li>
                      <li>• Max 3 levels recommended</li>
                    </>
                  )}
                  <li className="pt-2">
                    • All items support optional: images, text blocks, buttons
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Two-panel layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Panel - Menu Tree */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Menu Structure</CardTitle>
                <CardDescription>
                  {config.navbarType === "static"
                    ? "Static navbar: No children allowed"
                    : config.navbarType === "dropdown"
                      ? "Dropdown: One level of children"
                      : config.navbarType === "mega"
                        ? "Mega menu: Unlimited nesting"
                        : config.navbarType === "breadcrumb"
                          ? "Breadcrumb: Linear chain"
                          : "Sidebar: Simple nesting"}
                </CardDescription>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const newItem = createEmptyItem();
                  setMenuItems([...menuItems, newItem]);
                  setSelectedItemId(newItem.id);
                }}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-150 pr-4">
              {menuItems.length === 0 ? (
                <div className="h-100 flex flex-col items-center justify-center text-center text-muted-foreground">
                  <div className="p-4 rounded-full bg-muted mb-4">
                    <Plus className="h-8 w-8" />
                  </div>
                  <p className="font-medium">No menu items yet</p>
                  <p className="text-sm mt-1">
                    Add your first item to start building
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {menuItems.map((item) => renderMenuItem(item))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Right Panel - Item Editor */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>
              {selectedItem ? `Edit: ${selectedItem.label}` : "Item Editor"}
            </CardTitle>
            <CardDescription>
              {selectedItem
                ? `Configure ${config.location} item settings`
                : "Select an item to edit"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedItem ? (
              <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="blocks">Content Blocks</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                {/* Content Tab */}
                <TabsContent value="content" className="space-y-6 mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="label">Label</Label>
                    <Input
                      id="label"
                      value={selectedItem.label}
                      onChange={(e) =>
                        updateMenuItem(selectedItem.id, {
                          label: e.target.value,
                        })
                      }
                      placeholder="Menu item label"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Link Type</Label>
                    <RadioGroup
                      value={selectedItem.linkType}
                      onValueChange={(value: LinkType) =>
                        updateMenuItem(selectedItem.id, { linkType: value })
                      }
                    >
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="internal" id="internal" />
                          <Label
                            htmlFor="internal"
                            className="font-normal cursor-pointer text-sm"
                          >
                            Internal Page
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="external" id="external" />
                          <Label
                            htmlFor="external"
                            className="font-normal cursor-pointer text-sm"
                          >
                            External URL
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="none" id="none" />
                          <Label
                            htmlFor="none"
                            className="font-normal cursor-pointer text-sm"
                          >
                            No Link
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  {(selectedItem.linkType === "internal" ||
                    selectedItem.linkType === "external") && (
                    <div className="space-y-2">
                      <Label>
                        {selectedItem.linkType === "internal"
                          ? "Page URL"
                          : "External URL"}
                      </Label>
                      <Input
                        value={selectedItem.slug || ""}
                        onChange={(e) =>
                          updateMenuItem(selectedItem.id, {
                            slug: e.target.value,
                          })
                        }
                        placeholder={
                          selectedItem.linkType === "internal"
                            ? "/about"
                            : "https://example.com"
                        }
                      />
                    </div>
                  )}
                </TabsContent>

                {/* Content Blocks Tab */}
                <TabsContent value="blocks" className="space-y-6 mt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">
                        Content Blocks
                      </Label>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            addContentBlock(selectedItem.id, "image")
                          }
                        >
                          <ImageIcon className="h-3 w-3 mr-2" />
                          Add Image
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            addContentBlock(selectedItem.id, "text")
                          }
                        >
                          <Type className="h-3 w-3 mr-2" />
                          Add Text
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            addContentBlock(selectedItem.id, "button")
                          }
                        >
                          <Link className="h-3 w-3 mr-2" />
                          Add Button
                        </Button>
                      </div>
                    </div>

                    {/* Images */}
                    {selectedItem.images && selectedItem.images.length > 0 && (
                      <div className="space-y-3">
                        <Label className="text-sm">Images</Label>
                        {selectedItem.images.map((img) => (
                          <div
                            key={img.id}
                            className="flex items-center gap-3 p-3 border rounded-md"
                          >
                            <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                              <ImageIcon className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div className="flex-1 space-y-2">
                              <Input
                                placeholder="Image URL"
                                value={img.url}
                                onChange={(e) =>
                                  updateContentBlock(
                                    selectedItem.id,
                                    "image",
                                    img.id,
                                    { url: e.target.value },
                                  )
                                }
                              />
                              <Input
                                placeholder="Alt text"
                                value={img.alt}
                                onChange={(e) =>
                                  updateContentBlock(
                                    selectedItem.id,
                                    "image",
                                    img.id,
                                    { alt: e.target.value },
                                  )
                                }
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Text Blocks */}
                    {selectedItem.textBlocks &&
                      selectedItem.textBlocks.length > 0 && (
                        <div className="space-y-3">
                          <Label className="text-sm">Text Blocks</Label>
                          {selectedItem.textBlocks.map((text) => (
                            <div
                              key={text.id}
                              className="p-3 border rounded-md"
                            >
                              <Textarea
                                placeholder="Text content"
                                value={text.content}
                                onChange={(e) =>
                                  updateContentBlock(
                                    selectedItem.id,
                                    "text",
                                    text.id,
                                    { content: e.target.value },
                                  )
                                }
                                rows={3}
                              />
                            </div>
                          ))}
                        </div>
                      )}

                    {/* Buttons */}
                    {selectedItem.buttons &&
                      selectedItem.buttons.length > 0 && (
                        <div className="space-y-3">
                          <Label className="text-sm">Buttons</Label>
                          {selectedItem.buttons.map((btn) => (
                            <div
                              key={btn.id}
                              className="flex items-center gap-3 p-3 border rounded-md"
                            >
                              <Input
                                placeholder="Button label"
                                value={btn.label}
                                onChange={(e) =>
                                  updateContentBlock(
                                    selectedItem.id,
                                    "button",
                                    btn.id,
                                    { label: e.target.value },
                                  )
                                }
                              />
                              <Input
                                placeholder="Action URL"
                                value={btn.action}
                                onChange={(e) =>
                                  updateContentBlock(
                                    selectedItem.id,
                                    "button",
                                    btn.id,
                                    { action: e.target.value },
                                  )
                                }
                              />
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                </TabsContent>

                {/* Settings Tab */}
                <TabsContent value="settings" className="space-y-6 mt-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enabled</Label>
                      <p className="text-xs text-muted-foreground">
                        Show this item in the menu
                      </p>
                    </div>
                    <Switch
                      checked={selectedItem.enabled}
                      onCheckedChange={(checked) =>
                        updateMenuItem(selectedItem.id, { enabled: checked })
                      }
                    />
                  </div>

                  <div className="pt-4 border-t">
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        deleteMenuItem(selectedItem.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Item
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="h-100 flex flex-col items-center justify-center text-center text-muted-foreground">
                <div className="p-4 rounded-full bg-muted mb-4">
                  <FileText className="h-8 w-8" />
                </div>
                <p className="font-medium">No item selected</p>
                <p className="text-sm mt-1">
                  Select an item from the menu tree to edit its properties
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
