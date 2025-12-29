import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Travel Guides | TakeYourLounge",
  description: "Expert travel guides, airport lounge tips, and insider insights to enhance your travel experience.",
  openGraph: {
    title: "Travel Guides - Airport Lounge Tips & Insights",
    description: "Discover expert tips for maximizing your airport lounge experience worldwide.",
    type: "website",
    url: "https://takeyourlounge.com/blog",
  },
};

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  emoji: string;
}

const blogPosts: BlogPost[] = [
  {
    id: "maximizing-priority-pass",
    title: "Maximizing Your Priority Pass Membership",
    excerpt: "Learn how to get the most value from your Priority Pass membership, including hidden benefits, partner lounges, and pro tips for frequent travelers.",
    category: "Access Cards",
    readTime: "5 min read",
    emoji: "🎫"
  },
  {
    id: "best-lounges-business-travelers",
    title: "Top 10 Airport Lounges for Business Travelers",
    excerpt: "Discover the world's best airport lounges equipped with high-speed Wi-Fi, private workspaces, meeting rooms, and business-class amenities.",
    category: "Business Travel",
    readTime: "7 min read",
    emoji: "💼"
  },
  {
    id: "lounge-access-credit-cards",
    title: "Ultimate Guide to Lounge Access Credit Cards",
    excerpt: "Compare the best credit cards offering airport lounge access. From American Express Platinum to Chase Sapphire Reserve - find the perfect card for your travel style.",
    category: "Access Cards",
    readTime: "10 min read",
    emoji: "💳"
  },
  {
    id: "family-friendly-lounges",
    title: "Best Family-Friendly Airport Lounges Worldwide",
    excerpt: "Traveling with kids? Discover lounges with play areas, family rooms, kid-friendly menus, and amenities that make family travel stress-free.",
    category: "Family Travel",
    readTime: "6 min read",
    emoji: "👨‍👩‍👧‍👦"
  },
  {
    id: "airport-lounge-etiquette",
    title: "Airport Lounge Etiquette: Do's and Don'ts",
    excerpt: "Master the unwritten rules of airport lounges. Learn proper etiquette for phone calls, seating, food buffets, and making the most of your lounge experience.",
    category: "Tips & Tricks",
    readTime: "4 min read",
    emoji: "🤝"
  },
  {
    id: "long-haul-flight-preparation",
    title: "Preparing for Long-Haul Flights: Lounge Edition",
    excerpt: "Essential tips for using airport lounges before long international flights. From shower facilities to sleep zones and wellness amenities.",
    category: "Tips & Tricks",
    readTime: "8 min read",
    emoji: "✈️"
  },
  {
    id: "premium-lounge-amenities",
    title: "Hidden Gems: Premium Lounge Amenities You Didn't Know Existed",
    excerpt: "Explore unique amenities found in luxury airport lounges - from spa treatments and sleeping pods to chef-prepared meals and wine cellars.",
    category: "Luxury Travel",
    readTime: "6 min read",
    emoji: "💎"
  },
  {
    id: "digital-nomad-lounges",
    title: "Best Airport Lounges for Digital Nomads",
    excerpt: "Remote work meets travel. Find lounges with reliable Wi-Fi, power outlets, quiet zones, and ergonomic workspaces perfect for getting work done.",
    category: "Digital Nomads",
    readTime: "7 min read",
    emoji: "💻"
  },
  {
    id: "lounge-access-comparison",
    title: "Priority Pass vs. Lounge Club vs. DragonPass: Complete Comparison",
    excerpt: "A comprehensive comparison of the world's top lounge access programs. Coverage, pricing, partner networks, and which one is right for you.",
    category: "Access Cards",
    readTime: "12 min read",
    emoji: "📊"
  },
  {
    id: "seasonal-travel-tips",
    title: "Airport Lounge Strategies for Peak Travel Seasons",
    excerpt: "Navigate crowded holidays and peak seasons like a pro. Tips for accessing lounges during busy times, alternative options, and booking strategies.",
    category: "Tips & Tricks",
    readTime: "5 min read",
    emoji: "🎄"
  },
  {
    id: "wellness-lounges",
    title: "Airport Wellness Lounges: Spa, Yoga, and Relaxation Spaces",
    excerpt: "Discover airport lounges focused on health and wellness. Featuring yoga rooms, meditation spaces, spa services, and healthy dining options.",
    category: "Wellness",
    readTime: "6 min read",
    emoji: "🧘"
  },
  {
    id: "connecting-flights-lounges",
    title: "Making the Most of Layovers: Lounge Access Guide",
    excerpt: "Turn long layovers into productive or relaxing experiences. Learn about same-day lounge access, shower facilities, and maximizing connection time.",
    category: "Tips & Tricks",
    readTime: "8 min read",
    emoji: "⏰"
  }
];

