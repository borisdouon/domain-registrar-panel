"use client";

import { useState } from "react";
import {
  Settings,
  Database,
  Cloud,
  Shield,
  Bell,
  User,
  Linkedin,
  Github,
  MessageSquare,
  Mail,
  ExternalLink,
  Laptop,
  Brain,
  Zap,
  Layout,
  BarChart,
  Globe,
} from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export function SettingsPage() {
  const [saving, setSaving] = useState(false);

  return (
    <DashboardShell
      title="Settings"
      description="Platform configuration and profile"
      currentPath="/settings"
    >
      <div className="space-y-6">
        {/* User Profile Card */}
        <Card className="border-zinc-200/50 bg-white overflow-hidden">
          <CardHeader className="bg-zinc-50/50 border-b border-zinc-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-black flex items-center justify-center border-4 border-white shadow-xl">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">Boris Douon</CardTitle>
                  <CardDescription className="text-zinc-600 font-medium font-mono text-xs uppercase tracking-wider mt-0.5">
                    Full Stack AI-Software Engineer
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" asChild className="h-8">
                  <a
                    href="https://wa.me/2250788233647"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageSquare className="mr-2 h-3.5 w-3.5 text-emerald-500" />
                    WhatsApp
                  </a>
                </Button>
                <Button size="sm" variant="outline" asChild className="h-8">
                  <a href="mailto:douon2010@gmail.com">
                    <Mail className="mr-2 h-3.5 w-3.5 text-red-500" />
                    Email
                  </a>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-3 flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Expertise & Vision
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {
                        icon: Brain,
                        label: "AI & ML Systems",
                        value: "LLMs, RAG, Agents",
                      },
                      {
                        icon: Laptop,
                        label: "Full Stack",
                        value: "React, Astro, Next.js",
                      },
                      {
                        icon: Zap,
                        label: "Edge Computing",
                        value: "Cloudflare Workers",
                      },
                      {
                        icon: Layout,
                        label: "Product Design",
                        value: "UI/UX Architecture",
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="p-3 rounded-xl border border-zinc-100 bg-zinc-50/30"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <item.icon className="h-3.5 w-3.5 text-zinc-500" />
                          <span className="text-[11px] font-bold text-zinc-400 uppercase">
                            {item.label}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-zinc-700">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-3">
                    Professional Services
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "SaaS Development",
                      "AI Integration",
                      "Edge Applications",
                      "Performance Optimization",
                      "Data Engineering",
                    ].map((service) => (
                      <Badge
                        key={service}
                        variant="secondary"
                        className="px-3 py-1 bg-white border border-zinc-200 text-zinc-600 font-medium"
                      >
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-zinc-900 text-white shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                    <Zap className="h-16 w-16" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Let's Collaborate!</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                    Open to innovative SaaS projects and technical partnerships.
                    Let's build the future of edge-native systems together.
                  </p>
                  <div className="space-y-2">
                    <a
                      href="https://www.linkedin.com/in/boris-douon/"
                      target="_blank"
                      className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Linkedin className="h-4 w-4 text-blue-400" />
                        <span className="text-sm font-medium">LinkedIn</span>
                      </div>
                      <ExternalLink className="h-3 w-3 opacity-50" />
                    </a>
                    <a
                      href="https://github.com/borisdouon"
                      target="_blank"
                      className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Github className="h-4 w-4 text-zinc-400" />
                        <span className="text-sm font-medium">GitHub</span>
                      </div>
                      <ExternalLink className="h-3 w-3 opacity-50" />
                    </a>
                    <a
                      href="https://boris-douon-portfolio.netlify.app/"
                      target="_blank"
                      className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-orange-400" />
                        <span className="text-sm font-medium">Portfolio</span>
                      </div>
                      <ExternalLink className="h-3 w-3 opacity-50" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Platform Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5" />
              Platform Status
            </CardTitle>
            <CardDescription>
              Cloudflare service status and bindings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Database className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">D1 Database</p>
                    <p className="text-sm text-muted-foreground">
                      domain-registrar-db
                    </p>
                  </div>
                </div>
                <Badge variant="success">Connected</Badge>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Cloud className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">KV Namespace</p>
                    <p className="text-sm text-muted-foreground">
                      DOMAIN_CACHE
                    </p>
                  </div>
                </div>
                <Badge variant="success">Connected</Badge>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Durable Objects</p>
                    <p className="text-sm text-muted-foreground">
                      DomainStateMachine
                    </p>
                  </div>
                </div>
                <Badge variant="success">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Analytics Engine</p>
                    <p className="text-sm text-muted-foreground">
                      domain_metrics
                    </p>
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
            <CardDescription>
              Configure domain registration defaults
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="defaultTtl">
                  Default Registration Period (years)
                </Label>
                <Input
                  id="defaultTtl"
                  type="number"
                  defaultValue="1"
                  min="1"
                  max="10"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="gracePeriod">Grace Period (days)</Label>
                <Input
                  id="gracePeriod"
                  type="number"
                  defaultValue="30"
                  min="1"
                  max="90"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="redemptionPeriod">
                  Redemption Period (days)
                </Label>
                <Input
                  id="redemptionPeriod"
                  type="number"
                  defaultValue="30"
                  min="1"
                  max="90"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="abuseThreshold">Abuse Score Threshold</Label>
                <Input
                  id="abuseThreshold"
                  type="number"
                  defaultValue="10"
                  min="1"
                  max="100"
                />
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
            <CardDescription>
              Top-level domains available for registration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {[
                ".com",
                ".net",
                ".org",
                ".io",
                ".dev",
                ".app",
                ".co",
                ".xyz",
              ].map((tld) => (
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
                <span className="text-sm text-muted-foreground">
                  List all domains
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <code className="text-sm">POST /api/domains</code>
                <span className="text-sm text-muted-foreground">
                  Register domain
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <code className="text-sm">
                  POST /api/domains/:id/transition
                </code>
                <span className="text-sm text-muted-foreground">
                  Transition state
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <code className="text-sm">GET /api/metrics</code>
                <span className="text-sm text-muted-foreground">
                  Platform metrics
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <code className="text-sm">GET /api/registrants</code>
                <span className="text-sm text-muted-foreground">
                  List registrants
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <code className="text-sm">GET /api/abuse</code>
                <span className="text-sm text-muted-foreground">
                  Abuse reports
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
