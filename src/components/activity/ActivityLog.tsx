"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";
import {
  Activity,
  Globe,
  ArrowRight,
  AlertTriangle,
  RefreshCw,
  Cpu,
  Network,
  Shield,
  Zap,
} from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ActivityItem {
  id: string;
  type: "transition" | "abuse_report" | "registration" | "system_alert";
  description: string;
  triggered_by: string;
  created_at: string; // ISO string
  metadata: {
    ip_address: string;
    protocol: "TCP" | "UDP" | "TLSv1.3" | "QUIC";
    latency_ms: number;
    region: string;
    status_code: number;
    user_agent: string;
    trace_id: string;
    risk_score?: number;
  };
}

// Generate realistic technical data
function generateMockActivity(): ActivityItem {
  const types = [
    "transition",
    "abuse_report",
    "registration",
    "system_alert",
  ] as const;
  const type = types[Math.floor(Math.random() * types.length)];
  const ms = Math.floor(Math.random() * 999)
    .toString()
    .padStart(3, "0");
  const now = new Date();
  now.setMilliseconds(parseInt(ms));

  const protocols = ["TLSv1.3", "QUIC", "TCP", "HTTP/3"] as const;
  const regions = ["us-east-1", "eu-west-1", "ap-northeast-1", "sa-east-1"];

  const baseActions = {
    transition: [
      "transitioned from active to suspended",
      "transitioned from pending to active",
      "DNS propagation complete",
    ],
    abuse_report: [
      "Phishing detected",
      "Spam signature match",
      "Malware payload identified",
    ],
    registration: [
      "Domain registered successfully",
      "Auto-renewal processed",
      "Transfer completed",
    ],
    system_alert: [
      "High latency detected",
      "Rate limit exceeded",
      "Node rebalancing initiated",
    ],
  };

  const descriptions = baseActions[type];
  const description =
    descriptions[Math.floor(Math.random() * descriptions.length)];

  return {
    id: Math.random().toString(36).substring(7),
    type,
    description:
      type === "registration" || type === "transition"
        ? `Domain ${["acme.com", "startup.io", "dev.net", "shop.org"][Math.floor(Math.random() * 4)]} ${description}`
        : `${description} on node-${Math.floor(Math.random() * 100)}`,
    triggered_by: ["system", "admin", "security_bot", "user_action"][
      Math.floor(Math.random() * 4)
    ],
    created_at: now.toISOString(),
    metadata: {
      ip_address: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      protocol: protocols[Math.floor(Math.random() * protocols.length)],
      latency_ms: Math.floor(Math.random() * 150) + 5,
      region: regions[Math.floor(Math.random() * regions.length)],
      status_code: type === "abuse_report" ? 403 : 200,
      user_agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...",
      trace_id: `req_${Math.random().toString(16).substring(2, 10)}`,
      risk_score: type === "abuse_report" ? Math.floor(Math.random() * 100) : 0,
    },
  };
}

