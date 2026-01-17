"use client"

import { useEffect, useState } from "react"
import { DashboardShell } from "@/components/DashboardShell"
import { StatsCards } from "@/components/dashboard/StatsCards"
import { DomainStateChart } from "@/components/dashboard/DomainStateChart"
import { RecentTransitions } from "@/components/dashboard/RecentTransitions"
import type { DomainMetrics, DomainTransition } from "@/types/domain"

interface DashboardData {
  metrics: DomainMetrics
  recentTransitions: DomainTransition[]
}

export function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/metrics")
        if (!response.ok) throw new Error("Failed to fetch metrics")
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 30000) // Refresh every 30s
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <DashboardShell title="Dashboard" description="Domain lifecycle overview">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardShell>
    )
  }

  if (error || !data) {
    return (
      <DashboardShell title="Dashboard" description="Domain lifecycle overview">
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <p className="text-destructive mb-2">{error || "Failed to load dashboard"}</p>
          <button 
            onClick={() => window.location.reload()}
            className="text-primary hover:underline"
          >
            Try again
          </button>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell title="Dashboard" description="Domain lifecycle overview">
      <div className="space-y-6">
        <StatsCards
          totalDomains={data.metrics.totalDomains}
          registrationsToday={data.metrics.registrationsToday}
          expiringSoon={data.metrics.expiringSoon}
          suspendedDomains={data.metrics.suspendedDomains}
          abuseReportsPending={data.metrics.abuseReportsPending}
        />
        
        <div className="grid gap-6 md:grid-cols-2">
          <DomainStateChart byState={data.metrics.byState} />
          <RecentTransitions transitions={data.recentTransitions} />
        </div>
      </div>
    </DashboardShell>
  )
}
