import { Separator } from "@/components/ui/separator"
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
  Menu,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface DashboardShellProps {
  children: React.ReactNode
  title: string
  description?: string
}

const navigationItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Domains", url: "/domains", icon: Globe },
  { title: "Registrants", url: "/registrants", icon: Users },
  { title: "Transitions", url: "/transitions", icon: Clock },
]

const trustSafetyItems = [
  { title: "Abuse Reports", url: "/abuse", icon: AlertTriangle },
  { title: "Suspended Domains", url: "/suspended", icon: Shield },
]

const observabilityItems = [
  { title: "Metrics", url: "/metrics", icon: BarChart3 },
  { title: "Activity Log", url: "/activity", icon: Activity },
]

export function DashboardShell({ children, title, description }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen">
      {/* Fixed Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-background">
        <div className="flex h-full flex-col">
          {/* Sidebar Header */}
          <div className="flex h-16 items-center gap-2 border-b px-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Globe className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">DomainRegistrar</span>
              <span className="text-xs text-muted-foreground">Control Plane</span>
            </div>
          </div>

          {/* Sidebar Content */}
          <ScrollArea className="flex-1 px-3 py-4">
            <div className="space-y-6">
              {/* Navigation */}
              <div>
                <h4 className="mb-2 px-2 text-xs font-semibold uppercase text-muted-foreground">
                  Navigation
                </h4>
                <nav className="space-y-1">
                  {navigationItems.map((item) => (
                    <a
                      key={item.title}
                      href={item.url}
                      className="flex items-center gap-3 rounded-md px-2 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      <item.icon className="h-4 w-4" />
                      {item.title}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Trust & Safety */}
              <div>
                <h4 className="mb-2 px-2 text-xs font-semibold uppercase text-muted-foreground">
                  Trust & Safety
                </h4>
                <nav className="space-y-1">
                  {trustSafetyItems.map((item) => (
                    <a
                      key={item.title}
                      href={item.url}
                      className="flex items-center gap-3 rounded-md px-2 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      <item.icon className="h-4 w-4" />
                      {item.title}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Observability */}
              <div>
                <h4 className="mb-2 px-2 text-xs font-semibold uppercase text-muted-foreground">
                  Observability
                </h4>
                <nav className="space-y-1">
                  {observabilityItems.map((item) => (
                    <a
                      key={item.title}
                      href={item.url}
                      className="flex items-center gap-3 rounded-md px-2 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      <item.icon className="h-4 w-4" />
                      {item.title}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </ScrollArea>

          {/* Sidebar Footer */}
          <div className="border-t p-3">
            <a
              href="/settings"
              className="flex items-center gap-3 rounded-md px-2 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <Settings className="h-4 w-4" />
              Settings
            </a>
          </div>
        </div>
      </aside>

      {/* Main Content Area - offset by sidebar width */}
      <div className="ml-64 flex-1 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold">{title}</h1>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        </header>
        <main className="flex-1 p-6">
          {children}
        </main>
        <footer className="border-t bg-background px-6 py-4">
          <div className="flex items-center justify-center text-sm text-muted-foreground">
            <p>Developed by <span className="font-semibold text-foreground">BORIS DOUON</span> - Full Stack AI-Software Engineer</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
