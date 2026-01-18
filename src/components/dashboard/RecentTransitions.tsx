import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { DomainTransition } from "@/types/domain";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, Clock, User, Cpu, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecentTransitionsProps {
  transitions: DomainTransition[];
}

export function RecentTransitions({ transitions }: RecentTransitionsProps) {
  return (
    <Card className="h-full border-2 border-zinc-200 bg-white overflow-hidden relative group transition-all duration-500 hover:border-zinc-300">
      <CardHeader className="pb-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <Activity className="h-4 w-4 text-blue-600" />
              </div>
              Movement Log
            </CardTitle>
            <CardDescription className="text-xs uppercase tracking-widest font-semibold text-blue-500/80">
              Real-time state propagation
            </CardDescription>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge
              variant="outline"
              className="bg-green-500/10 text-green-500 border-green-500/20 font-mono text-[9px] px-2 py-0"
            >
              UPLINK ACTIVE
            </Badge>
            <span className="text-[9px] font-mono text-muted-foreground uppercase">
              Stream: 12.4kb/s
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 relative z-10">
        <ScrollArea className="h-[400px] w-full px-6">
          <div className="space-y-6 py-4">
            {transitions.length === 0 ? (
              <div className="flex flex-col h-48 items-center justify-center gap-4 border border-dashed border-zinc-200 rounded-2xl mx-2 bg-zinc-50">
                <Cpu className="h-8 w-8 text-zinc-400" />
                <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-[0.2em]">
                  Awaiting Input Signal...
                </span>
              </div>
            ) : (
              transitions.map((transition, i) => {
                // Handle different prop names for mock vs real data
                const domainId =
                  (transition as any).domainId || transition.domain_id;
                const fromState =
                  (transition as any).fromState || transition.from_state;
                const toState =
                  (transition as any).toState || transition.to_state;
                const by = (transition as any).by || transition.triggered_by;
                const timestamp =
                  (transition as any).timestamp || transition.created_at;

                return (
                  <div
                    key={i}
                    className="relative group/item animate-in fade-in slide-in-from-right-4 duration-500 ease-out"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    {/* Vertical Timeline Thread */}
                    {i !== transitions.length - 1 && (
                      <div className="absolute left-[19px] top-10 bottom-[-24px] w-[2px] bg-zinc-200" />
                    )}

                    <div className="flex gap-4">
                      {/* Event Node */}
                      <div className="relative mt-1">
                        <div
                          className={cn(
                            "h-10 w-10 rounded-full flex items-center justify-center border transition-all duration-300",
                            "bg-white border-zinc-200",
                            toState === "active"
                              ? "group-hover/item:border-green-500/50"
                              : toState === "suspended"
                                ? "group-hover/item:border-red-500/50"
                                : "group-hover/item:border-blue-500/50",
                          )}
                        >
                          {by === "System" ? (
                            <Cpu className="h-4 w-4 text-zinc-400" />
                          ) : (
                            <User className="h-4 w-4 text-zinc-400" />
                          )}
                        </div>
                        {/* Status Pulse */}
                        <div
                          className={cn(
                            "absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-zinc-950 flex items-center justify-center",
                            toState === "active"
                              ? "bg-green-500" // Removed shadow
                              : toState === "suspended"
                                ? "bg-red-500" // Removed shadow
                                : "bg-blue-500", // Removed shadow
                          )}
                        >
                          <div className="h-1.5 w-1.5 rounded-full bg-white/40" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-black tracking-tighter text-zinc-900 group-hover/item:text-blue-600 transition-colors">
                              {domainId}
                            </span>
                            <span className="text-[9px] font-mono text-zinc-500 uppercase opacity-70">
                              @{by}
                            </span>
                          </div>
                          <span className="flex items-center text-[10px] text-zinc-500 font-mono bg-white/50 px-2 py-0.5 rounded-full border border-black/5">
                            {/* Removed shadow-sm */}
                            <Clock className="mr-1 h-3 w-3" />
                            {new Date(timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 p-2 rounded-xl bg-zinc-50 border border-black/5 transition-all group-hover/item:bg-white">
                          {/* Removed shadow-sm */}
                          <div className="flex-1 flex items-center justify-center gap-3">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                              {fromState}
                            </div>
                            <ArrowRight className="h-3 w-3 text-zinc-300" />
                            <div
                              className={cn(
                                "text-[10px] font-black uppercase tracking-widest",
                                toState === "active"
                                  ? "text-green-600"
                                  : toState === "suspended"
                                    ? "text-red-600"
                                    : "text-blue-600",
                              )}
                            >
                              {toState}
                            </div>
                          </div>
                        </div>

                        {/* Tech Detail Overlay */}
                        <div className="flex items-center justify-between text-[8px] font-mono text-zinc-400 uppercase tracking-widest pt-1">
                          <span>
                            Event ID: {Math.random().toString(16).slice(2, 10)}
                          </span>
                          <span>
                            {new Date(timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>

      {/* Bottom Status Bar */}
      <div className="p-3 border-t border-black/5 bg-zinc-50 flex items-center justify-between text-[9px] font-mono text-zinc-500">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
          SYSTEM_VERIFIED_DATA_STREAM
        </div>
        <div>V2.0_CORE_PROTOCOL</div>
      </div>
    </Card>
  );
}
