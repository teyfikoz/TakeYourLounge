import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Compare Lounge Access Cards | TakeYourLounge",
  description: "Compare Priority Pass, DragonPass, credit cards, and other lounge access options. Find the best way to access airport lounges worldwide.",
  alternates: {
    canonical: 'https://takeyourlounge.com/compare-lounge-access',
  },
  openGraph: {
    title: "Compare Lounge Access Cards - TakeYourLounge",
    description: "Find the best lounge access option for your travel style.",
    type: "website",
    url: "https://takeyourlounge.com/compare-lounge-access",
  },
};

const accessOptions = [
  {
    name: 'Priority Pass',
    type: 'Membership',
    lounges: '1,500+',
    price: 'From $99/year',
    bestFor: 'Frequent travelers',
    pros: ['Largest lounge network', 'Multiple membership tiers', 'Guest passes available'],
    cons: ['Can get crowded', 'Some lounges have restrictions'],
    url: '/go/priority-pass',
  },
  {
    name: 'DragonPass',
    type: 'Membership',
    lounges: '1,300+',
    price: 'From $99/year',
    bestFor: 'Asia-Pacific travelers',
    pros: ['Strong Asia coverage', 'Airport services included', 'Flexible plans'],
    cons: ['Smaller network than Priority Pass', 'Less US coverage'],
    url: '/go/dragonpass',
  },
  {
    name: 'LoungeBuddy',
    type: 'Pay-per-visit',
    lounges: '500+',
    price: 'From $25/visit',
    bestFor: 'Occasional travelers',
    pros: ['No membership required', 'Book specific lounges', 'Real-time availability'],
    cons: ['Per-visit costs add up', 'Limited lounge selection'],
    url: '/go/loungebuddy',
  },
  {
    name: 'Plaza Premium',
    type: 'Pay-per-visit',
    lounges: '250+',
    price: 'From $35/visit',
    bestFor: 'Quality-focused travelers',
    pros: ['Consistent quality', 'Online booking', 'Own lounge network'],
    cons: ['Limited to Plaza Premium lounges', 'Higher per-visit cost'],
    url: '/go/plaza-premium',
  },
  {
    name: 'Credit Card Benefits',
    type: 'Card perk',
    lounges: 'Varies',
    price: 'Included with card',
    bestFor: 'Card holders',
    pros: ['No separate membership', 'Often includes Priority Pass', 'Additional travel perks'],
    cons: ['Requires premium card', 'Annual fees apply'],
    url: '/blog',
  },
];

export default function CompareAccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white">
      {/* Navigation */}
      <header className="container-custom pt-8 pb-6">
        <nav className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <img
              src="/takeyourlounge-logo-light.svg"
              alt="TakeYourLounge"
              width={180}
              height={45}
              className="h-9 w-auto"
            />
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
            Compare Lounge Access Options
          </h1>
          <p className="text-lg text-gray-600">
            Find the best way to access airport lounges based on your travel habits and preferences.
          </p>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="bg-white py-12">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-4 font-semibold text-gray-900 border-b">Option</th>
                    <th className="text-left p-4 font-semibold text-gray-900 border-b">Type</th>
                    <th className="text-left p-4 font-semibold text-gray-900 border-b">Lounges</th>
                    <th className="text-left p-4 font-semibold text-gray-900 border-b">Price</th>
                    <th className="text-left p-4 font-semibold text-gray-900 border-b">Best For</th>
                    <th className="text-left p-4 font-semibold text-gray-900 border-b"></th>
                  </tr>
                </thead>
                <tbody>
                  {accessOptions.map((option, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <span className="font-medium text-gray-900">{option.name}</span>
                      </td>
                      <td className="p-4 text-gray-600">{option.type}</td>
                      <td className="p-4 text-gray-600">{option.lounges}</td>
                      <td className="p-4 text-gray-600">{option.price}</td>
                      <td className="p-4 text-gray-600">{option.bestFor}</td>
                      <td className="p-4">
                        <a
                          href={option.url}
                          rel={option.url.startsWith('/go/') ? 'nofollow sponsored' : undefined}
                          className="text-brand-600 hover:text-brand-700 font-medium text-sm"
                        >
                          Learn more →
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-6">
              {accessOptions.map((option, index) => (
                <div key={index} className="bg-white border rounded-xl p-6 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{option.name}</h3>
                      <span className="text-sm text-gray-500">{option.type}</span>
                    </div>
                    <span className="bg-brand-50 text-brand-700 text-sm font-medium px-3 py-1 rounded-full">
                      {option.lounges} lounges
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price</span>
                      <span className="font-medium text-gray-900">{option.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Best for</span>
                      <span className="font-medium text-gray-900">{option.bestFor}</span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="mb-3">
                      <span className="text-sm font-medium text-green-700">Pros:</span>
                      <ul className="text-sm text-gray-600 mt-1">
                        {option.pros.map((pro, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="text-green-500">✓</span> {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mb-4">
                      <span className="text-sm font-medium text-red-700">Cons:</span>
                      <ul className="text-sm text-gray-600 mt-1">
                        {option.cons.map((con, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="text-red-500">✕</span> {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <a
                    href={option.url}
                    rel={option.url.startsWith('/go/') ? 'nofollow sponsored' : undefined}
                    className="block w-full text-center bg-brand-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-brand-700 transition-colors"
                  >
                    Learn more
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="max-w-4xl mx-auto mt-12">
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-sm text-gray-600">
                <strong>Note:</strong> Prices and lounge counts are approximate and subject to change.
                Always verify current offerings on the provider's website. Some links on this page
                are affiliate links.{' '}
                <Link href="/affiliate-disclosure" className="text-brand-600 hover:underline">
                  Learn more
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-brand-50">
        <div className="container-custom text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Not sure which option is right for you?
          </h2>
          <p className="text-gray-600 mb-6">
            Browse our lounge directory to see which access methods work at your most-visited airports.
          </p>
          <Link
            href="/lounges"
            className="inline-block bg-brand-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-brand-700 transition-colors"
          >
            Explore Lounges
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Link href="/" className="inline-block mb-4">
                <img
                  src="/takeyourlounge-logo-dark.svg"
                  alt="TakeYourLounge"
                  width={160}
                  height={40}
                  className="h-8 w-auto"
                />
              </Link>
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
