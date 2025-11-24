import Link from 'next/link';
import Image from 'next/image';
import loungeData from '@/data/lounges.json';
import { Lounge } from '@/types/lounge';
import { notFound } from 'next/navigation';
import ReviewForm from '@/components/ReviewForm';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return loungeData.lounges.map((lounge: any) => ({
    id: lounge.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const lounge = loungeData.lounges.find((l: any) => l.id === id);

  if (!lounge) {
    return {
      title: 'Lounge Not Found | TakeYourLounge',
    };
  }

  const title = `${lounge.name} - ${lounge.airport_code} ${lounge.city} | TakeYourLounge`;
  const description = lounge.description
    ? lounge.description.slice(0, 155)
    : `${lounge.name} at ${lounge.airport_name} (${lounge.airport_code}) in ${lounge.city}, ${lounge.country}. ${lounge.amenities.length} amenities, ${lounge.access_methods.length} access methods. Rating: ${lounge.rating > 0 ? lounge.rating.toFixed(1) : 'Not rated yet'}.`;

  return {
    title,
    description,
    keywords: `${lounge.name}, ${lounge.airport_code} lounge, ${lounge.city} airport lounge, ${lounge.country} lounge, ${lounge.access_methods.join(', ')}, airport lounge`,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://takeyourlounge.com/lounges/${lounge.id}`,
      siteName: 'TakeYourLounge',
      images: lounge.images.length > 0 ? [
        {
          url: lounge.images[0],
          width: 1200,
          height: 630,
          alt: `${lounge.name} at ${lounge.airport_code}`,
        },
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: lounge.images.length > 0 ? [lounge.images[0]] : [],
    },
  };
}

export default async function LoungePage({ params }: PageProps) {
  const { id } = await params;
  const lounge = loungeData.lounges.find((l: any) => l.id === id);

  if (!lounge) {
    notFound();
  }

  // Schema.org structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: lounge.name,
    description: lounge.description || `${lounge.name} at ${lounge.airport_name}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: lounge.city,
      addressCountry: lounge.country,
    },
    geo: lounge.coordinates ? {
      '@type': 'GeoCoordinates',
      latitude: lounge.coordinates.lat,
      longitude: lounge.coordinates.lng,
    } : undefined,
    image: lounge.images,
    aggregateRating: lounge.rating > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: lounge.rating,
      reviewCount: lounge.review_count,
      bestRating: 5,
      worstRating: 1,
    } : undefined,
    amenityFeature: lounge.amenities.map(amenity => ({
      '@type': 'LocationFeatureSpecification',
      name: amenity,
    })),
    publicAccess: true,
    isAccessibleForFree: false,
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
              <Link href="/lounges" className="text-gray-700 hover:text-brand-600">
                ← Back to Lounges
              </Link>
              <Link href="/" className="text-gray-700 hover:text-brand-600">
                Home
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <main className="container-custom py-8">
        {/* Hero Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          {/* Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
            {lounge.images.slice(0, 2).map((image: any, index) => (
              <div key={index} className="relative h-64 md:h-96 rounded-lg overflow-hidden">
                <Image
                  src={image}
                  alt={`${lounge.name} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={index === 0}
                />
              </div>
            ))}
          </div>

          {/* Main Info */}
          <div className="p-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {lounge.name}
                </h1>
                <div className="flex items-center gap-4 text-lg text-gray-600">
                  <span>📍 {lounge.city}, {lounge.country}</span>
                  {lounge.rating > 0 && (
                    <span className="flex items-center gap-1 text-brand-600 font-medium">
                      ⭐ {lounge.rating.toFixed(1)}
                      <span className="text-gray-500 text-sm">
                        ({lounge.review_count} reviews)
                      </span>
                    </span>
                  )}
                </div>
              </div>

              {/* Lounge Type Badge */}
              <div className="bg-brand-100 text-brand-700 px-4 py-2 rounded-lg font-medium">
                {lounge.lounge_type === 'centurion' && '✨ Centurion Lounge'}
                {lounge.lounge_type === 'operator' && '🏢 Operator Lounge'}
                {lounge.lounge_type === 'independent' && '🔑 Independent'}
                {lounge.lounge_type === 'partner' && '🤝 Partner Lounge'}
              </div>
            </div>

            {/* Description */}
            {lounge.description && (
              <p className="text-gray-700 mb-6 leading-relaxed">
                {lounge.description}
              </p>
            )}

            {/* Quick Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Airport */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-gray-500 text-sm mb-1">Airport</div>
                <div className="font-medium text-gray-900">
                  ✈️ {lounge.airport_name || lounge.airport_code}
                </div>
                <div className="text-sm text-gray-600">
                  {lounge.airport_code}
                </div>
              </div>

              {/* Terminal */}
              {lounge.terminal && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-gray-500 text-sm mb-1">Terminal</div>
                  <div className="font-medium text-gray-900">
                    🚪 {lounge.terminal}
                  </div>
                </div>
              )}

              {/* Location */}
              {lounge.location && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-gray-500 text-sm mb-1">Location</div>
                  <div className="font-medium text-gray-900 text-sm">
                    📌 {lounge.location}
                  </div>
                </div>
              )}

              {/* Open Hours */}
              {lounge.open_hours && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-gray-500 text-sm mb-1">Open Hours</div>
                  <div className="font-medium text-gray-900">
                    🕐 {lounge.open_hours}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Access Methods */}
            {lounge.access_methods.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Access Methods
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {lounge.access_methods.map((method: any, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 bg-brand-50 p-3 rounded-lg"
                    >
                      <span className="text-brand-600 text-xl">🎫</span>
                      <span className="font-medium text-gray-900">{method}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Amenities */}
            {lounge.amenities.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Amenities & Services
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {lounge.amenities.map((amenity: any, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-brand-600">✓</span>
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            {lounge.coordinates && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Location Map
                </h2>
                <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="text-4xl mb-2">🗺️</div>
                    <div>Map View Coming Soon</div>
                    <div className="text-sm mt-2">
                      Coordinates: {lounge.coordinates.lat.toFixed(4)}, {lounge.coordinates.lng.toFixed(4)}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-bold text-gray-900 mb-4">Quick Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Country</span>
                  <span className="font-medium text-gray-900">{lounge.country}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">City</span>
                  <span className="font-medium text-gray-900">{lounge.city}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Airport Code</span>
                  <span className="font-medium text-gray-900">{lounge.airport_code}</span>
                </div>
                {lounge.continent && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Continent</span>
                    <span className="font-medium text-gray-900">{lounge.continent}</span>
                  </div>
                )}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-brand-600 rounded-xl shadow-md p-6 text-white">
              <h3 className="font-bold mb-2">Want to network here?</h3>
              <p className="text-brand-100 text-sm mb-4">
                Download LoungeConnect to meet fellow travelers at this lounge
              </p>
              <button className="w-full bg-white text-brand-600 font-medium py-2 px-4 rounded-lg hover:bg-brand-50 transition-colors">
                Coming Soon
              </button>
            </div>

            {/* Share */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-bold text-gray-900 mb-4">Share Lounge</h3>
              <div className="flex gap-2">
                <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors">
                  Twitter
                </button>
                <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors">
                  Facebook
                </button>
                <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors">
                  Copy Link
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Review Form */}
        <div className="mt-16">
          <ReviewForm
            loungeId={lounge.id}
            loungeName={lounge.name}
          />
        </div>

        {/* Similar Lounges */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            More Lounges at {lounge.airport_code}
          </h2>
          <div className="bg-white rounded-xl shadow-md p-8 text-center text-gray-500">
            <div className="text-4xl mb-2">🔍</div>
            <p>Similar lounges coming soon...</p>
          </div>
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
