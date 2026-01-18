"use client";

import { useEffect, useState } from "react";
import {
  MoreHorizontal,
  Plus,
  Search,
  Globe,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Domain } from "@/types/domain";
import { DomainState } from "@/types/domain";
import { cn } from "@/lib/utils";

// Custom badge styles with a more vibrant, premium look
const STATE_STYLES: Record<DomainState, string> = {
  [DomainState.Available]:
    "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20",
  [DomainState.Registered]:
    "bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/20",
  [DomainState.Active]:
    "bg-green-50 text-green-700 border-green-200 ring-green-500/20",
  [DomainState.Expiring]:
    "bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20",
  [DomainState.GracePeriod]:
    "bg-orange-50 text-orange-700 border-orange-200 ring-orange-500/20",
  [DomainState.Redemption]:
    "bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20",
  [DomainState.Suspended]:
    "bg-red-50 text-red-700 border-red-200 ring-red-500/20",
  [DomainState.Deleted]:
    "bg-slate-100 text-slate-500 border-slate-200 ring-slate-500/10",
};

function formatDate(dateString: string | null): string {
  if (!dateString) return "—";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (e) {
    return dateString;
  }
}

function formatRelativeTime(dateString: string | null): string {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Expired";
    if (diffDays === 0) return "Expires today";
    if (diffDays < 30) return `in ${diffDays} days`;
    if (diffDays < 365) return `in ${Math.floor(diffDays / 30)} months`;
    return `in ${(diffDays / 365).toFixed(1)} years`;
  } catch (e) {
    return "";
  }
}

function StatusBadge({ state }: { state: DomainState }) {
  return (
    <div
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ring-1 ring-inset shadow-sm transition-all duration-200",
        STATE_STYLES[state],
      )}
    >
      <span className="relative flex h-1.5 w-1.5 mr-2">
        <span
          className={cn(
            "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
            state === DomainState.Active
              ? "bg-green-400"
              : state === DomainState.Expiring
                ? "bg-amber-400"
                : state === DomainState.Suspended
                  ? "bg-red-400"
                  : "opacity-0",
          )}
        ></span>
        <span
          className={cn(
            "relative inline-flex rounded-full h-1.5 w-1.5",
            state === DomainState.Active
              ? "bg-green-500"
              : state === DomainState.Expiring
                ? "bg-amber-500"
                : state === DomainState.Suspended
                  ? "bg-red-500"
                  : "bg-current",
          )}
        ></span>
      </span>
      {state}
    </div>
  );
}

