import {
  Globe,
  LayoutDashboard,
  Shield,
  AlertTriangle,
  BarChart3,
  Settings,
  Users,
  Clock,
  Activity,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    title: "Mission Control",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Domain Registry",
    url: "/domains",
    icon: Globe,
  },
  {
    title: "Registrants",
    url: "/registrants",
    icon: Users,
  },
  {
    title: "Transitions",
    url: "/transitions",
    icon: Clock,
  },
];

const trustSafetyItems = [
  {
    title: "Abuse Reports",
    url: "/abuse",
    icon: AlertTriangle,
    badge: "2",
  },
  {
    title: "Suspended",
    url: "/suspended",
    icon: Shield,
    badge: "2",
  },
];

const observabilityItems = [
  {
    title: "Metrics",
    url: "/metrics",
    icon: BarChart3,
  },
  {
    title: "Live Activity",
    url: "/activity",
    icon: Activity,
  },
];

interface AppSidebarProps {
  currentPath?: string;
}

function isActive(itemUrl: string, currentPath: string): boolean {
  if (itemUrl === "/") {
    return currentPath === "/" || currentPath === "";
  }
  return currentPath.startsWith(itemUrl);
}

export function AppSidebar({ currentPath = "/" }: AppSidebarProps) {
  return (
    <Sidebar
      collapsible="none"
      className="border-r-2 border-zinc-200 bg-white h-full"
    >
      <SidebarHeader className="border-b-2 border-zinc-100 px-6 py-4 bg-white">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white shadow-none">
            <Globe className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold text-zinc-900 tracking-wide">
              DomainRegistrar
            </span>
            <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">
              Control Plane
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-4 py-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
            Systems
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const active = isActive(item.url, currentPath);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      size="lg"
                      className={cn(
                        "transition-colors duration-200",
                        active
                          ? "bg-orange-500/10 text-orange-600 border-l-2 border-orange-500"
                          : "hover:bg-zinc-100 hover:text-orange-600 text-zinc-600",
                      )}
                    >
                      <a href={item.url} className="flex items-center gap-3">
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium">{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="bg-white/5 my-2" />

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
            Trust & Safety
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {trustSafetyItems.map((item) => {
                const active = isActive(item.url, currentPath);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      size="lg"
                      className={cn(
                        "transition-colors duration-200",
                        active
                          ? "bg-red-500/10 text-red-600 border-l-2 border-red-500"
                          : "hover:bg-zinc-100 hover:text-red-600 text-zinc-600",
                      )}
                    >
                      <a
                        href={item.url}
                        className="flex items-center gap-3 justify-between w-full"
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="h-5 w-5" />
                          <span className="font-medium">{item.title}</span>
                        </div>
                        {item.badge && (
                          <Badge
                            variant="destructive"
                            className="h-5 px-1.5 text-[10px] min-w-5 flex items-center justify-center"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="bg-white/5 my-2" />

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
            Observability
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {observabilityItems.map((item) => {
                const active = isActive(item.url, currentPath);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      size="lg"
                      className={cn(
                        "transition-colors duration-200",
                        active
                          ? "bg-blue-500/10 text-blue-600 border-l-2 border-blue-500"
                          : "hover:bg-zinc-100 hover:text-blue-600 text-zinc-600",
                      )}
                    >
                      <a href={item.url} className="flex items-center gap-3">
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium">{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t-2 border-zinc-100 p-4 bg-white">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              className="hover:bg-zinc-100 transition-colors text-zinc-900"
            >
              <a href="/settings" className="flex items-center gap-3">
                <Settings className="h-5 w-5" />
                <div className="flex flex-col text-left">
                  <span className="font-medium">Settings</span>
                  <span className="text-[10px] text-muted-foreground">
                    v1.2.0 • Edge-Native
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
