import {
  Globe,
  AlertTriangle,
  Clock,
  Shield,
  ArrowUpRight,
  Activity,
  Zap,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardsProps {
  totalDomains: number;
  registrationsToday: number;
  expiringSoon: number;
  suspendedDomains: number;
  abuseReportsPending: number;
}

export function StatsCards({
  totalDomains,
  registrationsToday,
  expiringSoon,
  suspendedDomains,
  abuseReportsPending,
}: StatsCardsProps) {
  const cards = [
    {
      title: "Total Domains",
      value: totalDomains,
      subValue: `+${registrationsToday}`,
      subLabel: "new today",
      icon: Globe,
      color: "orange",
      trend: "up",
      details: "Global Reach",
    },
    {
      title: "Expiring Soon",
      value: expiringSoon,
      subValue: "30d",
      subLabel: "window",
      icon: Clock,
      color: "amber",
      trend: "warning",
      details: "Renewal Queue",
    },
    {
      title: "Suspended",
      value: suspendedDomains,
      subValue: "Action",
      subLabel: "required",
      icon: Shield,
      color: "red",
      trend: "danger",
      details: "Policy Violation",
    },
    {
      title: "Abuse Reports",
      value: abuseReportsPending,
      subValue: "LIVE",
      subLabel: "analysis",
      icon: AlertTriangle,
      color: "blue",
      trend: "info",
      details: "Inbound Signal",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        const colorClass =
          card.color === "orange"
            ? "text-orange-500 border-orange-500/50 bg-orange-500/10"
            : card.color === "amber"
              ? "text-amber-500 border-amber-500/50 bg-amber-500/10"
              : card.color === "red"
                ? "text-red-500 border-red-500/50 bg-red-500/10"
                : "text-blue-500 border-blue-500/50 bg-blue-500/10";

        return (
          <Card
            key={card.title}
            className={cn(
              "relative overflow-hidden border-2 border-zinc-200 bg-white group cursor-default",
              "hover:border-zinc-300",
            )}
          >
            {/* Grid Pattern Background */}
            <div
              className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply"
              style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, black 1px, transparent 0)`,
                backgroundSize: "24px 24px",
              }}
            />

            <CardContent className="p-6 relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-zinc-900" />
                    <p className="text-[11px] font-bold text-zinc-600 uppercase tracking-[0.2em]">
                      {card.title}
                    </p>
                  </div>
                  <h3 className="text-sm font-bold text-zinc-500 group-hover:text-zinc-800 transition-colors">
                    {card.details}
                  </h3>
                </div>
                <div className={cn("p-2.5 rounded-xl border", colorClass)}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <div className="flex items-end justify-between items-center">
                <div className="space-y-1">
                  <div className="text-4xl font-black tracking-tighter text-zinc-900">
                    {/* Removed drop-shadow-sm */}
                    {card.value}
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-black font-mono border border-transparent",
                        card.trend === "up"
                          ? "bg-green-500/10 text-green-700 border-green-500/20"
                          : card.trend === "warning"
                            ? "bg-amber-500/10 text-amber-700 border-amber-500/20"
                            : card.trend === "danger"
                              ? "bg-red-500/10 text-red-700 border-red-500/20 animate-pulse"
                              : "bg-blue-500/10 text-blue-700 border-blue-500/20",
                      )}
                    >
                      {card.trend === "up" && (
                        <ArrowUpRight className="h-3 w-3" />
                      )}
                      {card.trend === "warning" && <Zap className="h-3 w-3" />}
                      {card.trend === "danger" && (
                        <Activity className="h-3 w-3" />
                      )}
                      {card.trend === "info" && (
                        <Activity className="h-3 w-3" />
                      )}
                      {card.subValue}
                    </div>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      {card.subLabel}
                    </span>
                  </div>
                </div>

                {/* Micro Tech Link */}
                <div className="h-8 w-8 rounded-full border border-black/5 flex items-center justify-center cursor-pointer hover:bg-black/5">
                  {/* Removed shadow-sm */}
                  <ChevronRight className="h-4 w-4 text-zinc-900" />
                </div>
              </div>

              {/* Decorative Tech Bar */}
              <div className="mt-6 flex gap-1 h-1 w-full opacity-60">
                {Array.from({ length: 12 }).map((_, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "flex-1 rounded-full transition-all duration-500",
                      idx < 8
                        ? card.color === "orange"
                          ? "bg-orange-500/40 group-hover:bg-orange-500"
                          : card.color === "amber"
                            ? "bg-amber-500/40 group-hover:bg-amber-500"
                            : card.color === "red"
                              ? "bg-red-500/40 group-hover:bg-red-500"
                              : "bg-blue-500/40 group-hover:bg-blue-500"
                        : "bg-black/5",
                    )}
                    style={{ transitionDelay: `${idx * 50}ms` }}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
