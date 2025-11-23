import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white">
      {/* Hero Section */}
      <header className="container-custom pt-16 pb-20">
        <nav className="flex justify-between items-center mb-16">
          <div className="text-2xl font-bold text-brand-700">
            TakeYourLounge
          </div>
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

        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Discover <span className="text-brand-600">Airport Lounges</span>
            <br />
            Worldwide
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Browse 2,272 premium lounges across 703 airports in 175 countries.
            <br />
            Find your perfect travel sanctuary.
          </p>

          <div className="flex gap-4 justify-center">
            <Link href="/lounges" className="btn-primary text-lg px-8 py-3">
              Explore Lounges
            </Link>
            <Link href="/airports" className="btn-secondary text-lg px-8 py-3">
              Browse Airports
            </Link>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-brand-600 mb-2">2,272</div>
              <div className="text-gray-600">Airport Lounges</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-brand-600 mb-2">703</div>
              <div className="text-gray-600">Airports</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-brand-600 mb-2">799</div>
              <div className="text-gray-600">Cities</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-brand-600 mb-2">175</div>
              <div className="text-gray-600">Countries</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose TakeYourLounge?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card">
              <div className="text-brand-600 text-4xl mb-4">🗺️</div>
              <h3 className="text-xl font-semibold mb-2">Global Coverage</h3>
              <p className="text-gray-600">
                Access to lounges worldwide with detailed location information,
                coordinates, and directions.
              </p>
            </div>

            <div className="card">
              <div className="text-brand-600 text-4xl mb-4">🎫</div>
              <h3 className="text-xl font-semibold mb-2">Access Methods</h3>
              <p className="text-gray-600">
                Priority Pass, Amex Centurion, Plaza Premium, and more.
                Find lounges that match your membership.
              </p>
            </div>

            <div className="card">
              <div className="text-brand-600 text-4xl mb-4">⭐</div>
              <h3 className="text-xl font-semibold mb-2">Reviews & Ratings</h3>
              <p className="text-gray-600">
                Real traveler reviews with detailed scores for cleanliness,
                food, quietness, and workspace quality.
              </p>
            </div>

            <div className="card">
              <div className="text-brand-600 text-4xl mb-4">📱</div>
              <h3 className="text-xl font-semibold mb-2">LoungeConnect</h3>
              <p className="text-gray-600">
                Network with fellow travelers in real-time. Connect with
                professionals at airport lounges.
              </p>
            </div>

            <div className="card">
              <div className="text-brand-600 text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">Smart Search</h3>
              <p className="text-gray-600">
                Filter by amenities, access methods, ratings, and location.
                Find your ideal lounge instantly.
              </p>
            </div>

            <div className="card">
              <div className="text-brand-600 text-4xl mb-4">💡</div>
              <h3 className="text-xl font-semibold mb-2">Travel Insights</h3>
              <p className="text-gray-600">
                Airport guides, lounge comparisons, and expert tips for
                maximizing your travel experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-brand-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Elevate Your Travel?
          </h2>
          <p className="text-xl mb-8 text-brand-100">
            Join thousands of travelers discovering the best airport lounges worldwide
          </p>
          <Link href="/lounges" className="inline-block bg-white text-brand-600 hover:bg-brand-50 font-semibold px-8 py-3 rounded-lg transition-colors">
            Start Exploring
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
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="https://github.com/teyfikoz/TakeYourLounge" className="hover:text-white">GitHub</a></li>
                <li><a href="#" className="hover:text-white">Twitter</a></li>
                <li><a href="#" className="hover:text-white">LinkedIn</a></li>
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
