"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  MoreHorizontal,
  CheckCircle2,
  AlertCircle,
  Building2,
  Globe2,
  Mail,
  User,
  ShieldCheck,
  Search,
} from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Registrant } from "@/types/domain";
import { cn } from "@/lib/utils";

// Helper to get country flag emoji
const getCountryFlag = (countryCode: string) => {
  if (!countryCode) return "🌐";
  // Simple mapping for demo purposes - in production use a library
  const code = countryCode.toUpperCase();
  const offset = 127397;
  try {
    return code.replace(/./g, (char) =>
      String.fromCodePoint(char.charCodeAt(0) + offset),
    );
  } catch (e) {
    return "🌐";
  }
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function UserAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Generate a consistent color based on the name length
  const colors = [
    "from-blue-500 to-indigo-500",
    "from-emerald-500 to-teal-500",
    "from-orange-500 to-amber-500",
    "from-pink-500 to-rose-500",
    "from-purple-500 to-violet-500",
  ];
  const colorIndex = name.length % colors.length;
  const gradient = colors[colorIndex];

  return (
    <div
      className={cn(
        "h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm bg-gradient-to-br",
        gradient,
      )}
    >
      {initials}
    </div>
  );
}

export function RegistrantsTable() {
  const { toast } = useToast();
  const [registrants, setRegistrants] = useState<Registrant[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newRegistrant, setNewRegistrant] = useState({
    name: "",
    email: "",
    organization: "",
    country: "",
    phone: "",
  });

  async function fetchRegistrants() {
    try {
      const response = await fetch("/api/registrants");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = (await response.json()) as { registrants: Registrant[] };
      setRegistrants(data.registrants || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRegistrants();
  }, []);

  async function handleCreate() {
    if (!newRegistrant.name || !newRegistrant.email || !newRegistrant.country)
      return;

    setCreating(true);
    try {
      const response = await fetch("/api/registrants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRegistrant),
      });

      if (!response.ok) throw new Error("Failed to create");

      const data = (await response.json()) as {
        registrant: any;
        verificationEmailSent: boolean;
        message: string;
      };

      // Close dialog first
      setDialogOpen(false);
      setNewRegistrant({
        name: "",
        email: "",
        organization: "",
        country: "",
        phone: "",
      });

      // Show toast notification
      if (data.verificationEmailSent) {
        toast({
          variant: "success",
          title: "✅ Registrant Created",
          description: `📧 Verification email sent to ${newRegistrant.email}. Please check your inbox.`,
        });
      } else {
        toast({
          variant: "default",
          title: "✅ Registrant Created",
          description:
            "⚠️ Verification email could not be sent. Please try resending later.",
        });
      }

      // Refresh list
      fetchRegistrants();
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "❌ Error",
        description: "Failed to create registrant. Please try again.",
      });
    } finally {
      setCreating(false);
    }
  }

  return (
    <DashboardShell
      title="Registrants"
      description="Manage domain registrant accounts"
      currentPath="/registrants"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search registrants..."
              className="pl-9 bg-white/50 border-zinc-200 focus:bg-white transition-colors"
            />
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white shadow-sm shadow-orange-200">
                <Plus className="mr-2 h-4 w-4" />
                Add Registrant
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Registrant</DialogTitle>
                <DialogDescription>
                  Create a new registrant profile to associate with domains.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={newRegistrant.name}
                    onChange={(e) =>
                      setNewRegistrant({
                        ...newRegistrant,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={newRegistrant.email}
                    onChange={(e) =>
                      setNewRegistrant({
                        ...newRegistrant,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="organization">Organization</Label>
                    <Input
                      id="organization"
                      placeholder="Acme Inc."
                      value={newRegistrant.organization}
                      onChange={(e) =>
                        setNewRegistrant({
                          ...newRegistrant,
                          organization: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="country">Country Code *</Label>
                    <Input
                      id="country"
                      placeholder="US"
                      maxLength={2}
                      className="uppercase"
                      value={newRegistrant.country}
                      onChange={(e) =>
                        setNewRegistrant({
                          ...newRegistrant,
                          country: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="+1 (555) 000-0000"
                    value={newRegistrant.phone}
                    onChange={(e) =>
                      setNewRegistrant({
                        ...newRegistrant,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleCreate}
                  disabled={
                    creating ||
                    !newRegistrant.name ||
                    !newRegistrant.email ||
                    !newRegistrant.country
                  }
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  {creating ? "Creating..." : "Create Profile"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Main Table Card */}
        <div className="rounded-xl border border-zinc-200 bg-white/50 backdrop-blur-xl shadow-sm overflow-hidden flex flex-col h-[calc(100vh-220px)] min-h-[500px]">
          <div className="flex-1 overflow-auto relative scrollbar-thin scrollbar-thumb-zinc-200 scrollbar-track-transparent">
            <Table>
              <TableHeader className="sticky top-0 bg-white/95 backdrop-blur-md z-10 shadow-sm border-b border-zinc-100">
                <TableRow className="bg-zinc-50/50 hover:bg-zinc-50/80 border-0">
                  <TableHead className="w-[300px] py-4 text-xs font-bold uppercase tracking-wider text-zinc-500 pl-6">
                    Name & Email
                  </TableHead>
                  <TableHead className="py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Organization
                  </TableHead>
                  <TableHead className="py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Location
                  </TableHead>
                  <TableHead className="py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Verification
                  </TableHead>
                  <TableHead className="py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Created
                  </TableHead>
                  <TableHead className="w-[50px] py-4"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center">
                      <div className="flex items-center justify-center text-muted-foreground">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary mr-2"></div>
                        Loading registrants...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : registrants.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
                        <div className="h-12 w-12 rounded-full bg-zinc-100 flex items-center justify-center">
                          <User className="h-6 w-6 text-zinc-400" />
                        </div>
                        <p className="font-medium text-zinc-900">
                          No registrants found
                        </p>
                        <p className="text-sm max-w-sm mx-auto">
                          Create your first registrant profile to start managing
                          domains.
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => setDialogOpen(true)}
                          className="mt-2"
                        >
                          Add Registrant
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  registrants.map((registrant) => (
                    <TableRow
                      key={registrant.id}
                      className="group hover:bg-zinc-50/80 transition-all duration-200 border-zinc-100"
                    >
                      <TableCell className="font-medium pl-6 py-4">
                        <div className="flex items-center gap-4">
                          <UserAvatar name={registrant.name} />
                          <div className="flex flex-col">
                            <span className="text-zinc-900 font-semibold text-sm tracking-tight">
                              {registrant.name}
                            </span>
                            <div className="flex items-center gap-1.5 text-zinc-500 text-xs mt-0.5">
                              <Mail className="h-3 w-3" />
                              <span>{registrant.email}</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2 text-zinc-700 text-sm">
                          <Building2 className="h-4 w-4 text-zinc-400" />
                          <span className="font-medium">
                            {registrant.organization || "Private Individual"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2 text-zinc-700 text-sm bg-zinc-50 w-fit px-2 py-1 rounded-md border border-zinc-100">
                          <span className="text-lg leading-none">
                            {getCountryFlag(registrant.country)}
                          </span>
                          <span className="font-medium font-mono text-xs">
                            {registrant.country}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        {registrant.verified ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100 ring-1 ring-blue-500/10">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            Verified Identity
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-100 ring-1 ring-amber-500/10">
                            <AlertCircle className="h-3.5 w-3.5" />
                            Pending Verification
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="py-4 text-zinc-500 text-sm font-medium">
                        {formatDate(registrant.created_at)}
                      </TableCell>
                      <TableCell className="py-4 pr-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-zinc-400 hover:text-zinc-900 hover:bg-white hover:shadow-sm"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                            <DropdownMenuItem>Edit Details</DropdownMenuItem>
                            <DropdownMenuItem>View Domains</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              Delete Profile
                            </DropdownMenuItem>
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
      </div>
    </DashboardShell>
  );
}
