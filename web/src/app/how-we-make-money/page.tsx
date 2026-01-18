import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "How We Make Money | TakeYourLounge",
  description: "Learn how TakeYourLounge sustains its free airport lounge directory through affiliate partnerships.",
  openGraph: {
    title: "How We Make Money - TakeYourLounge",
    description: "Our transparent approach to monetization and affiliate partnerships.",
    type: "website",
    url: "https://takeyourlounge.com/how-we-make-money",
  },
};

export default function HowWeMakeMoneyPage() {
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
      <section className="container-custom py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How TakeYourLounge Makes Money
          </h1>
          <p className="text-lg text-gray-600">
            TakeYourLounge is free to use. This page explains how we sustain our
            platform while keeping it accessible to all travelers.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-white py-12">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-12">
              {/* Affiliate Partnerships */}
              <div className="border-b pb-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 text-xl">✓</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Affiliate Partnerships</h2>
                  <span className="bg-green-100 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full">
                    Active
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  When you access a lounge through one of our partner links, we may receive
                  a commission from that partner. This includes:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-brand-600 mt-1">•</span>
                    <div>
                      <strong className="text-gray-900">Lounge membership programs</strong>
                      <p className="text-gray-600 text-sm">e.g., Priority Pass, DragonPass</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-brand-600 mt-1">•</span>
                    <div>
                      <strong className="text-gray-900">Day pass purchases</strong>
                      <p className="text-gray-600 text-sm">e.g., LoungeBuddy, Plaza Premium</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-brand-600 mt-1">•</span>
                    <div>
                      <strong className="text-gray-900">Credit cards</strong>
                      <p className="text-gray-600 text-sm">Cards with lounge access benefits</p>
                    </div>
                  </li>
                </ul>
                <div className="mt-6 bg-brand-50 p-4 rounded-lg">
                  <p className="text-gray-700 text-sm">
                    <strong>Important:</strong> You pay the same price whether you use our link
                    or not. The commission comes from the partner, not from you.
                  </p>
                </div>
              </div>

              {/* Sponsored Listings */}
              <div className="border-b pb-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400 text-xl">○</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Sponsored Listings</h2>
                  <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-full">
                    Planned
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  In the future, lounges or lounge networks may pay to be featured in specific
                  positions on our platform. Sponsored listings will always be clearly labeled.
                </p>
                <p className="text-gray-500 text-sm mt-3 italic">
                  Status: Not currently active.
                </p>
              </div>

              {/* Premium Tools */}
              <div className="border-b pb-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400 text-xl">○</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Premium Tools</h2>
                  <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-full">
                    Planned
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We are developing optional premium features for frequent travelers, such as:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Personalized lounge recommendations</li>
                  <li>Travel planning tools</li>
                  <li>Offline access</li>
                </ul>
                <p className="text-gray-500 text-sm mt-3 italic">
                  Status: Not currently active. Core features will remain free.
                </p>
              </div>

              {/* What We Don't Do */}
              <div className="bg-gray-50 p-8 rounded-xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">What We Don't Do</h2>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <span className="text-red-500 text-lg">✕</span>
                    <span className="text-gray-700">We don't sell your personal data</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-red-500 text-lg">✕</span>
                    <span className="text-gray-700">We don't display intrusive advertisements</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-red-500 text-lg">✕</span>
                    <span className="text-gray-700">We don't accept payment to alter reviews or rankings</span>
                  </li>
                </ul>
              </div>

              {/* Our Commitment */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Commitment</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Our revenue model allows us to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                  <li>Maintain data on 2,045+ lounges across 703 airports</li>
                  <li>Keep the platform free for all users</li>
                  <li>Continuously improve lounge information accuracy</li>
                </ul>
                <div className="bg-brand-50 p-6 rounded-lg">
                  <p className="text-gray-700">
                    If you find TakeYourLounge useful, using our affiliate links is the best
                    way to support our work.
                  </p>
                </div>
              </div>

              {/* Philosophy */}
              <div className="border-t pt-8">
                <p className="text-gray-600 text-center italic">
                  Our monetization model is designed to align with user decisions, not interrupt them.
                </p>
              </div>

              {/* Questions */}
              <div className="text-center">
                <p className="text-gray-700">
                  Questions? Contact us at{' '}
                  <a href="mailto:info@tsynca.com" className="text-brand-600 hover:underline">
                    info@tsynca.com
                  </a>
                </p>
              </div>
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
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
                <li><Link href="/affiliate-disclosure" className="hover:text-white">Affiliate Disclosure</Link></li>
                <li><Link href="/how-we-make-money" className="text-white font-medium">How We Make Money</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                <li><a href="mailto:info@tsynca.com" className="hover:text-white">Contact</a></li>
                <li><a href="https://www.linkedin.com/company/tech-sync-analytica-llc/?viewAsMember=true" target="_blank" rel="noopener noreferrer" className="hover:text-white">LinkedIn</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2026 TakeYourLounge. All rights reserved.</p>
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
