"use client"

import { useEffect, useState } from "react"
import { Shield, RefreshCw } from "lucide-react"
import { DashboardShell } from "@/components/DashboardShell"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"

interface SuspendedDomain {
  id: string
  name: string
  tld: string
  state: string
  suspension_reason: string | null
  updated_at: string
  registrant_name: string | null
  registrant_email: string | null
  abuse_score: number
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function SuspendedDomainsTable() {
  const [domains, setDomains] = useState<SuspendedDomain[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchDomains() {
    setLoading(true)
    try {
      const response = await fetch("/api/suspended")
      if (!response.ok) throw new Error("Failed to fetch")
      const data = await response.json() as { domains: SuspendedDomain[] }
      setDomains(data.domains || [])
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDomains()
  }, [])

  async function handleUnsuspend(domainId: string) {
    try {
      const response = await fetch(`/api/domains/${domainId}/transition`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toState: "active",
          triggeredBy: "admin",
          reason: "Manual unsuspension",
        }),
      })
      
      if (!response.ok) {
        const error = await response.json()
        alert(error.error || "Failed to unsuspend")
        return
      }
      
      fetchDomains()
    } catch (error) {
      console.error("Error:", error)
    }
  }

  return (
    <DashboardShell title="Suspended Domains" description="Domains currently suspended for policy violations">
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button variant="outline" onClick={fetchDomains} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : domains.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Shield className="h-12 w-12 text-green-500 mb-4" />
              <p className="text-lg font-medium">No suspended domains</p>
              <p className="text-muted-foreground">All domains are in good standing</p>
            </CardContent>
          </Card>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Domain</TableHead>
                  <TableHead>Registrant</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Abuse Score</TableHead>
                  <TableHead>Suspended On</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {domains.map((domain) => (
                  <TableRow key={domain.id}>
                    <TableCell className="font-medium">{domain.name}</TableCell>
                    <TableCell>
                      {domain.registrant_name ? (
                        <div>
                          <p className="font-medium">{domain.registrant_name}</p>
                          <p className="text-sm text-muted-foreground">{domain.registrant_email}</p>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">No registrant</span>
                      )}
                    </TableCell>
                    <TableCell>{domain.suspension_reason || "Policy violation"}</TableCell>
                    <TableCell>
                      <Badge variant={domain.abuse_score > 5 ? "destructive" : "warning"}>
                        {domain.abuse_score}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(domain.updated_at)}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUnsuspend(domain.id)}
                      >
                        Unsuspend
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
