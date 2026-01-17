import type { APIRoute } from "astro"
import { getDomains, createDomain, getDomainMetrics } from "@/lib/db"
import { DomainState } from "@/types/domain"

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    const env = locals.runtime.env
    const url = new URL(request.url)
    const includeMetrics = url.searchParams.get("metrics") === "true"
    
    if (includeMetrics) {
      const metrics = await getDomainMetrics(env.DB)
      return new Response(JSON.stringify(metrics), {
        headers: { "Content-Type": "application/json" }
      })
    }
    
    const limit = parseInt(url.searchParams.get("limit") || "100")
    const offset = parseInt(url.searchParams.get("offset") || "0")
    
    const domains = await getDomains(env.DB, limit, offset)
    
    return new Response(JSON.stringify({ domains }), {
      headers: { "Content-Type": "application/json" }
    })
  } catch (error) {
    console.error("Error fetching domains:", error)
    return new Response(JSON.stringify({ error: "Failed to fetch domains" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
}

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const env = locals.runtime.env
    const body = await request.json() as {
      name: string
      tld: string
      registrantId?: string
    }
    
    const { name, tld, registrantId } = body
    
    if (!name || !tld) {
      return new Response(JSON.stringify({ error: "Name and TLD are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      })
    }
    
    const domainId = crypto.randomUUID()
    const fullName = `${name}.${tld}`
    const now = new Date().toISOString()
    const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    
    console.log(`[DOMAIN_CREATE] Starting registration for ${fullName}`)
    
    // Initialize domain state machine via Durable Object (optional - graceful degradation)
    let doSuccess = false
    try {
      const doId = env.DOMAIN_STATE.idFromName(fullName)
      const stub = env.DOMAIN_STATE.get(doId)
      
      console.log(`[DOMAIN_CREATE] Initializing DO for ${fullName}`)
      await stub.fetch(new Request("https://do/initialize", {
        method: "POST",
        body: JSON.stringify({ domainId, domainName: fullName })
      }))
      
      console.log(`[DOMAIN_CREATE] Transitioning ${fullName} to registered`)
      const transitionResponse = await stub.fetch(new Request("https://do/transition", {
        method: "POST",
        body: JSON.stringify({
          domainId,
          domainName: fullName,
          toState: DomainState.Registered,
          triggeredBy: "api",
          reason: "Initial registration"
        })
      }))
      
      if (transitionResponse.ok) {
        doSuccess = true
        console.log(`[DOMAIN_CREATE] DO state machine updated successfully`)
      } else {
        const error = await transitionResponse.json()
        console.warn(`[DOMAIN_CREATE] DO transition failed (continuing anyway):`, error)
      }
    } catch (doError) {
      console.warn(`[DOMAIN_CREATE] Durable Object error (continuing anyway):`, doError)
    }
    
    if (!doSuccess) {
      console.log(`[DOMAIN_CREATE] Proceeding with domain creation without DO (free tier limit or DO unavailable)`)
    }
    
    console.log(`[DOMAIN_CREATE] Creating domain in D1: ${fullName}`)
    // Create domain in D1
    const domain = await createDomain(env.DB, {
      id: domainId,
      name: fullName,
      tld,
      state: DomainState.Registered,
      registrant_id: registrantId || null,
      expires_at: expiresAt,
      registered_at: now,
      grace_period_ends_at: null,
      redemption_ends_at: null,
      locked: false,
      auto_renew: true,
      dnssec_enabled: false,
      abuse_score: 0,
      suspension_reason: null,
      metadata: null
    })
    
    console.log(`[DOMAIN_CREATE] Caching domain in KV: ${fullName}`)
    // Cache in KV for fast lookups
    await env.DOMAIN_CACHE.put(`domain:${fullName}`, JSON.stringify(domain), {
      expirationTtl: 3600
    })
    
    // Emit metric if Analytics Engine is available
    if (env.METRICS) {
      console.log(`[DOMAIN_CREATE] Writing metric for ${fullName}`)
      env.METRICS.writeDataPoint({
        blobs: [fullName, "registration"],
        doubles: [1],
        indexes: ["domain_registration"]
      })
    }
    
    console.log(`[DOMAIN_CREATE] Successfully created domain: ${fullName}`)
    return new Response(JSON.stringify({ domain }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    })
  } catch (error) {
    console.error("[DOMAIN_CREATE] Error creating domain:", error)
    return new Response(JSON.stringify({ 
      error: "Failed to create domain",
      details: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
}
