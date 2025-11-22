# 📸 Image Scraping Setup Guide

Complete guide for setting up **free** image scraping APIs for TakeYourLounge.

---

## 🎯 Overview

Our image scraper supports **3 free APIs** + fallback options:

| Service | Free Tier | Quality | Best For |
|---------|-----------|---------|----------|
| **Bing Images** | 1,000 calls/month | ⭐⭐⭐⭐⭐ | Specific lounge photos |
| **Pexels** | Unlimited* | ⭐⭐⭐⭐ | Generic lounge interiors |
| **Unsplash** | 50 calls/hour | ⭐⭐⭐⭐ | Artistic lounge photos |

*Requires attribution

---

## 🔑 Setup Instructions

### 1. Bing Image Search API (Recommended)

**Why Bing?**
- Best results for specific lounge names
- 1,000 free searches per month
- High-quality images
- Most reliable

**Setup Steps:**

1. **Go to Azure Portal**
   - Visit: https://portal.azure.com
   - Sign in with Microsoft account (create free if needed)

2. **Create Bing Search Resource**
   - Click "+ Create a resource"
   - Search for "Bing Search v7"
   - Click "Create"

3. **Configure Resource**
   - **Subscription**: Choose your subscription
   - **Resource Group**: Create new (e.g., "TakeYourLounge")
   - **Pricing Tier**: Choose **F1 (Free)** - 1,000 calls/month
   - **Region**: Choose closest region

4. **Get API Key**
   - After creation, go to resource
   - Click "Keys and Endpoint" in left menu
   - Copy **KEY 1**

5. **Set Environment Variable**
   ```bash
   # macOS/Linux
   export BING_API_KEY="your-key-here"

   # Or add to ~/.zshrc or ~/.bashrc
   echo 'export BING_API_KEY="your-key-here"' >> ~/.zshrc
   source ~/.zshrc

   # Windows (PowerShell)
   $env:BING_API_KEY="your-key-here"
   ```

**Usage Limits:**
- Free Tier: 1,000 calls/month
- For 3,000 lounges with 1 search each = 3 months
- Or process 100 lounges with Bing, rest with Pexels

---

### 2. Pexels API (Unlimited)

**Why Pexels?**
- Completely free (unlimited requests)
- High-quality stock photos
- Good for generic lounge images
- Requires attribution

**Setup Steps:**

1. **Create Account**
   - Visit: https://www.pexels.com/api/
   - Click "Get Started"
   - Sign up (free)

2. **Get API Key**
   - After signup, you'll see your API key
   - Or go to: https://www.pexels.com/api/key/

3. **Set Environment Variable**
   ```bash
   export PEXELS_API_KEY="your-key-here"
   ```

**Attribution:**
- Add credit: "Photo by [Photographer] on Pexels"
- Not required for editorial use

---

### 3. Unsplash API (50/hour)

**Why Unsplash?**
- Free tier: 50 requests/hour
- Artistic, high-quality photos
- Good supplement to Bing/Pexels

**Setup Steps:**

1. **Create Account**
   - Visit: https://unsplash.com/developers
   - Sign up (free)

2. **Create App**
   - Click "New Application"
   - Accept terms
   - Fill in app details:
     - **Application name**: TakeYourLounge
     - **Description**: Airport lounge discovery platform

3. **Get Access Key**
   - Copy "Access Key"

4. **Set Environment Variable**
   ```bash
   export UNSPLASH_API_KEY="your-access-key-here"
   ```

**Usage Limits:**
- Free: 50 requests/hour
- Demo: Unlimited (with Unsplash branding)

---

## 🚀 Quick Start

### Option 1: Test with 10 Lounges

```bash
# Set at least one API key
export BING_API_KEY="your-key"

# Test with first 10 lounges
python3 image_scraper.py 10
```

### Option 2: Full Run (All Lounges)

```bash
# Set multiple API keys for best coverage
export BING_API_KEY="your-bing-key"
export PEXELS_API_KEY="your-pexels-key"
export UNSPLASH_API_KEY="your-unsplash-key"

# Process all lounges
python3 image_scraper.py
```

### Option 3: Batch Processing

```bash
# Process in batches to stay within free limits
# Batch 1: First 1000 (Bing)
python3 image_scraper.py 1000

# Wait 1 month or use Pexels for next batch
export BING_API_KEY=""  # Disable Bing
export PEXELS_API_KEY="your-pexels-key"  # Enable Pexels

# Batch 2: Next 1000
# Modify script to skip first 1000
```

---

## 📊 Expected Results

