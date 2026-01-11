'use client';
import Navbar from '@/components/Navbar';

import { useState } from 'react';
import Link from 'next/link';

export default function CardIssuersPage() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    cardType: '',
    loungeProgram: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/b2b/card-issuers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit form');
      }

      setSubmitted(true);

      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: '',
          company: '',
          email: '',
          cardType: '',
          loungeProgram: '',
          message: ''
        });
      }, 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit form');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <header className="bg-white border-b">
        <div className="container-custom py-6">
          <Navbar />
        </div>
      </header>

      {/* Hero Section */}
      <section className="container-custom py-20">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            💳 For Card Issuers & Financial Institutions
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Enhance Your Card's
            <span className="text-brand-600"> Travel Benefits</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Partner with TakeYourLounge to provide cardholders with comprehensive lounge access data, personalized recommendations, and seamless travel experiences.
          </p>

          <div className="flex gap-4 justify-center">
            <a href="#contact" className="btn-primary text-lg px-8 py-4">
              Explore Partnership
            </a>
            <a href="#benefits" className="btn-secondary text-lg px-8 py-4">
              View Solutions
            </a>
          </div>
        </div>
      </section>

      {/* Market Intelligence */}
      <section className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Global Lounge Access Market Intelligence
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
                <div className="text-4xl font-bold mb-2">2,045</div>
                <div className="text-purple-100">Lounges Tracked</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
                <div className="text-4xl font-bold mb-2">15+</div>
                <div className="text-purple-100">Access Programs</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
                <div className="text-4xl font-bold mb-2">703</div>
                <div className="text-purple-100">Airports Covered</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
                <div className="text-4xl font-bold mb-2">100K+</div>
                <div className="text-purple-100">Monthly Users</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section id="benefits" className="py-20">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
              Partnership Solutions
            </h2>
            <p className="text-xl text-gray-600 text-center mb-16">
              White-label solutions and API integrations for premium card programs
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Solution 1 */}
              <div className="card bg-gradient-to-br from-white to-purple-50">
                <div className="text-5xl mb-4">🔌</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  API Integration
                </h3>
                <p className="text-gray-700 mb-4">
                  Embed real-time lounge data directly into your cardholder portal or mobile app.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>RESTful API with comprehensive documentation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Real-time lounge availability and ratings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Personalized recommendations based on card tier</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>99.9% uptime SLA</span>
                  </li>
                </ul>
              </div>

              {/* Solution 2 */}
              <div className="card bg-gradient-to-br from-white to-blue-50">
                <div className="text-5xl mb-4">🎨</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  White-Label Widget
                </h3>
                <p className="text-gray-700 mb-4">
                  Branded lounge finder widget ready to embed on your website or app.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Fully customizable with your brand colors</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Mobile-responsive design</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>One-line implementation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>No technical maintenance required</span>
                  </li>
                </ul>
              </div>

              {/* Solution 3 */}
              <div className="card bg-gradient-to-br from-white to-green-50">
                <div className="text-5xl mb-4">📊</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Competitive Intelligence
                </h3>
                <p className="text-gray-700 mb-4">
                  Understand how your lounge access benefits compare to competitors.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Market penetration analysis by airport</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Competitor program comparison</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Coverage gap identification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Strategic expansion recommendations</span>
                  </li>
                </ul>
              </div>

              {/* Solution 4 */}
              <div className="card bg-gradient-to-br from-white to-yellow-50">
                <div className="text-5xl mb-4">💎</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Premium Features
                </h3>
                <p className="text-gray-700 mb-4">
                  Enhanced benefits exclusive to your cardholders through our platform.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Priority booking for high-demand lounges</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Exclusive lounge deals for cardholders</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Personalized airport guides</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Co-branded content marketing</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="bg-gray-50 py-20">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
              How Card Issuers Use TakeYourLounge
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="text-5xl mb-4">🏆</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Premium Tier Differentiation
                </h3>
                <p className="text-gray-600 text-sm">
                  Offer exclusive lounge data and booking features to Platinum/Black card tiers, increasing upgrade motivation.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="text-5xl mb-4">📱</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Mobile App Enhancement
                </h3>
                <p className="text-gray-600 text-sm">
                  Integrate lounge finder into your banking app, increasing app engagement and cardholder satisfaction.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="text-5xl mb-4">📈</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Marketing Campaigns
                </h3>
                <p className="text-gray-600 text-sm">
                  Leverage comprehensive lounge network data in acquisition campaigns to compete with travel-focused cards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Integration */}
      <section className="py-20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
              Sample Data Output
            </h2>

            <div className="bg-gray-900 rounded-xl p-8 overflow-x-auto">
              <pre className="text-green-400 text-sm font-mono">
{`{
  "airport": "IST",
  "airport_name": "Istanbul Airport",
  "lounges": [
    {
      "id": "turkish-airlines-lounge-ist",
      "name": "Turkish Airlines Lounge",
      "terminal": "International",
      "rating": 4.5,
      "access_methods": ["Priority Pass", "Amex Platinum"],
      "amenities": ["Showers", "Hot Meals", "Wi-Fi"],
      "availability": "available",
      "walking_time": "5 minutes from gate"
    }
  ],
  "your_card_access": {
    "eligible_lounges": 12,
    "total_lounges": 21,
    "coverage": "57%"
  },
  "recommendations": [
    "Turkish Airlines Lounge - Best food",
    "IST Premium Lounge - Quietest"
  ]
}`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Start Partnership Discussion
              </h2>
              <p className="text-xl text-gray-600">
                Let's explore how we can enhance your card's travel benefits
              </p>
            </div>

            {submitted ? (
              <div className="bg-green-50 border-2 border-green-500 rounded-xl p-12 text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-green-800 mb-2">Thank You!</h3>
                <p className="text-green-700">
                  Our partnerships team will contact you within 24 hours to discuss integration options.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Company / Bank Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      placeholder="ABC Bank"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    placeholder="partnerships@bank.com"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Card Type / Program
                    </label>
                    <select
                      value={formData.cardType}
                      onChange={(e) => setFormData({...formData, cardType: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    >
                      <option value="">Select...</option>
                      <option value="premium">Premium Travel Card</option>
                      <option value="business">Business Card</option>
                      <option value="rewards">Rewards Card</option>
                      <option value="corporate">Corporate Program</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Current Lounge Program
                    </label>
                    <input
                      type="text"
                      value={formData.loungeProgram}
                      onChange={(e) => setFormData({...formData, loungeProgram: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      placeholder="Priority Pass, LoungeKey, etc."
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Partnership Interest
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    placeholder="Tell us about your integration goals, cardholder base, and partnership objectives..."
                  />
                </div>

                {error && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Request Partnership Information'}
                </button>

                <p className="text-center text-sm text-gray-500 mt-4">
                  Enterprise solutions available · Custom pricing · Dedicated support
                </p>
              </form>
            )}
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
              <h4 className="text-white font-semibold mb-4">B2B Solutions</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/b2b/operators" className="hover:text-white">For Lounge Operators</Link></li>
                <li><Link href="/b2b/airports" className="hover:text-white">For Airports</Link></li>
                <li><Link href="/b2b/card-issuers" className="text-brand-400 hover:text-brand-300">For Card Issuers</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="https://www.linkedin.com/company/tech-sync-analytica-llc/?viewAsMember=true" target="_blank" rel="noopener noreferrer" className="hover:text-white">LinkedIn</a></li>
                <li><a href="mailto:info@tsynca.com" className="hover:text-white">Email Us</a></li>
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
