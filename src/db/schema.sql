-- Domain Registrar D1 Schema
-- Domains table - core domain records
CREATE TABLE IF NOT EXISTS domains (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    tld TEXT NOT NULL,
    state TEXT NOT NULL DEFAULT 'available',
    registrant_id TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    expires_at TEXT,
    registered_at TEXT,
    grace_period_ends_at TEXT,
    redemption_ends_at TEXT,
    locked BOOLEAN DEFAULT FALSE,
    auto_renew BOOLEAN DEFAULT TRUE,
    dnssec_enabled BOOLEAN DEFAULT FALSE,
    abuse_score INTEGER DEFAULT 0,
    suspension_reason TEXT,
    metadata TEXT
);

-- Domain state transitions audit log
CREATE TABLE IF NOT EXISTS domain_transitions (
    id TEXT PRIMARY KEY,
    domain_id TEXT NOT NULL,
    from_state TEXT NOT NULL,
    to_state TEXT NOT NULL,
    triggered_by TEXT NOT NULL,
    reason TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    metadata TEXT,
    FOREIGN KEY (domain_id) REFERENCES domains(id)
);

-- Registrants table
CREATE TABLE IF NOT EXISTS registrants (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    organization TEXT,
    address TEXT,
    city TEXT,
    country TEXT NOT NULL,
    phone TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    verified BOOLEAN DEFAULT FALSE,
    abuse_flags INTEGER DEFAULT 0
);

-- DNS records
CREATE TABLE IF NOT EXISTS dns_records (
    id TEXT PRIMARY KEY,
    domain_id TEXT NOT NULL,
    type TEXT NOT NULL,
    name TEXT NOT NULL,
    content TEXT NOT NULL,
    ttl INTEGER DEFAULT 3600,
    priority INTEGER,
    proxied BOOLEAN DEFAULT FALSE,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (domain_id) REFERENCES domains(id)
);

-- Abuse reports
CREATE TABLE IF NOT EXISTS abuse_reports (
    id TEXT PRIMARY KEY,
    domain_id TEXT NOT NULL,
    reporter_email TEXT,
    category TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    resolved_at TEXT,
    resolution_notes TEXT,
    FOREIGN KEY (domain_id) REFERENCES domains(id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_domains_state ON domains(state);
CREATE INDEX IF NOT EXISTS idx_domains_expires_at ON domains(expires_at);
CREATE INDEX IF NOT EXISTS idx_domains_registrant ON domains(registrant_id);
CREATE INDEX IF NOT EXISTS idx_transitions_domain ON domain_transitions(domain_id);
CREATE INDEX IF NOT EXISTS idx_transitions_created ON domain_transitions(created_at);
CREATE INDEX IF NOT EXISTS idx_dns_domain ON dns_records(domain_id);
CREATE INDEX IF NOT EXISTS idx_abuse_domain ON abuse_reports(domain_id);
CREATE INDEX IF NOT EXISTS idx_abuse_status ON abuse_reports(status);
