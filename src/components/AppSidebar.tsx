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

export function AppSidebar() {
  return (
    <Sidebar
      collapsible="none"
      className="border-r border-border bg-background/80 backdrop-blur-md"
    >
      <SidebarHeader className="border-b border-white/10 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600">
            <Globe className="h-6 w-6 text-white animate-pulse" />
            <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-500 ring-2 ring-black animate-ping" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold text-foreground tracking-wide">
              DomainRegistrar
            </span>
            <span className="text-[10px] font-medium text-orange-500 uppercase tracking-widest">
              Control Plane
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-4 py-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-bold text-muted-foreground/70 uppercase tracking-wider mb-2">
            Systems
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    size="lg"
                    className="hover:bg-orange-500/10 hover:text-orange-500 transition-all duration-300"
                  >
                    <a href={item.url} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="bg-white/5 my-2" />

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-bold text-muted-foreground/70 uppercase tracking-wider mb-2">
            Trust & Safety
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {trustSafetyItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    size="lg"
                    className="hover:bg-red-500/10 hover:text-red-500 transition-all duration-300"
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
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="bg-white/5 my-2" />

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-bold text-muted-foreground/70 uppercase tracking-wider mb-2">
            Observability
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {observabilityItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    size="lg"
                    className="hover:bg-blue-500/10 hover:text-blue-500 transition-all duration-300"
                  >
                    <a href={item.url} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-white/10 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              className="hover:bg-white/5 transition-all"
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
