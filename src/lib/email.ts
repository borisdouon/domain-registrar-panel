/**
 * Email service using MailChannels API (free for Cloudflare Workers)
 * No API key required - works automatically from Workers
 */

export interface EmailOptions {
  to: string
  subject: string
  html: string
  from?: string
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  const { to, subject, html, from = "noreply@workers.dev" } = options
  
  try {
    console.log(`[EMAIL] Attempting to send email to ${to}: ${subject}`)
    
    const payload = {
      personalizations: [
        {
          to: [{ email: to }],
        },
      ],
      from: {
        email: from,
        name: "Domain Registrar",
      },
      subject,
      content: [
        {
          type: "text/html",
          value: html,
        },
      ],
    }
    
    console.log(`[EMAIL] Payload:`, JSON.stringify(payload, null, 2))
    
    const response = await fetch("https://api.mailchannels.net/tx/v1/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
    
    const responseText = await response.text()
    console.log(`[EMAIL] MailChannels response status: ${response.status}`)
    console.log(`[EMAIL] MailChannels response:`, responseText)
    
    if (!response.ok) {
      console.error(`[EMAIL] Failed to send email. Status: ${response.status}, Response:`, responseText)
      return false
    }
    
    console.log(`[EMAIL] Email sent successfully to ${to}`)
    return true
  } catch (error) {
    console.error(`[EMAIL] Exception while sending email:`, error)
    return false
  }
}

export function generateVerificationEmail(
  registrantName: string,
  verificationUrl: string
): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Domain Registrar</h1>
        </div>
        
        <div style="background: #ffffff; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
          <h2 style="color: #1f2937; margin-top: 0;">Verify Your Email Address</h2>
          
          <p>Hello ${registrantName},</p>
          
          <p>Thank you for registering with Domain Registrar. To complete your registration and verify your email address, please click the button below:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              Verify Email Address
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px;">Or copy and paste this link into your browser:</p>
          <p style="background: #f3f4f6; padding: 12px; border-radius: 6px; word-break: break-all; font-size: 13px; color: #4b5563;">
            ${verificationUrl}
          </p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="color: #6b7280; font-size: 13px; margin-bottom: 0;">
            This verification link will expire in 24 hours. If you didn't create an account with Domain Registrar, you can safely ignore this email.
          </p>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
          <p>© ${new Date().getFullYear()} Domain Registrar. All rights reserved.</p>
          <p>Powered by Cloudflare Workers</p>
        </div>
      </body>
    </html>
  `
}

export function generateWelcomeEmail(registrantName: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Domain Registrar</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Welcome!</h1>
        </div>
        
        <div style="background: #ffffff; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
          <h2 style="color: #1f2937; margin-top: 0;">Email Verified Successfully</h2>
          
          <p>Hello ${registrantName},</p>
          
          <p>Your email has been verified! You can now:</p>
          
          <ul style="color: #4b5563;">
            <li>Register and manage domains</li>
            <li>Configure DNS records</li>
            <li>Monitor domain lifecycle states</li>
            <li>Access compliance and audit tools</li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="/" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              Go to Dashboard
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="color: #6b7280; font-size: 13px;">
            If you have any questions, please don't hesitate to reach out to our support team.
          </p>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
          <p>© ${new Date().getFullYear()} Domain Registrar. All rights reserved.</p>
        </div>
      </body>
    </html>
  `
}
