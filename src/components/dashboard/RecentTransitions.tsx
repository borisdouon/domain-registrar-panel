import { ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DomainState, type DomainTransition } from "@/types/domain"

interface RecentTransitionsProps {
  transitions: DomainTransition[]
}

const STATE_BADGE_VARIANT: Record<DomainState, "default" | "secondary" | "destructive" | "outline" | "success" | "warning"> = {
  [DomainState.Available]: "secondary",
  [DomainState.Registered]: "default",
  [DomainState.Active]: "success",
  [DomainState.Expiring]: "warning",
  [DomainState.GracePeriod]: "warning",
  [DomainState.Redemption]: "destructive",
  [DomainState.Suspended]: "destructive",
  [DomainState.Deleted]: "secondary",
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return `${diffDays}d ago`
}

export function RecentTransitions({ transitions }: RecentTransitionsProps) {
  if (transitions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transitions</CardTitle>
          <CardDescription>Latest domain state changes</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[200px]">
          <p className="text-muted-foreground">No recent transitions</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transitions</CardTitle>
        <CardDescription>Latest domain state changes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transitions.slice(0, 8).map((transition) => (
            <div
              key={transition.id}
              className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Badge variant={STATE_BADGE_VARIANT[transition.from_state]}>
                    {transition.from_state}
                  </Badge>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  <Badge variant={STATE_BADGE_VARIANT[transition.to_state]}>
                    {transition.to_state}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">
                  {transition.triggered_by}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatTimeAgo(transition.created_at)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
