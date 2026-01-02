# Resend Email Service Setup Guide

**Purpose:** Configure professional email sending for B2B forms and contact submissions.

**Status:** ✅ Code ready | ⏳ Resend API key needed

---

## What is Resend?

Resend is a modern email API service designed for developers, similar to SendGrid or Mailgun but with better deliverability and Next.js integration.

**Why we chose Resend:**
- ✅ Built for Next.js/React applications
- ✅ Superior email deliverability (emails reach inbox, not spam)
- ✅ Simple API, no complex setup
- ✅ Generous free tier (3,000 emails/month)
- ✅ Professional email templates support
- ✅ Real-time delivery tracking

---

## Current Email Features

### ✅ Implemented (Code Ready)
- B2B Operators Form → Email to `info@tsynca.com`
- B2B Airports Form → Email to `info@tsynca.com`
- B2B Card Issuers Form → Email to `info@tsynca.com`
- Centralized email service (`/web/src/lib/email-service.ts`)
- Production-safe fallback (logs to console if API key missing)
- HTML email templates with professional formatting

### ❌ NOT Implemented (Future Features)
- Marketing newsletters
- Bulk email campaigns
- User registration emails (mobile app)
- Password reset emails (mobile app)
- Booking confirmations (mobile app)

---

## Setup Instructions (5 Minutes)

### Step 1: Create Resend Account

1. Go to https://resend.com
2. Click "Start Building" or "Sign Up"
3. Sign up with your email (or use GitHub/Google login)
4. Verify your email address

**Cost:** FREE (3,000 emails/month)

---

### Step 2: Verify Your Domain

**Important:** You must verify `takeyourlounge.com` to send emails from `noreply@takeyourlounge.com`

1. Log in to Resend dashboard
2. Go to **Domains** section
3. Click "**Add Domain**"
4. Enter: `takeyourlounge.com`
5. Resend will show DNS records you need to add

**DNS Records to Add** (via your domain registrar):

```
Type: TXT
Name: @ (or leave blank)
Value: [Resend will provide this]

Type: CNAME
Name: resend._domainkey
Value: [Resend will provide this]

Type: MX
Name: @ (or leave blank)
Priority: 10
Value: [Resend will provide this - optional]
```

6. Add these DNS records to your domain
7. Click "**Verify**" in Resend dashboard
8. Wait 5-15 minutes for DNS propagation

**Verification Status:**
- ✅ Green checkmark = Domain verified (ready to send)
- ⏳ Pending = DNS not propagated yet (wait 15 minutes)
- ❌ Failed = DNS records incorrect (check and retry)

---

### Step 3: Generate API Key

1. Go to **API Keys** section in Resend dashboard
2. Click "**Create API Key**"
3. Name it: `TakeYourLounge Production`
4. Click "**Create**"
5. Copy the API key (it starts with `re_`)

**⚠️ IMPORTANT:** Save this API key securely. You cannot view it again!

Example API key format:
```
re_123456789abcdefghijklmnopqrstuvwxyz
```

---

### Step 4: Add API Key to Production Server

**Option A: SSH to Server (Recommended)**

```bash
# Connect to server
ssh root@46.62.164.198

# Navigate to project directory
cd /var/www/TakeYourLounge

# Edit .env file
nano .env

# Add this line (replace with your actual API key):
RESEND_API_KEY=re_your_actual_api_key_here

# Save and exit (Ctrl+X, then Y, then Enter)

# Restart application
pm2 restart takeyourlounge

# Check logs to verify
pm2 logs takeyourlounge --lines 20
```

**Option B: Upload .env File**

```bash
# On your local machine, create .env file
cd /Users/teyfikoz/TakeYourLounge/web
nano .env

# Add:
RESEND_API_KEY=re_your_actual_api_key_here
B2B_NOTIFICATION_EMAIL=info@tsynca.com
EMAIL_FROM=noreply@takeyourlounge.com
ENABLE_EMAIL_SENDING=true

# Save and upload to server
scp .env root@46.62.164.198:/var/www/TakeYourLounge/web/

# Restart server
ssh root@46.62.164.198 'cd /var/www/TakeYourLounge && pm2 restart takeyourlounge'
```

---

### Step 5: Test Email Sending

**Test with Curl:**

```bash
curl -X POST https://takeyourlounge.com/api/b2b/operators \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "company": "Test Company",
    "email": "test@example.com",
    "loungeCount": "1",
    "airports": "JFK",
    "message": "This is a test submission"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Your partnership inquiry has been submitted successfully..."
}
```

**Check Your Inbox:**
- Email should arrive at `info@tsynca.com` within 1-2 seconds
- Subject: 🏢 New Lounge Operator Partnership Inquiry - Test Company
- From: noreply@takeyourlounge.com

**If Email Doesn't Arrive:**
1. Check spam folder
2. Check Resend dashboard → "Logs" → verify email was sent
3. Check server logs: `pm2 logs takeyourlounge`
4. Verify domain is verified in Resend (green checkmark)

---

## Monitoring & Analytics

### Resend Dashboard

Access: https://resend.com/dashboard

**Available Metrics:**
- Emails sent (real-time count)
- Delivery rate (should be >99%)
- Bounce rate (should be <1%)
- Open rate (if tracking enabled)
- Click rate (if tracking enabled)

**Email Logs:**
- See all sent emails
- Click on email to see:
  - Delivery status
  - Opens and clicks
  - Bounce/spam reports
  - Full email content

### Server Logs

```bash
# View recent email activity
ssh root@46.62.164.198
pm2 logs takeyourlounge --lines 50 | grep Email

# Should see:
# ✅ Email sent successfully via Resend: msg_xxxxx
```

---

## Troubleshooting

### Problem: "RESEND_API_KEY not configured"

