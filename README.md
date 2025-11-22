# TakeYourLounge.com - Lounge Database & Platform

**Global Airport Lounge Discovery & Networking Platform**

---

## 🎯 Project Overview

TakeYourLounge.com is a comprehensive platform combining:
- **Web Platform**: SEO-optimized lounge directory, airport guides, and travel insights
- **Mobile App (LoungeConnect)**: Real-time networking for travelers at airport lounges

---

## 📊 Current Database Statistics

✅ **3,032 unique airport lounges worldwide**
- 🌍 21 countries
- 🏙️ 648 cities
- ✈️ 703 airports
- 🎫 3,000+ Priority Pass accessible lounges

### Lounge Types:
- **Independent**: 2,972 lounges
- **Operator**: 29 lounges (Plaza Premium, TAV, etc.)
- **Centurion**: 21 Amex Centurion Lounges
- **Partner**: 10 DreamFolks partner lounges

### Access Methods:
- Priority Pass (3,001)
- Day Pass (1,486)
- American Express Platinum (21)
- Plaza Premium (19)
- DreamFolks (10)
- TAV Passport (10)

---

## 🗂️ Files Structure

```
TAKE_YOUR_LOUNGE/
├── 📁 Source Data (CSV)
│   ├── prioritypass_lounges.csv        (1,486 lounges)
│   ├── supabase_lounges.csv            (1,486 lounges - normalized)
│   ├── amex_global_lounges_sample.csv  (21 Centurion lounges)
│   ├── dreamfolks_lounges_sample.csv   (12 partner lounges)
│   ├── plaza_premium_lounges_sample.csv (22 operator lounges)
│   └── TAV_Lounges__preview_.csv       (15 TAV lounges)
│
├── 🔧 Processing Scripts
│   ├── merge_lounges.py                 (CSV merger & consolidator)
│   └── import_to_supabase.py           (Database importer)
│
├── 📦 Output Files
│   ├── master_lounges.csv              (1.2MB - unified lounge database)
│   └── master_lounges.json             (2.7MB - JSON format)
│
├── 🗄️ Database Schema
│   └── database_migration.sql          (PostgreSQL/Supabase schema)
│
└── 📖 Documentation
    └── README.md                        (This file)
```

---

## 🚀 Quick Start

### Step 1: Merge CSV Data

```bash
python3 merge_lounges.py
```

**Output:**
- `master_lounges.csv` - Unified CSV database
- `master_lounges.json` - JSON format with metadata

**What it does:**
- ✅ Combines 6 data sources
- ✅ Removes duplicates (10 merged)
- ✅ Normalizes data structure
- ✅ Generates unique IDs
- ✅ Merges amenities & access methods

### Step 2: Setup Database

**Option A: Supabase (Recommended)**

