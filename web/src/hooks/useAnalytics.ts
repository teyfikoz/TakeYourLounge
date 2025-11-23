/**
 * Analytics Hooks
 *
 * Custom hooks for tracking user interactions
 */

import { event } from '@/lib/analytics';

export const useAnalytics = () => {
  // Lounge Events
  const trackLoungeView = (loungeId: string, loungeName: string) => {
    event({
      action: 'view_lounge',
      category: 'Lounge',
      label: `${loungeId}: ${loungeName}`,
    });
  };

  const trackLoungeClick = (loungeId: string, loungeName: string, position: number) => {
    event({
      action: 'click_lounge_card',
      category: 'Lounge',
      label: `${loungeId}: ${loungeName}`,
      value: position,
    });
  };

  // Search Events
  const trackSearch = (query: string, results: number) => {
    event({
      action: 'search',
      category: 'Search',
      label: query,
      value: results,
    });
  };

  // Filter Events
  const trackFilter = (filterType: string, filterValue: string) => {
    event({
      action: 'use_filter',
      category: 'Filter',
      label: `${filterType}: ${filterValue}`,
    });
  };

  const trackClearFilters = () => {
    event({
      action: 'clear_filters',
      category: 'Filter',
      label: 'Clear All',
    });
  };

  // Navigation Events
  const trackNavigation = (page: string) => {
    event({
      action: 'navigate',
      category: 'Navigation',
      label: page,
    });
  };

  // CTA Events
  const trackCTA = (ctaName: string, location: string) => {
    event({
      action: 'click_cta',
      category: 'CTA',
      label: `${ctaName} (${location})`,
    });
  };

  // Review Events
  const trackReviewSubmit = (loungeId: string, rating: number) => {
    event({
      action: 'submit_review',
      category: 'Review',
      label: loungeId,
      value: rating,
    });
  };

  // External Link Events
  const trackExternalLink = (url: string, linkText: string) => {
    event({
      action: 'click_external_link',
      category: 'External',
      label: `${linkText}: ${url}`,
    });
  };

  // Social Share Events
  const trackSocialShare = (platform: string, content: string) => {
    event({
      action: 'share',
      category: 'Social',
      label: `${platform}: ${content}`,
    });
  };

  // Conversion Events
  const trackConversion = (conversionType: string, value?: number) => {
    event({
      action: 'conversion',
      category: 'Conversion',
      label: conversionType,
      value,
    });
  };

  return {
    trackLoungeView,
    trackLoungeClick,
    trackSearch,
    trackFilter,
    trackClearFilters,
    trackNavigation,
    trackCTA,
    trackReviewSubmit,
    trackExternalLink,
    trackSocialShare,
    trackConversion,
  };
};