**Symptoms:**
- Emails logged to console instead of sent
- Server logs show: `📧 Email would be sent (RESEND_API_KEY not configured)`

**Solution:**
1. Verify `.env` file exists: `ls -la /var/www/TakeYourLounge/web/.env`
2. Check API key is set: `cat /var/www/TakeYourLounge/web/.env | grep RESEND`
3. Restart app: `pm2 restart takeyourlounge`

---

### Problem: "Failed to send email via Resend"

**Symptoms:**
- Error in server logs
- Forms submit but no email arrives

**Possible Causes:**
1. **Invalid API key:**
   - Check API key is correct in `.env`
   - API key starts with `re_`

2. **Domain not verified:**
   - Go to Resend dashboard → Domains
   - Check for green checkmark next to `takeyourlounge.com`
   - If not verified, add DNS records again

3. **Rate limit exceeded:**
   - Free tier: 3,000 emails/month
   - Check Resend dashboard → Usage

4. **Resend API outage:**
   - Check https://status.resend.com

**Debug Steps:**
```bash
# Check server logs
pm2 logs takeyourlounge --lines 100 | grep -A 5 "Failed to send"

# Test API key manually
curl https://api.resend.com/emails \
  -H "Authorization: Bearer re_your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "noreply@takeyourlounge.com",
    "to": "test@example.com",
    "subject": "Test",
    "text": "Test email"
  }'
```

---

### Problem: Emails Going to Spam

**Solutions:**

1. **Verify SPF/DKIM records:**
   - Go to Resend dashboard → Domains
   - Check all DNS records have green checkmarks
   - If not, re-add DNS records

2. **Warm up your domain:**
   - Send a few test emails first
   - Gradually increase volume
   - Don't send 100 emails in first day

3. **Check email content:**
   - Avoid spam trigger words (free, winner, click here)
   - Our templates are already optimized

4. **Add DMARC record** (optional but recommended):
   ```
   Type: TXT
   Name: _dmarc
   Value: v=DMARC1; p=none; rua=mailto:info@tsynca.com
   ```

---

## Email Templates

All templates are in `/web/src/app/api/b2b/*/route.ts`

**Current Templates:**
- ✅ B2B Operators Inquiry
- ✅ B2B Airports Demo Request
- ✅ B2B Card Issuers Partnership

**Template Features:**
- Professional HTML design
- Responsive (mobile-friendly)
- Color-coded by form type
- Includes all form fields
- Timestamp and source tracking

**Customizing Templates:**
Edit files:
- `/web/src/app/api/b2b/operators/route.ts` (line 37-81)
- `/web/src/app/api/b2b/airports/route.ts` (similar structure)
- `/web/src/app/api/b2b/card-issuers/route.ts` (similar structure)

---

## Future Mobile App Email Features

**When mobile app launches**, the same email infrastructure will support:

### User Registration Flow
```javascript
import { sendEmail } from '@/lib/email-service';

await sendEmail({
  to: user.email,
  subject: 'Welcome to TakeYourLounge! ✈️',
  text: 'Welcome email text...',
  html: '<html>Welcome email...</html>'
});
```

### Password Reset
```javascript
const resetToken = generateToken();
await sendEmail({
  to: user.email,
  subject: 'Reset Your Password',
  text: `Reset link: ${resetUrl}/${resetToken}`,
  html: passwordResetTemplate(resetUrl, resetToken)
});
```

### Booking Confirmations
```javascript
await sendEmail({
  to: user.email,
  subject: `Booking Confirmed: ${lounge.name}`,
  html: bookingConfirmationTemplate(booking)
});
```

**No additional setup required** - just use existing `sendEmail()` function!

---

## Production Checklist

Before going live with Resend:

- [ ] Resend account created
- [ ] Domain `takeyourlounge.com` verified (green checkmark)
- [ ] API key generated and saved securely
- [ ] `.env` file updated on production server
- [ ] `RESEND_API_KEY` added to `.env`
- [ ] `B2B_NOTIFICATION_EMAIL=info@tsynca.com` confirmed
- [ ] Application restarted (`pm2 restart takeyourlounge`)
- [ ] Test email sent successfully
- [ ] Email received at `info@tsynca.com`
- [ ] Resend dashboard shows successful delivery
- [ ] Email NOT in spam folder

---

## Cost Analysis

### Free Tier (Current)
- **Limit:** 3,000 emails/month
- **Cost:** $0/month
- **Sufficient for:**
  - ~100 B2B form submissions/month
  - Early stage operations
  - Testing and development

### Pro Tier (When Scaling)
- **Limit:** 50,000 emails/month
- **Cost:** $20/month
- **Sufficient for:**
  - B2B forms
  - User registration (mobile app)
  - Booking confirmations
  - Weekly newsletters

### Business Tier (Future)
- **Limit:** 1,000,000 emails/month
- **Cost:** $100/month
- **For:** Large-scale marketing campaigns

**Current Recommendation:** Start with free tier, upgrade when you hit 2,500 emails/month.

---

## Support

**Resend Support:**
- Documentation: https://resend.com/docs
- Support: https://resend.com/support
- Status page: https://status.resend.com

**TakeYourLounge Support:**
- Email: info@tsynca.com
- GitHub: Issues section
- Documentation: This file

---

## Summary

1. ✅ Sign up at https://resend.com (free)
2. ✅ Verify `takeyourlounge.com` domain
3. ✅ Generate API key
4. ✅ Add `RESEND_API_KEY` to `.env` on server
5. ✅ Restart application
6. ✅ Test with curl command
7. ✅ Monitor in Resend dashboard

**Total setup time:** ~5 minutes (+ DNS propagation time)

**Result:** Professional email sending for all B2B forms! 📧