export function ActivityLog() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Custom Cursor State
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorText, setCursorText] = useState("SYSTEM_READY");
  const [isCursorVisible, setIsCursorVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initial load
  useEffect(() => {
    // Generate some initial history
    const initial = Array.from({ length: 15 }, generateMockActivity).sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
    setActivities(initial);
    setLoading(false);
  }, []);

  // Live updates - "The Nerve" effect
  useEffect(() => {
    const interval = setInterval(
      () => {
        setActivities((prev) => {
          const newActivity = generateMockActivity();
          const updated = [newActivity, ...prev].slice(0, 50); // Keep last 50
          return updated;
        });
      },
      2000 + Math.random() * 3000,
    ); // Random interval between 2-5s

    return () => clearInterval(interval);
  }, []);

  // Handle Mouse Move for Custom Cursor
  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setCursorPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  return (
    <DashboardShell
      title="Live Activity"
      description="System-wide event stream"
      currentPath="/activity"
    >
      <div className="space-y-4">
        {/* Header Status Bar */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50/50 border border-emerald-100 rounded-full">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 duration-1000"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-mono font-medium text-emerald-700 uppercase tracking-wider">
                System Online
              </span>
            </div>
            <div className="flex gap-4 text-[10px] font-mono text-zinc-400">
              <span className="flex items-center gap-1.5 list-item-vibrate">
                <Network className="h-3 w-3" />
                <span>NET_OK</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Cpu className="h-3 w-3" />
                <span>CPU_IDLE</span>
              </span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              setActivities([generateMockActivity(), ...activities])
            }
            className="h-8 text-xs font-mono text-zinc-400 hover:text-zinc-600"
          >
            <RefreshCw className="mr-2 h-3.5 w-3.5" />
            FORCE_SYNC
          </Button>
        </div>

        {/* Main Log Console */}
        <Card
          className="bg-white border-zinc-200 shadow-sm overflow-hidden relative group/console"
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsCursorVisible(true)}
          onMouseLeave={() => setIsCursorVisible(false)}
        >
          {/* "Nerve" decoration line */}
          <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent opacity-0 group-hover/console:opacity-100 transition-opacity duration-700 pointer-events-none" />

          {/* Custom Technical Cursor */}
          <div
            className="pointer-events-none fixed z-[100] flex items-center gap-2 px-2 py-1 bg-zinc-900/90 text-emerald-400 border border-emerald-500/30 rounded shadow-xl backdrop-blur-md transition-opacity duration-100"
            style={{
              left:
                cursorPos.x +
                (containerRef.current?.getBoundingClientRect().left || 0) +
                16,
              top:
                cursorPos.y +
                (containerRef.current?.getBoundingClientRect().top || 0) +
                16,
              opacity: isCursorVisible ? 1 : 0,
            }}
          >
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[10px] tracking-widest font-bold whitespace-nowrap">
              [{cursorText}]
            </span>
          </div>

          <div className="bg-zinc-50/80 backdrop-blur-sm border-b border-zinc-100 p-2 flex items-center gap-2 px-4 sticky top-0 z-10">
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-red-400/20 border border-red-400/50" />
              <div className="h-2.5 w-2.5 rounded-full bg-amber-400/20 border border-amber-400/50" />
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/20 border border-emerald-400/50" />
            </div>
            <div className="ml-4 text-[10px] font-mono text-zinc-400 flex-1 flex justify-between items-center">
              <span>
                root@domain-registry:~ tail -f /var/log/activity.log --json
                --expanded
              </span>
              <span className="opacity-50">Stream Latency: 12ms</span>
            </div>
          </div>

          <CardContent className="p-0">
            <ScrollArea className="h-[600px]" ref={scrollRef}>
              <div className="p-2 space-y-1 font-mono text-sm min-h-[600px]">
                {loading && activities.length === 0 ? (
                  <div className="flex items-center justify-center py-12 text-zinc-400 italic">
                    Initializing neural stream...
                  </div>
                ) : (
                  activities.map((activity, index) => (
                    <ActivityRow
                      key={activity.id}
                      activity={activity}
                      index={index}
                      setCursorText={setCursorText}
                    />
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <style jsx global>{`
        @keyframes float-scan {
          0% {
            transform: translateY(0px);
            opacity: 0.5;
          }
          50% {
            transform: translateY(4px);
            opacity: 1;
          }
          100% {
            transform: translateY(0px);
            opacity: 0.5;
          }
        }
        .list-item-vibrate {
          animation: vibe 2s infinite;
        }
        @keyframes vibe {
          0%,
          100% {
            opacity: 0.7;
          }
          50% {
            opacity: 1;
            text-shadow: 0 0 2px rgba(16, 185, 129, 0.2);
          }
        }
      `}</style>
    </DashboardShell>
  );
}

// Sub-component for individual rows to manage hover state cleanly
function ActivityRow({
  activity,
  index,
  setCursorText,
}: {
  activity: ActivityItem;
  index: number;
  setCursorText: (text: string) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const time = new Date(activity.created_at);

  // Format: HH:mm:ss.SSS
  const timestamp = `${time.getHours().toString().padStart(2, "0")}:${time.getMinutes().toString().padStart(2, "0")}:${time.getSeconds().toString().padStart(2, "0")}.${time.getMilliseconds().toString().padStart(3, "0")}`;

  const typeConfig = {
    transition: {
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
      icon: ArrowRight,
      cursor: "ANALYZING",
    },
    abuse_report: {
      color: "text-red-500",
      bg: "bg-red-50",
      border: "border-red-100",
      icon: AlertTriangle,
      cursor: "THREAT_DETECTED",
    },
    registration: {
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      icon: Globe,
      cursor: "VERIFIED",
    },
    system_alert: {
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-100",
      icon: Zap,
      cursor: "SYSTEM_ALERT",
    },
  };

  const config = typeConfig[activity.type];
  const Icon = config.icon;

  const handleMouseEnter = () => {
    setIsHovered(true);
    setCursorText(config.cursor);
  };

  return (
    <div
      className="relative group perspective"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => {
        setIsHovered(false);
        setCursorText("SCANNING...");
      }}
    >
      {/* Base Row */}
      <div
        className={cn(
          "flex items-center gap-3 py-2 px-3 rounded-md transition-all duration-200 border border-transparent",
          "hover:bg-zinc-50 hover:border-zinc-200 hover:shadow-sm hover:z-20 relative",
          index === 0
            ? "animate-in slide-in-from-top-2 fade-in duration-300"
            : "",
        )}
      >
        {/* Timestamp */}
        <span className="text-zinc-400 text-[11px] w-[100px] tracking-tight shrink-0 font-light opacity-70 group-hover:opacity-100 group-hover:text-zinc-600">
          [{timestamp}]
        </span>

        {/* Status Badge */}
        <div
          className={cn(
            "flex items-center justify-center h-6 w-6 rounded border shrink-0 transition-transform group-hover:scale-110",
            config.bg,
            config.border,
          )}
        >
          <Icon className={cn("h-3.5 w-3.5", config.color)} />
        </div>

        {/* Status Text - Compact */}
        <div className="flex items-center gap-2 min-w-[80px] shrink-0">
          <span
            className={cn(
              "text-[11px] font-bold uppercase tracking-wider",
              config.color,
            )}
          >
            {activity.type.replace("_", " ")}
          </span>
        </div>

        {/* Description */}
        <div className="flex-1 text-zinc-900 text-xs truncate font-medium group-hover:text-black">
          {activity.description}
        </div>

        {/* Quick Meta */}
        <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0">
          <span className="text-[10px] text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200">
            {activity.metadata.latency_ms}ms
          </span>
          <span className="text-[10px] text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200">
            {activity.metadata.protocol}
          </span>
        </div>
      </div>

      {/* FLOATING BODY - Detailed View Popover */}
      {/* Renders conditionally or is just hidden with opacity/scale for better physics? Using conditional for DOM perf, but CSS for smoothness. Let's use absolute positioning with high Z-index */}
      <div
        className={cn(
          "absolute left-[10%] top-full z-50 w-[80%] mt-2",
          "pointer-events-none transition-all duration-200 ease-out origin-top",
          isHovered
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 -translate-y-2 scale-95 hidden",
        )}
      >
        <div
          className={cn(
            "bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 rounded-lg p-4 shadow-2xl",
            "text-zinc-300 grid grid-cols-2 gap-x-8 gap-y-2 text-[11px]",
            "ring-1 ring-white/10",
          )}
        >
          {/* Decoration Header */}
          <div className="col-span-2 flex justify-between border-b border-zinc-800 pb-2 mb-2">
            <span className="font-bold text-emerald-400 flex items-center gap-2">
              <Activity className="h-3 w-3" />
              EVENT_TRACE_LOG
            </span>
            <span className="font-mono text-zinc-500">
              {activity.metadata.trace_id}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-zinc-500 uppercase tracking-wider text-[9px]">
              Source IP
            </span>
            <span className="font-mono text-zinc-200">
              {activity.metadata.ip_address}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-zinc-500 uppercase tracking-wider text-[9px]">
              Region
            </span>
            <span className="font-mono text-zinc-200 flex items-center gap-1">
              <Globe className="h-3 w-3 text-zinc-600" />
              {activity.metadata.region}
            </span>
          </div>

          <div className="flex flex-col gap-1 mt-2">
            <span className="text-zinc-500 uppercase tracking-wider text-[9px]">
              User Agent
            </span>
            <span className="font-mono text-zinc-400 truncate w-full">
              {activity.metadata.user_agent}
            </span>
          </div>
          <div className="flex flex-col gap-1 mt-2">
            <span className="text-zinc-500 uppercase tracking-wider text-[9px]">
              Risk Score
            </span>
            <div className="flex items-center gap-2">
              <div className="h-1.5 flex-1 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full",
                    activity.metadata.risk_score &&
                      activity.metadata.risk_score > 50
                      ? "bg-red-500"
                      : "bg-emerald-500",
                  )}
                  style={{ width: `${activity.metadata.risk_score}%` }}
                />
              </div>
              <span className="font-mono text-zinc-200">
                {activity.metadata.risk_score}/100
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="col-span-2 mt-3 pt-2 border-t border-zinc-800 flex justify-between items-center text-[10px] text-zinc-500">
            <span>Processed in {activity.metadata.latency_ms}ms</span>
            <span className="font-mono">
              STATUS: {activity.metadata.status_code}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
