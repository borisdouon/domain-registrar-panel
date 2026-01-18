import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Bell, Search, User } from "lucide-react";

interface DashboardShellProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export function DashboardShell({
  children,
  title,
  description,
}: DashboardShellProps) {
  return (
    <SidebarProvider defaultOpen>
      <AppSidebar />
      <SidebarInset className="bg-background/95 backdrop-blur-sm transition-all duration-300 ease-in-out">
        <header className="flex h-16 shrink-0 items-center border-b px-6 sticky top-0 z-10 bg-background/80 backdrop-blur-md">
          <div className="flex flex-1 items-center justify-between max-w-[1600px] mx-auto w-full">
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <h1 className="text-sm font-semibold leading-none tracking-tight">
                  {title}
                </h1>
                {description && (
                  <p className="text-xs text-muted-foreground hidden md:block mt-1">
                    {description}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* HUD Elements */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-full border border-white/5">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  System Optimal
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                  <Search className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground relative"
                >
                  <Bell className="h-4 w-4" />
                  <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-orange-500" />
                </Button>

                <Separator orientation="vertical" className="h-4 mx-2" />

                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-sm font-medium"
                >
                  <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-700 border border-white/10 flex items-center justify-center">
                    <User className="h-3 w-3 text-zinc-400" />
                  </div>
                  <span className="hidden md:inline-block">Admin</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-10 w-full overflow-y-auto">
          <div className="max-w-[1600px] mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
            {children}
          </div>
        </main>

        <footer className="border-t px-6 py-4 bg-background/50">
          <div className="flex items-center justify-center text-xs text-muted-foreground max-w-[1600px] mx-auto w-full">
            <p>
              Developed by{" "}
              <span className="font-semibold text-foreground tracking-wide">
                BORIS DOUON
              </span>{" "}
              • Full Stack AI-Software Engineer
            </p>
          </div>
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
