'use client';
import Navbar from '@/components/Navbar';

import { useState } from 'react';
import Link from 'next/link';

export default function AirportsPage() {
  const [formData, setFormData] = useState({
    name: '',
    airport: '',
    email: '',
    position: '',
    interest: '',
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
      const response = await fetch('/api/b2b/airports', {
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
          airport: '',
          email: '',
          position: '',
          interest: '',
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
          <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            ✈️ For Airport Management
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Optimize Your Airport's
            <span className="text-brand-600"> Lounge Experience</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Data-driven insights to enhance passenger experience, maximize lounge utilization, and increase non-aeronautical revenue.
          </p>

          <div className="flex gap-4 justify-center">
            <a href="#contact" className="btn-primary text-lg px-8 py-4">
              Request Demo
            </a>
            <a href="#insights" className="btn-secondary text-lg px-8 py-4">
              View Insights
            </a>
          </div>
        </div>
      </section>

      {/* Sample Insights */}
      <section className="bg-gradient-to-r from-brand-600 to-brand-700 text-white py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Example: Istanbul Airport (IST) Analytics
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
                <div className="text-4xl font-bold mb-2">8.2/10</div>
                <div className="text-brand-100">Lounge Density Score</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
                <div className="text-4xl font-bold mb-2">21</div>
                <div className="text-brand-100">Premium Lounges</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
                <div className="text-4xl font-bold mb-2">4.3★</div>
                <div className="text-brand-100">Average Rating</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
                <div className="text-4xl font-bold mb-2">85%</div>
                <div className="text-brand-100">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="insights" className="py-20">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
              What We Provide
            </h2>
            <p className="text-xl text-gray-600 text-center mb-16">
              Comprehensive lounge analytics and passenger insights
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Insight 1 */}
              <div className="card bg-gradient-to-br from-white to-blue-50">
                <div className="text-5xl mb-4">📊</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Lounge Performance Analytics
                </h3>
                <p className="text-gray-700 mb-4">
                  Understand how your airport's lounges perform compared to global benchmarks.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Density score vs. passenger volume</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Terminal-by-terminal breakdown</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Quality ratings and satisfaction trends</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Competitive benchmarking (vs similar airports)</span>
                  </li>
                </ul>
              </div>

              {/* Insight 2 */}
              <div className="card bg-gradient-to-br from-white to-purple-50">
                <div className="text-5xl mb-4">🗺️</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Terminal Optimization
                </h3>
                <p className="text-gray-700 mb-4">
                  Identify which terminals need more lounge capacity based on traffic patterns.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Lounge distribution across terminals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Peak hours and crowding analysis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Under-served terminal identification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Expansion opportunity recommendations</span>
                  </li>
                </ul>
              </div>

              {/* Insight 3 */}
              <div className="card bg-gradient-to-br from-white to-green-50">
                <div className="text-5xl mb-4">💰</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Revenue Optimization
                </h3>
                <p className="text-gray-700 mb-4">
                  Maximize non-aeronautical revenue through strategic lounge partnerships.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Concession fee benchmarking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>High-potential operator identification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Premium space utilization metrics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Contract renewal insights</span>
                  </li>
                </ul>
              </div>

              {/* Insight 4 */}
              <div className="card bg-gradient-to-br from-white to-yellow-50">
                <div className="text-5xl mb-4">👥</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Passenger Experience Insights
                </h3>
                <p className="text-gray-700 mb-4">
                  Real traveler feedback to improve your airport's premium offerings.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Aggregate review sentiment analysis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Most requested amenities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Service gap identification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Best practice recommendations</span>
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
              Real-World Applications
            </h2>

            <div className="space-y-8">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-16 h-16 bg-brand-100 text-brand-600 rounded-xl flex items-center justify-center text-2xl font-bold">
                    📈
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Strategic Planning
                    </h3>
                    <p className="text-gray-700">
                      Use density scores and passenger data to plan new lounge spaces. Identify under-served terminals and negotiate better terms with operators based on competitive intelligence.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-16 h-16 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-2xl font-bold">
                    🤝
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Operator Relations
                    </h3>
                    <p className="text-gray-700">
                      Leverage performance data in renewal negotiations. Identify high-performing operators for expansion and address quality issues with data-backed insights.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-16 h-16 bg-green-100 text-green-600 rounded-xl flex items-center justify-center text-2xl font-bold">
                    ⭐
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Service Quality Monitoring
                    </h3>
                    <p className="text-gray-700">
                      Track traveler satisfaction trends over time. Identify service gaps and improvement opportunities before they impact airport reputation.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-16 h-16 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center text-2xl font-bold">
                    🌍
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Competitive Positioning
                    </h3>
                    <p className="text-gray-700">
                      Compare your airport's lounge offerings against competitors. Understand where you lead and where improvements are needed to attract premium travelers.
                    </p>
                  </div>
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
                Request Airport Analytics Demo
              </h2>
              <p className="text-xl text-gray-600">
                See how your airport performs and discover optimization opportunities
              </p>
            </div>

            {submitted ? (
              <div className="bg-green-50 border-2 border-green-500 rounded-xl p-12 text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-green-800 mb-2">Request Received!</h3>
                <p className="text-green-700">
                  Our team will prepare your customized airport analytics report and contact you within 24-48 hours.
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
                      Airport Name & Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.airport}
                      onChange={(e) => setFormData({...formData, airport: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      placeholder="Istanbul Airport (IST)"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      placeholder="contact@airport.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Position / Department
                    </label>
                    <input
                      type="text"
                      value={formData.position}
                      onChange={(e) => setFormData({...formData, position: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      placeholder="Commercial Manager"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Area of Interest
                  </label>
                  <select
                    value={formData.interest}
                    onChange={(e) => setFormData({...formData, interest: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  >
                    <option value="">Select...</option>
                    <option value="analytics">Performance Analytics</option>
                    <option value="terminal">Terminal Optimization</option>
                    <option value="revenue">Revenue Optimization</option>
                    <option value="passenger">Passenger Experience</option>
                    <option value="all">All of the above</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    placeholder="Specific questions or areas you'd like to explore..."
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
                  {isSubmitting ? 'Submitting...' : 'Request Analytics Demo'}
                </button>

                <p className="text-center text-sm text-gray-500 mt-4">
                  We'll prepare a customized report for your airport
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
                <li><Link href="/b2b/airports" className="text-brand-400 hover:text-brand-300">For Airports</Link></li>
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
