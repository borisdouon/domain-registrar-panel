"use client"

import { useEffect, useState } from "react"
import { MoreHorizontal, Plus } from "lucide-react"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Domain } from "@/types/domain"
import { DomainState } from "@/types/domain"

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

function formatDate(dateString: string | null): string {
  if (!dateString) return "—"
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function DomainsTable() {
  const [domains, setDomains] = useState<Domain[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newDomain, setNewDomain] = useState({ name: "", tld: "com" })
  const [creating, setCreating] = useState(false)

  async function fetchDomains() {
    try {
      const response = await fetch("/api/domains")
      if (!response.ok) throw new Error("Failed to fetch domains")
      const data = await response.json()
      setDomains(data.domains || [])
    } catch (error) {
      console.error("Error fetching domains:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDomains()
  }, [])

  async function handleCreateDomain() {
    if (!newDomain.name) return
    
    setCreating(true)
    try {
      const response = await fetch("/api/domains", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDomain),
      })
      
      if (!response.ok) throw new Error("Failed to create domain")
      
      setDialogOpen(false)
      setNewDomain({ name: "", tld: "com" })
      fetchDomains()
    } catch (error) {
      console.error("Error creating domain:", error)
    } finally {
      setCreating(false)
    }
  }

  async function handleTransition(domainId: string, toState: DomainState) {
    try {
      const response = await fetch(`/api/domains/${domainId}/transition`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toState,
          triggeredBy: "admin",
          reason: `Manual transition to ${toState}`,
        }),
      })
      
      if (!response.ok) {
        const error = await response.json()
        alert(error.error || "Transition failed")
        return
      }
      
      fetchDomains()
    } catch (error) {
      console.error("Error transitioning domain:", error)
    }
  }

  return (
    <DashboardShell title="Domains" description="Manage domain registrations">
      <div className="space-y-4">
        <div className="flex justify-end">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Register Domain
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Register New Domain</DialogTitle>
                <DialogDescription>
                  Enter the domain name to register.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Domain Name</Label>
                  <div className="flex gap-2">
                    <Input
                      id="name"
                      placeholder="example"
                      value={newDomain.name}
                      onChange={(e) => setNewDomain({ ...newDomain, name: e.target.value })}
                    />
                    <Select
                      value={newDomain.tld}
                      onValueChange={(value) => setNewDomain({ ...newDomain, tld: value })}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="com">.com</SelectItem>
                        <SelectItem value="net">.net</SelectItem>
                        <SelectItem value="org">.org</SelectItem>
                        <SelectItem value="io">.io</SelectItem>
                        <SelectItem value="dev">.dev</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateDomain} disabled={creating || !newDomain.name}>
                  {creating ? "Registering..." : "Register"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Domain</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Registered</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Auto-Renew</TableHead>
                <TableHead className="w-[50px]"></TableHead>
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
              ) : domains.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No domains registered yet
                  </TableCell>
                </TableRow>
              ) : (
                domains.map((domain) => (
                  <TableRow key={domain.id}>
                    <TableCell className="font-medium">{domain.name}</TableCell>
                    <TableCell>
                      <Badge variant={STATE_BADGE_VARIANT[domain.state]}>
                        {domain.state}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(domain.registered_at)}</TableCell>
                    <TableCell>{formatDate(domain.expires_at)}</TableCell>
                    <TableCell>
                      <Badge variant={domain.auto_renew ? "success" : "secondary"}>
                        {domain.auto_renew ? "Yes" : "No"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {domain.state === DomainState.Registered && (
                            <DropdownMenuItem onClick={() => handleTransition(domain.id, DomainState.Active)}>
                              Activate
                            </DropdownMenuItem>
                          )}
                          {domain.state === DomainState.Active && (
                            <>
                              <DropdownMenuItem onClick={() => handleTransition(domain.id, DomainState.Expiring)}>
                                Mark Expiring
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => handleTransition(domain.id, DomainState.Suspended)}
                              >
                                Suspend
                              </DropdownMenuItem>
                            </>
                          )}
                          {domain.state === DomainState.Expiring && (
                            <DropdownMenuItem onClick={() => handleTransition(domain.id, DomainState.Active)}>
                              Renew
                            </DropdownMenuItem>
                          )}
                          {domain.state === DomainState.Suspended && (
                            <DropdownMenuItem onClick={() => handleTransition(domain.id, DomainState.Active)}>
                              Unsuspend
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
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
