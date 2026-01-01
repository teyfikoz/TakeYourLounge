'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Lounge } from '@/types/lounge';
import { addToCompare, removeFromCompare, isInCompare } from './compare-selector';

interface LoungeCardProps {
  lounge: Lounge;
}

export default function LoungeCard({ lounge }: LoungeCardProps) {
  const [inCompare, setInCompare] = useState(false);

  useEffect(() => {
    setInCompare(isInCompare(lounge.id));

    const handleCompareUpdate = () => {
      setInCompare(isInCompare(lounge.id));
    };

    window.addEventListener('addToCompare', handleCompareUpdate);
    window.addEventListener('removeFromCompare', handleCompareUpdate);
    window.addEventListener('clearCompare', handleCompareUpdate);

    return () => {
      window.removeEventListener('addToCompare', handleCompareUpdate);
      window.removeEventListener('removeFromCompare', handleCompareUpdate);
      window.removeEventListener('clearCompare', handleCompareUpdate);
    };
  }, [lounge.id]);

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (inCompare) {
      removeFromCompare(lounge.id);
    } else {
      addToCompare({
        id: lounge.id,
        name: lounge.name,
        airport_code: lounge.airport_code,
        image: lounge.images[0] || '/images/placeholder-lounge.jpg'
      });
    }
  };

  return (
    <div className="relative">
      <Link href={`/lounges/${lounge.id}`} className="block">
        <div className="card group cursor-pointer h-full">
        {/* Image */}
        <div className="relative h-48 -mx-6 -mt-6 mb-4 overflow-hidden rounded-t-lg bg-gray-100">
          <Image
            src={lounge.images[0] || '/images/placeholder-lounge.jpg'}
            alt={lounge.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Lounge Type Badge */}
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium">
            {lounge.lounge_type === 'centurion' && '✨ Centurion'}
            {lounge.lounge_type === 'operator' && '🏢 Operator'}
            {lounge.lounge_type === 'independent' && '🔑 Independent'}
            {lounge.lounge_type === 'partner' && '🤝 Partner'}
          </div>

          {/* Rating Badge */}
          {lounge.rating > 0 && (
            <div className="absolute top-3 left-3 bg-brand-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
              ⭐ {lounge.rating.toFixed(1)}
            </div>
          )}
        </div>

        {/* Content */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-brand-600 transition-colors">
            {lounge.name}
          </h3>

          <div className="space-y-2 text-sm text-gray-600 mb-4">
            {/* Location */}
            <div className="flex items-start gap-2">
              <span className="text-gray-400">📍</span>
              <span>
                {lounge.city && lounge.country ? (
                  <>{lounge.city}, {lounge.country}</>
                ) : (
                  lounge.airport_name || lounge.airport_code
                )}
              </span>
            </div>

            {/* Airport */}
            {lounge.airport_name && (
              <div className="flex items-start gap-2">
                <span className="text-gray-400">✈️</span>
                <span>{lounge.airport_name} ({lounge.airport_code})</span>
              </div>
            )}

            {/* Terminal */}
            {lounge.terminal && (
              <div className="flex items-start gap-2">
                <span className="text-gray-400">🚪</span>
                <span>Terminal {lounge.terminal}</span>
              </div>
            )}
          </div>

          {/* Access Methods */}
          {lounge.access_methods.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {lounge.access_methods.slice(0, 3).map((method, index) => (
                <span
                  key={index}
                  className="inline-block bg-brand-50 text-brand-700 text-xs px-2 py-1 rounded"
                >
                  {method}
                </span>
              ))}
              {lounge.access_methods.length > 3 && (
                <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                  +{lounge.access_methods.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Amenities */}
          {lounge.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1 text-xs text-gray-500">
              {lounge.amenities.slice(0, 4).map((amenity, index) => (
                <span key={index}>
                  {amenity}
                  {index < Math.min(3, lounge.amenities.length - 1) && ' •'}
                </span>
              ))}
              {lounge.amenities.length > 4 && (
                <span>+{lounge.amenities.length - 4} more</span>
              )}
            </div>
          )}

          {/* Open Hours */}
          {lounge.open_hours && (
            <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
              🕐 {lounge.open_hours}
            </div>
          )}
        </div>
      </div>
      </Link>

      {/* Compare Button - Outside Link */}
      <button
        onClick={handleCompareClick}
        className={`absolute top-3 right-3 px-3 py-1.5 rounded-lg text-sm font-medium transition-all z-10 ${
          inCompare
            ? 'bg-brand-600 text-white hover:bg-brand-700'
            : 'bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-brand-50 hover:text-brand-600 border border-gray-200'
        }`}
        title={inCompare ? 'Remove from comparison' : 'Add to comparison'}
      >
        {inCompare ? '✓ Added' : '⚖️ Compare'}
      </button>
    </div>
  );
}
