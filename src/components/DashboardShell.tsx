import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Bell, Search, User, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardShellProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  currentPath?: string;
}

export function DashboardShell({
  children,
  title,
  description,
  currentPath = "/",
}: DashboardShellProps) {
  return (
    <SidebarProvider defaultOpen className="h-screen overflow-hidden">
      <AppSidebar currentPath={currentPath} />
      <SidebarInset className="bg-zinc-50/50 backdrop-blur-xl transition-all duration-300 ease-in-out overflow-hidden flex flex-col">
        <header className="flex h-16 shrink-0 items-center border-b border-zinc-100 px-6 sticky top-0 z-10 bg-white/80 backdrop-blur-sm">
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
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-zinc-100 rounded-full border border-zinc-200">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-600">
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

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2 text-sm font-medium focus-visible:ring-0"
                    >
                      <div className="h-6 w-6 rounded-full bg-black border border-zinc-200 flex items-center justify-center">
                        <User className="h-3 w-3 text-white" />
                      </div>
                      <span className="hidden md:inline-block text-zinc-700">
                        Boris Douon
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer" asChild>
                      <a href="/settings" className="flex items-center w-full">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-10 w-full overflow-y-auto">
          <div className="max-w-[1600px] mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
