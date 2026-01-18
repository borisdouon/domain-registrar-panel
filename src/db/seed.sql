-- Domain Registrar Seed Data
-- Populates D1 with realistic sample data for production demo

-- Clear existing data (optional - comment out if appending)
-- DELETE FROM abuse_reports;
-- DELETE FROM domain_transitions;
-- DELETE FROM dns_records;
-- DELETE FROM domains;
-- DELETE FROM registrants;

-- =====================================================
-- REGISTRANTS
-- =====================================================
INSERT OR IGNORE INTO registrants (id, email, name, organization, address, city, country, phone, created_at, updated_at, verified, abuse_flags) VALUES
('reg-001', 'alice@techcorp.com', 'Alice Johnson', 'TechCorp Inc.', '123 Innovation Drive', 'San Francisco', 'US', '+1 (415) 555-0101', datetime('now', '-120 days'), datetime('now', '-30 days'), 1, 0),
('reg-002', 'bob@startuplab.io', 'Bob Chen', 'StartupLab', '456 Venture Blvd', 'Austin', 'US', '+1 (512) 555-0202', datetime('now', '-90 days'), datetime('now', '-15 days'), 1, 0),
('reg-003', 'maria@globalnet.eu', 'Maria Garcia', 'GlobalNet Europe', '789 Tech Square', 'Berlin', 'DE', '+49 30 12345678', datetime('now', '-80 days'), datetime('now', '-10 days'), 1, 0),
('reg-004', 'yuki@tokyodigital.jp', 'Yuki Tanaka', 'Tokyo Digital Solutions', '101 Shibuya District', 'Tokyo', 'JP', '+81 3-1234-5678', datetime('now', '-75 days'), datetime('now', '-5 days'), 1, 0),
('reg-005', 'james@cloudhosting.co', 'James Wilson', 'CloudHosting Pro', '202 Server Lane', 'London', 'GB', '+44 20 7946 0958', datetime('now', '-60 days'), datetime('now', '-2 days'), 0, 0),
('reg-006', 'priya@devstudio.in', 'Priya Sharma', 'DevStudio India', '303 Tech Park', 'Bangalore', 'IN', '+91 80 4567 8901', datetime('now', '-45 days'), datetime('now', '-1 days'), 1, 0),
('reg-007', 'alex@nordicsaas.se', 'Alex Lindberg', 'Nordic SaaS AB', '404 Innovation Hub', 'Stockholm', 'SE', '+46 8 123 456 78', datetime('now', '-30 days'), datetime('now'), 0, 0),
('reg-008', 'douon2010@gmail.com', 'Boris Douon', 'Douon Digital', '123 Edge Computing Blvd', 'Abidjan', 'CI', '+225 07 88 23 36 47', datetime('now', '-180 days'), datetime('now'), 1, 0);

