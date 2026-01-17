import type { APIRoute } from "astro"
import { getRecentTransitions } from "@/lib/db"

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    const env = locals.runtime.env
    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get("limit") || "100")
    
    const transitions = await getRecentTransitions(env.DB, limit)
    
    // Join with domain names for display
    const transitionsWithDomains = await Promise.all(
      transitions.map(async (t) => {
        const domain = await env.DB.prepare(
          `SELECT name FROM domains WHERE id = ?`
        ).bind(t.domain_id).first<{ name: string }>()
        return { ...t, domain_name: domain?.name || "Unknown" }
      })
    )
    
    return new Response(JSON.stringify({ transitions: transitionsWithDomains }), {
      headers: { "Content-Type": "application/json" }
    })
  } catch (error) {
    console.error("Error fetching transitions:", error)
    return new Response(JSON.stringify({ error: "Failed to fetch transitions" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
}
