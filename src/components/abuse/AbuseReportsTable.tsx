"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, CheckCircle, Clock, XCircle } from "lucide-react"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface AbuseReport {
  id: string
  domain_id: string
  domain_name: string
  reporter_email: string | null
  category: string
  description: string | null
  status: string
  created_at: string
  resolved_at: string | null
  resolution_notes: string | null
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

const statusIcons: Record<string, React.ReactNode> = {
  pending: <Clock className="h-4 w-4 text-yellow-500" />,
  investigating: <AlertTriangle className="h-4 w-4 text-orange-500" />,
  resolved: <CheckCircle className="h-4 w-4 text-green-500" />,
  dismissed: <XCircle className="h-4 w-4 text-muted-foreground" />,
}

export function AbuseReportsTable() {
  const [reports, setReports] = useState<AbuseReport[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [selectedReport, setSelectedReport] = useState<AbuseReport | null>(null)
  const [resolutionNotes, setResolutionNotes] = useState("")
  const [updating, setUpdating] = useState(false)

  async function fetchReports() {
    setLoading(true)
    try {
      const url = filter === "all" ? "/api/abuse" : `/api/abuse?status=${filter}`
      const response = await fetch(url)
      if (!response.ok) throw new Error("Failed to fetch")
      const data = await response.json() as { reports: AbuseReport[] }
      setReports(data.reports || [])
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [filter])

  async function updateStatus(status: string) {
    if (!selectedReport) return
    
    setUpdating(true)
    try {
      const response = await fetch("/api/abuse", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedReport.id,
          status,
          resolution_notes: resolutionNotes,
        }),
      })
      
      if (!response.ok) throw new Error("Failed to update")
      
      setSelectedReport(null)
      setResolutionNotes("")
      fetchReports()
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setUpdating(false)
    }
  }

  const filteredReports = reports

  return (
    <DashboardShell title="Abuse Reports" description="Review and manage abuse reports">
      <div className="space-y-4">
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="investigating">Investigating</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
            <TabsTrigger value="dismissed">Dismissed</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Domain</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Reporter</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reported</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredReports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No abuse reports found
                  </TableCell>
                </TableRow>
              ) : (
                filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.domain_name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{report.category}</Badge>
                    </TableCell>
                    <TableCell>{report.reporter_email || "Anonymous"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {statusIcons[report.status]}
                        <span className="capitalize">{report.status}</span>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(report.created_at)}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedReport(report)}
                      >
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <Dialog open={!!selectedReport} onOpenChange={(open) => !open && setSelectedReport(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Review Abuse Report</DialogTitle>
              <DialogDescription>
                {selectedReport?.domain_name} - {selectedReport?.category}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label className="text-muted-foreground">Description</Label>
                <p className="mt-1">{selectedReport?.description || "No description provided"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Reporter</Label>
                <p className="mt-1">{selectedReport?.reporter_email || "Anonymous"}</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Resolution Notes</Label>
                <Input
                  id="notes"
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Add notes about the resolution..."
                />
              </div>
            </div>
            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={() => updateStatus("dismissed")} disabled={updating}>
                Dismiss
              </Button>
              <Button variant="outline" onClick={() => updateStatus("investigating")} disabled={updating}>
                Investigate
              </Button>
              <Button onClick={() => updateStatus("resolved")} disabled={updating}>
                Resolve
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardShell>
  )
}
