"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Server,
  Database,
  Globe,
  MoreHorizontal,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock Data for Network Operations
const operations = [
  {
    id: "op-1",
    name: "Verisign Registry Sync",
    description: "Daily zone file synchronization and delta verification.",
    status: "Running",
    metrics: {
      latency: "14ms",
      successRate: "99.9%",
      throughput: "2.4k/s",
    },
    icon: Database,
    trend: [40, 35, 55, 60, 58, 65, 78, 80, 75, 82, 90, 85],
    trend24h: [50, 55, 45, 60, 65, 60, 70, 75, 80, 78, 85, 90],
  },
  {
    id: "op-2",
    name: "Global DNS Propagation",
    description: "Edge cache invalidation and record distribution.",
    status: "Running",
    metrics: {
      latency: "42ms",
      successRate: "98.5%",
      throughput: "8.1k/s",
    },
    icon: Globe,
    trend: [60, 65, 62, 68, 70, 72, 75, 74, 78, 80, 82, 85],
    trend24h: [55, 60, 65, 70, 68, 72, 75, 80, 78, 82, 85, 88],
  },
  {
    id: "op-3",
    name: "Abuse Feed Ingestion",
    description: "Real-time processing of threat intelligence feeds.",
    status: "Warning",
    metrics: {
      latency: "120ms",
      successRate: "94.2%",
      throughput: "450/s",
    },
    icon: AlertTriangle,
    trend: [30, 45, 40, 35, 50, 45, 60, 55, 50, 40, 35, 30],
    trend24h: [40, 38, 42, 45, 40, 50, 48, 55, 50, 45, 40, 35],
  },
  {
    id: "op-4",
    name: "Whois Privacy Rotation",
    description: "Scheduled rotation of proxy contact information.",
    status: "Idle",
    metrics: {
      latency: "--",
      successRate: "--",
      throughput: "0/s",
    },
    icon: RefreshCw,
    trend: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    trend24h: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    id: "op-5",
    name: "Zone File Export",
    description: "Generating daily zone file exports for partners.",
    status: "Running",
    metrics: {
      latency: "205ms",
      successRate: "99.1%",
      throughput: "1.2k/s",
    },
    icon: Database,
    trend: [10, 20, 15, 25, 30, 45, 40, 50, 60, 55, 65, 70],
    trend24h: [15, 25, 20, 30, 35, 50, 45, 55, 65, 60, 70, 75],
  },
  {
    id: "op-6",
    name: "RDAP Server Health Check",
    description: "Continuous health monitoring of RDAP endpoints.",
    status: "Idle",
    metrics: {
      latency: "--",
      successRate: "--",
      throughput: "0/s",
    },
    icon: Activity,
    trend: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    trend24h: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
];

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data
    .map(
      (val, i) =>
        `${(i / (data.length - 1)) * 100},${100 - ((val - min) / range) * 100}`,
    )
    .join(" ");

  return (
    <div className="h-8 w-24">
      <svg
        viewBox="0 0 100 100"
        className="h-full w-full overflow-visible"
        preserveAspectRatio="none"
      >
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function CircuitStream({ color }: { color: string }) {
  // Generate a random-looking path for the "circuit"
  // Simple sine wave variety
  const gradientId = `gradient-${color.replace("#", "")}`;

  return (
    <div className="h-8 w-full flex items-center justify-center overflow-hidden relative">
      <svg
        viewBox="0 0 100 20"
        className="h-full w-full overflow-visible"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0" />
            <stop offset="50%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Background Trace */}
        <path
          d="M0 10 Q 25 20, 50 10 T 100 10"
          fill="none"
          stroke={color}
          strokeWidth="1"
          strokeOpacity="0.2"
          vectorEffect="non-scaling-stroke"
        />
        {/* Live Electron */}
        <circle r="1.5" fill={color}>
          <animateMotion
            dur="2s"
            repeatCount="indefinite"
            path="M0 10 Q 25 20, 50 10 T 100 10"
            calcMode="spline"
            keySplines="0.4 0 0.2 1"
          />
          <animate
            attributeName="opacity"
            values="0;1;1;0"
            keyTimes="0;0.1;0.9;1"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
        {/* Pulse Effect */}
        <path
          d="M0 10 Q 25 20, 50 10 T 100 10"
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="0 100"
          vectorEffect="non-scaling-stroke"
        >
          <animate
            attributeName="stroke-dasharray"
            values="0 100; 20 100; 0 100"
            keyTimes="0;0.5;1"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="stroke-dashoffset"
            values="100; 0; -100"
            dur="2s"
            repeatCount="indefinite"
          />
        </path>
      </svg>
    </div>
  );
}

export function NetworkActivityTable() {
  return (
    <Card className="w-full border-2 border-zinc-200 bg-white overflow-hidden relative group transition-all duration-500 hover:border-zinc-300">
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-black/5 bg-white">
        <div>
          <CardTitle className="text-xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <Activity className="h-5 w-5 text-purple-600" />
            Network Operations
          </CardTitle>
          <CardDescription className="text-xs uppercase tracking-widest font-semibold text-purple-600/80">
            Active System Processes & Telemetry
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="hidden sm:flex bg-purple-500/10 text-purple-600 border-purple-500/20 font-mono text-[10px]"
          >
            {operations.filter((op) => op.status !== "Idle").length} PROCESSES
            ACTIVE
          </Badge>
          <div className="h-8 w-8 rounded-lg border border-zinc-200 bg-white/50 flex items-center justify-center">
            <Server className="h-4 w-4 text-zinc-500" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="w-full">
          {/* Table Header - Sticky */}
          <div className="hidden md:grid grid-cols-[repeat(14,minmax(0,1fr))] gap-4 px-6 py-3 bg-zinc-50 border-b border-zinc-100 text-[10px] font-bold uppercase tracking-wider text-zinc-500 relative z-20">
            <div className="col-span-3">Operation Name</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Latency</div>
            <div className="col-span-1">Success Rate</div>
            <div className="col-span-2 text-center">Live Circuit</div>
            <div className="col-span-2 text-right">Activity (24H)</div>
            <div className="col-span-2 text-right">Activity (1h)</div>
          </div>

          {/* Table Rows - Scrollable */}
          <ScrollArea className="h-[400px] w-full relative z-10">
            <div className="divide-y divide-zinc-100">
              {operations.map((op, i) => {
                let statusColor = "bg-zinc-200";
                let badgeClass = "bg-zinc-100 text-zinc-500 border-zinc-200";
                let pulseColor = "bg-zinc-400";
                let sparklineColor = "#a1a1aa"; // zinc

                if (op.status === "Running") {
                  statusColor = "bg-green-500";
                  badgeClass = "bg-green-50 text-green-700 border-green-200";
                  pulseColor = "bg-green-600";
                  sparklineColor = "#22c55e"; // green
                } else if (op.status === "Warning") {
                  statusColor = "bg-amber-500";
                  badgeClass = "bg-amber-50 text-amber-700 border-amber-200";
                  pulseColor = "bg-amber-600";
                  sparklineColor = "#f59e0b"; // amber
                }

                return (
                  <div
                    key={op.id}
                    className="group/row relative grid grid-cols-1 md:grid-cols-[repeat(14,minmax(0,1fr))] gap-4 px-6 py-4 items-center hover:bg-zinc-50 transition-colors duration-200 animate-in fade-in slide-in-from-right-4 duration-500 ease-out"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    {/* Active Indicator Line */}
                    <div
                      className={cn(
                        "absolute left-0 top-0 bottom-0 w-1 transition-colors duration-300",
                        statusColor,
                        "opacity-0 group-hover/row:opacity-100",
                      )}
                    />

                    {/* Name & Desc */}
                    <div className="col-span-1 md:col-span-3 flex items-start gap-4">
                      <div className="mt-1 p-2 rounded-lg bg-white border border-zinc-100">
                        {/* Removed shadow-sm */}
                        <op.icon className="h-4 w-4 text-zinc-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-zinc-900 group-hover/row:text-purple-700 transition-colors">
                          {op.name}
                        </h4>
                        <p className="text-xs text-zinc-500 line-clamp-1 mt-0.5">
                          {op.description}
                        </p>
                        {/* Mobile Only Metadata */}
                        <div className="flex md:hidden gap-3 mt-2 text-xs font-mono text-zinc-500">
                          <span>{op.metrics.latency}</span>
                          <span>{op.metrics.successRate}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="col-span-1 md:col-span-2 flex items-center">
                      <div
                        className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border",
                          badgeClass,
                        )}
                      >
                        <div
                          className={cn("h-1.5 w-1.5 rounded-full", pulseColor)}
                        />
                        {op.status}
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="hidden md:flex col-span-2 font-mono text-xs font-medium text-zinc-600">
                      {op.metrics.latency}
                    </div>
                    <div className="hidden md:flex col-span-1 font-mono text-xs font-medium text-zinc-600">
                      {op.metrics.successRate}
                    </div>

                    {/* Circuit Animation */}
                    <div className="hidden md:flex col-span-2 items-center justify-center">
                      {op.status !== "Idle" && (
                        <div className="w-full max-w-[120px] opacity-70 group-hover/row:opacity-100 transition-opacity">
                          <CircuitStream color={sparklineColor} />
                        </div>
                      )}
                      {op.status === "Idle" && (
                        <div className="h-[2px] w-full max-w-[80px] bg-zinc-100 rounded-full" />
                      )}
                    </div>

                    {/* Sparkline (24H) */}
                    <div className="col-span-1 md:col-span-2 hidden md:flex items-center justify-end gap-4">
                      <div className="opacity-50 group-hover/row:opacity-100 transition-opacity">
                        <Sparkline data={op.trend24h} color={sparklineColor} />
                      </div>
                    </div>

                    {/* Sparkline (1H) & Actions */}
                    <div className="col-span-1 md:col-span-2 flex items-center justify-end gap-4">
                      <div className="opacity-50 group-hover/row:opacity-100 transition-opacity">
                        <Sparkline data={op.trend} color={sparklineColor} />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-zinc-400 hover:text-zinc-600"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </CardContent>

      {/* Footer / Status Bar */}
      <div className="p-3 border-t border-black/5 bg-zinc-50 flex items-center justify-between text-[9px] font-mono text-zinc-400">
        <span className="flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3 text-green-500" />
          ALL SYSTEMS OPERATIONAL
        </span>
        <span>LAST_SYNC: 00:00:24s AGO</span>
      </div>
    </Card>
  );
}
