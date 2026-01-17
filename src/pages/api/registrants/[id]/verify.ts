import type { APIRoute } from "astro"

export const POST: APIRoute = async ({ params, request, locals }) => {
  try {
    const env = locals.runtime.env
    const registrantId = params.id
    const body = await request.json() as {
      token?: string
    }
    
    if (!registrantId) {
      return new Response(JSON.stringify({ error: "Registrant ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      })
    }
    
    console.log(`[VERIFY] Verifying registrant ${registrantId}`)
    
    // Get the verification token from KV
    const storedToken = await env.DOMAIN_CACHE.get(`verify:${registrantId}`)
    
    if (!storedToken) {
      return new Response(JSON.stringify({ error: "Verification token expired or invalid" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      })
    }
    
    if (body.token !== storedToken) {
      return new Response(JSON.stringify({ error: "Invalid verification token" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      })
    }
    
    // Update registrant as verified
    await env.DB.prepare(
      `UPDATE registrants SET verified = 1, updated_at = ? WHERE id = ?`
    ).bind(new Date().toISOString(), registrantId).run()
    
    // Delete the verification token
    await env.DOMAIN_CACHE.delete(`verify:${registrantId}`)
    
    console.log(`[VERIFY] Registrant ${registrantId} verified successfully`)
    
    return new Response(JSON.stringify({ 
      success: true,
      message: "Email verified successfully"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    })
  } catch (error) {
    console.error("[VERIFY] Error verifying registrant:", error)
    return new Response(JSON.stringify({ 
      error: "Failed to verify registrant",
      details: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
}

export const GET: APIRoute = async ({ params, request, locals }) => {
  try {
    const env = locals.runtime.env
    const registrantId = params.id
    const url = new URL(request.url)
    const token = url.searchParams.get("token")
    
    if (!registrantId || !token) {
      return new Response("Invalid verification link", {
        status: 400,
        headers: { "Content-Type": "text/html" }
      })
    }
    
    console.log(`[VERIFY] Processing verification link for ${registrantId}`)
    
    // Verify the token
    const storedToken = await env.DOMAIN_CACHE.get(`verify:${registrantId}`)
    
    if (!storedToken || token !== storedToken) {
      return new Response(`
        <!DOCTYPE html>
        <html>
          <head><title>Verification Failed</title></head>
          <body style="font-family: system-ui; max-width: 600px; margin: 50px auto; padding: 20px;">
            <h1>❌ Verification Failed</h1>
            <p>This verification link is invalid or has expired.</p>
            <p>Please request a new verification email.</p>
          </body>
        </html>
      `, {
        status: 400,
        headers: { "Content-Type": "text/html" }
      })
    }
    
    // Update registrant as verified
    await env.DB.prepare(
      `UPDATE registrants SET verified = 1, updated_at = ? WHERE id = ?`
    ).bind(new Date().toISOString(), registrantId).run()
    
    // Delete the verification token
    await env.DOMAIN_CACHE.delete(`verify:${registrantId}`)
    
    console.log(`[VERIFY] Registrant ${registrantId} verified via email link`)
    
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head><title>Email Verified</title></head>
        <body style="font-family: system-ui; max-width: 600px; margin: 50px auto; padding: 20px;">
          <h1>✅ Email Verified Successfully</h1>
          <p>Your email has been verified. You can now close this window.</p>
          <p><a href="/" style="color: #0066cc;">Return to Dashboard</a></p>
        </body>
      </html>
    `, {
      status: 200,
      headers: { "Content-Type": "text/html" }
    })
  } catch (error) {
    console.error("[VERIFY] Error processing verification link:", error)
    return new Response("An error occurred during verification", {
      status: 500,
      headers: { "Content-Type": "text/html" }
    })
  }
}
