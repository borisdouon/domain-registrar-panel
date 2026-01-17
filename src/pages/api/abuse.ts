import type { APIRoute } from "astro"
import { getAbuseReports } from "@/lib/db"

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    const env = locals.runtime.env
    const url = new URL(request.url)
    const status = url.searchParams.get("status") || undefined
    
    const reports = await getAbuseReports(env.DB, status)
    
    // Join with domain names
    const reportsWithDomains = await Promise.all(
      reports.map(async (r) => {
        const domain = await env.DB.prepare(
          `SELECT name FROM domains WHERE id = ?`
        ).bind(r.domain_id).first<{ name: string }>()
        return { ...r, domain_name: domain?.name || "Unknown" }
      })
    )
    
    return new Response(JSON.stringify({ reports: reportsWithDomains }), {
      headers: { "Content-Type": "application/json" }
    })
  } catch (error) {
    console.error("Error fetching abuse reports:", error)
    return new Response(JSON.stringify({ error: "Failed to fetch abuse reports" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
}

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const env = locals.runtime.env
    const body = await request.json() as {
      domain_id: string
      reporter_email?: string
      category: string
      description?: string
    }
    
    const { domain_id, reporter_email, category, description } = body
    
    if (!domain_id || !category) {
      return new Response(JSON.stringify({ error: "domain_id and category are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      })
    }
    
    const id = crypto.randomUUID()
    const now = new Date().toISOString()
    
    await env.DB.prepare(
      `INSERT INTO abuse_reports (id, domain_id, reporter_email, category, description, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).bind(id, domain_id, reporter_email || null, category, description || null, "pending", now).run()
    
    // Increment abuse score on domain
    await env.DB.prepare(
      `UPDATE domains SET abuse_score = abuse_score + 1, updated_at = ? WHERE id = ?`
    ).bind(now, domain_id).run()
    
    return new Response(JSON.stringify({ 
      report: { id, domain_id, reporter_email, category, description, status: "pending", created_at: now }
    }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    })
  } catch (error) {
    console.error("Error creating abuse report:", error)
    return new Response(JSON.stringify({ error: "Failed to create abuse report" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
}

export const PATCH: APIRoute = async ({ request, locals }) => {
  try {
    const env = locals.runtime.env
    const body = await request.json() as {
      id: string
      status: string
      resolution_notes?: string
    }
    
    const { id, status, resolution_notes } = body
    
    if (!id || !status) {
      return new Response(JSON.stringify({ error: "id and status are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      })
    }
    
    const now = new Date().toISOString()
    const resolvedAt = status === "resolved" ? now : null
    
    await env.DB.prepare(
      `UPDATE abuse_reports SET status = ?, resolution_notes = ?, resolved_at = ? WHERE id = ?`
    ).bind(status, resolution_notes || null, resolvedAt, id).run()
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    })
  } catch (error) {
    console.error("Error updating abuse report:", error)
    return new Response(JSON.stringify({ error: "Failed to update abuse report" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
}
