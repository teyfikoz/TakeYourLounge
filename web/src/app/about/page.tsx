import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "About Us | TakeYourLounge",
  description: "Learn about TakeYourLounge and Tech Sync Analytica LLC - developing smart automation and travel technology solutions.",
  openGraph: {
    title: "About TakeYourLounge - Travel Technology Solutions",
    description: "Discover how Tech Sync Analytica LLC is revolutionizing airport lounge discovery and travel networking.",
    type: "website",
    url: "https://takeyourlounge.com/about",
  },
};

export default function AboutPage() {
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
            <Link href="/about" className="text-brand-600 font-semibold">
              About
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container-custom py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            About <span className="text-brand-600">TakeYourLounge</span>
          </h1>
          <p className="text-xl text-gray-600">
            Transforming the way travelers discover and experience airport lounges worldwide
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-white py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {/* Our Mission */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-700 mb-4">
                TakeYourLounge is your comprehensive guide to airport lounges around the globe.
                We believe that every traveler deserves access to comfort, convenience, and quality
                service during their journey. Our platform connects you with over 2,000 premium
                airport lounges across 175 countries, making it easier than ever to find your perfect
                travel sanctuary.
              </p>
              <p className="text-lg text-gray-700">
                Whether you're a frequent business traveler or an occasional vacationer,
                TakeYourLounge helps you discover lounges that match your needs, access methods,
                and preferences.
              </p>
            </div>

            {/* What We Offer */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">What We Offer</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card">
                  <div className="text-brand-600 text-3xl mb-3">🌍</div>
                  <h3 className="text-xl font-semibold mb-2">Global Lounge Directory</h3>
                  <p className="text-gray-600">
                    Access detailed information about 2,272 airport lounges worldwide, including
                    amenities, access methods, and locations.
                  </p>
                </div>

                <div className="card">
                  <div className="text-brand-600 text-3xl mb-3">⭐</div>
                  <h3 className="text-xl font-semibold mb-2">Real Reviews & Ratings</h3>
                  <p className="text-gray-600">
                    Read authentic traveler reviews with detailed ratings for cleanliness,
                    food quality, quietness, and workspace facilities.
                  </p>
                </div>

                <div className="card">
                  <div className="text-brand-600 text-3xl mb-3">🔍</div>
                  <h3 className="text-xl font-semibold mb-2">Smart Search & Filters</h3>
                  <p className="text-gray-600">
                    Find lounges by airport, city, country, access method, or specific amenities
                    that matter most to you.
                  </p>
                </div>

                <div className="card">
                  <div className="text-brand-600 text-3xl mb-3">📱</div>
                  <h3 className="text-xl font-semibold mb-2">LoungeConnect (Coming Soon)</h3>
                  <p className="text-gray-600">
                    Our upcoming mobile app will revolutionize airport networking, allowing you to
                    connect with fellow travelers and professionals in real-time.
                  </p>
                </div>
              </div>
            </div>

            {/* About Tech Sync Analytica */}
            <div className="bg-gradient-to-r from-brand-50 to-brand-100 rounded-xl p-8 md:p-12 mb-16">
              <div className="max-w-3xl">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Developed by Tech Sync Analytica LLC
                </h2>
                <p className="text-lg text-gray-800 mb-4">
                  <strong>Based in New Mexico, United States</strong>
                </p>
                <p className="text-lg text-gray-700 mb-4">
                  Tech Sync Analytica LLC specializes in creating intelligent automation platforms
                  and cutting-edge travel technology solutions. Our mission is to simplify complex
                  travel experiences through innovative software that puts the traveler first.
                </p>
                <p className="text-lg text-gray-700 mb-6">
                  We are committed to building products that enhance connectivity, streamline processes,
                  and deliver seamless experiences for modern travelers worldwide. From airport lounge
                  discovery to real-time networking tools, we're shaping the future of travel technology.
                </p>
                <a
                  href="https://techsyncanalytica.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-brand-600 text-white hover:bg-brand-700 font-semibold px-6 py-3 rounded-lg transition-colors"
                >
                  Visit Tech Sync Analytica
                </a>
              </div>
            </div>

            {/* Coming Soon */}
            <div className="bg-gray-50 rounded-xl p-8 md:p-12 text-center">
              <div className="text-brand-600 text-5xl mb-4">📱✨</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                LoungeConnect Mobile App
              </h2>
              <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
                We're excited to announce that <strong>LoungeConnect</strong>, our dedicated mobile
                application, will be launching soon! Connect with fellow travelers, share experiences,
                and network with professionals at airport lounges around the world - all from the palm
                of your hand.
              </p>
              <p className="text-gray-600">
                Stay tuned for updates on our launch date and exclusive early access opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-brand-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">
            Start Exploring Airport Lounges Today
          </h2>
          <p className="text-xl mb-8 text-brand-100">
            Discover your perfect travel sanctuary from our global directory
          </p>
          <Link href="/lounges" className="inline-block bg-white text-brand-600 hover:bg-brand-50 font-semibold px-8 py-3 rounded-lg transition-colors">
            Explore Lounges
          </Link>
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
