# Google Search Console Setup Guide for TakeYourLounge

This guide will help you set up Google Search Console for **takeyourlounge.com** to monitor SEO performance, submit sitemaps, and track indexing status.

---

## Prerequisites

✅ Domain: takeyourlounge.com (owned via GoDaddy)
✅ Google Account (Gmail)
✅ Website deployed to production (Hetzner VPS)
✅ SSL certificate active (HTTPS)

---

## Step 1: Access Google Search Console

1. Go to [https://search.google.com/search-console](https://search.google.com/search-console)
2. Sign in with your Google account
3. Click **"Start now"** or **"Add property"**

---

## Step 2: Add Your Property

You have **2 options** to verify ownership:

### Option A: Domain Property (Recommended)
- Verifies all subdomains and protocols (http, https, www, non-www)
- Best for comprehensive coverage

**Steps:**
1. Select **"Domain"** property type
2. Enter: `takeyourlounge.com`
3. Click **"Continue"**
4. You'll receive a **TXT record** to add to your DNS

**DNS Verification (GoDaddy):**
1. Log in to GoDaddy account
2. Go to **"My Products" → "Domains" → "DNS"**
3. Click **"Add"** under DNS Records
4. Select **"TXT"** type
5. Enter:
   - **Name/Host:** `@`
   - **Value:** (paste the TXT record from Google)
   - **TTL:** 1 hour (default)
6. Click **"Save"**
7. Wait 10-60 minutes for DNS propagation
8. Return to Search Console and click **"Verify"**

### Option B: URL Prefix Property
- Verifies specific URL only (e.g., https://takeyourlounge.com)

**Steps:**
1. Select **"URL prefix"** property type
2. Enter: `https://takeyourlounge.com`
3. Click **"Continue"**
4. Choose verification method:
   - **HTML file upload** (upload to `/public` directory)
   - **HTML meta tag** (add to `layout.tsx`)
   - **Google Analytics** (already integrated - easiest!)

**Recommended: Google Analytics Verification**
- Since you already have GA4 (G-74NMEZ6BJT) integrated, select this method
- Google will automatically verify ownership
- Click **"Verify"**

---

## Step 3: Submit Your Sitemap

After verification:

1. In Search Console, go to **"Sitemaps"** (left sidebar)
2. Enter sitemap URL:
   ```
   https://takeyourlounge.com/sitemap.xml
   ```
3. Click **"Submit"**
4. Status should change to **"Success"** within minutes

**Expected Sitemap URLs:**
- Homepage: 1
- Static pages: 2 (lounges, airports)
- Lounge pages: 2,256
- Airport pages: 703
- **Total: ~3,000 URLs**

---

## Step 4: Submit Robots.txt

While not required, you can verify robots.txt:

1. Go to **"Settings" → "Crawl rate"**
2. Verify Google can access: `https://takeyourlounge.com/robots.txt`

Your robots.txt already allows all crawlers:
```
User-agent: *
Allow: /
Sitemap: https://takeyourlounge.com/sitemap.xml
```

---

## Step 5: Request Indexing (Optional - For Faster Results)

To speed up initial indexing:

1. Go to **"URL Inspection"** (top search bar)
2. Enter key pages:
   - `https://takeyourlounge.com`
   - `https://takeyourlounge.com/lounges`
   - `https://takeyourlounge.com/airports`
3. Click **"Request Indexing"** for each
4. Google will prioritize crawling these pages

**Note:** Google will automatically discover all 3,000 pages via the sitemap. This step just accelerates the homepage indexing.

---

## Step 6: Monitor Performance

### Key Metrics to Track:

**1. Overview Dashboard**
- Total Clicks
- Total Impressions
- Average CTR (Click-Through Rate)
- Average Position

**2. Performance Report**
- Top queries (search terms bringing users)
- Top pages (most visited URLs)
- Countries (geographic traffic)
- Devices (mobile vs desktop)

**3. Coverage Report**
- **Valid:** Pages successfully indexed (~3,000 expected)
- **Errors:** Pages with indexing issues (fix these!)
- **Excluded:** Pages intentionally not indexed (should be 0)

**4. Enhancements**
- **Mobile Usability:** Ensure no mobile errors
- **Core Web Vitals:** Monitor loading speed (LCP, FID, CLS)

---

## Step 7: Fix Common Issues

### Issue 1: "Couldn't fetch" Sitemap Error
**Cause:** Site not deployed or DNS not propagated
**Fix:** Wait until Hetzner deployment is complete

### Issue 2: "Submitted URL not found (404)"
**Cause:** Page doesn't exist or server error
**Fix:** Check URL in browser, verify static generation

### Issue 3: "Crawled - currently not indexed"
**Cause:** Low-quality content or duplicate pages
**Fix:** Improve content, add unique descriptions

### Issue 4: "Redirect error"
**Cause:** HTTP → HTTPS redirect loop
**Fix:** Check Nginx configuration

---

## Step 8: Set Up Email Alerts

1. Go to **"Settings" → "Users and permissions"**
2. Add your email
3. Enable notifications for:
   - **Critical issues** (indexing errors)
   - **Manual actions** (penalties)
   - **Security issues** (hacking attempts)

---

## Step 9: Integrate with Google Analytics

1. In Search Console, go to **"Settings" → "Associations"**
2. Click **"Associate"** and link to GA4 property (G-74NMEZ6BJT)
3. This enables:
   - Organic search data in GA4
   - Better attribution tracking
   - Combined reporting

---

## Step 10: Ongoing Maintenance

### Weekly Tasks:
- Check **Coverage** report for new errors
- Review **Performance** for top queries
- Monitor **Mobile Usability** issues

### Monthly Tasks:
- Analyze **Search Queries** trends
- Optimize pages with high impressions but low CTR
- Update meta descriptions for underperforming pages

### After Major Updates:
- Re-submit sitemap if URLs change
- Request re-indexing of updated pages
- Monitor for new errors

---

## Expected Timeline

| Event | Timeframe |
|-------|-----------|
| Domain verification | 10-60 minutes (DNS propagation) |
| Sitemap submission | Immediate |
| First crawl | 1-3 days |
| Full indexing (~3,000 pages) | 1-4 weeks |
| Search Console data | 2-3 days after crawling |
| Ranking improvements | 4-12 weeks |

---

## Troubleshooting

### "Property not verified"
1. Check DNS TXT record is correct
2. Wait 1 hour for propagation
3. Try alternative verification method (HTML file)

### "Sitemap couldn't be read"
1. Test sitemap in browser: `https://takeyourlounge.com/sitemap.xml`
2. Validate XML syntax
3. Check server logs for 403/404 errors

### "No data available"
1. Wait 48-72 hours after verification
2. Ensure site has organic traffic
3. Check robots.txt isn't blocking crawlers

---

## Resources

- **Search Console Help:** [https://support.google.com/webmasters](https://support.google.com/webmasters)
- **SEO Starter Guide:** [https://developers.google.com/search/docs/beginner/seo-starter-guide](https://developers.google.com/search/docs/beginner/seo-starter-guide)
- **Structured Data Testing:** [https://search.google.com/test/rich-results](https://search.google.com/test/rich-results)

---

## Next Steps After Setup

1. ✅ Submit sitemap (done after first deployment)
2. ✅ Enable email alerts
3. ✅ Link with Google Analytics 4
4. Create **Google Business Profile** for brand visibility
5. Submit to **Bing Webmaster Tools** (similar process)
6. Monitor **Core Web Vitals** for performance

---

## Summary Checklist

- [ ] Create Google Search Console account
- [ ] Add takeyourlounge.com property
- [ ] Verify ownership via DNS or GA4
- [ ] Submit sitemap.xml
- [ ] Verify robots.txt accessibility
- [ ] Request indexing for key pages
- [ ] Set up email alerts
- [ ] Link with Google Analytics 4
- [ ] Monitor Coverage report weekly
- [ ] Review Performance metrics monthly

---

**Status:** Ready to set up after Hetzner deployment
**Estimated Setup Time:** 30-60 minutes (excluding DNS propagation)
**Maintenance Time:** 30 minutes/month

✨ **Good luck with your SEO optimization!**
