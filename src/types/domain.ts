export enum DomainState {
  Available = "available",
  Registered = "registered",
  Active = "active",
  Expiring = "expiring",
  GracePeriod = "grace_period",
  Redemption = "redemption",
  Suspended = "suspended",
  Deleted = "deleted",
}

export interface Domain {
  id: string;
  name: string;
  tld: string;
  state: DomainState;
  registrant_id: string | null;
  created_at: string;
  updated_at: string;
  expires_at: string | null;
  registered_at: string | null;
  grace_period_ends_at: string | null;
  redemption_ends_at: string | null;
  locked: boolean;
  auto_renew: boolean;
  dnssec_enabled: boolean;
  abuse_score: number;
  suspension_reason: string | null;
  metadata: string | null;
}

export interface DomainTransition {
  id: string;
  domain_id: string;
  from_state: DomainState;
  to_state: DomainState;
  triggered_by: string;
  reason: string | null;
  created_at: string;
  metadata: string | null;
}

export interface Registrant {
  id: string;
  email: string;
  name: string;
  organization: string | null;
  address: string | null;
  city: string | null;
  country: string;
  phone: string | null;
  created_at: string;
  updated_at: string;
  verified: boolean;
  abuse_flags: number;
}

export interface DnsRecord {
  id: string;
  domain_id: string;
  type: string;
  name: string;
  content: string;
  ttl: number;
  priority: number | null;
  proxied: boolean;
  created_at: string;
  updated_at: string;
}

export interface AbuseReport {
  id: string;
  domain_id: string;
  reporter_email: string | null;
  category: string;
  description: string | null;
  status: string;
  created_at: string;
  resolved_at: string | null;
  resolution_notes: string | null;
}

export interface DomainMetrics {
  totalDomains: number;
  byState: Record<DomainState, number>;
  registrationsToday: number;
  expiringSoon: number;
  suspendedDomains: number;
  abuseReportsPending: number;
}

export interface TransitionRequest {
  domainId: string;
  toState: DomainState;
  triggeredBy: string;
  reason?: string;
}