-- =====================================================
-- DOMAINS
-- =====================================================
INSERT OR IGNORE INTO domains (id, name, tld, state, registrant_id, created_at, updated_at, expires_at, registered_at, locked, auto_renew, dnssec_enabled, abuse_score, suspension_reason) VALUES
-- Active domains
('dom-001', 'techcorp.com', 'com', 'active', 'reg-001', datetime('now', '-120 days'), datetime('now', '-1 days'), datetime('now', '+245 days'), datetime('now', '-120 days'), 0, 1, 1, 0, NULL),
('dom-002', 'innovate.io', 'io', 'active', 'reg-001', datetime('now', '-100 days'), datetime('now', '-2 days'), datetime('now', '+265 days'), datetime('now', '-100 days'), 0, 1, 0, 0, NULL),
('dom-003', 'startuplab.dev', 'dev', 'active', 'reg-002', datetime('now', '-90 days'), datetime('now', '-3 days'), datetime('now', '+275 days'), datetime('now', '-90 days'), 1, 1, 1, 0, NULL),
('dom-004', 'globalnet.eu', 'eu', 'active', 'reg-003', datetime('now', '-80 days'), datetime('now', '-1 days'), datetime('now', '+285 days'), datetime('now', '-80 days'), 0, 1, 0, 0, NULL),
('dom-005', 'tokyodigital.app', 'app', 'active', 'reg-004', datetime('now', '-75 days'), datetime('now', '-4 days'), datetime('now', '+290 days'), datetime('now', '-75 days'), 0, 1, 1, 0, NULL),
('dom-006', 'cloudhosting.co', 'co', 'active', 'reg-005', datetime('now', '-60 days'), datetime('now', '-5 days'), datetime('now', '+305 days'), datetime('now', '-60 days'), 0, 0, 0, 0, NULL),
('dom-007', 'devstudio.net', 'net', 'active', 'reg-006', datetime('now', '-45 days'), datetime('now', '-2 days'), datetime('now', '+320 days'), datetime('now', '-45 days'), 0, 1, 1, 0, NULL),
('dom-008', 'nordic-saas.org', 'org', 'active', 'reg-007', datetime('now', '-30 days'), datetime('now', '-1 days'), datetime('now', '+335 days'), datetime('now', '-30 days'), 0, 1, 0, 0, NULL),
-- Expiring domains
('dom-009', 'legacy-system.com', 'com', 'expiring', 'reg-001', datetime('now', '-350 days'), datetime('now', '-1 days'), datetime('now', '+15 days'), datetime('now', '-350 days'), 0, 0, 0, 0, NULL),
('dom-010', 'old-project.io', 'io', 'expiring', 'reg-002', datetime('now', '-340 days'), datetime('now', '-2 days'), datetime('now', '+25 days'), datetime('now', '-340 days'), 0, 0, 0, 0, NULL),
-- Suspended domains
('dom-011', 'suspicious-site.xyz', 'xyz', 'suspended', 'reg-005', datetime('now', '-200 days'), datetime('now', '-10 days'), datetime('now', '+165 days'), datetime('now', '-200 days'), 1, 0, 0, 8, 'Phishing activity detected'),
('dom-012', 'malware-host.com', 'com', 'suspended', NULL, datetime('now', '-150 days'), datetime('now', '-5 days'), datetime('now', '+215 days'), datetime('now', '-150 days'), 1, 0, 0, 12, 'Malware distribution reported'),
-- Registered (pending activation)
('dom-013', 'new-venture.dev', 'dev', 'registered', 'reg-006', datetime('now', '-5 days'), datetime('now', '-1 days'), datetime('now', '+360 days'), datetime('now', '-5 days'), 0, 1, 0, 0, NULL),
('dom-014', 'fresh-start.app', 'app', 'registered', 'reg-007', datetime('now', '-2 days'), datetime('now'), datetime('now', '+363 days'), datetime('now', '-2 days'), 0, 1, 0, 0, NULL),
-- Boris Douon's demo domains
('dom-015', 'edgegrid-control.dev', 'dev', 'active', 'reg-008', datetime('now', '-180 days'), datetime('now'), datetime('now', '+185 days'), datetime('now', '-180 days'), 0, 1, 1, 0, NULL),
('dom-016', 'ai-loop-console.io', 'io', 'active', 'reg-008', datetime('now', '-150 days'), datetime('now'), datetime('now', '+215 days'), datetime('now', '-150 days'), 0, 1, 1, 0, NULL),
('dom-017', 'douon-portfolio.com', 'com', 'active', 'reg-008', datetime('now', '-365 days'), datetime('now'), datetime('now', '+1 days'), datetime('now', '-365 days'), 0, 1, 1, 0, NULL);

-- =====================================================
-- DOMAIN TRANSITIONS (Audit Log)
-- =====================================================
INSERT OR IGNORE INTO domain_transitions (id, domain_id, from_state, to_state, triggered_by, reason, created_at) VALUES
('trans-001', 'dom-001', 'registered', 'active', 'admin', 'Domain activated after verification', datetime('now', '-119 days')),
('trans-002', 'dom-002', 'registered', 'active', 'system', 'Auto-activation after DNS propagation', datetime('now', '-99 days')),
('trans-003', 'dom-003', 'registered', 'active', 'admin', 'Manual activation', datetime('now', '-89 days')),
('trans-004', 'dom-011', 'active', 'suspended', 'trust_safety', 'Phishing content detected by automated scan', datetime('now', '-10 days')),
('trans-005', 'dom-012', 'active', 'suspended', 'abuse_team', 'Multiple malware reports received', datetime('now', '-5 days')),
('trans-006', 'dom-009', 'active', 'expiring', 'system', 'Domain approaching expiration date', datetime('now', '-15 days')),
('trans-007', 'dom-010', 'active', 'expiring', 'system', 'Domain approaching expiration date', datetime('now', '-10 days')),
('trans-008', 'dom-015', 'registered', 'active', 'admin', 'EdgeGrid Control activated', datetime('now', '-179 days')),
('trans-009', 'dom-016', 'registered', 'active', 'admin', 'AI Loop Console activated', datetime('now', '-149 days'));

