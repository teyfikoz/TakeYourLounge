'use client';

import { useEffect } from 'react';
import { getDeviceId } from '@/lib/deviceId';
import { trackVisitor } from '@/lib/analytics';

/**
 * Visitor Tracker Component
 *
 * Tracks visitor data and sends to:
 * 1. Google Analytics 4 (if configured)
 * 2. Google Sheets (via API route)
 *
 * Collected Data:
 * - Device ID (fingerprint)
 * - IP address
 * - Country/City (from IP geolocation)
 * - Device: Type, Brand, Model, OS, Browser
 * - Screen resolution
 * - Language
 * - Timezone
 * - Referrer
 * - Landing page
 */

interface VisitorData {
  deviceId: string;
  timestamp: number;

  // Device Info
  userAgent: string;
  platform: string;
  language: string;
  screenResolution: string;
  timezone: string;

  // Browser Info
  browser: string;
  browserVersion: string;

  // OS Info
  os: string;
  osVersion: string;

  // Device Type
  deviceType: 'mobile' | 'tablet' | 'desktop';
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;

  // Page Info
  landingPage: string;
  referrer: string;

  // Location (will be filled by API)
  ip?: string;
  country?: string;
  city?: string;
  region?: string;
  latitude?: number;
  longitude?: number;
}

function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
}

function getBrowserInfo(): { browser: string; version: string } {
  const ua = navigator.userAgent;
  let browser = 'Unknown';
  let version = '';

  if (ua.includes('Firefox/')) {
    browser = 'Firefox';
    version = ua.match(/Firefox\/(\d+\.\d+)/)?.[1] || '';
  } else if (ua.includes('Chrome/') && !ua.includes('Edg')) {
    browser = 'Chrome';
    version = ua.match(/Chrome\/(\d+\.\d+)/)?.[1] || '';
  } else if (ua.includes('Safari/') && !ua.includes('Chrome')) {
    browser = 'Safari';
    version = ua.match(/Version\/(\d+\.\d+)/)?.[1] || '';
  } else if (ua.includes('Edg/')) {
    browser = 'Edge';
    version = ua.match(/Edg\/(\d+\.\d+)/)?.[1] || '';
  }

  return { browser, version };
}

function getOSInfo(): { os: string; version: string } {
  const ua = navigator.userAgent;
  let os = 'Unknown';
  let version = '';

  if (ua.includes('Windows NT')) {
    os = 'Windows';
    version = ua.match(/Windows NT (\d+\.\d+)/)?.[1] || '';
  } else if (ua.includes('Mac OS X')) {
    os = 'macOS';
    version = ua.match(/Mac OS X (\d+[._]\d+)/)?.[1].replace('_', '.') || '';
  } else if (ua.includes('Android')) {
    os = 'Android';
    version = ua.match(/Android (\d+\.\d+)/)?.[1] || '';
  } else if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) {
    os = 'iOS';
    version = ua.match(/OS (\d+[._]\d+)/)?.[1].replace('_', '.') || '';
  } else if (ua.includes('Linux')) {
    os = 'Linux';
  }

  return { os, version };
}

export default function VisitorTracker() {
  useEffect(() => {
    const trackVisit = async () => {
      // Get device ID
      const deviceId = getDeviceId();

      // Get browser and OS info
      const { browser, version: browserVersion } = getBrowserInfo();
      const { os, version: osVersion } = getOSInfo();

      // Get device type
      const deviceType = getDeviceType();

      // Collect visitor data
      const visitorData: VisitorData = {
        deviceId,
        timestamp: Date.now(),

        // Device
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        screenResolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,

        // Browser
        browser,
        browserVersion,

        // OS
        os,
        osVersion,

        // Device Type
        deviceType,
        isMobile: deviceType === 'mobile',
        isTablet: deviceType === 'tablet',
        isDesktop: deviceType === 'desktop',

        // Page
        landingPage: window.location.href,
        referrer: document.referrer || 'Direct',
      };

      // Send to Google Analytics
      trackVisitor({
        deviceId,
        deviceType,
        os,
        browser,
      });

      // Send to Google Sheets (via API route)
      try {
        await fetch('/api/track-visitor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(visitorData),
        });
      } catch (error) {
        console.error('Failed to track visitor:', error);
      }
    };

    // Track on mount (only once)
    trackVisit();
  }, []);

  return null; // This component doesn't render anything
}
