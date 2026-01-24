import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Affiliate Disclosure | TakeYourLounge",
  description: "TakeYourLounge Affiliate Disclosure - Learn about our affiliate partnerships and how we earn revenue.",
  alternates: {
    canonical: 'https://takeyourlounge.com/affiliate-disclosure',
  },
  openGraph: {
    title: "Affiliate Disclosure - TakeYourLounge",
    description: "Our commitment to transparency about affiliate partnerships.",
    type: "website",
    url: "https://takeyourlounge.com/affiliate-disclosure",
  },
};

export default function AffiliateDisclosurePage() {
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
            Affiliate Disclosure
          </h1>
          <p className="text-lg text-gray-600">
            Last updated: January 2026
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-white py-12">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <div className="space-y-8">
              {/* Company Info */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 leading-relaxed">
                  TakeYourLounge.com is operated by <strong>Tech Sync Analytica LLC</strong>,
                  a company registered in New Mexico, USA.
                </p>
              </div>

              {/* How We Earn Revenue */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Earn Revenue</h2>
                <p className="text-gray-700 leading-relaxed">
                  Some links on this website are affiliate links. This means we may earn a
                  commission if you make a purchase or sign up for a service through these
                  links. <strong>This comes at no additional cost to you.</strong>
                </p>
              </div>

              {/* Types of Affiliate Links */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Types of Services We May Link To</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We may include affiliate links to companies that provide airport lounge access
                  and related travel services. These may include:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Lounge membership programs (such as Priority Pass, DragonPass)</li>
                  <li>Day pass booking services</li>
                  <li>Travel credit cards with lounge benefits</li>
                  <li>Other travel-related services</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4 text-sm italic">
                  Note: Mention of any company name does not imply a formal partnership.
                  We only earn commissions through approved affiliate programs.
                </p>
              </div>

              {/* Editorial Independence */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Editorial Independence</h2>
                <p className="text-gray-700 leading-relaxed">
                  Our lounge ratings, reviews, and recommendations are based on publicly
                  available information and user feedback. <strong>Affiliate relationships
                  do not influence our editorial content or rankings.</strong>
                </p>
              </div>

              {/* Identification of Affiliate Links */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Identification of Affiliate Links</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Affiliate links on our site:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>May be marked with text such as "View options" or "Check availability"</li>
                  <li>Include the <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">rel="sponsored"</code> attribute</li>
                  <li>Are disclosed within the content where they appear</li>
                </ul>
              </div>

              {/* Your Choice */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Choice</h2>
                <p className="text-gray-700 leading-relaxed">
                  You are never obligated to use our affiliate links. You may independently
                  search for any product or service we mention.
                </p>
              </div>

              {/* Questions */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions</h2>
                <p className="text-gray-700 leading-relaxed">
                  For questions about this disclosure, contact us at:{' '}
                  <a href="mailto:info@tsynca.com" className="text-brand-600 hover:underline">
                    info@tsynca.com
                  </a>
                </p>
              </div>

              {/* FTC Compliance */}
              <div className="border-t pt-8 mt-8">
                <p className="text-gray-500 text-sm italic">
                  This disclosure is made in compliance with the Federal Trade Commission's
                  guidelines on affiliate marketing (16 CFR Part 255).
                </p>
                <p className="text-gray-500 text-sm italic mt-4">
                  <strong>This disclosure applies to all pages on takeyourlounge.com.</strong>
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
                <li><Link href="/affiliate-disclosure" className="text-white font-medium">Affiliate Disclosure</Link></li>
                <li><Link href="/how-we-make-money" className="hover:text-white">How We Make Money</Link></li>
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
