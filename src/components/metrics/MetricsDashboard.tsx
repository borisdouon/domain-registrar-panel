"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DashboardShell } from "@/components/DashboardShell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MetricPoint {
  timestamp: string;
  registrations: number;
  transitions: number;
  errors: number;
  latency: number;
}

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Globe,
  Activity,
  Zap,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

export function MetricsDashboard() {
  const [timeRange, setTimeRange] = useState("24h");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sample data - in production this would come from Analytics Engine
  const sampleData: MetricPoint[] = Array.from({ length: 24 }, (_, i) => ({
    timestamp: `${i}:00`,
    registrations: Math.floor(Math.random() * 50) + 10,
    transitions: Math.floor(Math.random() * 100) + 20,
    errors: Math.floor(Math.random() * 5),
    latency: Math.floor(Math.random() * 40) + 10,
  }));

  if (!mounted) return null;

  return (
    <DashboardShell
      title="Metrics"
      description="Real-time platform telemetry and analytics"
      currentPath="/metrics"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Tabs
            value={timeRange}
            onValueChange={setTimeRange}
            className="w-[400px]"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="1h">1h</TabsTrigger>
              <TabsTrigger value="24h">24h</TabsTrigger>
              <TabsTrigger value="7d">7d</TabsTrigger>
              <TabsTrigger value="30d">30d</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
              Live Stream Active
            </span>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-zinc-200/50 bg-gradient-to-br from-white to-zinc-50/50 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <Globe className="h-12 w-12" />
            </div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Domains
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-zinc-900">12,453</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <span className="text-emerald-600 font-medium flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-0.5" />
                  +2.5%
                </span>
                from last month
              </p>
            </CardContent>
          </Card>

          <Card className="border-zinc-200/50 bg-gradient-to-br from-white to-zinc-50/50 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <Activity className="h-12 w-12" />
            </div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Mutations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-zinc-900 flex items-center gap-2">
                543
                <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Transitions in last hour
              </p>
            </CardContent>
          </Card>

          <Card className="border-zinc-200/50 bg-gradient-to-br from-white to-zinc-50/50 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <Zap className="h-12 w-12" />
            </div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg Latency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-zinc-900">42ms</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <span className="text-emerald-600 font-medium flex items-center">
                  <ArrowDownRight className="h-3 w-3 mr-0.5" />
                  -5ms
                </span>
                improvement
              </p>
            </CardContent>
          </Card>

          <Card className="border-zinc-200/50 bg-gradient-to-br from-white to-zinc-50/50 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <ShieldCheck className="h-12 w-12" />
            </div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Threat Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-zinc-900 text-emerald-600">
                Low
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                0 critical incidents
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4 border-zinc-200/50 shadow-sm">
            <CardHeader>
              <CardTitle>Registration Velocity</CardTitle>
              <CardDescription>
                Real-time ingestion rate of new domains
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sampleData}>
                    <defs>
                      <linearGradient
                        id="colorRegistrations"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="hsl(var(--primary))"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="hsl(var(--primary))"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-zinc-100"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="timestamp"
                      className="text-[10px] font-mono text-zinc-500"
                      tickLine={false}
                      axisLine={false}
                      dy={10}
                    />
                    <YAxis
                      className="text-[10px] font-mono text-zinc-500"
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-lg border border-zinc-200 bg-white p-2 shadow-xl">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex flex-col">
                                  <span className="text-[10px] uppercase text-muted-foreground">
                                    Registrations
                                  </span>
                                  <span className="font-bold text-zinc-900">
                                    {payload[0].value}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="registrations"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorRegistrations)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-3 border-zinc-200/50 shadow-sm">
            <CardHeader>
              <CardTitle>System Health Matrix</CardTitle>
              <CardDescription>Component operational status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {[
                  {
                    name: "Worker API",
                    status: "operational",
                    region: "global",
                  },
                  { name: "D1 Database", status: "operational", region: "nam" },
                  {
                    name: "Durable Objects",
                    status: "operational",
                    region: "global",
                  },
                  { name: "KV Store", status: "operational", region: "global" },
                  {
                    name: "Analytics Engine",
                    status: "degraded",
                    region: "weu",
                  },
                ].map((service) => (
                  <div
                    key={service.name}
                    className="flex items-center justify-between p-3 rounded-lg border border-zinc-100 bg-zinc-50/50"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "h-2.5 w-2.5 rounded-full ring-2 ring-white",
                          service.status === "operational"
                            ? "bg-emerald-500 shadow-lg shadow-emerald-500/20"
                            : service.status === "degraded"
                              ? "bg-amber-500 shadow-lg shadow-amber-500/20"
                              : "bg-red-500",
                        )}
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-zinc-900">
                          {service.name}
                        </span>
                        <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
                          {service.region}
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "capitalize font-mono text-[10px]",
                        service.status === "operational"
                          ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                          : service.status === "degraded"
                            ? "text-amber-700 bg-amber-50 border-amber-200"
                            : "text-red-700 bg-red-50 border-red-200",
                      )}
                    >
                      {service.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-zinc-200/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Abuse Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[120px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sampleData}>
                    <Area
                      type="monotone"
                      dataKey="errors"
                      stroke="#ef4444"
                      fill="#fee2e2"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card className="border-zinc-200/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">API Latency</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[120px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sampleData}>
                    <Area
                      type="monotone"
                      dataKey="latency"
                      stroke="#f59e0b"
                      fill="#fef3c7"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card className="border-zinc-200/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Transition Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[120px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sampleData}>
                    <Area
                      type="monotone"
                      dataKey="transitions"
                      stroke="#3b82f6"
                      fill="#dbeafe"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
