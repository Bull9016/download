
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  Briefcase,
  MessageSquare,
  Settings,
  UserCog,
  LayoutDashboard,
  FileText,
  ClipboardList,
  Users2,
  GitFork,
  SlidersHorizontal,
  Palette, 
  ShieldCheck as RoleIcon,
  History,
  BarChart,
} from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";

const mainNavItems = [
  { href: "/", label: "Dashboard", icon: Home, roles: ["client", "contractor", "manager", "admin"] },
  { href: "/projects", label: "Projects", icon: Briefcase, roles: ["client", "contractor", "manager", "admin"] },
  { href: "/contractors", label: "Contractors", icon: Users, roles: ["client", "manager", "admin"] },
  { href: "/matching", label: "Smart Match", icon: GitFork, roles: ["client", "manager", "admin"] },
  { href: "/chat", label: "Messages", icon: MessageSquare, roles: ["client", "contractor", "manager", "admin"] },
];

const adminNavItems = [
  { href: "/admin", label: "Admin Dashboard", icon: LayoutDashboard, roles: ["admin"] },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart, roles: ["admin"] },
  { href: "/admin/users", label: "User Management", icon: Users2, roles: ["admin"] },
  { href: "/admin/roles", label: "Role Management", icon: RoleIcon, roles: ["admin"] }, 
  { href: "/admin/work-allocation", label: "Work Allocation", icon: ClipboardList, roles: ["admin"] },
  { href: "/admin/managers", label: "Manager Management", icon: UserCog, roles: ["admin"] },
  { href: "/admin/appearance", label: "Appearance", icon: Palette, roles: ["admin"] }, 
  { href: "/admin/activity-log", label: "Activity Log", icon: History, roles: ["admin"] },
  { href: "/admin/settings", label: "System Settings", icon: SlidersHorizontal, roles: ["admin"] },
];

const accountSettingsItem = { href: "/account/settings", label: "Account Settings", icon: Settings, roles: ["client", "contractor", "manager", "admin"] };

export function NavMenu() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const currentUserRole = "admin"; // Mock role for display purposes

  const renderNavItem = (item: typeof mainNavItems[0] | typeof accountSettingsItem | typeof adminNavItems[0], index: number) => {
    if (!item.roles.includes(currentUserRole)) {
      return null;
    }
    const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
    return (
      <SidebarMenuItem key={`${item.label}-${index}`}>
        <Link href={item.href}>
          <SidebarMenuButton
            onClick={() => setOpenMobile(false)}
            isActive={isActive}
            tooltip={item.label}
            aria-current={isActive ? "page" : undefined}
          >
            <item.icon aria-hidden="true" />
            <span>{item.label}</span>
          </SidebarMenuButton>
        </Link>
      </SidebarMenuItem>
    );
  };

  return (
    <>
      <SidebarMenu>
        {mainNavItems.map(renderNavItem)}
      </SidebarMenu>
      
      {currentUserRole === "admin" && (
        <>
          <p className="px-4 py-2 text-xs font-medium text-muted-foreground group-data-[collapsible=icon]:hidden">Admin</p>
          <SidebarMenu>
            {adminNavItems.map(renderNavItem)}
          </SidebarMenu>
        </>
      )}
      
      <div className="mt-auto"> {/* Pushes account settings to the bottom */}
        <SidebarMenu>
          {renderNavItem(accountSettingsItem, 99)}
        </SidebarMenu>
      </div>
    </>
  );
}
