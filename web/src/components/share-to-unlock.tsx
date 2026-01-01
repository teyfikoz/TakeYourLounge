'use client';

import { useState, useEffect, ReactNode } from 'react';

interface ShareToUnlockProps {
  contentId: string;
  title: string;
  description?: string;
  children: ReactNode;
  shareUrl?: string;
  shareText?: string;
}

export default function ShareToUnlock({
  contentId,
  title,
  description = 'Share this page to unlock exclusive content',
  children,
  shareUrl,
  shareText = 'Check out this amazing airport lounge guide on TakeYourLounge!',
}: ShareToUnlockProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [justUnlocked, setJustUnlocked] = useState(false);

  const storageKey = `unlock_${contentId}`;
  const currentUrl = shareUrl || (typeof window !== 'undefined' ? window.location.href : '');

  useEffect(() => {
    // Check if already unlocked
    const unlocked = localStorage.getItem(storageKey);
    if (unlocked === 'true') {
      setIsUnlocked(true);
    }
    setIsLoading(false);
  }, [storageKey]);

  const handleUnlock = () => {
    localStorage.setItem(storageKey, 'true');
    setIsUnlocked(true);
    setJustUnlocked(true);
    setShowShareOptions(false);

    // Celebrate animation
    setTimeout(() => setJustUnlocked(false), 2000);
  };

  const handleShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(currentUrl);
    const encodedText = encodeURIComponent(shareText);

    let shareLink = '';

    switch (platform) {
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(currentUrl);
        alert('Link copied to clipboard! 📋');
        handleUnlock();
        return;
    }

    // Open share window
    if (shareLink) {
      window.open(shareLink, '_blank', 'width=600,height=400');

      // Unlock after sharing
      setTimeout(() => {
        handleUnlock();
      }, 1000);
    }
  };

  if (isLoading) {
    return (
      <div className="relative">
        <div className="blur-sm pointer-events-none">{children}</div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
        </div>
      </div>
    );
  }

  if (isUnlocked) {
    return (
      <div className={`transition-all duration-500 ${justUnlocked ? 'animate-pulse' : ''}`}>
        {justUnlocked && (
          <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 mb-6 text-center">
            <div className="text-4xl mb-2">🎉</div>
            <div className="font-bold text-green-800 text-lg">Content Unlocked!</div>
            <div className="text-green-600 text-sm">Thank you for sharing!</div>
          </div>
        )}
        {children}
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Blurred Content */}
      <div className="blur-md pointer-events-none select-none">
        {children}
      </div>

      {/* Unlock Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-white/80 to-white/95 backdrop-blur-sm">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-brand-200">
            {/* Icon */}
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🔒</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-600">{description}</p>
            </div>

            {/* Share Button */}
            {!showShareOptions ? (
              <button
                onClick={() => setShowShareOptions(true)}
                className="w-full bg-gradient-to-r from-brand-600 to-brand-700 text-white font-semibold py-4 rounded-xl hover:from-brand-700 hover:to-brand-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                🔓 Share to Unlock
              </button>
            ) : (
              <div className="space-y-4">
                <p className="text-center text-sm text-gray-600 font-medium">Choose your platform:</p>

                {/* Share Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleShare('twitter')}
                    className="bg-[#1DA1F2] text-white font-semibold py-3 rounded-lg hover:bg-[#1a8cd8] transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                    Twitter
                  </button>

                  <button
                    onClick={() => handleShare('facebook')}
                    className="bg-[#1877F2] text-white font-semibold py-3 rounded-lg hover:bg-[#166fe5] transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook
                  </button>

                  <button
                    onClick={() => handleShare('linkedin')}
                    className="bg-[#0A66C2] text-white font-semibold py-3 rounded-lg hover:bg-[#095196] transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn
                  </button>

                  <button
                    onClick={() => handleShare('copy')}
                    className="bg-gray-700 text-white font-semibold py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy Link
                  </button>
                </div>

                {/* Back Button */}
                <button
                  onClick={() => setShowShareOptions(false)}
                  className="w-full text-gray-600 hover:text-gray-800 text-sm py-2"
                >
                  ← Back
                </button>
              </div>
            )}

            {/* Info */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                💡 No signup required. Content unlocks instantly after sharing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to check if content is unlocked (for conditional rendering)
export const isContentUnlocked = (contentId: string): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(`unlock_${contentId}`) === 'true';
};
