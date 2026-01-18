'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import airportData from '@/data/airports.json';
import { Airport } from '@/types/lounge';

export default function AirportsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedContinent, setSelectedContinent] = useState('');
  const [sortBy, setSortBy] = useState<'lounges' | 'rating' | 'name'>('lounges');

  // Get unique countries and continents
  const countries = useMemo(() => {
    const uniqueCountries = new Set(airportData.airports.map((a: any) => a.country).filter(Boolean));
    return Array.from(uniqueCountries).sort();
  }, []);

  const continents = useMemo(() => {
    const uniqueContinents = new Set(airportData.airports.map((a: any) => a.continent).filter(Boolean));
    return Array.from(uniqueContinents).sort();
  }, []);

  // Filter and sort airports
  const filteredAirports = useMemo(() => {
    let filtered = airportData.airports.filter((airport: any) => {
      const matchesSearch = searchTerm === '' ||
        airport.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        airport.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        airport.city.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCountry = selectedCountry === '' || airport.country === selectedCountry;
      const matchesContinent = selectedContinent === '' || airport.continent === selectedContinent;

      return matchesSearch && matchesCountry && matchesContinent;
    });

    // Sort
    filtered.sort((a: any, b: any) => {
      switch (sortBy) {
        case 'lounges':
          return b.lounge_count - a.lounge_count;
        case 'rating':
          return b.avg_rating - a.avg_rating;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, selectedCountry, selectedContinent, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container-custom py-6">
          <Navbar />
        </div>
      </header>

      <main className="container-custom py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Airport Lounge Directory
          </h1>
          <p className="text-xl text-gray-600">
            Explore {airportData.total} airports with premium lounge facilities worldwide
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Airport name, code, or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>

            {/* Continent Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Continent
              </label>
              <select
                value={selectedContinent}
                onChange={(e) => setSelectedContinent(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              >
                <option value="">All Continents</option>
                {continents.map((continent) => (
                  <option key={continent} value={continent}>
                    {continent}
                  </option>
                ))}
              </select>
            </div>

            {/* Country Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              >
                <option value="">All Countries</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'lounges' | 'rating' | 'name')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              >
                <option value="lounges">Most Lounges</option>
                <option value="rating">Highest Rated</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredAirports.length} of {airportData.total} airports
          </div>
        </div>

        {/* Airport Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAirports.map((airport: any) => (
            <Link
              key={airport.code}
              href={`/airports/${airport.code}`}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden group"
            >
              <div className="p-6">
                {/* Airport Code Badge */}
                <div className="flex items-start justify-between mb-3">
                  <div className="bg-brand-600 text-white px-3 py-1 rounded-lg font-bold text-lg">
                    {airport.code}
                  </div>
                  {airport.avg_rating > 0 && (
                    <div className="flex items-center gap-1 text-sm">
                      <span className="text-yellow-500">⭐</span>
                      <span className="font-medium text-gray-900">
                        {airport.avg_rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Airport Name */}
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-brand-600 transition-colors">
                  {airport.name}
                </h3>

                {/* Location */}
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <span>📍</span>
                  <span>{airport.city}, {airport.country}</span>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-brand-600">
                      {airport.lounge_count}
                    </div>
                    <div className="text-xs text-gray-500">
                      {airport.lounge_count === 1 ? 'Lounge' : 'Lounges'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {Object.keys(airport.terminals).length}
                    </div>
                    <div className="text-xs text-gray-500">
                      {Object.keys(airport.terminals).length === 1 ? 'Terminal' : 'Terminals'}
                    </div>
                  </div>
                  <div className="text-brand-600 group-hover:translate-x-1 transition-transform">
                    →
                  </div>
                </div>

                {/* Access Methods Preview */}
                {airport.available_access_methods.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="text-xs text-gray-500 mb-2">Access Methods:</div>
                    <div className="flex flex-wrap gap-1">
                      {airport.available_access_methods.slice(0, 3).map((method: any, index: number) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                        >
                          {method}
                        </span>
                      ))}
                      {airport.available_access_methods.length > 3 && (
                        <span className="text-xs text-gray-500 px-2 py-1">
                          +{airport.available_access_methods.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredAirports.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No airports found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filters
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCountry('');
                setSelectedContinent('');
              }}
              className="btn-primary"
            >
              Clear Filters
            </button>
          </div>
        )}
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
