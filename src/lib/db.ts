import type { Domain, DomainTransition, Registrant, DnsRecord, AbuseReport, DomainMetrics, DomainState } from "@/types/domain"

export async function getDomains(db: D1Database, limit = 100, offset = 0): Promise<Domain[]> {
  const result = await db.prepare(
    `SELECT * FROM domains ORDER BY updated_at DESC LIMIT ? OFFSET ?`
  ).bind(limit, offset).all<Domain>()
  return result.results
}

export async function getDomainById(db: D1Database, id: string): Promise<Domain | null> {
  const result = await db.prepare(
    `SELECT * FROM domains WHERE id = ?`
  ).bind(id).first<Domain>()
  return result
}

export async function getDomainByName(db: D1Database, name: string): Promise<Domain | null> {
  const result = await db.prepare(
    `SELECT * FROM domains WHERE name = ?`
  ).bind(name).first<Domain>()
  return result
}

export async function createDomain(db: D1Database, domain: Omit<Domain, "created_at" | "updated_at">): Promise<Domain> {
  const now = new Date().toISOString()
  await db.prepare(
    `INSERT INTO domains (id, name, tld, state, registrant_id, expires_at, registered_at, locked, auto_renew, dnssec_enabled, abuse_score, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    domain.id,
    domain.name,
    domain.tld,
    domain.state,
    domain.registrant_id,
    domain.expires_at,
    domain.registered_at,
    domain.locked ? 1 : 0,
    domain.auto_renew ? 1 : 0,
    domain.dnssec_enabled ? 1 : 0,
    domain.abuse_score,
    now,
    now
  ).run()
  
  return { ...domain, created_at: now, updated_at: now } as Domain
}

export async function updateDomainState(
  db: D1Database, 
  domainId: string, 
  newState: DomainState,
  additionalFields?: Partial<Domain>
): Promise<void> {
  const now = new Date().toISOString()
  let query = `UPDATE domains SET state = ?, updated_at = ?`
  const bindings: (string | number | null)[] = [newState, now]
  
  if (additionalFields?.expires_at !== undefined) {
    query += `, expires_at = ?`
    bindings.push(additionalFields.expires_at)
  }
  if (additionalFields?.suspension_reason !== undefined) {
    query += `, suspension_reason = ?`
    bindings.push(additionalFields.suspension_reason)
  }
  
  query += ` WHERE id = ?`
  bindings.push(domainId)
  
  await db.prepare(query).bind(...bindings).run()
}

export async function recordTransition(
  db: D1Database,
  transition: Omit<DomainTransition, "created_at">
): Promise<void> {
  await db.prepare(
    `INSERT INTO domain_transitions (id, domain_id, from_state, to_state, triggered_by, reason, metadata)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    transition.id,
    transition.domain_id,
    transition.from_state,
    transition.to_state,
    transition.triggered_by,
    transition.reason,
    transition.metadata
  ).run()
}

export async function getTransitionsByDomain(db: D1Database, domainId: string): Promise<DomainTransition[]> {
  const result = await db.prepare(
    `SELECT * FROM domain_transitions WHERE domain_id = ? ORDER BY created_at DESC`
  ).bind(domainId).all<DomainTransition>()
  return result.results
}

export async function getRecentTransitions(db: D1Database, limit = 50): Promise<DomainTransition[]> {
  const result = await db.prepare(
    `SELECT * FROM domain_transitions ORDER BY created_at DESC LIMIT ?`
  ).bind(limit).all<DomainTransition>()
  return result.results
}

export async function getDomainMetrics(db: D1Database): Promise<DomainMetrics> {
  const totalResult = await db.prepare(`SELECT COUNT(*) as count FROM domains`).first<{count: number}>()
  const total = totalResult?.count || 0

  const stateResults = await db.prepare(
    `SELECT state, COUNT(*) as count FROM domains GROUP BY state`
  ).all<{state: DomainState, count: number}>()
  
  const byState = {} as Record<DomainState, number>
  for (const row of stateResults.results) {
    byState[row.state] = row.count
  }

  const today = new Date().toISOString().split('T')[0]
  const registrationsTodayResult = await db.prepare(
    `SELECT COUNT(*) as count FROM domains WHERE DATE(registered_at) = ?`
  ).bind(today).first<{count: number}>()

  const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  const expiringSoonResult = await db.prepare(
    `SELECT COUNT(*) as count FROM domains WHERE expires_at <= ? AND state = 'active'`
  ).bind(thirtyDaysFromNow).first<{count: number}>()

  const suspendedResult = await db.prepare(
    `SELECT COUNT(*) as count FROM domains WHERE state = 'suspended'`
  ).first<{count: number}>()

  const abuseResult = await db.prepare(
    `SELECT COUNT(*) as count FROM abuse_reports WHERE status = 'pending'`
  ).first<{count: number}>()

  return {
    totalDomains: total,
    byState,
    registrationsToday: registrationsTodayResult?.count || 0,
    expiringSoon: expiringSoonResult?.count || 0,
    suspendedDomains: suspendedResult?.count || 0,
    abuseReportsPending: abuseResult?.count || 0,
  }
}

export async function getRegistrants(db: D1Database, limit = 100): Promise<Registrant[]> {
  const result = await db.prepare(
    `SELECT * FROM registrants ORDER BY created_at DESC LIMIT ?`
  ).bind(limit).all<Registrant>()
  return result.results
}

export async function getAbuseReports(db: D1Database, status?: string): Promise<AbuseReport[]> {
  let query = `SELECT * FROM abuse_reports`
  const bindings: string[] = []
  
  if (status) {
    query += ` WHERE status = ?`
    bindings.push(status)
  }
  
  query += ` ORDER BY created_at DESC`
  
  const result = await db.prepare(query).bind(...bindings).all<AbuseReport>()
  return result.results
}
