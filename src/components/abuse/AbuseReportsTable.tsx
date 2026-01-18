"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  Siren,
  Flag,
  ShieldAlert,
  ShieldCheck,
  MoreHorizontal,
  Search,
  Filter,
  Shield,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface AbuseReport {
  id: string;
  domain_id: string;
  domain_name: string;
  reporter_email: string | null;
  category: string;
  description: string | null;
  status: string;
  created_at: string;
  resolved_at: string | null;
  resolution_notes: string | null;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const SEVERITY_CONFIG: Record<
  string,
  { label: string; color: string; icon: any }
> = {
  high: {
    label: "Critical",
    color: "bg-red-50 text-red-700 border-red-200 ring-red-500/10",
    icon: Siren,
  },
  medium: {
    label: "Moderate",
    color: "bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/10",
    icon: AlertTriangle,
  },
  low: {
    label: "Low",
    color: "bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/10",
    icon: Flag,
  },
};

const getSeverity = (category: string) => {
  const high = ["phishing", "malware", "copyright", "child_safety"];
  const medium = ["spam", "impersonation", "fraud"];
  if (high.some((c) => category.toLowerCase().includes(c))) return "high";
  if (medium.some((c) => category.toLowerCase().includes(c))) return "medium";
  return "low";
};

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  investigating: "bg-orange-50 text-orange-700 border-orange-200",
  resolved: "bg-green-50 text-green-700 border-green-200",
  dismissed: "bg-zinc-100 text-zinc-500 border-zinc-200",
};

export function AbuseReportsTable() {
  const [reports, setReports] = useState<AbuseReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedReport, setSelectedReport] = useState<AbuseReport | null>(
    null,
  );
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [updating, setUpdating] = useState(false);

  async function fetchReports() {
    setLoading(true);
    try {
      const url =
        filter === "all" ? "/api/abuse" : `/api/abuse?status=${filter}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch");
      const data = (await response.json()) as { reports: AbuseReport[] };
      setReports(data.reports || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReports();
  }, [filter]);

  async function updateStatus(status: string) {
    if (!selectedReport) return;

    setUpdating(true);
    try {
      const response = await fetch("/api/abuse", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedReport.id,
          status,
          resolution_notes: resolutionNotes,
        }),
      });

      if (!response.ok) throw new Error("Failed to update");

      setSelectedReport(null);
      setResolutionNotes("");
      fetchReports();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setUpdating(false);
    }
  }

  const filteredReports = reports;

  return (
    <DashboardShell
      title="Abuse Reports"
      description="Review and manage abuse reports"
      currentPath="/abuse"
    >
      <div className="space-y-4">
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="investigating">Investigating</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
            <TabsTrigger value="dismissed">Dismissed</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reports..."
              className="pl-9 bg-white/50 border-zinc-200 focus:bg-white transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-9"
              onClick={() => fetchReports()}
            >
              Refresh
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white/50 backdrop-blur-xl shadow-sm overflow-hidden flex flex-col h-[calc(100vh-280px)] min-h-[500px]">
          <div className="flex-1 overflow-auto relative scrollbar-thin scrollbar-thumb-zinc-200 scrollbar-track-transparent">
            <Table>
              <TableHeader className="sticky top-0 bg-white/95 backdrop-blur-md z-10 shadow-sm border-b border-zinc-100">
                <TableRow className="bg-zinc-50/50 hover:bg-zinc-50/80 border-0">
                  <TableHead className="w-[300px] py-4 text-xs font-bold uppercase tracking-wider text-zinc-500 pl-6">
                    Report Context
                  </TableHead>
                  <TableHead className="py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Triage Level
                  </TableHead>
                  <TableHead className="py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Source
                  </TableHead>
                  <TableHead className="py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Status
                  </TableHead>
                  <TableHead className="py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-20 h-64">
                      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500 mb-2"></div>
                        Loading reports...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredReports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-20 h-64">
                      <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
                        <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center">
                          <ShieldCheck className="h-6 w-6 text-green-500" />
                        </div>
                        <p className="font-medium text-zinc-900">All Clear</p>
                        <p className="text-sm max-w-sm mx-auto">
                          No abuse reports found matching your criteria.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReports.map((report) => {
                    const severity = getSeverity(report.category);
                    const severityConfig = SEVERITY_CONFIG[severity];
                    const SeverityIcon = severityConfig.icon;

                    return (
                      <TableRow
                        key={report.id}
                        className="group hover:bg-zinc-50/80 transition-all duration-200 border-zinc-100"
                      >
                        <TableCell className="pl-6 py-4">
                          <div className="flex flex-col gap-1">
                            <span className="font-bold text-zinc-900">
                              {report.domain_name}
                            </span>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{formatDate(report.created_at)}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex flex-col gap-1.5 align-start">
                            <Badge
                              variant="outline"
                              className={cn(
                                "w-fit flex items-center gap-1.5 px-2 py-0.5 rounded-md font-semibold ring-1 ring-inset border-transparent",
                                severityConfig.color,
                              )}
                            >
                              <SeverityIcon className="h-3 w-3" />
                              {severityConfig.label}
                            </Badge>
                            <span className="text-xs text-zinc-500 ml-1 capitalize">
                              {report.category.replace("_", " ")}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-2">
                            {report.reporter_email ? (
                              <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold border border-blue-100">
                                {report.reporter_email[0].toUpperCase()}
                              </div>
                            ) : (
                              <div className="h-8 w-8 rounded-full bg-zinc-100 text-zinc-400 flex items-center justify-center border border-zinc-200">
                                <Shield className="h-4 w-4" />
                              </div>
                            )}
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-zinc-700">
                                {report.reporter_email || "Anonymous Reporter"}
                              </span>
                              {report.reporter_email && (
                                <span className="text-[10px] text-zinc-400 uppercase tracking-wide font-semibold">
                                  Verified Source
                                </span>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div
                            className={cn(
                              "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border capitalize",
                              STATUS_STYLES[report.status],
                            )}
                          >
                            {report.status}
                          </div>
                        </TableCell>
                        <TableCell className="py-4 active:scale-95 transition-transform origin-left">
                          <div className="flex items-center gap-2">
                            <Button
                              variant={
                                severity === "high"
                                  ? "destructive"
                                  : "secondary"
                              }
                              size="sm"
                              className="h-8 shadow-sm"
                              onClick={() => setSelectedReport(report)}
                            >
                              Review
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-zinc-400 hover:text-zinc-900"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>
                                  Quick Actions
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                  <ShieldAlert className="mr-2 h-4 w-4" />
                                  Suspend Domain
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <CheckCircle2 className="mr-2 h-4 w-4" />
                                  Mark Resolved
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <Dialog
          open={!!selectedReport}
          onOpenChange={(open) => !open && setSelectedReport(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Review Abuse Report</DialogTitle>
              <DialogDescription>
                {selectedReport?.domain_name} - {selectedReport?.category}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label className="text-muted-foreground">Description</Label>
                <p className="mt-1">
                  {selectedReport?.description || "No description provided"}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Reporter</Label>
                <p className="mt-1">
                  {selectedReport?.reporter_email || "Anonymous"}
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Resolution Notes</Label>
                <Input
                  id="notes"
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Add notes about the resolution..."
                />
              </div>
            </div>
            <DialogFooter className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => updateStatus("dismissed")}
                disabled={updating}
              >
                Dismiss
              </Button>
              <Button
                variant="outline"
                onClick={() => updateStatus("investigating")}
                disabled={updating}
              >
                Investigate
              </Button>
              <Button
                onClick={() => updateStatus("resolved")}
                disabled={updating}
              >
                Resolve
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardShell>
  );
}
