import type { APIRoute } from "astro"
import { getDomainMetrics, getRecentTransitions } from "@/lib/db"

export const GET: APIRoute = async ({ locals }) => {
  try {
    const env = locals.runtime.env
    
    const [metrics, recentTransitions] = await Promise.all([
      getDomainMetrics(env.DB),
      getRecentTransitions(env.DB, 20)
    ])
    
    return new Response(JSON.stringify({
      metrics,
      recentTransitions
    }), {
      headers: { "Content-Type": "application/json" }
    })
  } catch (error) {
    console.error("Error fetching metrics:", error)
    return new Response(JSON.stringify({ error: "Failed to fetch metrics" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
}

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const env = locals.runtime.env
    const body = await request.json() as {
      event: string
      domain?: string
      value?: number
      metadata?: Record<string, string>
    }
    
    const { event, domain, value = 1, metadata } = body
    
    console.log(`[METRICS] Received metric event: ${event}`, { domain, value, metadata })
    
    if (!event) {
      return new Response(JSON.stringify({ error: "Event type is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      })
    }
    
    // Write to Analytics Engine if available
    if (env.METRICS) {
      const blobs: string[] = [event]
      if (domain) blobs.push(domain)
      if (metadata) {
        Object.entries(metadata).forEach(([key, val]) => {
          blobs.push(`${key}:${val}`)
        })
      }
      
      console.log(`[METRICS] Writing to Analytics Engine:`, { blobs, doubles: [value], indexes: [event] })
      env.METRICS.writeDataPoint({
        blobs,
        doubles: [value],
        indexes: [event]
      })
      console.log(`[METRICS] Successfully wrote metric to Analytics Engine`)
    } else {
      console.warn(`[METRICS] Analytics Engine not available, skipping metric`)
    }
    
    return new Response(JSON.stringify({ 
      success: true,
      event,
      analyticsEngineEnabled: !!env.METRICS,
      timestamp: new Date().toISOString()
    }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    })
  } catch (error) {
    console.error("[METRICS] Error ingesting metric:", error)
    return new Response(JSON.stringify({ 
      error: "Failed to ingest metric",
      details: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
}
