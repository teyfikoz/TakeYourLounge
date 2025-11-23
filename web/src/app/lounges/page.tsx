'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import LoungeCard from '@/components/LoungeCard';
import loungeData from '@/data/lounges.json';
import { Lounge } from '@/types/lounge';

export default function LoungesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedAirport, setSelectedAirport] = useState('');
  const [selectedAccessMethod, setSelectedAccessMethod] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const loungesPerPage = 24;

  // Get unique countries, cities, airports, and access methods
  const countries = useMemo(() => {
    const uniqueCountries = new Set<string>();
    loungeData.lounges.forEach((lounge: Lounge) => {
      if (lounge.country) uniqueCountries.add(lounge.country);
    });
    return Array.from(uniqueCountries).sort();
  }, []);

  const cities = useMemo(() => {
    const uniqueCities = new Set<string>();
    loungeData.lounges.forEach((lounge: Lounge) => {
      if (lounge.city) uniqueCities.add(lounge.city);
    });
    return Array.from(uniqueCities).sort();
  }, []);

  const airports = useMemo(() => {
    const uniqueAirports = new Set<string>();
    loungeData.lounges.forEach((lounge: Lounge) => {
      if (lounge.airport_name) {
        uniqueAirports.add(`${lounge.airport_code} - ${lounge.airport_name}`);
      }
    });
    return Array.from(uniqueAirports).sort();
  }, []);

  const accessMethods = useMemo(() => {
    const uniqueMethods = new Set<string>();
    loungeData.lounges.forEach((lounge: Lounge) => {
      lounge.access_methods.forEach(method => uniqueMethods.add(method));
    });
    return Array.from(uniqueMethods).sort();
  }, []);

  // Filter lounges
  const filteredLounges = useMemo(() => {
    return loungeData.lounges.filter((lounge: Lounge) => {
      const matchesSearch = searchTerm === '' ||
        lounge.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lounge.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lounge.airport_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lounge.airport_name?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCountry = selectedCountry === '' || lounge.country === selectedCountry;

      const matchesCity = selectedCity === '' || lounge.city === selectedCity;

      const matchesAirport = selectedAirport === '' ||
        `${lounge.airport_code} - ${lounge.airport_name}` === selectedAirport;

      const matchesAccessMethod = selectedAccessMethod === '' ||
        lounge.access_methods.includes(selectedAccessMethod);

      return matchesSearch && matchesCountry && matchesCity && matchesAirport && matchesAccessMethod;
    });
  }, [searchTerm, selectedCountry, selectedCity, selectedAirport, selectedAccessMethod]);

  // Pagination
  const totalPages = Math.ceil(filteredLounges.length / loungesPerPage);
  const startIndex = (currentPage - 1) * loungesPerPage;
  const paginatedLounges = filteredLounges.slice(startIndex, startIndex + loungesPerPage);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container-custom py-6">
          <nav className="flex justify-between items-center mb-6">
            <Link href="/" className="text-2xl font-bold text-brand-700">
              TakeYourLounge
            </Link>
            <div className="space-x-6">
              <Link href="/lounges" className="text-brand-600 font-medium">
                Lounges
              </Link>
              <Link href="/airports" className="text-gray-700 hover:text-brand-600">
                Airports
              </Link>
              <Link href="/" className="text-gray-700 hover:text-brand-600">
                Home
              </Link>
            </div>
          </nav>

          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Airport Lounges Directory
          </h1>
          <p className="text-lg text-gray-600">
            Browse {loungeData.total.toLocaleString()} premium lounges worldwide
          </p>
        </div>
      </header>

      {/* Filters */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="container-custom py-4">
          <div className="space-y-4">
            {/* Search and Access Method Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <input
                type="text"
                placeholder="Search by lounge name, city, or airport..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />

              {/* Access Method Filter */}
              <select
                value={selectedAccessMethod}
                onChange={(e) => {
                  setSelectedAccessMethod(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              >
                <option value="">All Access Methods</option>
                {accessMethods.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>

            {/* Country, City, Airport Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Country Filter */}
              <select
                value={selectedCountry}
                onChange={(e) => {
                  setSelectedCountry(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              >
                <option value="">All Countries</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>

              {/* City Filter */}
              <select
                value={selectedCity}
                onChange={(e) => {
                  setSelectedCity(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              >
                <option value="">All Cities</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>

              {/* Airport Filter */}
              <select
                value={selectedAirport}
                onChange={(e) => {
                  setSelectedAirport(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              >
                <option value="">All Airports</option>
                {airports.map((airport) => (
                  <option key={airport} value={airport}>
                    {airport}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {startIndex + 1}-{Math.min(startIndex + loungesPerPage, filteredLounges.length)} of {filteredLounges.length.toLocaleString()} lounges
            {(searchTerm || selectedCountry || selectedCity || selectedAirport || selectedAccessMethod) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCountry('');
                  setSelectedCity('');
                  setSelectedAirport('');
                  setSelectedAccessMethod('');
                  setCurrentPage(1);
                }}
                className="ml-4 text-brand-600 hover:text-brand-700 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Lounges Grid */}
      <main className="container-custom py-8">
        {paginatedLounges.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedLounges.map((lounge: Lounge) => (
                <LoungeCard key={lounge.id} lounge={lounge} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-lg ${
                          currentPage === pageNum
                            ? 'bg-brand-600 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              No lounges found
            </h2>
            <p className="text-gray-600 mb-4">
              Try adjusting your search or filters
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCountry('');
                setSelectedCity('');
                setSelectedAirport('');
                setSelectedAccessMethod('');
                setCurrentPage(1);
              }}
              className="btn-primary"
            >
              Clear all filters
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
