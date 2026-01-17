"use client"

import { useState } from "react"
import { Settings, Database, Cloud, Shield, Bell } from "lucide-react"
import { DashboardShell } from "@/components/DashboardShell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

export function SettingsPage() {
  const [saving, setSaving] = useState(false)

  return (
    <DashboardShell title="Settings" description="Platform configuration">
      <div className="space-y-6">
        {/* Platform Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5" />
              Platform Status
            </CardTitle>
            <CardDescription>Cloudflare service status and bindings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Database className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">D1 Database</p>
                    <p className="text-sm text-muted-foreground">domain-registrar-db</p>
                  </div>
                </div>
                <Badge variant="success">Connected</Badge>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Cloud className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">KV Namespace</p>
                    <p className="text-sm text-muted-foreground">DOMAIN_CACHE</p>
                  </div>
                </div>
                <Badge variant="success">Connected</Badge>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Durable Objects</p>
                    <p className="text-sm text-muted-foreground">DomainStateMachine</p>
                  </div>
                </div>
                <Badge variant="success">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Analytics Engine</p>
                    <p className="text-sm text-muted-foreground">domain_metrics</p>
                  </div>
                </div>
                <Badge variant="success">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Domain Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Domain Settings</CardTitle>
            <CardDescription>Configure domain registration defaults</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="defaultTtl">Default Registration Period (years)</Label>
                <Input id="defaultTtl" type="number" defaultValue="1" min="1" max="10" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="gracePeriod">Grace Period (days)</Label>
                <Input id="gracePeriod" type="number" defaultValue="30" min="1" max="90" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="redemptionPeriod">Redemption Period (days)</Label>
                <Input id="redemptionPeriod" type="number" defaultValue="30" min="1" max="90" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="abuseThreshold">Abuse Score Threshold</Label>
                <Input id="abuseThreshold" type="number" defaultValue="10" min="1" max="100" />
              </div>
            </div>
            <Separator />
            <div className="flex justify-end">
              <Button disabled={saving}>
                {saving ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Supported TLDs */}
        <Card>
          <CardHeader>
            <CardTitle>Supported TLDs</CardTitle>
            <CardDescription>Top-level domains available for registration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {[".com", ".net", ".org", ".io", ".dev", ".app", ".co", ".xyz"].map((tld) => (
                <Badge key={tld} variant="secondary" className="text-sm">
                  {tld}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* API Information */}
        <Card>
          <CardHeader>
            <CardTitle>API Information</CardTitle>
            <CardDescription>API endpoints and documentation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <code className="text-sm">GET /api/domains</code>
                <span className="text-sm text-muted-foreground">List all domains</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <code className="text-sm">POST /api/domains</code>
                <span className="text-sm text-muted-foreground">Register domain</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <code className="text-sm">POST /api/domains/:id/transition</code>
                <span className="text-sm text-muted-foreground">Transition state</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <code className="text-sm">GET /api/metrics</code>
                <span className="text-sm text-muted-foreground">Platform metrics</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <code className="text-sm">GET /api/registrants</code>
                <span className="text-sm text-muted-foreground">List registrants</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <code className="text-sm">GET /api/abuse</code>
                <span className="text-sm text-muted-foreground">Abuse reports</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
