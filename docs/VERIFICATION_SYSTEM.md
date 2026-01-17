# Email Verification System

## Overview

The Domain Registrar platform now includes a complete email verification system for registrants using **MailChannels API** - a free email service for Cloudflare Workers that requires no API keys or configuration.

## How It Works

### 1. Registrant Creation Flow

When a new registrant is created:

1. **Registrant record created** in D1 database with `verified = 0`
2. **Verification token generated** (UUID) and stored in KV with 24-hour expiration
3. **Verification email sent** via MailChannels API to the registrant's email
4. **Response includes** `verificationEmailSent` status

```bash
# Create a registrant
curl -X POST https://domain-registrar-panel.douon2010.workers.dev/api/registrants \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "name": "John Doe",
    "country": "US"
  }'

# Response
{
  "registrant": { ... },
  "verificationEmailSent": true,
  "message": "Registrant created. Please check your email to verify your address."
}
```

### 2. Email Verification Flow

The registrant receives a beautiful HTML email with:
- Professional gradient design
- Clear "Verify Email Address" button
- Verification link that expires in 24 hours
- Fallback text link

When clicked, the link goes to:
```
GET /api/registrants/{id}/verify?token={token}
```

This endpoint:
1. Validates the token from KV storage
2. Updates `verified = 1` in the database
3. Deletes the verification token
4. Shows a success page

### 3. Resend Verification

If the email is lost or expired:

```bash
# Resend verification email
curl -X POST https://domain-registrar-panel.douon2010.workers.dev/api/registrants/{id}/resend-verification
```

This generates a new token and sends a fresh email.

## Technical Implementation

### MailChannels Integration

**Why MailChannels?**
- ✅ **Free for Cloudflare Workers** - No cost, no limits for reasonable use
- ✅ **No API keys required** - Works automatically from Workers
- ✅ **No configuration** - Just call the API
- ✅ **Reliable delivery** - Professional email infrastructure
- ✅ **HTML support** - Beautiful branded emails

**API Endpoint:**
```
POST https://api.mailchannels.net/tx/v1/send
```

**Implementation:** `src/lib/email.ts`

### Storage Architecture

**KV Storage for Tokens:**
- Key: `verify:{registrantId}`
- Value: UUID token
- TTL: 86400 seconds (24 hours)
- Auto-expires to prevent token reuse

**D1 Database:**
- `verified` column: 0 (unverified) or 1 (verified)
- Updated atomically on successful verification

### API Endpoints

#### 1. Create Registrant with Verification
```
POST /api/registrants
```

**Request:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "organization": "Acme Corp",
  "country": "US",
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "registrant": {
    "id": "uuid",
    "email": "user@example.com",
    "verified": false,
    ...
  },
  "verificationEmailSent": true,
  "message": "Registrant created. Please check your email to verify your address."
}
```

#### 2. Verify Email (GET - for email links)
```
GET /api/registrants/{id}/verify?token={token}
```

Returns HTML success/error page.

#### 3. Verify Email (POST - for API calls)
```
POST /api/registrants/{id}/verify
```

**Request:**
```json
{
  "token": "verification-token-uuid"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

#### 4. Resend Verification Email
```
POST /api/registrants/{id}/resend-verification
```

**Response:**
```json
{
  "success": true,
  "emailSent": true,
  "message": "Verification email sent. Please check your inbox."
}
```

## Email Templates

### Verification Email
- **Subject:** "Verify Your Email - Domain Registrar"
- **Design:** Professional gradient header, clear CTA button
- **Content:** Personalized with registrant name
- **Includes:** Both button and text link for accessibility
- **Branding:** Domain Registrar with Cloudflare Workers badge

### Welcome Email (Future)
After verification, can send a welcome email with:
- Dashboard link
- Feature overview
- Support information

## Security Features

1. **Token Expiration:** 24-hour automatic expiry via KV TTL
2. **One-time Use:** Token deleted after successful verification
3. **UUID Tokens:** Cryptographically random, unpredictable
4. **HTTPS Only:** All verification links use HTTPS
5. **No Sensitive Data:** Tokens stored separately from user data

## Monitoring & Logging

All email operations are logged with prefixes:
- `[REGISTRANT_CREATE]` - Registrant creation and email sending
- `[VERIFY]` - Verification attempts
- `[RESEND_VERIFY]` - Resend verification requests
- `[EMAIL]` - MailChannels API calls

View logs:
```bash
npx wrangler tail --format pretty
```

## UI Integration

The Registrants table shows verification status:
- ❌ **Unverified** - Red badge
- ✅ **Verified** - Green badge

Future enhancements:
- "Resend Verification" button in UI
- Verification status filter
- Bulk verification reminders

## Cloudflare Services Used

1. **Workers** - Email sending logic
2. **KV** - Token storage with TTL
3. **D1** - Registrant data and verification status
4. **MailChannels API** - Email delivery (free for Workers)

## Testing

### Test Email Verification Flow

1. **Create registrant:**
```bash
curl -X POST https://domain-registrar-panel.douon2010.workers.dev/api/registrants \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User","country":"US"}'
```

2. **Check email** - Look for verification email

3. **Click link** - Should see success page

4. **Verify in database:**
```bash
npx wrangler d1 execute domain-registrar-db \
  --command "SELECT id, email, verified FROM registrants WHERE email='test@example.com'"
```

### Test Resend Flow

```bash
# Get registrant ID from previous step
curl -X POST https://domain-registrar-panel.douon2010.workers.dev/api/registrants/{id}/resend-verification
```

## Troubleshooting

### Email Not Received

1. **Check spam folder** - MailChannels emails may be filtered
2. **Check logs** - Look for `[EMAIL]` errors
3. **Verify email address** - Ensure it's valid
4. **Check MailChannels status** - API may have temporary issues

### Verification Link Expired

- Use the resend endpoint to generate a new link
- Tokens expire after 24 hours automatically

### Email Sending Failed

- Check worker logs for MailChannels API errors
- Verify network connectivity from Workers
- Ensure email content is valid HTML

## Future Enhancements

1. **Email Templates**
   - Welcome email after verification
   - Domain registration confirmation
   - Renewal reminders
   - Abuse notifications

2. **Advanced Features**
   - Custom email domains (via Cloudflare Email Routing)
   - Email preferences management
   - Unsubscribe handling
   - Email delivery tracking

3. **Compliance**
   - GDPR consent tracking
   - Email audit logs
   - Bounce handling
   - Spam complaint management

## Cost Analysis

**MailChannels for Cloudflare Workers:**
- ✅ **FREE** for reasonable use
- No per-email charges
- No monthly fees
- No API key required
- Included with Cloudflare Workers

**Alternative Considered:**
- SendGrid: $15-$90/month
- Mailgun: $35+/month
- AWS SES: $0.10 per 1000 emails
- Resend: $20/month

**Winner:** MailChannels - Free, native Cloudflare integration, zero config
