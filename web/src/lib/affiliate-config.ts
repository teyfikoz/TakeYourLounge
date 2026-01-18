/**
 * Affiliate Configuration
 *
 * Centralized configuration for all affiliate partner URLs.
 * URLs are injected from config to support:
 * - A/B testing
 * - Geo-based routing (EU/US)
 * - Partner-specific tracking
 *
 * IMPORTANT: Update URLs here when affiliate partnerships are established.
 */

export interface AffiliatePartner {
  id: string;
  name: string;
  description: string;
  url: string;
  isActive: boolean;
  trackingParams?: Record<string, string>;
}

export interface AffiliateConfig {
  priorityPass: AffiliatePartner;
  dragonPass: AffiliatePartner;
  loungeKey: AffiliatePartner;
  plazaPremium: AffiliatePartner;
  loungeBuddy: AffiliatePartner;
  compareCards: {
    url: string;
    isActive: boolean;
  };
}

// Environment-based URL configuration
// Replace placeholder URLs with actual affiliate links when partnerships are established
const affiliateConfig: AffiliateConfig = {
  priorityPass: {
    id: 'priority_pass',
    name: 'Priority Pass',
    description: 'Global lounge access with Priority Pass membership',
    url: process.env.NEXT_PUBLIC_AFFILIATE_PRIORITY_PASS_URL || '/go/priority-pass',
    isActive: true,
    trackingParams: {
      utm_source: 'takeyourlounge',
      utm_medium: 'affiliate',
      utm_campaign: 'lounge_cta'
    }
  },
  dragonPass: {
    id: 'dragon_pass',
    name: 'DragonPass',
    description: 'Premium lounge access worldwide',
    url: process.env.NEXT_PUBLIC_AFFILIATE_DRAGONPASS_URL || '/go/dragonpass',
    isActive: true,
    trackingParams: {
      utm_source: 'takeyourlounge',
      utm_medium: 'affiliate',
      utm_campaign: 'lounge_cta'
    }
  },
  loungeKey: {
    id: 'lounge_key',
    name: 'LoungeKey',
    description: 'Access to 1,100+ airport lounges',
    url: process.env.NEXT_PUBLIC_AFFILIATE_LOUNGEKEY_URL || '/go/loungekey',
    isActive: false, // Enable when partnership established
    trackingParams: {
      utm_source: 'takeyourlounge',
      utm_medium: 'affiliate'
    }
  },
  plazaPremium: {
    id: 'plaza_premium',
    name: 'Plaza Premium',
    description: 'Book day passes at Plaza Premium lounges',
    url: process.env.NEXT_PUBLIC_AFFILIATE_PLAZA_PREMIUM_URL || '/go/plaza-premium',
    isActive: true,
    trackingParams: {
      utm_source: 'takeyourlounge',
      utm_medium: 'affiliate'
    }
  },
  loungeBuddy: {
    id: 'lounge_buddy',
    name: 'LoungeBuddy',
    description: 'Purchase single-visit lounge access',
    url: process.env.NEXT_PUBLIC_AFFILIATE_LOUNGEBUDDY_URL || '/go/loungebuddy',
    isActive: true,
    trackingParams: {
      utm_source: 'takeyourlounge',
      utm_medium: 'affiliate'
    }
  },
  compareCards: {
    url: '/compare-lounge-access',
    isActive: true
  }
};

/**
 * Build affiliate URL with tracking parameters
 */
export function buildAffiliateUrl(partner: AffiliatePartner, additionalParams?: Record<string, string>): string {
  if (!partner.isActive) {
    return '#';
  }

  const url = new URL(partner.url, 'https://takeyourlounge.com');

  // Add tracking params
  if (partner.trackingParams) {
    Object.entries(partner.trackingParams).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  // Add additional params (e.g., lounge_id, airport_code)
  if (additionalParams) {
    Object.entries(additionalParams).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  return url.toString();
}

/**
 * Get active affiliate partners for a lounge based on access methods
 */
export function getAffiliatePartnersForLounge(accessMethods: string[]): AffiliatePartner[] {
  const partners: AffiliatePartner[] = [];
  const methodsLower = accessMethods.map(m => m.toLowerCase());

  // Priority Pass
  if (methodsLower.some(m => m.includes('priority pass'))) {
    if (affiliateConfig.priorityPass.isActive) {
      partners.push(affiliateConfig.priorityPass);
    }
  }

  // DragonPass
  if (methodsLower.some(m => m.includes('dragonpass') || m.includes('dragon pass'))) {
    if (affiliateConfig.dragonPass.isActive) {
      partners.push(affiliateConfig.dragonPass);
    }
  }

  // Plaza Premium (for day passes)
  if (methodsLower.some(m => m.includes('plaza premium') || m.includes('day pass'))) {
    if (affiliateConfig.plazaPremium.isActive) {
      partners.push(affiliateConfig.plazaPremium);
    }
  }

  // LoungeBuddy as fallback for day pass option
  if (affiliateConfig.loungeBuddy.isActive && !partners.some(p => p.id === 'plaza_premium')) {
    partners.push(affiliateConfig.loungeBuddy);
  }

  return partners;
}

export default affiliateConfig;
