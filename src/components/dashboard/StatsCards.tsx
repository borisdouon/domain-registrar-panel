import { Globe, AlertTriangle, Clock, Shield } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StatsCardsProps {
  totalDomains: number
  registrationsToday: number
  expiringSoon: number
  suspendedDomains: number
  abuseReportsPending: number
}

export function StatsCards({
  totalDomains,
  registrationsToday,
  expiringSoon,
  suspendedDomains,
  abuseReportsPending
}: StatsCardsProps) {
  const stats = [
    {
      title: "Total Domains",
      value: totalDomains.toLocaleString(),
      description: `+${registrationsToday} today`,
      icon: Globe,
      iconColor: "text-primary",
    },
    {
      title: "Expiring Soon",
      value: expiringSoon.toLocaleString(),
      description: "Within 30 days",
      icon: Clock,
      iconColor: "text-yellow-500",
    },
    {
      title: "Suspended",
      value: suspendedDomains.toLocaleString(),
      description: "Requires review",
      icon: Shield,
      iconColor: "text-red-500",
    },
    {
      title: "Abuse Reports",
      value: abuseReportsPending.toLocaleString(),
      description: "Pending review",
      icon: AlertTriangle,
      iconColor: "text-orange-500",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
