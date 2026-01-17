"use client"

import { useEffect, useState } from "react"
import { Plus, MoreHorizontal, CheckCircle, XCircle } from "lucide-react"
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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import type { Registrant } from "@/types/domain"

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function RegistrantsTable() {
  const { toast } = useToast()
  const [registrants, setRegistrants] = useState<Registrant[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [newRegistrant, setNewRegistrant] = useState({
    name: "",
    email: "",
    organization: "",
    country: "",
    phone: "",
  })

  async function fetchRegistrants() {
    try {
      const response = await fetch("/api/registrants")
      if (!response.ok) throw new Error("Failed to fetch")
      const data = await response.json() as { registrants: Registrant[] }
      setRegistrants(data.registrants || [])
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRegistrants()
  }, [])

  async function handleCreate() {
    if (!newRegistrant.name || !newRegistrant.email || !newRegistrant.country) return
    
    setCreating(true)
    try {
      const response = await fetch("/api/registrants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRegistrant),
      })
      
      if (!response.ok) throw new Error("Failed to create")
      
      const data = await response.json() as { 
        registrant: any
        verificationEmailSent: boolean
        message: string 
      }
      
      // Close dialog first
      setDialogOpen(false)
      setNewRegistrant({ name: "", email: "", organization: "", country: "", phone: "" })
      
      // Show toast notification
      if (data.verificationEmailSent) {
        toast({
          variant: "success",
          title: "✅ Registrant Created",
          description: `📧 Verification email sent to ${newRegistrant.email}. Please check your inbox.`,
        })
      } else {
        toast({
          variant: "default",
          title: "✅ Registrant Created",
          description: "⚠️ Verification email could not be sent. Please try resending later.",
        })
      }
      
      // Refresh list
      fetchRegistrants()
    } catch (error) {
      console.error("Error:", error)
      toast({
        variant: "destructive",
        title: "❌ Error",
        description: "Failed to create registrant. Please try again.",
      })
    } finally {
      setCreating(false)
    }
  }

  return (
    <DashboardShell title="Registrants" description="Manage domain registrant accounts">
      <div className="space-y-4">
        <div className="flex justify-end">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Registrant
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Registrant</DialogTitle>
                <DialogDescription>Create a new registrant account.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={newRegistrant.name}
                    onChange={(e) => setNewRegistrant({ ...newRegistrant, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newRegistrant.email}
                    onChange={(e) => setNewRegistrant({ ...newRegistrant, email: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="organization">Organization</Label>
                  <Input
                    id="organization"
                    value={newRegistrant.organization}
                    onChange={(e) => setNewRegistrant({ ...newRegistrant, organization: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    value={newRegistrant.country}
                    onChange={(e) => setNewRegistrant({ ...newRegistrant, country: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={newRegistrant.phone}
                    onChange={(e) => setNewRegistrant({ ...newRegistrant, phone: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleCreate} disabled={creating || !newRegistrant.name || !newRegistrant.email || !newRegistrant.country}>
                  {creating ? "Creating..." : "Create"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Verified</TableHead>
                <TableHead>Created</TableHead>
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
              ) : registrants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No registrants found
                  </TableCell>
                </TableRow>
              ) : (
                registrants.map((registrant) => (
                  <TableRow key={registrant.id}>
                    <TableCell className="font-medium">{registrant.name}</TableCell>
                    <TableCell>{registrant.email}</TableCell>
                    <TableCell>{registrant.organization || "—"}</TableCell>
                    <TableCell>{registrant.country}</TableCell>
                    <TableCell>
                      {registrant.verified ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-muted-foreground" />
                      )}
                    </TableCell>
                    <TableCell>{formatDate(registrant.created_at)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardShell>
  )
}
