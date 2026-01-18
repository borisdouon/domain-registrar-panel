"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  Clock,
  RefreshCw,
  Activity,
  User,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DashboardShell } from "@/components/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DomainState } from "@/types/domain";

interface TransitionWithDomain {
  id: string;
  domain_id: string;
  domain_name: string;
  from_state: DomainState;
  to_state: DomainState;
  triggered_by: string;
  reason: string | null;
  created_at: string;
}

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

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function TransitionsView() {
  const [transitions, setTransitions] = useState<TransitionWithDomain[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchTransitions() {
    setLoading(true);
    try {
      const response = await fetch("/api/transitions?limit=100");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = (await response.json()) as {
        transitions: TransitionWithDomain[];
      };
      setTransitions(data.transitions || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTransitions();
  }, []);

  return (
    <DashboardShell
      title="Transitions"
      description="Domain state transition history"
      currentPath="/transitions"
    >
      <div className="space-y-6">
        <div className="flex justify-end sticky top-0 bg-background/95 backdrop-blur z-20 pb-4 border-b border-zinc-100">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mr-auto">
            <Activity className="h-4 w-4" />
            <span>Real-time activity log</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchTransitions}
            disabled={loading}
            className="shadow-sm"
          >
            <RefreshCw
              className={`mr-2 h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
            />
            Result
          </Button>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white/50 backdrop-blur-xl shadow-sm overflow-hidden flex flex-col h-[calc(100vh-220px)] min-h-[500px]">
          <div className="flex-1 overflow-y-auto relative p-6 scrollbar-thin scrollbar-thumb-zinc-200 scrollbar-track-transparent">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                  <p className="text-sm text-zinc-500">Loading timeline...</p>
                </div>
              </div>
            ) : transitions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 h-full">
                <div className="h-16 w-16 rounded-full bg-zinc-100 flex items-center justify-center mb-6">
                  <Clock className="h-8 w-8 text-zinc-300" />
                </div>
                <h3 className="text-lg font-medium text-zinc-900">
                  No activity yet
                </h3>
                <p className="text-zinc-500 text-sm max-w-sm text-center mt-2">
                  State transitions for domains will appear here in a
                  chronological timeline.
                </p>
              </div>
            ) : (
              <div className="relative space-y-0 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-200 before:to-transparent">
                {transitions.map((transition, index) => (
                  <div
                    key={transition.id}
                    className="group relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                  >
                    {/* Timeline Dot */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-zinc-100 group-hover:bg-orange-50 group-hover:border-orange-100 shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-colors duration-300">
                      <Activity className="h-4 w-4 text-zinc-400 group-hover:text-orange-500" />
                    </div>

                    {/* Card Content */}
                    <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] hover:shadow-md transition-shadow duration-300 border-zinc-200 group-hover:border-zinc-300">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex flex-col">
                            <span className="font-bold text-zinc-900 text-sm">
                              {transition.domain_name}
                            </span>
                            <span className="text-xs text-zinc-500 font-mono mt-0.5 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDate(transition.created_at)}
                            </span>
                          </div>
                          <div className="text-right">
                            <Badge
                              variant="outline"
                              className="text-[10px] bg-zinc-50 text-zinc-500 border-zinc-200 rounded-sm px-1.5 py-0.5 font-normal tracking-wide uppercase"
                            >
                              {formatTimeAgo(transition.created_at)}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 bg-zinc-50/50 p-3 rounded-lg border border-zinc-100/50 mb-3">
                          <div
                            className={cn(
                              "px-2.5 py-1 rounded-md text-xs font-semibold ring-1 ring-inset",
                              STATE_STYLES[transition.from_state],
                            )}
                          >
                            {transition.from_state}
                          </div>
                          <ArrowRight className="h-3.5 w-3.5 text-zinc-400" />
                          <div
                            className={cn(
                              "px-2.5 py-1 rounded-md text-xs font-semibold ring-1 ring-inset shadow-sm",
                              STATE_STYLES[transition.to_state],
                            )}
                          >
                            {transition.to_state}
                          </div>
                        </div>

                        <div className="flex items-start justify-between pt-2 border-t border-zinc-100">
                          <div className="flex items-center gap-1.5 text-xs text-zinc-600">
                            <User className="h-3.5 w-3.5 text-zinc-400" />
                            <span className="font-medium text-zinc-900">
                              {transition.triggered_by}
                            </span>
                          </div>
                          {transition.reason && (
                            <div
                              className="flex items-center gap-1.5 text-xs text-zinc-500 max-w-[60%] justify-end truncate"
                              title={transition.reason}
                            >
                              <AlertCircle className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                              <span className="truncate italic">
                                {transition.reason}
                              </span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
