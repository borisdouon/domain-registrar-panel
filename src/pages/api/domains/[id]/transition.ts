import type { APIRoute } from "astro"
import { getDomainById, updateDomainState, recordTransition } from "@/lib/db"
import { DomainState } from "@/types/domain"

export const POST: APIRoute = async ({ params, request, locals }) => {
  try {
    const env = locals.runtime.env
    const domainId = params.id
    
    if (!domainId) {
      return new Response(JSON.stringify({ error: "Domain ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      })
    }
    
    const body = await request.json() as {
      toState: string
      triggeredBy: string
      reason?: string
    }
    const { toState, triggeredBy, reason } = body
    
    if (!toState || !triggeredBy) {
      return new Response(JSON.stringify({ error: "toState and triggeredBy are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      })
    }
    
    // Get current domain state
    const domain = await getDomainById(env.DB, domainId)
    if (!domain) {
      return new Response(JSON.stringify({ error: "Domain not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      })
    }
    
    // Validate transition via Durable Object
    const doId = env.DOMAIN_STATE.idFromName(domain.name)
    const stub = env.DOMAIN_STATE.get(doId)
    
    const transitionResponse = await stub.fetch(new Request("https://do/transition", {
      method: "POST",
      body: JSON.stringify({
        domainId: domainId,
        domainName: domain.name,
        toState,
        triggeredBy,
        reason
      })
    }))
    
    const transitionResult = await transitionResponse.json() as {
      success: boolean
      fromState: DomainState
      toState: DomainState
      timestamp: string
      error?: string
    }
    
    if (!transitionResult.success) {
      return new Response(JSON.stringify({ 
        error: transitionResult.error,
        fromState: transitionResult.fromState,
        toState: transitionResult.toState
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      })
    }
    
    // Update D1
    const additionalFields: Partial<typeof domain> = {}
    
    // Handle state-specific logic
    if (toState === DomainState.Active && domain.state === DomainState.Expiring) {
      // Renewal - extend expiration
      additionalFields.expires_at = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    } else if (toState === DomainState.Suspended) {
      additionalFields.suspension_reason = reason || "Abuse detected"
    } else if (toState === DomainState.GracePeriod) {
      additionalFields.grace_period_ends_at = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    } else if (toState === DomainState.Redemption) {
      additionalFields.redemption_ends_at = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    }
    
    await updateDomainState(env.DB, domainId, toState as DomainState, additionalFields)
    
    // Record transition
    await recordTransition(env.DB, {
      id: crypto.randomUUID(),
      domain_id: domainId,
      from_state: transitionResult.fromState,
      to_state: transitionResult.toState,
      triggered_by: triggeredBy,
      reason: reason || null,
      metadata: null
    })
    
    // Invalidate cache
    await env.DOMAIN_CACHE.delete(`domain:${domain.name}`)
    
    // Emit metric if Analytics Engine is available
    if (env.METRICS) {
      console.log(`[TRANSITION] Writing metric for ${domain.name}: ${transitionResult.fromState} -> ${transitionResult.toState}`)
      env.METRICS.writeDataPoint({
        blobs: [domain.name, `transition:${transitionResult.fromState}:${transitionResult.toState}`],
        doubles: [1],
        indexes: ["domain_transition"]
      })
    }
    
    return new Response(JSON.stringify({
      success: true,
      transition: transitionResult
    }), {
      headers: { "Content-Type": "application/json" }
    })
  } catch (error) {
    console.error("Error transitioning domain:", error)
    return new Response(JSON.stringify({ error: "Failed to transition domain" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
}
