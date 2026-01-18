'use client';

import { useEffect, useCallback } from 'react';
import Link from 'next/link';
import affiliateConfig, {
  buildAffiliateUrl,
  getAffiliatePartnersForLounge,
  type AffiliatePartner
} from '@/lib/affiliate-config';

interface LoungeAccessCTAProps {
  loungeId: string;
  loungeName: string;
  airportCode: string;
  accessMethods: string[];
}

// Analytics helper - tracks both impressions and clicks
function trackEvent(eventName: string, params: Record<string, string | number>) {
  if (typeof window !== 'undefined' && 'gtag' in window) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).gtag('event', eventName, params);
  }
}

export default function LoungeAccessCTA({
  loungeId,
  loungeName,
  airportCode,
  accessMethods
}: LoungeAccessCTAProps) {
  // Get relevant affiliate partners based on lounge access methods
  const partners = getAffiliatePartnersForLounge(accessMethods);

  // Check if Priority Pass is available
  const hasPriorityPass = accessMethods.some(m =>
    m.toLowerCase().includes('priority pass')
  );

  // Check if day pass is available
  const hasDayPass = accessMethods.some(m =>
    m.toLowerCase().includes('day pass') ||
    m.toLowerCase().includes('walk-in') ||
    m.toLowerCase().includes('pay per visit')
  );

  // Track CTA impression on mount
  useEffect(() => {
    trackEvent('cta_impression', {
      cta_type: 'lounge_access',
      lounge_id: loungeId,
      lounge_name: loungeName,
      airport_code: airportCode,
      placement: 'lounge_detail_sidebar',
      has_priority_pass: hasPriorityPass ? 1 : 0,
      has_day_pass: hasDayPass ? 1 : 0,
      partner_count: partners.length
    });
  }, [loungeId, loungeName, airportCode, hasPriorityPass, hasDayPass, partners.length]);

  // Handle affiliate link click
  const handleAffiliateClick = useCallback((partner: AffiliatePartner) => {
    trackEvent('affiliate_click', {
      partner: partner.id,
      partner_name: partner.name,
      lounge_id: loungeId,
      lounge_name: loungeName,
      airport_code: airportCode,
      placement: 'lounge_detail_cta'
    });
  }, [loungeId, loungeName, airportCode]);

  // Handle compare cards click
  const handleCompareClick = useCallback(() => {
    trackEvent('compare_cards_click', {
      lounge_id: loungeId,
      lounge_name: loungeName,
      airport_code: airportCode,
      placement: 'lounge_detail_cta'
    });
  }, [loungeId, loungeName, airportCode]);

  return (
    <section
      className="border border-gray-200 rounded-xl bg-gray-50 overflow-hidden"
      aria-label="Lounge access options"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-white">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
          Access This Lounge
        </h3>
      </div>

      {/* CTA Options */}
      <div className="p-4 space-y-3">
        {/* Priority Pass - Primary CTA */}
        {hasPriorityPass && affiliateConfig.priorityPass.isActive && (
          <a
            href={buildAffiliateUrl(affiliateConfig.priorityPass, {
              lounge_id: loungeId,
              airport: airportCode
            })}
            onClick={() => handleAffiliateClick(affiliateConfig.priorityPass)}
            rel="nofollow sponsored"
            target="_blank"
            className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-brand-300 hover:shadow-sm transition-all group"
          >
            <div>
              <p className="font-medium text-gray-900 group-hover:text-brand-700">
                Priority Pass
              </p>
              <p className="text-sm text-gray-500">
                Global lounge access with Priority Pass membership
              </p>
            </div>
            <span className="text-sm text-brand-600 font-medium whitespace-nowrap ml-4">
              View options →
            </span>
          </a>
        )}

        {/* Day Pass - Secondary CTA */}
        {hasDayPass && affiliateConfig.loungeBuddy.isActive && (
          <a
            href={buildAffiliateUrl(affiliateConfig.loungeBuddy, {
              lounge_id: loungeId,
              airport: airportCode
            })}
            onClick={() => handleAffiliateClick(affiliateConfig.loungeBuddy)}
            rel="nofollow sponsored"
            target="_blank"
            className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-brand-300 hover:shadow-sm transition-all group"
          >
            <div>
              <p className="font-medium text-gray-900 group-hover:text-brand-700">
                Day Pass
              </p>
              <p className="text-sm text-gray-500">
                One-time entry to this lounge
              </p>
            </div>
            <span className="text-sm text-brand-600 font-medium whitespace-nowrap ml-4">
              Check availability →
            </span>
          </a>
        )}

        {/* DragonPass - If available */}
        {accessMethods.some(m => m.toLowerCase().includes('dragonpass')) &&
         affiliateConfig.dragonPass.isActive && (
          <a
            href={buildAffiliateUrl(affiliateConfig.dragonPass, {
              lounge_id: loungeId,
              airport: airportCode
            })}
            onClick={() => handleAffiliateClick(affiliateConfig.dragonPass)}
            rel="nofollow sponsored"
            target="_blank"
            className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-brand-300 hover:shadow-sm transition-all group"
          >
            <div>
              <p className="font-medium text-gray-900 group-hover:text-brand-700">
                DragonPass
              </p>
              <p className="text-sm text-gray-500">
                Premium lounge access worldwide
              </p>
            </div>
            <span className="text-sm text-brand-600 font-medium whitespace-nowrap ml-4">
              Learn more →
            </span>
          </a>
        )}

        {/* Compare Cards - Tertiary CTA */}
        {affiliateConfig.compareCards.isActive && (
          <Link
            href={affiliateConfig.compareCards.url}
            onClick={handleCompareClick}
            className="block text-center text-sm text-gray-600 hover:text-brand-600 pt-3 pb-1 transition-colors"
          >
            Not sure which option fits you? <span className="underline">Compare access cards</span>
          </Link>
        )}
      </div>

      {/* Disclosure */}
      <div className="px-4 pb-4">
        <p className="text-xs text-gray-400 text-center">
          We may earn a commission at no extra cost to you.{' '}
          <Link href="/affiliate-disclosure" className="underline hover:text-gray-500">
            Learn more
          </Link>
        </p>
      </div>
    </section>
  );
}
