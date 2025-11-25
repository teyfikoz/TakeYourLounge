'use client';

import { useState, useEffect } from 'react';
import { getDeviceId, hasReviewed, markAsReviewed } from '@/lib/deviceId';

interface ReviewFormProps {
  loungeId: string;
  loungeName: string;
  onSubmit?: (review: Review) => void;
}

interface Review {
  deviceId: string;
  loungeId: string;
  cleanliness: number;
  foodQuality: number;
  quietness: number;
  workspace: number;
  service: number;
  overallRating: number;
  comment?: string;
  timestamp: number;
}

const CATEGORIES = [
  { id: 'cleanliness', label: 'Temizlik', icon: '🧹', description: 'Lounge ne kadar temiz?' },
  { id: 'foodQuality', label: 'Yiyecek Kalitesi', icon: '🍽️', description: 'Yemek ve içecekler nasıl?' },
  { id: 'quietness', label: 'Sessizlik', icon: '🔇', description: 'Ortam ne kadar sakin?' },
  { id: 'workspace', label: 'Çalışma Alanı', icon: '💼', description: 'Çalışmak için uygun mu?' },
  { id: 'service', label: 'Hizmet', icon: '👨\u200d✈️', description: 'Personel ve hizmet kalitesi' },
];

export default function ReviewForm({ loungeId, loungeName, onSubmit }: ReviewFormProps) {
  const [hasReviewedAlready, setHasReviewedAlready] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [ratings, setRatings] = useState<Record<string, number>>({
    cleanliness: 0,
    foodQuality: 0,
    quietness: 0,
    workspace: 0,
    service: 0,
  });
  const [comment, setComment] = useState('');
  const [hoveredStars, setHoveredStars] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    setHasReviewedAlready(hasReviewed(loungeId));
  }, [loungeId]);

  const handleStarClick = (category: string, stars: number) => {
    setRatings(prev => ({ ...prev, [category]: stars }));
  };

  const handleStarHover = (category: string, stars: number) => {
    setHoveredStars(prev => ({ ...prev, [category]: stars }));
  };

  const handleStarLeave = (category: string) => {
    setHoveredStars(prev => ({ ...prev, [category]: 0 }));
  };

  const calculateOverallRating = (): number => {
    const values = Object.values(ratings);
    const sum = values.reduce((a, b) => a + b, 0);
    return sum / values.length;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all categories rated
    if (Object.values(ratings).some(rating => rating === 0)) {
      alert('Lütfen tüm kategorilere puan verin');
      return;
    }

    setIsSubmitting(true);

    const review = {
      deviceId: getDeviceId(),
      loungeId,
      ...ratings,
      overallRating: calculateOverallRating(),
      comment: comment.trim(),
      timestamp: Date.now(),
    } as Review;

    // Simulate API call (you'll replace this with actual API)
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mark as reviewed
    markAsReviewed(loungeId);

    // Callback
    if (onSubmit) {
      onSubmit(review);
    }

    setIsSubmitting(false);
    setSubmitSuccess(true);
    setHasReviewedAlready(true);

    // Log to console (you'll send to backend)
    console.log('Review submitted:', review);
  };

  const renderStars = (category: string, currentRating: number) => {
    const displayRating = hoveredStars[category] || currentRating;

    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            onClick={() => handleStarClick(category, star)}
            onMouseEnter={() => handleStarHover(category, star)}
            onMouseLeave={() => handleStarLeave(category)}
            className="text-2xl transition-transform hover:scale-110 focus:outline-none"
          >
            {star <= displayRating ? '⭐' : '☆'}
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {currentRating > 0 ? `${currentRating}/5` : ''}
        </span>
      </div>
    );
  };

  if (hasReviewedAlready && !showForm) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="text-4xl mb-2">✅</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Teşekkürler!
        </h3>
        <p className="text-gray-600">
          Bu lounge için zaten oy kullandınız.
        </p>
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="text-4xl mb-2">🎉</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Oyunuz Kaydedildi!
        </h3>
        <p className="text-gray-600">
          {loungeName} hakkındaki değerlendirmeniz için teşekkür ederiz.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900">
          Bu Lounge'u Değerlendirin
        </h3>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary"
          >
            Oy Ver
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {CATEGORIES.map(category => (
              <div key={category.id} className="border-b border-gray-100 pb-4 last:border-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{category.icon}</span>
                      <h4 className="font-semibold text-gray-900">{category.label}</h4>
                    </div>
                    <p className="text-sm text-gray-500">{category.description}</p>
                  </div>
                </div>
                <div className="mt-2">
                  {renderStars(category.id, ratings[category.id as keyof typeof ratings])}
                </div>
              </div>
            ))}

            {/* Overall Rating Display */}
            {calculateOverallRating() > 0 && (
              <div className="bg-brand-50 rounded-lg p-4 text-center">
                <div className="text-sm text-brand-700 font-medium mb-1">Genel Puan</div>
                <div className="text-3xl font-bold text-brand-600">
                  {calculateOverallRating().toFixed(1)} / 5.0
                </div>
              </div>
            )}

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Yorum (İsteğe Bağlı)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                maxLength={500}
                placeholder="Deneyiminizi paylaşın..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
              />
              <div className="text-xs text-gray-500 mt-1">
                {comment.length}/500 karakter
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting || Object.values(ratings).some(r => r === 0)}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Gönderiliyor...' : 'Oyumu Gönder'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 btn-secondary"
              >
                İptal
              </button>
            </div>
          </div>
        </form>
      )}

      {!showForm && (
        <div className="text-center text-gray-500 text-sm">
          Anonim olarak oy kullanabilirsiniz. Giriş yapmaya gerek yok!
        </div>
      )}
    </div>
  );
}