### With Bing API Only:
- Coverage: ~90% (specific lounge photos)
- Quality: Excellent
- Cost: Free (1,000/month limit)

### With Pexels Only:
- Coverage: ~60% (generic lounge photos)
- Quality: Very good
- Cost: Free (unlimited)

### With All 3 APIs:
- Coverage: ~95%
- Quality: Excellent
- Cost: Free

---

## 🎨 Fallback Strategy

If no API keys configured, the script will:
1. Skip image scraping
2. Leave `images` field empty
3. You can add images manually later

**Alternative Sources:**
- Lounge operator websites (manual scraping)
- AI-generated images (DALL-E, Midjourney)
- User-submitted photos (after launch)

---

## 🔐 Security Best Practices

### Store API Keys Safely:

1. **Environment Variables** (Recommended)
   ```bash
   # .env file (add to .gitignore)
   BING_API_KEY=your-key
   PEXELS_API_KEY=your-key
   UNSPLASH_API_KEY=your-key
   ```

2. **Load in Python**
   ```python
   from dotenv import load_dotenv
   load_dotenv()

   import os
   bing_key = os.getenv('BING_API_KEY')
   ```

3. **Never Commit Keys**
   - Add `.env` to `.gitignore`
   - Use GitHub Secrets for CI/CD
   - Rotate keys if exposed

---

## 📈 Cost Optimization

### Free Tier Maximization:

**Strategy 1: Priority-Based**
1. Use Bing for top 1,000 lounges (high-traffic airports)
2. Use Pexels for remaining lounges
3. Manually curate top 100 lounges

**Strategy 2: Round-Robin**
1. Bing: Every 3rd lounge (1,000 lounges/month)
2. Pexels: Every 3rd lounge (unlimited)
3. Unsplash: Every 3rd lounge (1,500/month @ 50/hour)

**Strategy 3: Geo-Based**
1. North America: Bing (best coverage)
2. Europe: Unsplash (good quality)
3. Asia/Other: Pexels (generic)

---

## 🛠️ Troubleshooting

### "No API keys configured"
```bash
# Check if environment variables are set
echo $BING_API_KEY
echo $PEXELS_API_KEY

# If empty, set them:
export BING_API_KEY="your-key"
```

### "Rate limit exceeded"
- Bing: Wait until next month or upgrade to paid tier
- Pexels: No rate limits
- Unsplash: Wait 1 hour

### "No images found"
- Check lounge name spelling
- Try broader search query
- Use generic "airport lounge interior" query

### "API key invalid"
- Verify key is correct (no extra spaces)
- Check API is enabled in dashboard
- Regenerate key if needed

---

## 📝 Attribution Requirements

### Bing
- No attribution required

### Pexels
- Preferred: "Photo by [Photographer] on Pexels"
- Add to image alt text or caption
- Example: `<img alt="Lounge interior - Photo by John Doe on Pexels">`

### Unsplash
- Required: Link to photographer & Unsplash
- Example: "Photo by [Photographer](link) on [Unsplash](https://unsplash.com)"

---

## 🎯 Next Steps

After scraping images:

1. **Review Results**
   ```bash
   # Check output CSV
   head master_lounges_with_images.csv
   ```

2. **Upload to CDN**
   - Cloudflare R2 (free tier: 10GB)
   - AWS S3 (free tier: 5GB)
   - Supabase Storage (free tier: 1GB)

3. **Optimize Images**
   - Resize to 1200x800
   - Compress (TinyPNG, Sharp)
   - Convert to WebP

4. **Update Database**
   ```bash
   python3 import_to_supabase.py
   ```

---

## 💡 Pro Tips

1. **Test First**: Always test with 10-20 lounges before full run
2. **Cache Results**: Script caches to avoid duplicate API calls
3. **Delay Between Calls**: 1-second delay prevents rate limiting
4. **Monitor Usage**: Check API dashboards regularly
5. **Rotate Keys**: Use multiple Bing accounts if needed

---

## 🔗 Resources

- [Bing Search API Docs](https://docs.microsoft.com/en-us/bing/search-apis/)
- [Pexels API Docs](https://www.pexels.com/api/documentation/)
- [Unsplash API Docs](https://unsplash.com/documentation)
- [Azure Free Account](https://azure.microsoft.com/free/)

---

## ✅ Checklist

- [ ] Created Azure account
- [ ] Got Bing API key (F1 Free tier)
- [ ] Got Pexels API key
- [ ] Got Unsplash API key
- [ ] Set environment variables
- [ ] Tested with 10 lounges
- [ ] Reviewed image quality
- [ ] Ready for full run

---

*Last Updated: November 22, 2025*
