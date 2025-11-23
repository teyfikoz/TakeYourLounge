'use client';

import { useEffect } from 'react';
import { event } from '@/lib/analytics';

/**
 * Global Click Tracker
 *
 * Automatically tracks all clicks on:
 * - Links (internal & external)
 * - Buttons
 * - CTA elements
 */

export default function ClickTracker() {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Find closest clickable element
      const link = target.closest('a');
      const button = target.closest('button');

      if (link) {
        trackLinkClick(link);
      } else if (button) {
        trackButtonClick(button);
      }
    };

    const trackLinkClick = (link: HTMLAnchorElement) => {
      const href = link.getAttribute('href') || '';
      const text = link.textContent?.trim() || 'Unknown Link';
      const isExternal = href.startsWith('http') && !href.includes(window.location.hostname);

      event({
        action: isExternal ? 'click_external_link' : 'click_internal_link',
        category: 'Link',
        label: `${text}: ${href}`,
      });
    };

    const trackButtonClick = (button: HTMLButtonElement) => {
      const text = button.textContent?.trim() || button.getAttribute('aria-label') || 'Unknown Button';
      const type = button.getAttribute('type') || 'button';

      event({
        action: 'click_button',
        category: 'Button',
        label: `${text} (${type})`,
      });
    };

    // Add listener
    document.addEventListener('click', handleClick);

    // Cleanup
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return null;
}
