"use client"

import { useEffect, useState } from "react"
import { ArrowRight, Clock, RefreshCw } from "lucide-react"
import { DashboardShell } from "@/components/DashboardShell"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DomainState } from "@/types/domain"

interface TransitionWithDomain {
  id: string
  domain_id: string
  domain_name: string
  from_state: DomainState
  to_state: DomainState
  triggered_by: string
  reason: string | null
  created_at: string
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

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function TransitionsView() {
  const [transitions, setTransitions] = useState<TransitionWithDomain[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchTransitions() {
    setLoading(true)
    try {
      const response = await fetch("/api/transitions?limit=100")
      if (!response.ok) throw new Error("Failed to fetch")
      const data = await response.json() as { transitions: TransitionWithDomain[] }
      setTransitions(data.transitions || [])
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransitions()
  }, [])

  return (
    <DashboardShell title="Transitions" description="Domain state transition history">
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button variant="outline" onClick={fetchTransitions} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : transitions.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Clock className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No transitions recorded yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {transitions.map((transition) => (
              <Card key={transition.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium">
                      {transition.domain_name}
                    </CardTitle>
                    <span className="text-sm text-muted-foreground">
                      {formatTimeAgo(transition.created_at)}
                    </span>
                  </div>
                  <CardDescription>{formatDate(transition.created_at)}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Badge variant={STATE_BADGE_VARIANT[transition.from_state]}>
                        {transition.from_state}
                      </Badge>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      <Badge variant={STATE_BADGE_VARIANT[transition.to_state]}>
                        {transition.to_state}
                      </Badge>
                    </div>
                    <div className="flex-1" />
                    <div className="text-right">
                      <p className="text-sm font-medium">Triggered by: {transition.triggered_by}</p>
                      {transition.reason && (
                        <p className="text-sm text-muted-foreground">{transition.reason}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
