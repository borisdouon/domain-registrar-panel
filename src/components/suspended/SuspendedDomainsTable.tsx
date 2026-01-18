"use client";

import { useEffect, useState } from "react";
import {
  Shield,
  RefreshCw,
  AlertTriangle,
  FileWarning,
  Search,
  Filter,
  Lock,
  Clock,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SuspendedDomain {
  id: string;
  name: string;
  tld: string;
  state: string;
  suspension_reason: string | null;
  updated_at: string;
  registrant_name: string | null;
  registrant_email: string | null;
  abuse_score: number;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function SuspendedDomainsTable() {
  const [domains, setDomains] = useState<SuspendedDomain[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState<SuspendedDomain | null>(
    null,
  );

  async function fetchDomains() {
    setLoading(true);
    try {
      const response = await fetch("/api/suspended");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = (await response.json()) as { domains: SuspendedDomain[] };
      setDomains(data.domains || []);
    } catch (error: any) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDomains();
  }, []);

  async function handleUnsuspend() {
    if (!selectedDomain) return;

    try {
      const response = await fetch(
        `/api/domains/${selectedDomain.id}/transition`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            toState: "active",
            triggeredBy: "admin",
            reason: "Manual unsuspension via console",
          }),
        },
      );

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || "Failed to unsuspend");
        return;
      }

      setSelectedDomain(null);
      fetchDomains();
    } catch (error: any) {
      console.error("Error:", error);
    }
  }

  return (
    <DashboardShell
      title="Suspended Domains"
      description="Domains currently suspended for policy violations"
      currentPath="/suspended"
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search suspended domains..."
              className="pl-9 bg-white/50 border-zinc-200 focus:bg-white transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9">
              <Filter className="mr-2 h-4 w-4" />
              Filter Reasons
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-9"
              onClick={fetchDomains}
            >
              <RefreshCw
                className={cn("mr-2 h-3.5 w-3.5", loading && "animate-spin")}
              />
              Refresh
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-red-100 bg-red-50/10 backdrop-blur-xl shadow-sm overflow-hidden flex flex-col h-[calc(100vh-280px)] min-h-[500px]">
          <div className="flex-1 overflow-auto relative scrollbar-thin scrollbar-thumb-zinc-200 scrollbar-track-transparent">
            <Table>
              <TableHeader className="sticky top-0 bg-white/95 backdrop-blur-md z-10 shadow-sm border-b border-zinc-100">
                <TableRow className="bg-zinc-50/50 hover:bg-zinc-50/80 border-0">
                  <TableHead className="w-[300px] py-4 text-xs font-bold uppercase tracking-wider text-zinc-500 pl-6">
                    Domain Context
                  </TableHead>
                  <TableHead className="py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Violation Reason
                  </TableHead>
                  <TableHead className="py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Abuse Score
                  </TableHead>
                  <TableHead className="py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Suspended On
                  </TableHead>
                  <TableHead className="py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Resolution
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-20 h-64">
                      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500 mb-2"></div>
                        Loading suspended domains...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : domains.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-20 h-64">
                      <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
                        <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center">
                          <Shield className="h-6 w-6 text-green-500" />
                        </div>
                        <p className="font-medium text-zinc-900">
                          System Secure
                        </p>
                        <p className="text-sm max-w-sm mx-auto">
                          No domains are currently suspended. Nice work!
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  domains.map((domain) => (
                    <TableRow
                      key={domain.id}
                      className="group hover:bg-red-50/30 transition-all duration-200 border-red-100/30"
                    >
                      <TableCell className="pl-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="font-bold text-zinc-900 group-hover:text-red-900 transition-colors">
                            {domain.name}
                          </span>
                          {domain.registrant_name ? (
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <span className="font-medium text-zinc-600">
                                {domain.registrant_name}
                              </span>
                              <span>•</span>
                              <span>{domain.registrant_email}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground italic">
                              No registrant info
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge
                          variant="outline"
                          className="bg-red-50 text-red-700 border-red-200 ring-red-500/10 gap-1.5 pl-2 pr-2.5 py-0.5"
                        >
                          <FileWarning className="h-3 w-3" />
                          {domain.suspension_reason || "Policy Violation"}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex flex-col gap-1 w-24">
                          <div className="flex justify-between items-center text-xs">
                            <span
                              className={cn(
                                "font-bold",
                                domain.abuse_score > 80
                                  ? "text-red-600"
                                  : domain.abuse_score > 50
                                    ? "text-orange-600"
                                    : "text-yellow-600",
                              )}
                            >
                              {domain.abuse_score}/100
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all duration-500",
                                domain.abuse_score > 80
                                  ? "bg-red-500"
                                  : domain.abuse_score > 50
                                    ? "bg-orange-500"
                                    : "bg-yellow-500",
                              )}
                              style={{ width: `${domain.abuse_score}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                          <Clock className="h-3 w-3" />
                          {formatDate(domain.updated_at)}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-colors"
                          onClick={() => setSelectedDomain(domain)}
                        >
                          <Lock className="mr-2 h-3.5 w-3.5" />
                          Evaluate
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <Dialog
          open={!!selectedDomain}
          onOpenChange={(open) => !open && setSelectedDomain(null)}
        >
          <DialogContent className="border-red-100 sm:max-w-md">
            <DialogHeader>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-2">
                <Lock className="h-6 w-6 text-red-600" />
              </div>
              <DialogTitle className="text-center text-lg">
                Unsuspend Domain?
              </DialogTitle>
              <DialogDescription className="text-center">
                This action will reactivate{" "}
                <span className="font-semibold text-zinc-900">
                  {selectedDomain?.name}
                </span>{" "}
                and restore full access to its DNS records.
              </DialogDescription>
            </DialogHeader>
            <div className="bg-zinc-50 rounded-lg p-3 text-xs text-zinc-600 border border-zinc-100 my-2">
              <p className="font-semibold mb-1">
                Violation: {selectedDomain?.suspension_reason}
              </p>
              <p>Abuse Score: {selectedDomain?.abuse_score}/100</p>
            </div>
            <DialogFooter className="sm:justify-center gap-2">
              <Button variant="outline" onClick={() => setSelectedDomain(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="bg-red-600 hover:bg-red-700"
                onClick={handleUnsuspend}
              >
                Confirm Reactivation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardShell>
  );
}
