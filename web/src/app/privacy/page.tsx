import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Privacy Policy | TakeYourLounge",
  description: "TakeYourLounge Privacy Policy - Learn how we collect, use, and protect your information.",
  openGraph: {
    title: "Privacy Policy - TakeYourLounge",
    description: "Our commitment to protecting your privacy and data security.",
    type: "website",
    url: "https://takeyourlounge.com/privacy",
  },
};

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600">
            Last updated: January 2025
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-white py-12">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <div className="space-y-8">
              {/* Introduction */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
                <p className="text-gray-700 leading-relaxed">
                  Welcome to TakeYourLounge ("we," "our," or "us"). This Privacy Policy explains how
                  we collect, use, disclose, and safeguard your information when you visit our website
                  <a href="https://takeyourlounge.com" className="text-brand-600 hover:underline"> takeyourlounge.com</a>,
                  including any other media form, media channel, mobile website, or mobile application
                  related or connected thereto.
                </p>
                <p className="text-gray-700 leading-relaxed mt-4">
                  Please read this privacy policy carefully. If you do not agree with the terms of this
                  privacy policy, please do not access the site.
                </p>
              </div>

              {/* Information We Collect */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">2.1 Automatically Collected Information</h3>
                <p className="text-gray-700 leading-relaxed">
                  When you visit our website, we may automatically collect certain information about
                  your device, including information about your web browser, IP address, time zone,
                  and some of the cookies that are installed on your device.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">2.2 Analytics Information</h3>
                <p className="text-gray-700 leading-relaxed">
                  We use Google Analytics to help us understand how our visitors use the site. Google
                  Analytics collects information such as how often users visit the site, what pages
                  they visit, and what other sites they used prior to coming to our site.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">2.3 User-Submitted Information</h3>
                <p className="text-gray-700 leading-relaxed">
                  If you submit a review or contact us via email, we may collect your name, email
                  address, and any other information you choose to provide.
                </p>
              </div>

              {/* How We Use Information */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  We use the information we collect in various ways, including to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Provide, operate, and maintain our website</li>
                  <li>Improve, personalize, and expand our website</li>
                  <li>Understand and analyze how you use our website</li>
                  <li>Develop new products, services, features, and functionality</li>
                  <li>Communicate with you for customer service and support</li>
                  <li>Send you updates and marketing communications (with your consent)</li>
                  <li>Find and prevent fraud</li>
                </ul>
              </div>

              {/* Cookies and Tracking */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Cookies and Tracking Technologies</h2>
                <p className="text-gray-700 leading-relaxed">
                  We use cookies and similar tracking technologies to track activity on our website
                  and hold certain information. Cookies are files with small amounts of data which
                  may include an anonymous unique identifier.
                </p>
                <p className="text-gray-700 leading-relaxed mt-4">
                  You can instruct your browser to refuse all cookies or to indicate when a cookie
                  is being sent. However, if you do not accept cookies, you may not be able to use
                  some portions of our website.
                </p>
              </div>

              {/* Third-Party Services */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Third-Party Services</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  We may employ third-party companies and individuals to facilitate our website
                  ("Service Providers"), provide the website on our behalf, perform website-related
                  services, or assist us in analyzing how our website is used.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  These third parties have access to your information only to perform these tasks
                  on our behalf and are obligated not to disclose or use it for any other purpose.
                </p>
                <p className="text-gray-700 leading-relaxed mt-4">
                  <strong>Third-party services we use:</strong>
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mt-2">
                  <li>Google Analytics (analytics)</li>
                  <li>Vercel (hosting)</li>
                  <li>Supabase (database)</li>
                </ul>
              </div>

              {/* Data Security */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Security</h2>
                <p className="text-gray-700 leading-relaxed">
                  The security of your data is important to us, but remember that no method of
                  transmission over the Internet or method of electronic storage is 100% secure.
                  While we strive to use commercially acceptable means to protect your information,
                  we cannot guarantee its absolute security.
                </p>
              </div>

              {/* Your Rights */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Your Data Protection Rights</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Depending on your location, you may have the following rights regarding your
                  personal information:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li><strong>Right to access</strong> – You have the right to request copies of your personal data.</li>
                  <li><strong>Right to rectification</strong> – You have the right to request that we correct any information you believe is inaccurate.</li>
                  <li><strong>Right to erasure</strong> – You have the right to request that we erase your personal data, under certain conditions.</li>
                  <li><strong>Right to restrict processing</strong> – You have the right to request that we restrict the processing of your personal data, under certain conditions.</li>
                  <li><strong>Right to data portability</strong> – You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.</li>
                </ul>
              </div>

              {/* Children's Privacy */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Children's Privacy</h2>
                <p className="text-gray-700 leading-relaxed">
                  Our website does not address anyone under the age of 13. We do not knowingly
                  collect personally identifiable information from children under 13. If you are
                  a parent or guardian and you are aware that your child has provided us with
                  personal data, please contact us.
                </p>
              </div>

              {/* Changes to Policy */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Changes to This Privacy Policy</h2>
                <p className="text-gray-700 leading-relaxed">
                  We may update our Privacy Policy from time to time. We will notify you of any
                  changes by posting the new Privacy Policy on this page and updating the "Last
                  updated" date at the top of this Privacy Policy.
                </p>
                <p className="text-gray-700 leading-relaxed mt-4">
                  You are advised to review this Privacy Policy periodically for any changes.
                  Changes to this Privacy Policy are effective when they are posted on this page.
                </p>
              </div>

              {/* Contact Us */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contact Us</h2>
                <p className="text-gray-700 leading-relaxed">
                  If you have any questions about this Privacy Policy, please contact us:
                </p>
                <div className="mt-4 bg-brand-50 p-6 rounded-lg">
                  <p className="text-gray-900 font-medium mb-2">Tech Sync Analytica LLC</p>
                  <p className="text-gray-700">Email: <a href="mailto:info@tsynca.com" className="text-brand-600 hover:underline">info@tsynca.com</a></p>
                  <p className="text-gray-700">Website: <a href="https://takeyourlounge.com" className="text-brand-600 hover:underline">takeyourlounge.com</a></p>
                  <p className="text-gray-700 mt-2">Based in New Mexico, United States</p>
                </div>
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
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                <li><a href="mailto:info@tsynca.com" className="hover:text-white">Contact</a></li>
                <li><Link href="/privacy" className="text-white font-medium">Privacy Policy</Link></li>
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
