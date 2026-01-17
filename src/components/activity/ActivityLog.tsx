"use client"

import { useEffect, useState } from "react"
import { Activity, Globe, ArrowRight, AlertTriangle, RefreshCw } from "lucide-react"
import { DashboardShell } from "@/components/DashboardShell"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ActivityItem {
  id: string
  type: "transition" | "abuse_report" | "registration"
  description: string
  triggered_by: string
  created_at: string
  metadata: Record<string, unknown>
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

const typeIcons: Record<string, React.ReactNode> = {
  transition: <ArrowRight className="h-4 w-4" />,
  abuse_report: <AlertTriangle className="h-4 w-4" />,
  registration: <Globe className="h-4 w-4" />,
}

const typeColors: Record<string, string> = {
  transition: "bg-blue-500",
  abuse_report: "bg-red-500",
  registration: "bg-green-500",
}

export function ActivityLog() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchActivities() {
    setLoading(true)
    try {
      const response = await fetch("/api/activity?limit=50")
      if (!response.ok) throw new Error("Failed to fetch")
      const data = await response.json() as { activities: ActivityItem[] }
      setActivities(data.activities || [])
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchActivities()
    const interval = setInterval(fetchActivities, 30000) // Refresh every 30s
    return () => clearInterval(interval)
  }, [])

  return (
    <DashboardShell title="Activity Log" description="Real-time platform activity">
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button variant="outline" onClick={fetchActivities} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {loading && activities.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : activities.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Activity className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No activity recorded yet</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Last 50 events across the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-4 pb-4 border-b last:border-0"
                    >
                      <div className={`mt-1 p-2 rounded-full text-white ${typeColors[activity.type]}`}>
                        {typeIcons[activity.type]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{activity.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {activity.type.replace("_", " ")}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            by {activity.triggered_by}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatTimeAgo(activity.created_at)}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardShell>
  )
}
