"use client";

import * as React from "react";
import { Pie, PieChart, Cell, Label, Sector } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { DomainState } from "@/types/domain";
import { Globe, Shield, Activity, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface DomainStateChartProps {
  byState: Record<DomainState, number>;
}

const chartConfig = {
  active: { label: "Active", color: "hsl(142, 71%, 45%)", icon: Activity },
  expiring: { label: "Expiring", color: "hsl(48, 96%, 53%)", icon: Zap },
  suspended: { label: "Suspended", color: "hsl(0, 72%, 51%)", icon: Shield },
  registered: { label: "Registered", color: "hsl(217, 91%, 60%)", icon: Globe },
} satisfies ChartConfig;

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } =
    props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 4}
        outerRadius={outerRadius + 4}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        stroke={fill}
        strokeWidth={2}
        className="drop-shadow-none"
      />
    </g>
  );
};

export function DomainStateChart({ byState }: DomainStateChartProps) {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  const total = Object.values(byState).reduce((acc, val) => acc + val, 0);

  const chartData = Object.entries(byState)
    .filter(([state]) =>
      ["active", "expiring", "suspended", "registered"].includes(state),
    )
    .map(([state, value]) => ({
      state: state,
      count: value,
      fill: `var(--color-${state})`,
    }))
    .sort((a, b) => b.count - a.count);

  if (total === 0) {
    return (
      <Card className="h-full border-white/5 bg-zinc-950/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Domain States</CardTitle>
          <CardDescription>Network distribution analysis</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[400px]">
          <div className="flex flex-col items-center gap-4 text-muted-foreground">
            <Activity className="h-12 w-12 animate-pulse" />
            <p className="text-sm font-medium">Neural link offline • No data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full border-2 border-zinc-200 bg-white overflow-hidden relative group transition-all duration-500 hover:border-zinc-300">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl font-bold tracking-tight text-zinc-900">
            Domain Clusters
          </CardTitle>
          <CardDescription className="text-xs uppercase tracking-widest font-semibold text-orange-600/80">
            Lifecycle Matrix Analysis
          </CardDescription>
        </div>
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20">
          <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
          <span className="text-[10px] font-bold text-green-600 leading-none">
            LIVE
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col xl:flex-row items-center gap-8 py-8">
        <div className="relative h-64 w-64 lg:h-72 lg:w-72 group/hub shrink-0">
          <ChartContainer
            config={chartConfig}
            className="aspect-square h-full w-full"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="count"
                nameKey="state"
                innerRadius={70}
                outerRadius={100}
                strokeWidth={5}
                activeIndex={activeIndex ?? -1}
                activeShape={renderActiveShape}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <foreignObject
                          x={viewBox.cx! - 50}
                          y={viewBox.cy! - 50}
                          width={100}
                          height={100}
                        >
                          <div className="flex h-full w-full items-center justify-center">
                            <div className="relative group/core">
                              <div className="relative flex h-20 w-20 flex-col items-center justify-center rounded-full bg-zinc-950">
                                <span className="text-2xl font-black text-white px-2 py-0.5 rounded-lg">
                                  {total}
                                </span>
                                <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">
                                  Nodes
                                </span>
                              </div>
                            </div>
                          </div>
                        </foreignObject>
                      );
                    }
                  }}
                />
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.fill}
                    className="transition-all duration-300 hover:opacity-80"
                  />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        </div>

        {/* Intelligence Matrix - Legend/Stats */}
        <div className="flex-1 w-full grid gap-4">
          {chartData.map((item, index) => {
            const Config = chartConfig[item.state as keyof typeof chartConfig];
            const Icon = Config?.icon;
            const percentage = ((item.count / total) * 100).toFixed(1);
            const isActive = activeIndex === index;

            return (
              <div
                key={item.state}
                className={cn(
                  "relative flex items-center justify-between p-3 rounded-xl border border-black/5 bg-white transition-all duration-300 cursor-pointer overflow-hidden",
                  isActive ? "border-black/10 bg-zinc-50" : "hover:bg-zinc-50",
                )}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {isActive && (
                  <div
                    className="absolute inset-y-0 left-0 w-1 rounded-full"
                    style={{ backgroundColor: item.fill }}
                  />
                )}
                <div className="flex items-center gap-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${item.fill}15` }}
                  >
                    {Icon && (
                      <Icon className="h-4 w-4" style={{ color: item.fill }} />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold capitalize text-zinc-700">
                      {item.state}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {percentage}% Network Share
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black font-mono tracking-tighter text-zinc-900">
                    {item.count}
                  </div>
                  <div className="text-[8px] text-zinc-500 uppercase font-bold tracking-widest">
                    Domains
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
