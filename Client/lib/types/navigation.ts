import { LucideIcon } from "lucide-react";

type BaseNavItem = {
  name: string;
  icon: LucideIcon;
  highlight?: boolean;
  alwaysShow?: boolean;
};

export type NavLink = BaseNavItem & {
  href: string;
  children?: never;
};

export type NavGroup = BaseNavItem & {
  children: NavLink[];
  href?: never;
};

export type NavigationItem = NavLink | NavGroup;
