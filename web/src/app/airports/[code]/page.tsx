import Link from 'next/link';
import Image from 'next/image';
import airportData from '@/data/airports.json';
import { Airport, Lounge } from '@/types/lounge';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ code: string }>;
}

export async function generateStaticParams() {
  return airportData.airports.map((airport: any) => ({
    code: airport.code,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { code } = await params;
  const airport = airportData.airports.find((a: any) => a.code === code);

  if (!airport) {
    return {
      title: 'Airport Not Found | TakeYourLounge',
    };
  }

  const title = `${airport.name} (${airport.code}) - ${airport.lounge_count} Lounges | TakeYourLounge`;
  const description = `Discover ${airport.lounge_count} premium airport lounges at ${airport.name} in ${airport.city}, ${airport.country}. ${airport.available_access_methods.length} access methods available. Average rating: ${airport.avg_rating > 0 ? airport.avg_rating.toFixed(1) : 'Not rated yet'}.`;

  return {
    title,
    description,
    keywords: `${airport.code} lounges, ${airport.name}, ${airport.city} airport, ${airport.country} airport lounges, ${airport.available_access_methods.join(', ')}`,
    alternates: {
      canonical: `https://takeyourlounge.com/airports/${airport.code}`,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://takeyourlounge.com/airports/${airport.code}`,
      siteName: 'TakeYourLounge',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}

export default async function AirportPage({ params }: PageProps) {
  const { code } = await params;
  const airport = airportData.airports.find((a: any) => a.code === code);

  if (!airport) {
    notFound();
  }

  // Schema.org structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Airport',
    name: airport.name,
    iataCode: airport.code,
    address: {
      '@type': 'PostalAddress',
      addressLocality: airport.city,
      addressCountry: airport.country,
    },
    geo: airport.coordinates ? {
      '@type': 'GeoCoordinates',
      latitude: airport.coordinates.lat,
      longitude: airport.coordinates.lng,
    } : undefined,
    aggregateRating: airport.avg_rating > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: airport.avg_rating,
      reviewCount: airport.lounges.reduce((sum: number, l: any) => sum + l.review_count, 0),
      bestRating: 5,
      worstRating: 1,
    } : undefined,
  };

  // Group lounges by type
  const loungesByType = airport.lounges.reduce((acc: any, lounge: any) => {
    const type = lounge.lounge_type;
    if (!acc[type]) acc[type] = [];
    acc[type].push(lounge);
    return acc;
  }, {} as Record<string, any[]>);

  const typeLabels: Record<string, { label: string; icon: string; color: string }> = {
    centurion: { label: 'Centurion Lounges', icon: '✨', color: 'brand' },
    operator: { label: 'Airline Operator Lounges', icon: '🏢', color: 'blue' },
    independent: { label: 'Independent Lounges', icon: '🔑', color: 'gray' },
    partner: { label: 'Partner Lounges', icon: '🤝', color: 'green' },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Header */}
      <header className="bg-white border-b">
        <div className="container-custom py-6">
          <nav className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-brand-700">
              TakeYourLounge
            </Link>
            <div className="space-x-6">
              <Link href="/airports" className="text-gray-700 hover:text-brand-600">
                ← Back to Airports
              </Link>
              <Link href="/lounges" className="text-gray-700 hover:text-brand-600">
                Lounges
              </Link>
              <Link href="/" className="text-gray-700 hover:text-brand-600">
                Home
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <main className="container-custom py-8">
        {/* Airport Hero */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="bg-brand-600 text-white px-4 py-2 rounded-lg font-bold text-2xl inline-block mb-4">
                {airport.code}
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {airport.name}
              </h1>
              <div className="flex items-center gap-4 text-lg text-gray-600">
                <span>📍 {airport.city}, {airport.country}</span>
                {airport.continent && (
                  <span className="text-gray-400">• {airport.continent}</span>
                )}
              </div>
            </div>

            {airport.avg_rating > 0 && (
              <div className="text-center bg-brand-50 rounded-lg p-4">
                <div className="text-3xl font-bold text-brand-600 mb-1">
                  {airport.avg_rating.toFixed(1)}
                </div>
                <div className="text-sm text-brand-700">Average Rating</div>
                <div className="text-yellow-500 text-xl mt-1">⭐⭐⭐⭐⭐</div>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-brand-600">
                {airport.lounge_count}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {airport.lounge_count === 1 ? 'Lounge' : 'Lounges'}
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-gray-900">
                {Object.keys(airport.terminals).length}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {Object.keys(airport.terminals).length === 1 ? 'Terminal' : 'Terminals'}
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-gray-900">
                {airport.available_access_methods.length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Access Methods</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-gray-900">
                {airport.common_amenities.length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Amenities</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Lounges by Terminal */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Lounges by Terminal
              </h2>
              <div className="space-y-6">
                {Object.entries(airport.terminals).map(([terminal, lounges]: [string, any[]]) => (
                  <div key={terminal} className="border-b border-gray-100 pb-6 last:border-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="bg-brand-100 text-brand-700 px-3 py-1 rounded-lg text-sm">
                        {terminal === 'Unknown' ? 'Terminal Info Not Available' : terminal}
                      </span>
                      <span className="text-gray-500 text-sm font-normal">
                        ({lounges.length} {lounges.length === 1 ? 'lounge' : 'lounges'})
                      </span>
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      {lounges.map((lounge: any) => (
                        <Link
                          key={lounge.id}
                          href={`/lounges/${lounge.id}`}
                          className="border border-gray-200 rounded-lg p-4 hover:border-brand-500 hover:shadow-md transition-all group"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-gray-900 group-hover:text-brand-600">
                              {lounge.name}
                            </h4>
                            {lounge.rating > 0 && (
                              <span className="flex items-center gap-1 text-sm text-brand-600">
                                ⭐ {lounge.rating.toFixed(1)}
                              </span>
                            )}
                          </div>
                          {lounge.location && (
                            <p className="text-sm text-gray-600 mb-2">📌 {lounge.location}</p>
                          )}
                          {lounge.open_hours && (
                            <p className="text-sm text-gray-600 mb-2">🕐 {lounge.open_hours}</p>
                          )}
                          {lounge.amenities.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {lounge.amenities.slice(0, 4).map((amenity: any, idx: number) => (
                                <span
                                  key={idx}
                                  className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                                >
                                  {amenity}
                                </span>
                              ))}
                              {lounge.amenities.length > 4 && (
                                <span className="text-xs text-gray-500 px-2 py-1">
                                  +{lounge.amenities.length - 4} more
                                </span>
                              )}
                            </div>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Lounges by Type */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Lounges by Type
              </h2>
              <div className="space-y-4">
                {Object.entries(loungesByType as Record<string, any[]>).map(([type, lounges]: [string, any[]]) => {
                  const typeInfo = typeLabels[type] || { label: type, icon: '📍', color: 'gray' };
                  return (
                    <div key={type} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl">{typeInfo.icon}</span>
                        <h3 className="font-semibold text-gray-900">{typeInfo.label}</h3>
                        <span className="text-sm text-gray-500">({lounges.length})</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {lounges.map((lounge: any) => (
                          <Link
                            key={lounge.id}
                            href={`/lounges/${lounge.id}`}
                            className="text-sm bg-gray-50 hover:bg-brand-50 hover:text-brand-700 text-gray-700 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            {lounge.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Access Methods */}
            {airport.available_access_methods.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-bold text-gray-900 mb-4">Available Access Methods</h3>
                <div className="space-y-2">
                  {airport.available_access_methods.map((method: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm text-gray-700 bg-brand-50 p-2 rounded-lg"
                    >
                      <span className="text-brand-600">🎫</span>
                      <span>{method}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Common Amenities */}
            {airport.common_amenities.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-bold text-gray-900 mb-4">Common Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {airport.common_amenities.map((amenity: any, index: number) => (
                    <span
                      key={index}
                      className="text-sm bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Map Placeholder */}
            {airport.coordinates && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-bold text-gray-900 mb-4">Location</h3>
                <div className="bg-gray-100 h-48 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="text-4xl mb-2">🗺️</div>
                    <div>Map View Coming Soon</div>
                    <div className="text-xs mt-2">
                      {airport.coordinates.lat.toFixed(4)}, {airport.coordinates.lng.toFixed(4)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="bg-brand-600 rounded-xl shadow-md p-6 text-white">
              <h3 className="font-bold mb-2">Planning a visit?</h3>
              <p className="text-brand-100 text-sm mb-4">
                Download LoungeConnect to network with travelers at {airport.code}
              </p>
              <button className="w-full bg-white text-brand-600 font-medium py-2 px-4 rounded-lg hover:bg-brand-50 transition-colors">
                Coming Soon
              </button>
            </div>
          </div>
        </div>

        {/* Similar Airports */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            More Airports in {airport.country}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {airportData.airports
              .filter((a: any) => a.country === airport.country && a.code !== airport.code)
              .slice(0, 3)
              .map((relatedAirport: any) => (
                <Link
                  key={relatedAirport.code}
                  href={`/airports/${relatedAirport.code}`}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="bg-brand-600 text-white px-3 py-1 rounded-lg font-bold text-lg inline-block mb-3">
                    {relatedAirport.code}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{relatedAirport.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">📍 {relatedAirport.city}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-brand-600 font-medium">
                      {relatedAirport.lounge_count} {relatedAirport.lounge_count === 1 ? 'lounge' : 'lounges'}
                    </span>
                    {relatedAirport.avg_rating > 0 && (
                      <span className="flex items-center gap-1">
                        ⭐ {relatedAirport.avg_rating.toFixed(1)}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
          </div>
          {airportData.airports.filter((a: any) => a.country === airport.country && a.code !== airport.code).length === 0 && (
            <div className="bg-white rounded-xl shadow-md p-8 text-center text-gray-500">
              <p>No other airports found in {airport.country}</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 mt-16">
        <div className="container-custom text-center">
          <p className="text-sm">&copy; 2025 TakeYourLounge. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
