import type { APIRoute } from "astro"
import { getRegistrants } from "@/lib/db"
import { sendEmail, generateVerificationEmail } from "@/lib/email"

export const GET: APIRoute = async ({ locals }) => {
  try {
    const env = locals.runtime.env
    const registrants = await getRegistrants(env.DB)
    
    return new Response(JSON.stringify({ registrants }), {
      headers: { "Content-Type": "application/json" }
    })
  } catch (error) {
    console.error("Error fetching registrants:", error)
    return new Response(JSON.stringify({ error: "Failed to fetch registrants" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
}

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const env = locals.runtime.env
    const body = await request.json() as {
      email: string
      name: string
      organization?: string
      country: string
      phone?: string
    }
    
    const { email, name, organization, country, phone } = body
    
    if (!email || !name || !country) {
      return new Response(JSON.stringify({ error: "Email, name, and country are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      })
    }
    
    const id = crypto.randomUUID()
    const now = new Date().toISOString()
    
    console.log(`[REGISTRANT_CREATE] Creating registrant: ${email}`)
    
    await env.DB.prepare(
      `INSERT INTO registrants (id, email, name, organization, country, phone, created_at, updated_at, verified, abuse_flags)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(id, email, name, organization || null, country, phone || null, now, now, 0, 0).run()
    
    const registrant = { id, email, name, organization, country, phone, created_at: now, updated_at: now, verified: false, abuse_flags: 0 }
    
    // Generate verification token and store in KV (expires in 24 hours)
    const verificationToken = crypto.randomUUID()
    await env.DOMAIN_CACHE.put(`verify:${id}`, verificationToken, {
      expirationTtl: 86400 // 24 hours
    })
    
    // Get the base URL from the request
    const url = new URL(request.url)
    const baseUrl = `${url.protocol}//${url.host}`
    const verificationUrl = `${baseUrl}/api/registrants/${id}/verify?token=${verificationToken}`
    
    console.log(`[REGISTRANT_CREATE] Sending verification email to ${email}`)
    
    // Send verification email using MailChannels (free for Cloudflare Workers)
    const emailSent = await sendEmail({
      to: email,
      subject: "Verify Your Email - Domain Registrar",
      html: generateVerificationEmail(name, verificationUrl)
    })
    
    if (emailSent) {
      console.log(`[REGISTRANT_CREATE] Verification email sent to ${email}`)
    } else {
      console.warn(`[REGISTRANT_CREATE] Failed to send verification email to ${email}`)
    }
    
    return new Response(JSON.stringify({ 
      registrant,
      verificationEmailSent: emailSent,
      message: emailSent 
        ? "Registrant created. Please check your email to verify your address."
        : "Registrant created. Email verification is pending."
    }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    })
  } catch (error) {
    console.error("[REGISTRANT_CREATE] Error creating registrant:", error)
    return new Response(JSON.stringify({ 
      error: "Failed to create registrant",
      details: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
}
