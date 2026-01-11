'use client';

import Navbar from '@/components/Navbar';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import loungeData from '@/data/lounges.json';

interface Lounge {
  id: string;
  name: string;
  airport_code: string;
  airport_name: string;
  city: string;
  country: string;
  terminal?: string;
  location?: string;
  access_methods: string[];
  amenities: string[];
  wifi?: boolean;
  food_rating?: number;
  cleanliness_rating?: number;
  comfort_rating?: number;
  staff_rating?: number;
  overall_rating?: number;
  images: string[];
}

export default function ComparePage() {
  const searchParams = useSearchParams();
  const [lounge1, setLounge1] = useState<Lounge | null>(null);
  const [lounge2, setLounge2] = useState<Lounge | null>(null);

  useEffect(() => {
    const id1 = searchParams.get('lounge1');
    const id2 = searchParams.get('lounge2');

    if (id1) {
      const found = loungeData.lounges.find((l: any) => l.id === id1);
      setLounge1(found as Lounge || null);
    }

    if (id2) {
      const found = loungeData.lounges.find((l: any) => l.id === id2);
      setLounge2(found as Lounge || null);
    }
  }, [searchParams]);

  const getRatingColor = (rating?: number) => {
    if (!rating) return 'text-gray-400';
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4.0) return 'text-blue-600';
    if (rating >= 3.5) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getRatingBg = (rating?: number) => {
    if (!rating) return 'bg-gray-100';
    if (rating >= 4.5) return 'bg-green-50';
    if (rating >= 4.0) return 'bg-blue-50';
    if (rating >= 3.5) return 'bg-yellow-50';
    return 'bg-orange-50';
  };

  const getBetterRating = (rating1?: number, rating2?: number): 'left' | 'right' | 'equal' => {
    if (!rating1 && !rating2) return 'equal';
    if (!rating1) return 'right';
    if (!rating2) return 'left';
    if (rating1 > rating2) return 'left';
    if (rating2 > rating1) return 'right';
    return 'equal';
  };

  const ComparisonRow = ({
    label,
    value1,
    value2,
    type = 'text',
    better
  }: {
    label: string;
    value1: any;
    value2: any;
    type?: 'text' | 'rating' | 'boolean' | 'list';
    better?: 'left' | 'right' | 'equal';
  }) => {
    const renderValue = (value: any, side: 'left' | 'right') => {
      if (type === 'rating') {
        return (
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${getRatingBg(value)} ${
            better === side ? 'ring-2 ring-brand-500' : ''
          }`}>
            <span className={`font-bold text-lg ${getRatingColor(value)}`}>
              {value ? value.toFixed(1) : 'N/A'}
            </span>
            <span className="text-sm text-gray-600">/ 5.0</span>
          </div>
        );
      }

      if (type === 'boolean') {
        return value ? (
          <span className="text-green-600 font-semibold">✓ Yes</span>
        ) : (
          <span className="text-gray-400">✗ No</span>
        );
      }

      if (type === 'list') {
        return (
          <div className="flex flex-wrap gap-2">
            {value && value.length > 0 ? (
              value.map((item: string, idx: number) => (
                <span key={idx} className="bg-brand-50 text-brand-700 px-2 py-1 rounded text-sm">
                  {item}
                </span>
              ))
            ) : (
              <span className="text-gray-400 text-sm">None listed</span>
            )}
          </div>
        );
      }

      return <span className="text-gray-900">{value || 'N/A'}</span>;
    };

    return (
      <div className="grid grid-cols-3 gap-4 py-4 border-b border-gray-200 hover:bg-gray-50 transition-colors">
        <div className={`text-center ${better === 'left' ? 'bg-brand-50 -mx-4 px-4 rounded-l' : ''}`}>
          {renderValue(value1, 'left')}
        </div>
        <div className="flex items-center justify-center">
          <span className="font-semibold text-gray-700 text-sm">{label}</span>
        </div>
        <div className={`text-center ${better === 'right' ? 'bg-brand-50 -mx-4 px-4 rounded-r' : ''}`}>
          {renderValue(value2, 'right')}
        </div>
      </div>
    );
  };

  if (!lounge1 && !lounge2) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white">
        {/* Navigation */}
        <header className="container-custom pt-8 pb-6">
          <Navbar />
        </header>

        <div className="container-custom py-20 text-center">
          <div className="text-6xl mb-6">⚖️</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Compare Lounges</h1>
          <p className="text-xl text-gray-600 mb-8">
            No lounges selected for comparison. Browse lounges and select "Compare" to get started.
          </p>
          <Link href="/lounges" className="btn-primary px-8 py-3">
            Browse Lounges
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white">
      {/* Navigation */}
      <header className="container-custom pt-8 pb-6">
          <Navbar />
      </header>

      {/* Comparison Header */}
      <section className="container-custom py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            ⚖️ Lounge Comparison
          </h1>
          <p className="text-gray-600">Side-by-side comparison to help you choose the best lounge</p>
        </div>

        {/* Lounge Headers */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Lounge 1 */}
          <div className="card">
            {lounge1 ? (
              <>
                <img
                  src={lounge1.images[0]}
                  alt={lounge1.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{lounge1.name}</h2>
                <p className="text-brand-600 font-medium mb-1">{lounge1.airport_name}</p>
                <p className="text-gray-600 text-sm">{lounge1.city}, {lounge1.country}</p>
                {lounge1.terminal && (
                  <p className="text-gray-500 text-sm mt-2">Terminal: {lounge1.terminal}</p>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400">No lounge selected</p>
                <Link href="/lounges" className="text-brand-600 hover:text-brand-700 text-sm mt-2 inline-block">
                  Select a lounge
                </Link>
              </div>
            )}
          </div>

          {/* Lounge 2 */}
          <div className="card">
            {lounge2 ? (
              <>
                <img
                  src={lounge2.images[0]}
                  alt={lounge2.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{lounge2.name}</h2>
                <p className="text-brand-600 font-medium mb-1">{lounge2.airport_name}</p>
                <p className="text-gray-600 text-sm">{lounge2.city}, {lounge2.country}</p>
                {lounge2.terminal && (
                  <p className="text-gray-500 text-sm mt-2">Terminal: {lounge2.terminal}</p>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400">No lounge selected</p>
                <Link href="/lounges" className="text-brand-600 hover:text-brand-700 text-sm mt-2 inline-block">
                  Select a lounge
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      {lounge1 && lounge2 && (
        <section className="bg-white py-12">
          <div className="container-custom">
            <div className="max-w-5xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Detailed Comparison
              </h3>

              <div className="bg-white rounded-xl shadow-lg p-6">
                {/* Ratings Section */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span>⭐</span> Ratings & Reviews
                  </h4>
                  <ComparisonRow
                    label="Overall Rating"
                    value1={lounge1.overall_rating}
                    value2={lounge2.overall_rating}
                    type="rating"
                    better={getBetterRating(lounge1.overall_rating, lounge2.overall_rating)}
                  />
                  <ComparisonRow
                    label="Food Quality"
                    value1={lounge1.food_rating}
                    value2={lounge2.food_rating}
                    type="rating"
                    better={getBetterRating(lounge1.food_rating, lounge2.food_rating)}
                  />
                  <ComparisonRow
                    label="Cleanliness"
                    value1={lounge1.cleanliness_rating}
                    value2={lounge2.cleanliness_rating}
                    type="rating"
                    better={getBetterRating(lounge1.cleanliness_rating, lounge2.cleanliness_rating)}
                  />
                  <ComparisonRow
                    label="Comfort"
                    value1={lounge1.comfort_rating}
                    value2={lounge2.comfort_rating}
                    type="rating"
                    better={getBetterRating(lounge1.comfort_rating, lounge2.comfort_rating)}
                  />
                  <ComparisonRow
                    label="Staff Service"
                    value1={lounge1.staff_rating}
                    value2={lounge2.staff_rating}
                    type="rating"
                    better={getBetterRating(lounge1.staff_rating, lounge2.staff_rating)}
                  />
                </div>

                {/* Access & Amenities */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span>🎫</span> Access & Amenities
                  </h4>
                  <ComparisonRow
                    label="Access Methods"
                    value1={lounge1.access_methods}
                    value2={lounge2.access_methods}
                    type="list"
                  />
                  <ComparisonRow
                    label="Amenities"
                    value1={lounge1.amenities}
                    value2={lounge2.amenities}
                    type="list"
                  />
                  <ComparisonRow
                    label="Free Wi-Fi"
                    value1={lounge1.wifi}
                    value2={lounge2.wifi}
                    type="boolean"
                  />
                </div>

                {/* Location */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span>📍</span> Location Details
                  </h4>
                  <ComparisonRow
                    label="Terminal"
                    value1={lounge1.terminal}
                    value2={lounge2.terminal}
                    type="text"
                  />
                  <ComparisonRow
                    label="Location"
                    value1={lounge1.location}
                    value2={lounge2.location}
                    type="text"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex gap-4 justify-center">
                <Link
                  href={`/lounges/${lounge1.id}`}
                  className="btn-primary px-6 py-3"
                >
                  View {lounge1.name.split(' ')[0]} Details
                </Link>
                <Link
                  href={`/lounges/${lounge2.id}`}
                  className="btn-secondary px-6 py-3"
                >
                  View {lounge2.name.split(' ')[0]} Details
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 mt-16">
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
                <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
                <li><a href="mailto:info@tsynca.com" className="hover:text-white">Contact</a></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
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