1. Create a Supabase project at [supabase.com](https://supabase.com)

2. Run the migration script in Supabase SQL Editor:
```sql
-- Copy contents of database_migration.sql
-- Paste and execute in Supabase SQL editor
```

3. Set environment variables:
```bash
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_KEY="your-service-role-key"
```

4. Import data:
```bash
pip3 install supabase
python3 import_to_supabase.py
```

**Option B: Local PostgreSQL**

```bash
# Create database
createdb takeyourlounge

# Run migration
psql takeyourlounge < database_migration.sql

# Modify import script to use local PostgreSQL
# (Update connection string in import_to_supabase.py)
```

---

## 📐 Database Schema

### Core Tables

#### 1. **lounges** (Main table)
- `id` - Unique lounge identifier
- `name` - Lounge name
- `airport_code` - IATA airport code
- `city`, `country` - Location
- `terminal`, `location` - Detailed position
- `amenities` - JSONB array (Wi-Fi, food, showers, etc.)
- `access_methods` - JSONB array (Priority Pass, cards, etc.)
- `lounge_type` - Type (independent/operator/centurion/partner)
- `rating` - Average rating (0-5)
- `review_count` - Total reviews
- `images` - JSONB array of image URLs

#### 2. **airports**
- Airport reference data
- Aggregated lounge counts
- Timezone & coordinates

#### 3. **reviews**
- User-generated reviews
- Multi-dimensional scoring (cleanliness, food, quietness, workspace)
- AI analysis support

#### 4. **lounge_checkins** (LoungeConnect)
- Real-time user check-ins
- Network availability status
- Check-in/check-out tracking

#### 5. **network_connections** (LoungeConnect)
- User networking matches
- Connection status tracking

#### 6. **blog_posts**
- Airport guides
- Lounge insights
- Travel tips

### Views & Functions

- `lounge_summary` - Aggregated lounge data with reviews
- `airport_summary` - Airport-level statistics
- Auto-updating triggers for ratings & counts
- Row-level security (RLS) for multi-tenant access

---

## 🎨 Data Model

```python
Lounge {
    id: str                    # "ist_primeclass_domestic"
    name: str                  # "Primeclass Lounge"
    airport_code: str          # "IST"
    airport_name: str          # "Istanbul Airport"
    city: str                  # "Istanbul"
    country: str               # "Turkey"
    terminal: str              # "Domestic Terminal"
    location: str              # "Airside, 2nd Floor, Gate D3"
    open_hours: str            # "05:00 - 23:00 daily"
    amenities: [str]           # ["Free Wi-Fi", "Hot Food", "Showers"]
    access_methods: [str]      # ["Priority Pass", "TAV Passport"]
    lounge_type: str           # "operator"
    description: str
    conditions: str            # "Maximum 3 hour stay"
    rating: float              # 4.5
    review_count: int          # 234
    max_capacity: int          # 100
    images: [str]              # ["https://...jpg"]
    source: str                # "PriorityPass"
}
```

---

## 🔄 Next Steps

### Phase 1: Data Infrastructure ✅ COMPLETE
- [x] CSV merger script
- [x] Master database (3,032 lounges)
- [x] PostgreSQL/Supabase schema
- [x] Data import tools

### Phase 2: Image Scraping ✅ READY
- [x] Multi-source image scraper (Bing, Pexels, Unsplash)
- [x] Free API integration (1,000+ images/month free)
- [x] Automated scraping pipeline
- [x] Setup guide with API key instructions
- [ ] Image optimization & CDN upload (next step)

### Phase 3: Web Platform
- [ ] Next.js + Tailwind CSS setup
- [ ] SEO-optimized lounge pages
- [ ] Airport guide generator
- [ ] Blog system

### Phase 4: Smart Features
- [ ] AI lounge review system
- [ ] Lounge finder tool
- [ ] Card eligibility checker
- [ ] Network heatmap

### Phase 5: Mobile App (LoungeConnect)
- [ ] React Native app
- [ ] Real-time check-ins
- [ ] User networking
- [ ] Push notifications

---

## 🛠️ Tech Stack

**Current (Phase 1):**
- Python 3.x
- PostgreSQL / Supabase
- CSV/JSON data processing

**Planned:**
- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Mobile**: React Native / Expo
- **AI/ML**: OpenAI GPT-4 (content), Computer Vision (image analysis)
- **Search**: PostgreSQL full-text search / Algolia
- **CDN**: Cloudflare R2 (images)
- **Hosting**: Vercel (web), Supabase (backend)

---

## 📈 SEO Strategy

### Target Keywords:
- "airport lounge {city}"
- "best lounges {airport code}"
- "Priority Pass lounges {location}"
- "{airport} lounge access"
- "business class lounge {airline}"

### Content Types:
1. **Lounge Directory** - 3,000+ indexed pages
2. **Airport Guides** - "Ultimate Guide to IST Airport Lounges"
3. **Comparison Pages** - "DXB vs DOH Lounges"
4. **How-to Guides** - "Get Free Lounge Access with Credit Cards"
5. **Travel Insights** - "Best Lounges for Digital Nomads"

---

## 💰 Monetization

1. **Affiliate Revenue**
   - Priority Pass sign-ups
   - Credit card referrals
   - Lounge booking commissions

2. **Premium Features**
   - LoungeConnect subscription
   - Enhanced visibility for lounges
   - Business traveler tools

3. **B2B Services**
   - Airport analytics
   - Lounge operator insights
   - Corporate travel tools

4. **Advertising**
   - Lounge operators
   - Credit card companies
   - Travel brands

---

## 🔐 Security & Privacy

- ✅ Row-level security (RLS) enabled
- ✅ JWT-based authentication (Supabase Auth)
- ✅ API rate limiting
- ✅ Data encryption at rest
- ✅ GDPR-compliant user data handling

---

## 📞 Support

For questions or issues:
- 📧 Email: support@takeyourlounge.com
- 🐛 Issues: GitHub Issues
- 📖 Docs: [Documentation](https://docs.takeyourlounge.com)

---

## 📄 License

Proprietary - All Rights Reserved
© 2025 TakeYourLounge.com

---

## 🙏 Data Sources

- Priority Pass Lounge Directory
- American Express Global Lounge Collection
- Plaza Premium Lounge Network
- DreamFolks Partner List
- TAV Airports Lounges

*Last Updated: November 22, 2025*