export function DomainsTable() {
  const [mounted, setMounted] = useState(false);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newDomain, setNewDomain] = useState({ name: "", tld: "com" });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchDomains();
  }, []);

  async function fetchDomains() {
    try {
      const response = await fetch("/api/domains");
      if (!response.ok) throw new Error("Failed to fetch domains");
      const data = (await response.json()) as { domains?: Domain[] };
      setDomains(data.domains || []);
    } catch (error) {
      console.error("Error fetching domains:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateDomain() {
    if (!newDomain.name) return;

    setCreating(true);
    try {
      const response = await fetch("/api/domains", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDomain),
      });

      if (!response.ok) throw new Error("Failed to create domain");

      setDialogOpen(false);
      setNewDomain({ name: "", tld: "com" });
      fetchDomains();
    } catch (error) {
      console.error("Error creating domain:", error);
    } finally {
      setCreating(false);
    }
  }

  async function handleTransition(domainId: string, toState: DomainState) {
    try {
      const response = await fetch(`/api/domains/${domainId}/transition`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toState,
          triggeredBy: "admin",
          reason: `Manual transition to ${toState}`,
        }),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as { error?: string };
        alert(errorData.error || "Transition failed");
        return;
      }

      fetchDomains();
    } catch (error) {
      console.error("Error transitioning domain:", error);
    }
  }

  if (!mounted) {
    return (
      <DashboardShell
        title="Domains"
        description="Manage your domain portfolio and registrations"
        currentPath="/domains"
      >
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-zinc-300" />
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell
      title="Domains"
      description="Manage your domain portfolio and registrations"
      currentPath="/domains"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search domains..."
              className="pl-9 bg-white/50 border-zinc-200 focus:bg-white transition-colors"
            />
          </div>

          <Button
            onClick={() => setDialogOpen(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white shadow-sm shadow-orange-200"
          >
            <Plus className="mr-2 h-4 w-4" />
            Register Domain
          </Button>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="sm:max-w-[500px] bg-white text-zinc-900 border-zinc-200 shadow-xl z-[100]">
              <DialogHeader>
                <DialogTitle className="text-xl">
                  Register New Domain
                </DialogTitle>
                <DialogDescription>
                  Search and register a new domain name for your project.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-6">
                <div className="space-y-4">
                  <Label htmlFor="domain-search">Domain Name</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        id="name"
                        placeholder="example"
                        value={newDomain.name}
                        onChange={(e) =>
                          setNewDomain({ ...newDomain, name: e.target.value })
                        }
                        className="pr-20 font-medium"
                      />
                    </div>
                    <Select
                      value={newDomain.tld}
                      onValueChange={(value) =>
                        setNewDomain({ ...newDomain, tld: value })
                      }
                    >
                      <SelectTrigger className="w-[100px] bg-muted/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="com">.com</SelectItem>
                        <SelectItem value="net">.net</SelectItem>
                        <SelectItem value="org">.org</SelectItem>
                        <SelectItem value="io">.io</SelectItem>
                        <SelectItem value="dev">.dev</SelectItem>
                        <SelectItem value="app">.app</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Globe className="h-4 w-4" />
                    <span>Your domain will be registered immediately.</span>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateDomain}
                  disabled={creating || !newDomain.name}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  {creating ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    "Complete Registration"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Main Table Card */}
        <div className="rounded-xl border border-zinc-200 bg-white/50 backdrop-blur-xl shadow-sm overflow-hidden flex flex-col h-[calc(100vh-220px)] min-h-[500px]">
          <div className="flex-1 overflow-auto relative scrollbar-thin scrollbar-thumb-zinc-200 scrollbar-track-transparent">
            <Table>
              <TableHeader className="sticky top-0 bg-white/95 backdrop-blur-md z-10 shadow-sm border-b border-zinc-100">
                <TableRow className="bg-zinc-50/50 hover:bg-zinc-50/80 border-0">
                  <TableHead className="w-[300px] py-4 text-xs font-bold uppercase tracking-wider text-zinc-500 pl-6">
                    Domain Name
                  </TableHead>
                  <TableHead className="py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Status
                  </TableHead>
                  <TableHead className="py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Registered
                  </TableHead>
                  <TableHead className="py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Expires
                  </TableHead>
                  <TableHead className="py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Auto-Renew
                  </TableHead>
                  <TableHead className="w-[50px] py-4"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center">
                      <div className="flex items-center justify-center text-muted-foreground">
                        <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                        Loading domains...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : domains.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
                        <div className="h-12 w-12 rounded-full bg-zinc-100 flex items-center justify-center">
                          <Globe className="h-6 w-6 text-zinc-400" />
                        </div>
                        <p className="font-medium text-zinc-900">
                          No domains found
                        </p>
                        <p className="text-sm max-w-sm mx-auto">
                          Get started by registering your first domain name to
                          launch your project.
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => setDialogOpen(true)}
                          className="mt-2"
                        >
                          Register Domain
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  domains.map((domain) => (
                    <TableRow
                      key={domain.id}
                      className="group hover:bg-zinc-50/80 transition-all duration-200 border-zinc-100"
                    >
                      <TableCell className="font-medium pl-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-zinc-50 to-zinc-100 flex items-center justify-center group-hover:from-white group-hover:to-zinc-50 group-hover:shadow-md transition-all duration-200 border border-zinc-200/60 group-hover:border-zinc-200 group-hover:scale-110">
                            <span className="text-xs font-bold text-zinc-600">
                              {domain.tld.toUpperCase()}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-zinc-900 font-semibold text-sm tracking-tight">
                              {domain.name}
                            </span>
                            <a
                              href={`https://${domain.name}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-zinc-400 hover:text-blue-500 transition-colors flex items-center gap-1 mt-0.5"
                            >
                              Visit site <Globe className="h-2.5 w-2.5" />
                            </a>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <StatusBadge state={domain.state} />
                      </TableCell>
                      <TableCell
                        className="text-zinc-600 text-sm py-4"
                        suppressHydrationWarning
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {formatDate(domain.registered_at)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell
                        className="text-zinc-600 text-sm py-4"
                        suppressHydrationWarning
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {formatDate(domain.expires_at)}
                          </span>
                          <span
                            className={cn(
                              "text-xs font-medium",
                              domain.state === DomainState.Expiring
                                ? "text-amber-600"
                                : "text-zinc-400",
                            )}
                          >
                            {formatRelativeTime(domain.expires_at)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        {domain.auto_renew ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-100">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Auto-Renew On
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-500 text-xs font-medium border border-zinc-200">
                            <AlertCircle className="h-3.5 w-3.5" />
                            Manual Renew
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="py-4 pr-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-zinc-400 hover:text-zinc-900 hover:bg-white hover:shadow-sm"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Manage Domain</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {domain.state === DomainState.Registered && (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleTransition(
                                    domain.id,
                                    DomainState.Active,
                                  )
                                }
                              >
                                <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-500" />
                                Activate Domain
                              </DropdownMenuItem>
                            )}
                            {domain.state === DomainState.Active && (
                              <>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleTransition(
                                      domain.id,
                                      DomainState.Expiring,
                                    )
                                  }
                                >
                                  Mark as Expiring
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600 focus:text-red-600"
                                  onClick={() =>
                                    handleTransition(
                                      domain.id,
                                      DomainState.Suspended,
                                    )
                                  }
                                >
                                  Suspend Domain
                                </DropdownMenuItem>
                              </>
                            )}
                            {domain.state === DomainState.Expiring && (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleTransition(
                                    domain.id,
                                    DomainState.Active,
                                  )
                                }
                              >
                                Renew Domain
                              </DropdownMenuItem>
                            )}
                            {domain.state === DomainState.Suspended && (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleTransition(
                                    domain.id,
                                    DomainState.Active,
                                  )
                                }
                              >
                                Unsuspend
                              </DropdownMenuItem>
                            )}

                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-muted-foreground">
                              View DNS Records
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-muted-foreground">
                              Transfer Authorization
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
