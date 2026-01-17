import type { APIRoute } from "astro"

export const GET: APIRoute = async ({ locals }) => {
  try {
    const env = locals.runtime.env
    
    const result = await env.DB.prepare(
      `SELECT d.*, r.name as registrant_name, r.email as registrant_email
       FROM domains d
       LEFT JOIN registrants r ON d.registrant_id = r.id
       WHERE d.state = 'suspended'
       ORDER BY d.updated_at DESC`
    ).all()
    
    return new Response(JSON.stringify({ domains: result.results }), {
      headers: { "Content-Type": "application/json" }
    })
  } catch (error) {
    console.error("Error fetching suspended domains:", error)
    return new Response(JSON.stringify({ error: "Failed to fetch suspended domains" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
}
