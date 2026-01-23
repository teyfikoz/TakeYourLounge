import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Terms of Service | TakeYourLounge",
  description: "Terms of Service for TakeYourLounge.com - User guidelines and legal terms.",
  alternates: {
    canonical: 'https://takeyourlounge.com/terms',
  },
  openGraph: {
    title: "Terms of Service - TakeYourLounge",
    description: "Read our terms of service and user agreement.",
    type: "website",
    url: "https://takeyourlounge.com/terms",
  },
};

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="text-lg text-gray-600">
            Last updated: January 4, 2025
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container-custom pb-24">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="prose prose-lg max-w-none">
            {/* Introduction */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Agreement to Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                By accessing or using TakeYourLounge.com ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not access or use the Service.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                <strong>Service Provider:</strong><br />
                TakeYourLounge.com<br />
                Operated by: Tech Sync Analytica LLC<br />
                Email: info@tsynca.com
              </p>
            </section>

            {/* Description of Service */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
              <p className="text-gray-700 leading-relaxed">
                TakeYourLounge provides:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mt-4">
                <li>Airport lounge directory and information database</li>
                <li>User-generated reviews and ratings</li>
                <li>Community verification system</li>
                <li>Lounge search and comparison tools</li>
                <li>Information aggregated from public sources and community contributions</li>
              </ul>
            </section>

            {/* User Accounts */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                To access certain features, you may need to create an account:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>You must provide accurate and complete information</li>
                <li>You are responsible for maintaining account security</li>
                <li>You must be at least 16 years old to create an account</li>
                <li>You may not share your account with others</li>
                <li>We reserve the right to suspend or terminate accounts that violate these Terms</li>
              </ul>
            </section>

            {/* User Content */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. User Content</h2>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">4.1 Your Content</h3>
              <p className="text-gray-700 leading-relaxed">
                When you submit content (reviews, ratings, reports, photos, etc.):
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mt-4">
                <li>You retain ownership of your content</li>
                <li>You grant us a worldwide, non-exclusive, royalty-free license to use, display, and distribute your content</li>
                <li>You represent that you have the right to submit the content</li>
                <li>You agree not to submit false, misleading, or defamatory content</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">4.2 Prohibited Content</h3>
              <p className="text-gray-700 leading-relaxed">
                You may NOT submit content that:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mt-4">
                <li>Is false, misleading, or fraudulent</li>
                <li>Violates intellectual property rights</li>
                <li>Contains malware or harmful code</li>
                <li>Is spam, advertising, or promotional material</li>
                <li>Is offensive, discriminatory, or harassing</li>
                <li>Violates privacy or confidentiality</li>
                <li>Violates any law or regulation</li>
              </ul>
            </section>

            {/* Data Sources and Disclaimers */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Sources and Disclaimers</h2>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">5.1 Information Sources</h3>
              <p className="text-gray-700 leading-relaxed">
                Our lounge database includes information from:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mt-4">
                <li>Community contributions and user submissions</li>
                <li>OpenStreetMap (© OpenStreetMap contributors, ODbL License)</li>
                <li>Wikidata (Wikidata contributors, CC0 Public Domain)</li>
                <li>Google Places API (Licensed)</li>
                <li>Publicly available information</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">5.2 NO WARRANTY</h3>
              <div className="bg-amber-50 border-l-4 border-amber-500 p-6 my-6">
                <p className="text-gray-800 font-semibold mb-2">⚠️ IMPORTANT DISCLAIMER</p>
                <p className="text-gray-700 leading-relaxed">
                  <strong>We provide information "AS IS" without any warranty.</strong> We do NOT guarantee the accuracy, completeness, or currency of any lounge information. Lounge details (hours, amenities, access rules, prices) may change without notice.
                </p>
                <p className="text-gray-700 leading-relaxed mt-3">
                  <strong>ALWAYS verify information with the lounge operator before your visit.</strong>
                </p>
              </div>
            </section>

            {/* Intellectual Property */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Intellectual Property</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                The Service and its content (excluding user content and third-party data) are owned by Tech Sync Analytica LLC and protected by copyright, trademark, and other laws.
              </p>
              <p className="text-gray-700 leading-relaxed">
                You may not:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mt-4">
                <li>Copy, modify, or distribute our content without permission</li>
                <li>Use automated tools to scrape or download data</li>
                <li>Reverse engineer or attempt to extract source code</li>
                <li>Remove copyright or trademark notices</li>
              </ul>
            </section>

            {/* Third-Party Links */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Third-Party Links and Services</h2>
              <p className="text-gray-700 leading-relaxed">
                Our Service may contain links to third-party websites or services. We are not responsible for:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mt-4">
                <li>The content or practices of third-party sites</li>
                <li>Transactions with third parties</li>
                <li>Accuracy of third-party information</li>
              </ul>
            </section>

            {/* Limitation of Liability */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitation of Liability</h2>
              <div className="bg-red-50 border-l-4 border-red-500 p-6 my-6">
                <p className="text-gray-800 font-semibold mb-2">LEGAL NOTICE</p>
                <p className="text-gray-700 leading-relaxed">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, TECH SYNC ANALYTICA LLC SHALL NOT BE LIABLE FOR ANY:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mt-3">
                  <li>Indirect, incidental, or consequential damages</li>
                  <li>Loss of profits, data, or use</li>
                  <li>Damages resulting from inaccurate lounge information</li>
                  <li>Damages from unauthorized access to your account</li>
                  <li>Issues arising from third-party services or content</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-3">
                  <strong>Our total liability shall not exceed $100 USD.</strong>
                </p>
              </div>
            </section>

            {/* Indemnification */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Indemnification</h2>
              <p className="text-gray-700 leading-relaxed">
                You agree to indemnify and hold harmless Tech Sync Analytica LLC from any claims, losses, or damages arising from:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mt-4">
                <li>Your use of the Service</li>
                <li>Your violation of these Terms</li>
                <li>Your content or submissions</li>
                <li>Your violation of third-party rights</li>
              </ul>
            </section>

            {/* Termination */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Termination</h2>
              <p className="text-gray-700 leading-relaxed">
                We may terminate or suspend your access to the Service:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mt-4">
                <li>For violation of these Terms</li>
                <li>For fraudulent, abusive, or illegal activity</li>
                <li>At our discretion, with or without notice</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                You may terminate your account at any time by contacting us at info@tsynca.com
              </p>
            </section>

            {/* Changes to Terms */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                We may update these Terms at any time. We will notify you of material changes by:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mt-4">
                <li>Posting the updated Terms on this page</li>
                <li>Updating the "Last Updated" date</li>
                <li>Sending email notification (for significant changes)</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                Continued use of the Service after changes constitutes acceptance of the new Terms.
              </p>
            </section>

            {/* Governing Law */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Governing Law</h2>
              <p className="text-gray-700 leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of the jurisdiction where Tech Sync Analytica LLC is registered, without regard to conflict of law provisions.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                Any disputes shall be resolved through binding arbitration or in the courts of the applicable jurisdiction.
              </p>
            </section>

            {/* Contact */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact Us</h2>
              <p className="text-gray-700 leading-relaxed">
                For questions about these Terms:
              </p>
              <div className="bg-blue-50 p-6 rounded-lg mt-4">
                <p className="text-gray-800 font-semibold">Tech Sync Analytica LLC</p>
                <p className="text-gray-700 mt-2">Email: info@tsynca.com</p>
                <p className="text-gray-700">
                  Website:{" "}
                  <Link
                    href="https://takeyourlounge.com"
                    className="text-blue-600 hover:underline"
                  >
                    https://takeyourlounge.com
                  </Link>
                </p>
              </div>
            </section>

            <section className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-600 italic">
                By using TakeYourLounge.com, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              </p>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}
