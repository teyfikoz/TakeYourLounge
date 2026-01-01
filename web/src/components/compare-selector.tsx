'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface SelectedLounge {
  id: string;
  name: string;
  airport_code: string;
  image: string;
}

export default function CompareSelector() {
  const router = useRouter();
  const [selected, setSelected] = useState<SelectedLounge[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Load from localStorage on mount
    const stored = localStorage.getItem('compareSelection');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSelected(parsed);
        setIsVisible(parsed.length > 0);
      } catch (e) {
        console.error('Failed to parse compare selection', e);
      }
    }

    // Listen for custom events when lounges are added/removed
    const handleAdd = (e: CustomEvent) => {
      const lounge = e.detail;
      setSelected(prev => {
        // Max 2 lounges for comparison
        if (prev.length >= 2) {
          // Replace the oldest one
          const newSelection = [prev[1], lounge];
          localStorage.setItem('compareSelection', JSON.stringify(newSelection));
          return newSelection;
        }
        const newSelection = [...prev, lounge];
        localStorage.setItem('compareSelection', JSON.stringify(newSelection));
        setIsVisible(true);
        return newSelection;
      });
    };

    const handleRemove = (e: CustomEvent) => {
      const loungeId = e.detail.id;
      setSelected(prev => {
        const newSelection = prev.filter(l => l.id !== loungeId);
        localStorage.setItem('compareSelection', JSON.stringify(newSelection));
        if (newSelection.length === 0) {
          setIsVisible(false);
        }
        return newSelection;
      });
    };

    const handleClear = () => {
      setSelected([]);
      setIsVisible(false);
      localStorage.removeItem('compareSelection');
    };

    window.addEventListener('addToCompare' as any, handleAdd);
    window.addEventListener('removeFromCompare' as any, handleRemove);
    window.addEventListener('clearCompare' as any, handleClear);

    return () => {
      window.removeEventListener('addToCompare' as any, handleAdd);
      window.removeEventListener('removeFromCompare' as any, handleRemove);
      window.removeEventListener('clearCompare' as any, handleClear);
    };
  }, []);

  const handleRemove = (id: string) => {
    const newSelection = selected.filter(l => l.id !== id);
    setSelected(newSelection);
    localStorage.setItem('compareSelection', JSON.stringify(newSelection));

    // Dispatch event for other components
    window.dispatchEvent(new CustomEvent('removeFromCompare', { detail: { id } }));

    if (newSelection.length === 0) {
      setIsVisible(false);
    }
  };

  const handleClear = () => {
    setSelected([]);
    setIsVisible(false);
    localStorage.removeItem('compareSelection');
    window.dispatchEvent(new CustomEvent('clearCompare'));
  };

  const handleCompare = () => {
    if (selected.length === 2) {
      router.push(`/compare?lounge1=${selected[0].id}&lounge2=${selected[1].id}`);
    } else if (selected.length === 1) {
      // Show message that we need 2 lounges
      alert('Please select one more lounge to compare');
    }
  };

  if (!isVisible || selected.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-6 bg-white rounded-2xl shadow-2xl p-6 z-40 max-w-md border-2 border-brand-500">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <span>⚖️</span>
            Compare Lounges
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {selected.length === 1 ? 'Select one more to compare' : 'Ready to compare!'}
          </p>
        </div>
        <button
          onClick={handleClear}
          className="text-gray-400 hover:text-gray-600 text-xl"
          title="Clear all"
        >
          ✕
        </button>
      </div>

      <div className="space-y-3 mb-4">
        {selected.map((lounge, index) => (
          <div key={lounge.id} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
            <img
              src={lounge.image}
              alt={lounge.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-gray-900 truncate">{lounge.name}</div>
              <div className="text-xs text-gray-500">{lounge.airport_code}</div>
            </div>
            <button
              onClick={() => handleRemove(lounge.id)}
              className="text-gray-400 hover:text-red-600 text-sm"
            >
              ✕
            </button>
          </div>
        ))}

        {selected.length === 1 && (
          <div className="flex items-center gap-3 bg-brand-50 rounded-lg p-3 border-2 border-dashed border-brand-300">
            <div className="w-16 h-16 bg-brand-100 rounded flex items-center justify-center text-3xl">
              ➕
            </div>
            <div className="flex-1">
              <div className="font-semibold text-sm text-brand-700">Add one more</div>
              <div className="text-xs text-brand-600">Select another lounge to compare</div>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={handleCompare}
        disabled={selected.length < 2}
        className={`w-full py-3 rounded-lg font-semibold transition-colors ${
          selected.length === 2
            ? 'bg-brand-600 text-white hover:bg-brand-700'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        {selected.length === 2 ? 'Compare Now →' : `Select ${2 - selected.length} more`}
      </button>
    </div>
  );
}

// Helper functions to use in other components
export const addToCompare = (lounge: SelectedLounge) => {
  window.dispatchEvent(new CustomEvent('addToCompare', { detail: lounge }));
};

export const removeFromCompare = (loungeId: string) => {
  window.dispatchEvent(new CustomEvent('removeFromCompare', { detail: { id: loungeId } }));
};

export const isInCompare = (loungeId: string): boolean => {
  const stored = localStorage.getItem('compareSelection');
  if (!stored) return false;
  try {
    const parsed = JSON.parse(stored);
    return parsed.some((l: SelectedLounge) => l.id === loungeId);
  } catch {
    return false;
  }
};
