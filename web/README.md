# TakeYourLounge - Web Platform

Modern Next.js web platform for discovering airport lounges worldwide.

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Hosting**: Vercel (recommended)

## 📦 Features

- ✅ SEO-optimized lounge directory
- ✅ Responsive design (mobile-first)
- ✅ Server-side rendering (SSR)
- ✅ Static site generation (SSG) for lounge pages
- ✅ Image optimization with Next.js Image
- ✅ Tailwind CSS custom design system
- [ ] Lounge search & filtering
- [ ] Airport guide pages
- [ ] Blog system
- [ ] User authentication
- [ ] Review system

## 🛠️ Development

### Prerequisites

- Node.js 18+ installed
- Supabase account (optional for local dev)

### Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env.local

   # Edit .env.local with your Supabase credentials
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open browser**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
# Create optimized production build
npm run build

# Test production build locally
npm run start
```

## 📁 Project Structure

```
web/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── layout.tsx    # Root layout
│   │   ├── page.tsx      # Homepage
│   │   ├── globals.css   # Global styles
│   │   ├── lounges/      # Lounge directory
│   │   ├── airports/     # Airport pages
│   │   └── blog/         # Blog system
│   │
│   ├── components/       # Reusable React components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── LoungeCard.tsx
│   │   └── SearchBar.tsx
│   │
│   └── lib/              # Utilities & helpers
│       ├── supabase.ts   # Supabase client
│       ├── types.ts      # TypeScript types
│       └── utils.ts      # Helper functions
│
├── public/               # Static assets
│   └── images/           # Image files
│
├── next.config.js        # Next.js configuration
├── tailwind.config.ts    # Tailwind CSS config
├── tsconfig.json         # TypeScript config
└── package.json          # Dependencies
```

## 🎨 Design System

### Colors

- **Brand**: Blue (#0284c7)
- **Primary**: Gray-900
- **Background**: White / Gray-50

### Components

- `btn-primary`: Primary button
- `btn-secondary`: Secondary button
- `card`: Card component
- `container-custom`: Container with max-width

### Typography

- **Font**: Inter (Google Fonts)
- **Headings**: Bold, 2xl-6xl
- **Body**: Regular, base-lg

## 📊 Data Integration

### Supabase Setup

1. Create Supabase project at [supabase.com](https://supabase.com)
2. Run database migration (from root):
   ```bash
   cd ..
   # Run database_migration.sql in Supabase SQL editor
   ```

3. Import lounge data:
   ```bash
   cd ..
   python3 import_to_supabase.py
   ```

### Fetching Lounges

```typescript
import { createClient } from '@/lib/supabase';

// Fetch all lounges
const { data: lounges } = await supabase
  .from('lounges')
  .select('*')
  .limit(100);

// Fetch by airport
const { data } = await supabase
  .from('lounges')
  .select('*')
  .eq('airport_code', 'IST');
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project to Vercel
3. Configure environment variables
4. Deploy!

```bash
# Or use Vercel CLI
npm i -g vercel
vercel
```

### Other Platforms

- **Netlify**: Connect GitHub repo
- **AWS Amplify**: Configure build settings
- **Cloudflare Pages**: Deploy from Git

## 📈 SEO Optimization

### Meta Tags

- Dynamic titles per page
- OpenGraph tags for social sharing
- Twitter Card meta tags
- Canonical URLs

### Sitemap

```bash
# Generate sitemap (TODO)
npm run generate-sitemap
```

### robots.txt

Already configured in `public/robots.txt`

## 🧪 Testing

```bash
# Run tests (TODO)
npm test

# Type checking
npm run type-check

# Linting
npm run lint
```

## 🔒 Environment Variables

Required variables:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key

Optional:

- `SUPABASE_SERVICE_ROLE_KEY`: For server-side operations

## 📝 TODO

- [ ] Implement lounge directory page with pagination
- [ ] Add search & filter functionality
- [ ] Create individual lounge detail pages
- [ ] Airport overview pages
- [ ] Blog system with MDX
- [ ] User authentication (Supabase Auth)
- [ ] Review submission form
- [ ] Image gallery with lightbox
- [ ] Favorites/bookmarking
- [ ] Mobile app integration (LoungeConnect)

## 🤝 Contributing

This is a private project. Contact owner for contribution guidelines.

## 📄 License

Proprietary - All Rights Reserved

---

*Built with ❤️ for travelers worldwide*