-- =====================================================
-- ABUSE REPORTS
-- =====================================================
INSERT OR IGNORE INTO abuse_reports (id, domain_id, reporter_email, category, description, status, created_at, resolved_at, resolution_notes) VALUES
('abuse-001', 'dom-011', 'security@safebrowsing.org', 'phishing', 'Domain hosting credential harvesting page mimicking popular bank login', 'resolved', datetime('now', '-12 days'), datetime('now', '-10 days'), 'Domain suspended and registrant notified'),
('abuse-002', 'dom-011', 'user@victim.com', 'phishing', 'Received phishing email linking to this domain', 'resolved', datetime('now', '-11 days'), datetime('now', '-10 days'), 'Consolidated with primary report'),
('abuse-003', 'dom-012', 'malware-intel@antivirus.com', 'malware', 'Domain serving malicious JavaScript payload', 'investigating', datetime('now', '-6 days'), NULL, NULL),
('abuse-004', 'dom-012', 'soc-team@enterprise.com', 'malware', 'Detected C2 communication to this domain from compromised endpoints', 'pending', datetime('now', '-4 days'), NULL, NULL),
('abuse-005', 'dom-006', 'copyright@media.com', 'copyright', 'Hosting copyrighted video content without authorization', 'pending', datetime('now', '-2 days'), NULL, NULL),
('abuse-006', 'dom-010', 'spam-report@postmaster.org', 'spam', 'Domain used in bulk unsolicited email campaign', 'dismissed', datetime('now', '-20 days'), datetime('now', '-18 days'), 'Unable to verify claim - insufficient evidence');

-- =====================================================
-- DNS RECORDS (Sample)
-- =====================================================
INSERT OR IGNORE INTO dns_records (id, domain_id, type, name, content, ttl, priority, proxied, created_at, updated_at) VALUES
('dns-001', 'dom-001', 'A', '@', '104.21.45.123', 3600, NULL, 1, datetime('now', '-120 days'), datetime('now', '-30 days')),
('dns-002', 'dom-001', 'AAAA', '@', '2606:4700:3033::6815:2d7b', 3600, NULL, 1, datetime('now', '-120 days'), datetime('now', '-30 days')),
('dns-003', 'dom-001', 'MX', '@', 'mx1.techcorp.com', 3600, 10, 0, datetime('now', '-120 days'), datetime('now', '-30 days')),
('dns-004', 'dom-001', 'TXT', '@', 'v=spf1 include:_spf.google.com ~all', 3600, NULL, 0, datetime('now', '-100 days'), datetime('now', '-30 days')),
('dns-005', 'dom-003', 'A', '@', '76.76.21.21', 3600, NULL, 1, datetime('now', '-90 days'), datetime('now', '-10 days')),
('dns-006', 'dom-003', 'CNAME', 'www', 'startuplab.dev', 3600, NULL, 1, datetime('now', '-90 days'), datetime('now', '-10 days')),
('dns-007', 'dom-015', 'A', '@', '104.21.78.90', 300, NULL, 1, datetime('now', '-180 days'), datetime('now')),
('dns-008', 'dom-015', 'CNAME', 'api', 'edgegrid-control.workers.dev', 300, NULL, 0, datetime('now', '-180 days'), datetime('now')),
('dns-009', 'dom-016', 'A', '@', '104.21.88.100', 300, NULL, 1, datetime('now', '-150 days'), datetime('now'));

