"use client"

import { Pie, PieChart, Cell, Label } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { DomainState } from "@/types/domain"

interface DomainStateChartProps {
  byState: Record<DomainState, number>
}

const chartConfig = {
  domains: { label: "Domains" },
  available: { label: "Available", color: "hsl(215, 14%, 63%)" },
  registered: { label: "Registered", color: "hsl(217, 91%, 60%)" },
  active: { label: "Active", color: "hsl(142, 71%, 45%)" },
  expiring: { label: "Expiring", color: "hsl(48, 96%, 53%)" },
  grace_period: { label: "Grace Period", color: "hsl(25, 95%, 53%)" },
  redemption: { label: "Redemption", color: "hsl(0, 84%, 60%)" },
  suspended: { label: "Suspended", color: "hsl(0, 72%, 51%)" },
  deleted: { label: "Deleted", color: "hsl(220, 9%, 46%)" },
} satisfies ChartConfig

export function DomainStateChart({ byState }: DomainStateChartProps) {
  const data = Object.entries(byState)
    .filter(([, value]) => value > 0)
    .map(([state, value]) => ({
      state: state,
      domains: value,
      fill: `var(--color-${state})`,
    }))

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Domain States</CardTitle>
          <CardDescription>Distribution of domains by lifecycle state</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-muted-foreground">No domain data available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Domain States</CardTitle>
        <CardDescription>Distribution of domains by lifecycle state</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[300px]">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="state" hideLabel />} />
            <Pie
              data={data}
              dataKey="domains"
              nameKey="state"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              label={({ name, value }) => `${value}`}
              labelLine={false}
            />
            <ChartLegend
              content={({ payload }) => <ChartLegendContent payload={payload} nameKey="state" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
