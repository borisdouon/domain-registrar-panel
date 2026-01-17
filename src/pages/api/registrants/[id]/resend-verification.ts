import type { APIRoute } from "astro"
import { sendEmail, generateVerificationEmail } from "@/lib/email"

export const POST: APIRoute = async ({ params, request, locals }) => {
  try {
    const env = locals.runtime.env
    const registrantId = params.id
    
    if (!registrantId) {
      return new Response(JSON.stringify({ error: "Registrant ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      })
    }
    
    console.log(`[RESEND_VERIFY] Resending verification for registrant ${registrantId}`)
    
    // Get registrant details
    const registrant = await env.DB.prepare(
      `SELECT * FROM registrants WHERE id = ?`
    ).bind(registrantId).first() as { id: string; email: string; name: string; verified: number } | null
    
    if (!registrant) {
      return new Response(JSON.stringify({ error: "Registrant not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      })
    }
    
    if (registrant.verified === 1) {
      return new Response(JSON.stringify({ 
        error: "Email already verified",
        verified: true
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      })
    }
    
    // Generate new verification token
    const verificationToken = crypto.randomUUID()
    await env.DOMAIN_CACHE.put(`verify:${registrantId}`, verificationToken, {
      expirationTtl: 86400 // 24 hours
    })
    
    // Get the base URL from the request
    const url = new URL(request.url)
    const baseUrl = `${url.protocol}//${url.host}`
    const verificationUrl = `${baseUrl}/api/registrants/${registrantId}/verify?token=${verificationToken}`
    
    console.log(`[RESEND_VERIFY] Sending verification email to ${registrant.email}`)
    
    // Send verification email
    const emailSent = await sendEmail({
      to: registrant.email,
      subject: "Verify Your Email - Domain Registrar",
      html: generateVerificationEmail(registrant.name, verificationUrl)
    })
    
    if (emailSent) {
      console.log(`[RESEND_VERIFY] Verification email sent to ${registrant.email}`)
    } else {
      console.warn(`[RESEND_VERIFY] Failed to send verification email to ${registrant.email}`)
    }
    
    return new Response(JSON.stringify({ 
      success: true,
      emailSent,
      message: emailSent 
        ? "Verification email sent. Please check your inbox."
        : "Failed to send verification email. Please try again later."
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    })
  } catch (error) {
    console.error("[RESEND_VERIFY] Error resending verification:", error)
    return new Response(JSON.stringify({ 
      error: "Failed to resend verification email",
      details: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
}
