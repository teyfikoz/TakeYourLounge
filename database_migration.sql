-- TakeYourLounge Database Schema
-- PostgreSQL / Supabase Migration Script
-- Version: 1.0

-- ============================================================
-- EXTENSIONS
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable PostGIS for geolocation features (optional)
-- CREATE EXTENSION IF NOT EXISTS postgis;

-- ============================================================
-- TABLES
-- ============================================================

-- 1. LOUNGES TABLE (Core)
-- ============================================================
CREATE TABLE IF NOT EXISTS lounges (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    airport_code TEXT NOT NULL,
    airport_name TEXT,
    city TEXT,
    country TEXT,
    terminal TEXT,
    location TEXT,
    open_hours TEXT,
    amenities JSONB DEFAULT '[]'::jsonb,
    access_methods JSONB DEFAULT '[]'::jsonb,
    lounge_type TEXT DEFAULT 'independent',
    description TEXT,
    conditions TEXT,
    rating DECIMAL(2,1) DEFAULT 0.0,
    review_count INTEGER DEFAULT 0,
    max_capacity INTEGER DEFAULT 50,
    current_occupancy INTEGER DEFAULT 0,
    coordinates TEXT,
    images JSONB DEFAULT '[]'::jsonb,
    source TEXT DEFAULT 'unknown',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. AIRPORTS TABLE (Reference data)
-- ============================================================
CREATE TABLE IF NOT EXISTS airports (
    airport_code TEXT PRIMARY KEY,
    airport_name TEXT NOT NULL,
    city TEXT NOT NULL,
    country TEXT NOT NULL,
    timezone TEXT,
    coordinates TEXT,
    total_lounges INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. REVIEWS TABLE (User-generated content)
-- ============================================================
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lounge_id TEXT NOT NULL REFERENCES lounges(id) ON DELETE CASCADE,
    user_id UUID,  -- Will be linked to Supabase auth
    rating DECIMAL(2,1) NOT NULL CHECK (rating >= 0 AND rating <= 5),
    title TEXT,
    comment TEXT,
    cleanliness_score INTEGER CHECK (cleanliness_score >= 1 AND cleanliness_score <= 5),
    food_quality_score INTEGER CHECK (food_quality_score >= 1 AND food_quality_score <= 5),
    quietness_score INTEGER CHECK (quietness_score >= 1 AND quietness_score <= 5),
    workspace_score INTEGER CHECK (workspace_score >= 1 AND workspace_score <= 5),
    visit_date DATE,
    helpful_count INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. REVIEW IMAGES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS review_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    ai_analysis JSONB,  -- AI-detected features (cleanliness, crowd, etc.)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. USER FAVORITES TABLE (LoungeConnect integration)
-- ============================================================
CREATE TABLE IF NOT EXISTS user_favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,  -- Supabase auth user
    lounge_id TEXT NOT NULL REFERENCES lounges(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, lounge_id)
);

-- 6. LOUNGE CHECK-INS (LoungeConnect networking)
-- ============================================================
CREATE TABLE IF NOT EXISTS lounge_checkins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,  -- Supabase auth user
    lounge_id TEXT NOT NULL REFERENCES lounges(id) ON DELETE CASCADE,
    check_in_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    check_out_time TIMESTAMP WITH TIME ZONE,
    is_looking_to_network BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'active',  -- active, checked_out
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. NETWORK CONNECTIONS (LoungeConnect matches)
-- ============================================================
CREATE TABLE IF NOT EXISTS network_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id_1 UUID NOT NULL,
    user_id_2 UUID NOT NULL,
    lounge_id TEXT NOT NULL REFERENCES lounges(id),
    connection_type TEXT DEFAULT 'lounge_match',  -- lounge_match, mutual_interest
    status TEXT DEFAULT 'pending',  -- pending, accepted, declined
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. BLOG POSTS (Airport guides, insights)
-- ============================================================
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image TEXT,
    airport_code TEXT REFERENCES airports(airport_code),
    tags JSONB DEFAULT '[]'::jsonb,
    author_id UUID,
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================

-- Lounge indexes
CREATE INDEX idx_lounges_airport_code ON lounges(airport_code);
CREATE INDEX idx_lounges_city ON lounges(city);
CREATE INDEX idx_lounges_country ON lounges(country);
CREATE INDEX idx_lounges_lounge_type ON lounges(lounge_type);
CREATE INDEX idx_lounges_rating ON lounges(rating DESC);
CREATE INDEX idx_lounges_amenities ON lounges USING gin(amenities);
CREATE INDEX idx_lounges_access_methods ON lounges USING gin(access_methods);

-- Airport indexes
CREATE INDEX idx_airports_country ON airports(country);
CREATE INDEX idx_airports_city ON airports(city);

-- Review indexes
CREATE INDEX idx_reviews_lounge_id ON reviews(lounge_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating DESC);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);

-- Check-in indexes
CREATE INDEX idx_checkins_lounge_id ON lounge_checkins(lounge_id);
CREATE INDEX idx_checkins_user_id ON lounge_checkins(user_id);
CREATE INDEX idx_checkins_status ON lounge_checkins(status);
CREATE INDEX idx_checkins_created_at ON lounge_checkins(created_at DESC);

-- Blog indexes
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_airport_code ON blog_posts(airport_code);
CREATE INDEX idx_blog_posts_published ON blog_posts(is_published, published_at DESC);
CREATE INDEX idx_blog_posts_tags ON blog_posts USING gin(tags);

