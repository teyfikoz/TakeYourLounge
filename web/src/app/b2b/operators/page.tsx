'use client';
import Navbar from '@/components/Navbar';

import { useState } from 'react';
import Link from 'next/link';

export default function OperatorsPage() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    loungeCount: '',
    airports: '',
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
      const response = await fetch('/api/b2b/operators', {
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

      // Reset form after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: '',
          company: '',
          email: '',
          loungeCount: '',
          airports: '',
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
          <div className="inline-block bg-brand-100 text-brand-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            💼 For Lounge Operators
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Increase Your Lounge's
            <span className="text-brand-600"> Visibility</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join the world's most comprehensive airport lounge directory. Reach 100,000+ monthly travelers actively searching for premium lounge experiences.
          </p>

          <div className="flex gap-4 justify-center">
            <a href="#contact" className="btn-primary text-lg px-8 py-4">
              Partner With Us
            </a>
            <a href="#benefits" className="btn-secondary text-lg px-8 py-4">
              See Benefits
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-brand-600 text-white py-16">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">100K+</div>
              <div className="text-brand-100">Monthly Visitors</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">2,045</div>
              <div className="text-brand-100">Listed Lounges</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">703</div>
              <div className="text-brand-100">Airports Worldwide</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">175</div>
              <div className="text-brand-100">Countries</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
              Why Partner With TakeYourLounge?
            </h2>
            <p className="text-xl text-gray-600 text-center mb-16">
              Data-driven visibility for your premium lounge facilities
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Benefit 1 */}
              <div className="card bg-gradient-to-br from-white to-brand-50">
                <div className="text-5xl mb-4">📈</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Increase Discovery
                </h3>
                <p className="text-gray-700 mb-4">
                  Travelers actively search for lounges by airport, access method, and amenities. Get discovered by qualified visitors planning their journey.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Featured in search results for your airport</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Highlighted in terminal guides</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Smart recommendations based on traveler preferences</span>
                  </li>
                </ul>
              </div>

              {/* Benefit 2 */}
              <div className="card bg-gradient-to-br from-white to-blue-50">
                <div className="text-5xl mb-4">⭐</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Build Your Reputation
                </h3>
                <p className="text-gray-700 mb-4">
                  Showcase authentic reviews and ratings. High-rated lounges get featured in "Top Rated" and "Hidden Gems" sections.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Verified traveler reviews and ratings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Featured in airport comparison pages</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Premium badge for top-performing lounges</span>
                  </li>
                </ul>
              </div>

              {/* Benefit 3 */}
              <div className="card bg-gradient-to-br from-white to-purple-50">
                <div className="text-5xl mb-4">📊</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Analytics Dashboard
                </h3>
                <p className="text-gray-700 mb-4">
                  Access detailed insights about your lounge's performance, visitor demographics, and competitive positioning.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Profile views and click-through rates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Benchmark against competitors</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Seasonal trend analysis</span>
                  </li>
                </ul>
              </div>

              {/* Benefit 4 */}
              <div className="card bg-gradient-to-br from-white to-green-50">
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Targeted Exposure
                </h3>
                <p className="text-gray-700 mb-4">
                  Reach travelers specifically looking for lounges with your amenities and access methods.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Filter-based discovery (Wi-Fi, showers, dining)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Access method matching (Priority Pass, Amex, etc.)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Terminal-specific recommendations</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
              How It Works
            </h2>

            <div className="space-y-8">
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-brand-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Get Listed</h3>
                  <p className="text-gray-600">
                    Submit your lounge details through our partnership form. We'll verify and optimize your listing for maximum visibility.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-brand-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Optimize Your Profile</h3>
                  <p className="text-gray-600">
                    Add high-quality photos, detailed amenity lists, and accurate information. Complete profiles get 3x more views.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-brand-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Get Discovered</h3>
                  <p className="text-gray-600">
                    Appear in search results, comparison tools, airport guides, and smart recommendations across our platform.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-brand-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Track Performance</h3>
                  <p className="text-gray-600">
                    Monitor your analytics dashboard to see visitor engagement, review trends, and competitive positioning.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Partner With Us
              </h2>
              <p className="text-xl text-gray-600">
                Join 2,045 premium lounges already featured on TakeYourLounge
              </p>
            </div>

            {submitted ? (
              <div className="bg-green-50 border-2 border-green-500 rounded-xl p-12 text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-green-800 mb-2">Thank You!</h3>
                <p className="text-green-700">
                  We've received your inquiry and will contact you within 24-48 hours.
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
                      Company / Lounge Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      placeholder="Premium Lounge LLC"
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
                    placeholder="contact@yourlounge.com"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Number of Lounges
                    </label>
                    <select
                      value={formData.loungeCount}
                      onChange={(e) => setFormData({...formData, loungeCount: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    >
                      <option value="">Select...</option>
                      <option value="1">1 lounge</option>
                      <option value="2-5">2-5 lounges</option>
                      <option value="6-10">6-10 lounges</option>
                      <option value="11-20">11-20 lounges</option>
                      <option value="20+">20+ lounges</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Airport(s) / Location(s)
                    </label>
                    <input
                      type="text"
                      value={formData.airports}
                      onChange={(e) => setFormData({...formData, airports: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      placeholder="JFK, LAX, LHR"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    placeholder="Tell us about your lounge(s) and partnership interests..."
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
                  {isSubmitting ? 'Submitting...' : 'Submit Partnership Inquiry'}
                </button>

                <p className="text-center text-sm text-gray-500 mt-4">
                  We typically respond within 24-48 business hours
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
                <li><Link href="/b2b/operators" className="text-brand-400 hover:text-brand-300">For Lounge Operators</Link></li>
                <li><Link href="/b2b/airports" className="hover:text-white">For Airports</Link></li>
                <li><Link href="/b2b/card-issuers" className="hover:text-white">For Card Issuers</Link></li>
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
