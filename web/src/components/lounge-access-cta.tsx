'use client';

import { useEffect, useCallback, useState } from 'react';
import Link from 'next/link';
import affiliateConfig, {
  buildAffiliateUrl,
  getAffiliatePartnersForLounge,
  type AffiliatePartner
} from '@/lib/affiliate-config';
import { getClientLocale, getCTACopy, type Locale } from '@/lib/cta-copy';

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
  // Locale detection
  const [locale, setLocale] = useState<Locale>('en');
  const [copy, setCopy] = useState(getCTACopy('en'));

  useEffect(() => {
    const detectedLocale = getClientLocale();
    setLocale(detectedLocale);
    setCopy(getCTACopy(detectedLocale));
  }, []);

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

  // Check if DragonPass is available
  const hasDragonPass = accessMethods.some(m =>
    m.toLowerCase().includes('dragonpass')
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
      partner_count: partners.length,
      locale: locale
    });
  }, [loungeId, loungeName, airportCode, hasPriorityPass, hasDayPass, partners.length, locale]);

  // Handle affiliate link click with enhanced tracking
  const handleAffiliateClick = useCallback((
    partner: AffiliatePartner,
    ctaLabel: 'priority_pass' | 'day_pass' | 'dragon_pass',
    ctaPosition: 'primary' | 'secondary' | 'tertiary'
  ) => {
    trackEvent('affiliate_click', {
      partner: partner.id,
      partner_name: partner.name,
      lounge_id: loungeId,
      lounge_name: loungeName,
      airport_code: airportCode,
      placement: 'lounge_detail_cta',
      cta_label: ctaLabel,
      cta_position: ctaPosition,
      locale: locale
    });
  }, [loungeId, loungeName, airportCode, locale]);

  // Handle compare cards click
  const handleCompareClick = useCallback(() => {
    trackEvent('compare_cards_click', {
      lounge_id: loungeId,
      lounge_name: loungeName,
      airport_code: airportCode,
      placement: 'lounge_detail_cta',
      cta_label: 'compare_cards',
      cta_position: 'nurture',
      locale: locale
    });
  }, [loungeId, loungeName, airportCode, locale]);

  return (
    <section
      id="lounge-access-cta"
      className="border border-gray-200 rounded-xl bg-gray-50 overflow-hidden"
      aria-label="Lounge access options"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-white">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
          {copy.title}
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
            onClick={() => handleAffiliateClick(affiliateConfig.priorityPass, 'priority_pass', 'primary')}
            rel="nofollow sponsored"
            target="_blank"
            className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-brand-300 hover:shadow-sm transition-all group"
          >
            <div>
              <p className="font-medium text-gray-900 group-hover:text-brand-700">
                {copy.priorityPass.title}
              </p>
              <p className="text-sm text-gray-500">
                {copy.priorityPass.desc}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {copy.priorityPass.hint}
              </p>
            </div>
            <span className="text-sm text-brand-600 font-medium whitespace-nowrap ml-4">
              {copy.priorityPass.cta}
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
            onClick={() => handleAffiliateClick(affiliateConfig.loungeBuddy, 'day_pass', 'secondary')}
            rel="nofollow sponsored"
            target="_blank"
            className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-brand-300 hover:shadow-sm transition-all group"
          >
            <div>
              <p className="font-medium text-gray-900 group-hover:text-brand-700">
                {copy.dayPass.title}
              </p>
              <p className="text-sm text-gray-500">
                {copy.dayPass.desc}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {copy.dayPass.hint}
              </p>
            </div>
            <span className="text-sm text-brand-600 font-medium whitespace-nowrap ml-4">
              {copy.dayPass.cta}
            </span>
          </a>
        )}

        {/* DragonPass - Tertiary CTA */}
        {hasDragonPass && affiliateConfig.dragonPass.isActive && (
          <a
            href={buildAffiliateUrl(affiliateConfig.dragonPass, {
              lounge_id: loungeId,
              airport: airportCode
            })}
            onClick={() => handleAffiliateClick(affiliateConfig.dragonPass, 'dragon_pass', 'tertiary')}
            rel="nofollow sponsored"
            target="_blank"
            className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-brand-300 hover:shadow-sm transition-all group"
          >
            <div>
              <p className="font-medium text-gray-900 group-hover:text-brand-700">
                {copy.dragonPass.title}
              </p>
              <p className="text-sm text-gray-500">
                {copy.dragonPass.desc}
              </p>
            </div>
            <span className="text-sm text-brand-600 font-medium whitespace-nowrap ml-4">
              {copy.dragonPass.cta}
            </span>
          </a>
        )}

        {/* Compare Cards - Nurture CTA */}
        {affiliateConfig.compareCards.isActive && (
          <Link
            href={affiliateConfig.compareCards.url}
            onClick={handleCompareClick}
            className="block text-center text-sm text-gray-600 hover:text-brand-600 pt-3 pb-1 transition-colors"
          >
            {copy.compare.question} <span className="underline">{copy.compare.link}</span>
          </Link>
        )}
      </div>

      {/* Trust Signal + Disclosure */}
      <div className="px-4 pb-4 space-y-2">
        <p className="text-xs text-gray-500 text-center">
          {copy.trust}
        </p>
        <p className="text-xs text-gray-400 text-center">
          {copy.disclosure.text}{' '}
          <Link href="/affiliate-disclosure" className="underline hover:text-gray-500">
            {copy.disclosure.link}
          </Link>
        </p>
      </div>
    </section>
  );
}