const categories = ["All", "Access Cards", "Business Travel", "Tips & Tricks", "Family Travel", "Luxury Travel", "Digital Nomads", "Wellness"];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white">
      {/* Navigation */}
      <header className="container-custom pt-8 pb-6">
        <nav className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-brand-700">
            TakeYourLounge
          </Link>
          <div className="space-x-6">
            <Link href="/lounges" className="text-gray-700 hover:text-brand-600">
              Lounges
            </Link>
            <Link href="/airports" className="text-gray-700 hover:text-brand-600">
              Airports
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-brand-600">
              About
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container-custom py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Travel <span className="text-brand-600">Guides</span>
          </h1>
          <p className="text-xl text-gray-600">
            Expert insights, tips, and guides to enhance your airport lounge experience
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="container-custom pb-8">
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                category === "All"
                  ? "bg-brand-600 text-white"
                  : "bg-white text-gray-700 hover:bg-brand-50 border border-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="card hover:shadow-xl transition-shadow cursor-pointer group"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-3xl">{post.emoji}</span>
                <span className="text-sm text-brand-600 font-medium">{post.category}</span>
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-brand-600 transition-colors">
                {post.title}
              </h2>

              <p className="text-gray-600 mb-4 line-clamp-3">
                {post.excerpt}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{post.readTime}</span>
                <span className="text-brand-600 font-medium group-hover:underline">
                  Coming Soon →
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Coming Soon Notice */}
      <section className="container-custom py-16">
        <div className="bg-gradient-to-r from-brand-600 to-brand-700 rounded-xl p-8 md:p-12 text-center text-white">
          <div className="text-4xl mb-4">📝✨</div>
          <h2 className="text-3xl font-bold mb-4">
            More Content Coming Soon!
          </h2>
          <p className="text-xl text-brand-100 mb-6 max-w-2xl mx-auto">
            We're currently working on creating in-depth travel guides and expert articles.
            These guides will be published soon to help you make the most of your airport lounge experience.
          </p>
          <p className="text-brand-100">
            Have a topic you'd like us to cover?{' '}
            <a href="mailto:info@tsynca.com" className="underline hover:text-white">
              Let us know!
            </a>
          </p>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="bg-white py-16">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Stay Updated
            </h2>
            <p className="text-gray-600 mb-6">
              Get notified when we publish new travel guides and airport lounge insights
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 flex-1 max-w-md"
                disabled
              />
              <button
                className="btn-primary px-8 py-3 opacity-50 cursor-not-allowed"
                disabled
              >
                Coming Soon
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-white font-bold text-xl mb-4">TakeYourLounge</div>
              <p className="text-sm">
                Your global airport lounge directory and networking platform.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Explore</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/lounges" className="hover:text-white">All Lounges</Link></li>
                <li><Link href="/airports" className="hover:text-white">Airports</Link></li>
                <li><Link href="/blog" className="hover:text-white">Travel Guides</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                <li><a href="mailto:info@tsynca.com" className="hover:text-white">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="https://www.linkedin.com/company/tech-sync-analytica-llc/?viewAsMember=true" target="_blank" rel="noopener noreferrer" className="hover:text-white">LinkedIn</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2025 TakeYourLounge. All rights reserved.</p>
            <p className="mt-2">
              Developed by{' '}
              <a
                href="https://techsyncanalytica.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-400 hover:text-brand-300 font-medium"
              >
                Tech Sync Analytica LLC
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
