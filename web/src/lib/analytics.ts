/**
 * Google Analytics 4 Integration
 */

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || '';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && typeof window.gtag !== 'undefined') {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

interface EventParams {
  action: string;
  category: string;
  label: string;
  value?: number;
}

export const event = ({ action, category, label, value }: EventParams) => {
  if (typeof window !== 'undefined' && typeof window.gtag !== 'undefined') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

interface VisitorData {
  deviceId: string;
  deviceType?: string;
  os?: string;
  browser?: string;
  page?: string;
}

export const trackVisitor = (data: VisitorData) => {
  if (typeof window !== 'undefined' && typeof window.gtag !== 'undefined') {
    window.gtag('event', 'visitor_tracking', {
      event_category: 'engagement',
      event_label: data.page || window.location.pathname,
      device_id: data.deviceId,
      device_type: data.deviceType,
      os: data.os,
      browser: data.browser,
    });
  }
};
