import type { APIRoute } from "astro"

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    const env = locals.runtime.env
    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get("limit") || "50")
    
    // Get recent transitions as activity
    const transitions = await env.DB.prepare(
      `SELECT t.*, d.name as domain_name 
       FROM domain_transitions t 
       LEFT JOIN domains d ON t.domain_id = d.id 
       ORDER BY t.created_at DESC 
       LIMIT ?`
    ).bind(limit).all()
    
    // Get recent abuse reports
    const abuseReports = await env.DB.prepare(
      `SELECT a.*, d.name as domain_name 
       FROM abuse_reports a 
       LEFT JOIN domains d ON a.domain_id = d.id 
       ORDER BY a.created_at DESC 
       LIMIT ?`
    ).bind(limit).all()
    
    // Get recent domain registrations
    const registrations = await env.DB.prepare(
      `SELECT id, name, state, created_at, 'registration' as activity_type 
       FROM domains 
       ORDER BY created_at DESC 
       LIMIT ?`
    ).bind(limit).all()
    
    // Combine and sort all activities
    const activities = [
      ...transitions.results.map((t: Record<string, unknown>) => ({
        id: t.id,
        type: "transition",
        description: `Domain ${t.domain_name} transitioned from ${t.from_state} to ${t.to_state}`,
        triggered_by: t.triggered_by,
        created_at: t.created_at,
        metadata: { from_state: t.from_state, to_state: t.to_state, reason: t.reason }
      })),
      ...abuseReports.results.map((a: Record<string, unknown>) => ({
        id: a.id,
        type: "abuse_report",
        description: `Abuse report filed for ${a.domain_name}: ${a.category}`,
        triggered_by: a.reporter_email || "anonymous",
        created_at: a.created_at,
        metadata: { category: a.category, status: a.status }
      })),
      ...registrations.results.map((r: Record<string, unknown>) => ({
        id: r.id,
        type: "registration",
        description: `Domain ${r.name} was registered`,
        triggered_by: "system",
        created_at: r.created_at,
        metadata: { state: r.state }
      }))
    ].sort((a, b) => new Date(b.created_at as string).getTime() - new Date(a.created_at as string).getTime())
     .slice(0, limit)
    
    return new Response(JSON.stringify({ activities }), {
      headers: { "Content-Type": "application/json" }
    })
  } catch (error) {
    console.error("Error fetching activity:", error)
    return new Response(JSON.stringify({ error: "Failed to fetch activity" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
}