-- ============================================================
-- VIEWS
-- ============================================================

-- Lounge summary view with aggregated reviews
CREATE OR REPLACE VIEW lounge_summary AS
SELECT
    l.*,
    COALESCE(AVG(r.rating), 0) as avg_rating,
    COUNT(r.id) as total_reviews,
    COUNT(DISTINCT uc.user_id) as current_visitors
FROM lounges l
LEFT JOIN reviews r ON l.id = r.lounge_id
LEFT JOIN lounge_checkins uc ON l.id = uc.lounge_id AND uc.status = 'active'
GROUP BY l.id;

-- Airport summary view
CREATE OR REPLACE VIEW airport_summary AS
SELECT
    a.*,
    COUNT(l.id) as lounge_count,
    AVG(l.rating) as avg_rating
FROM airports a
LEFT JOIN lounges l ON a.airport_code = l.airport_code
GROUP BY a.airport_code;

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Function: Update lounge rating when new review is added
CREATE OR REPLACE FUNCTION update_lounge_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE lounges
    SET
        rating = (
            SELECT AVG(rating)
            FROM reviews
            WHERE lounge_id = NEW.lounge_id
        ),
        review_count = (
            SELECT COUNT(*)
            FROM reviews
            WHERE lounge_id = NEW.lounge_id
        ),
        updated_at = NOW()
    WHERE id = NEW.lounge_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-update lounge rating
CREATE TRIGGER trigger_update_lounge_rating
AFTER INSERT OR UPDATE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_lounge_rating();

-- Function: Update airport lounge count
CREATE OR REPLACE FUNCTION update_airport_lounge_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE airports
        SET total_lounges = total_lounges + 1
        WHERE airport_code = NEW.airport_code;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE airports
        SET total_lounges = total_lounges - 1
        WHERE airport_code = OLD.airport_code;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-update airport lounge count
CREATE TRIGGER trigger_update_airport_lounge_count
AFTER INSERT OR DELETE ON lounges
FOR EACH ROW
EXECUTE FUNCTION update_airport_lounge_count();

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-update updated_at for lounges
CREATE TRIGGER trigger_update_lounges_timestamp
BEFORE UPDATE ON lounges
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Auto-update updated_at for blog posts
CREATE TRIGGER trigger_update_blog_posts_timestamp
BEFORE UPDATE ON blog_posts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- ROW LEVEL SECURITY (RLS) - Supabase specific
-- ============================================================

-- Enable RLS on tables
ALTER TABLE lounges ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE lounge_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE network_connections ENABLE ROW LEVEL SECURITY;

-- Lounges: Public read, admin write
CREATE POLICY "Lounges are viewable by everyone"
ON lounges FOR SELECT
USING (true);

CREATE POLICY "Lounges are editable by admins"
ON lounges FOR ALL
USING (auth.uid() IN (SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'));

-- Reviews: Users can create, read all, update/delete own
CREATE POLICY "Reviews are viewable by everyone"
ON reviews FOR SELECT
USING (true);

CREATE POLICY "Users can create reviews"
ON reviews FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
ON reviews FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews"
ON reviews FOR DELETE
USING (auth.uid() = user_id);

-- User favorites: Users can manage own favorites
CREATE POLICY "Users can view own favorites"
ON user_favorites FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own favorites"
ON user_favorites FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
ON user_favorites FOR DELETE
USING (auth.uid() = user_id);

-- Check-ins: Users can manage own check-ins
CREATE POLICY "Check-ins are viewable by everyone"
ON lounge_checkins FOR SELECT
USING (true);

CREATE POLICY "Users can create own check-ins"
ON lounge_checkins FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own check-ins"
ON lounge_checkins FOR UPDATE
USING (auth.uid() = user_id);

-- Network connections: Users can view connections involving them
CREATE POLICY "Users can view own connections"
ON network_connections FOR SELECT
USING (auth.uid() = user_id_1 OR auth.uid() = user_id_2);

CREATE POLICY "Users can create connections"
ON network_connections FOR INSERT
WITH CHECK (auth.uid() = user_id_1);

CREATE POLICY "Users can update own connections"
ON network_connections FOR UPDATE
USING (auth.uid() = user_id_1 OR auth.uid() = user_id_2);

-- ============================================================
-- SAMPLE QUERIES
-- ============================================================

-- Find all lounges at a specific airport
-- SELECT * FROM lounges WHERE airport_code = 'IST';

-- Find top-rated lounges globally
-- SELECT * FROM lounge_summary ORDER BY avg_rating DESC, total_reviews DESC LIMIT 20;

-- Find lounges with Priority Pass access in Turkey
-- SELECT * FROM lounges WHERE country = 'Turkey' AND access_methods @> '["Priority Pass"]';

-- Get current network-ready users at a lounge
-- SELECT * FROM lounge_checkins WHERE lounge_id = 'ist_primeclass' AND is_looking_to_network = true AND status = 'active';

-- Find best airport for lounge diversity
-- SELECT airport_code, airport_name, lounge_count FROM airport_summary ORDER BY lounge_count DESC LIMIT 10;

-- ============================================================
-- NOTES
-- ============================================================
-- 1. Run this script in your Supabase SQL editor or psql
-- 2. After creating tables, use the Python import script to load data
-- 3. For production, consider adding partitioning for reviews/checkins
-- 4. Add monitoring for slow queries
-- 5. Set up automated backups
-- 6. Consider adding full-text search (tsvector) for lounge names/descriptions
