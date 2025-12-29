import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Page Not Found | TakeYourLounge",
  description: "The page you're looking for doesn't exist.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="text-9xl font-bold text-brand-600 mb-4">404</div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Page Not Found
        </h1>

        <p className="text-xl text-gray-600 mb-8">
          Oops! The page you're looking for seems to have taken a different flight.
          Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/"
            className="btn-primary text-lg px-8 py-3"
          >
            Go Home
          </Link>
          <Link
            href="/lounges"
            className="btn-secondary text-lg px-8 py-3"
          >
            Browse Lounges
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Popular Destinations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <Link
              href="/lounges"
              className="p-4 border border-gray-200 rounded-lg hover:border-brand-400 hover:bg-brand-50 transition-colors"
            >
              <div className="text-2xl mb-2">🏢</div>
              <div className="font-semibold text-gray-900">All Lounges</div>
              <div className="text-sm text-gray-600">Browse 2,272 lounges</div>
            </Link>

            <Link
              href="/airports"
              className="p-4 border border-gray-200 rounded-lg hover:border-brand-400 hover:bg-brand-50 transition-colors"
            >
              <div className="text-2xl mb-2">✈️</div>
              <div className="font-semibold text-gray-900">Airports</div>
              <div className="text-sm text-gray-600">703 airports worldwide</div>
            </Link>

            <Link
              href="/blog"
              className="p-4 border border-gray-200 rounded-lg hover:border-brand-400 hover:bg-brand-50 transition-colors"
            >
              <div className="text-2xl mb-2">📚</div>
              <div className="font-semibold text-gray-900">Travel Guides</div>
              <div className="text-sm text-gray-600">Expert tips & insights</div>
            </Link>
          </div>
        </div>

        <div className="mt-8 text-gray-500">
          <p>
            Need help?{' '}
            <a
              href="mailto:info@tsynca.com"
              className="text-brand-600 hover:text-brand-700 underline"
            >
              Contact us
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
