/**
 * CTA Copy Configuration - Multi-language support
 *
 * Affiliate-safe, conversion-optimized copy
 * No aggressive sales language, no misleading claims
 */

export type Locale = 'en' | 'tr';

export interface CTACopyConfig {
  title: string;
  priorityPass: {
    title: string;
    desc: string;
    hint: string;
    cta: string;
  };
  dayPass: {
    title: string;
    desc: string;
    hint: string;
    cta: string;
  };
  dragonPass: {
    title: string;
    desc: string;
    cta: string;
  };
  compare: {
    question: string;
    link: string;
  };
  trust: string;
  disclosure: {
    text: string;
    link: string;
  };
}

export const CTA_COPY: Record<Locale, CTACopyConfig> = {
  en: {
    title: 'Access This Lounge',
    priorityPass: {
      title: 'Priority Pass',
      desc: 'Unlimited access to 1,500+ lounges worldwide',
      hint: 'Best option for frequent travelers',
      cta: 'See access options →',
    },
    dayPass: {
      title: 'Day Pass',
      desc: 'One-time entry to this lounge',
      hint: 'Ideal for occasional trips',
      cta: 'Check access availability →',
    },
    dragonPass: {
      title: 'DragonPass',
      desc: 'Premium lounge access worldwide',
      cta: 'Learn more →',
    },
    compare: {
      question: 'Not sure which option fits you?',
      link: 'Compare lounge access cards',
    },
    trust: 'Trusted by frequent travelers worldwide',
    disclosure: {
      text: 'We may earn a commission at no extra cost to you.',
      link: 'Learn more',
    },
  },

  tr: {
    title: 'Bu Lounge\'a Erişim',
    priorityPass: {
      title: 'Priority Pass',
      desc: 'Dünya genelinde 1.500+ lounge\'a sınırsız erişim',
      hint: 'Sık seyahat edenler için en uygun seçenek',
      cta: 'Erişim seçeneklerini gör →',
    },
    dayPass: {
      title: 'Günlük Giriş',
      desc: 'Bu lounge\'a tek seferlik giriş',
      hint: 'Ara sıra seyahat edenler için ideal',
      cta: 'Erişim uygunluğunu kontrol et →',
    },
    dragonPass: {
      title: 'DragonPass',
      desc: 'Dünya genelinde premium lounge erişimi',
      cta: 'Daha fazla bilgi →',
    },
    compare: {
      question: 'Hangi seçeneğin size uygun olduğundan emin değil misiniz?',
      link: 'Lounge erişim kartlarını karşılaştır',
    },
    trust: 'Dünya genelinde sık seyahat edenler tarafından tercih ediliyor',
    disclosure: {
      text: 'Size ek bir maliyet olmadan komisyon kazanabiliriz.',
      link: 'Detaylı bilgi',
    },
  },
};

/**
 * Get locale from browser language (client-side)
 */
export function getClientLocale(): Locale {
  if (typeof window === 'undefined') {
    return 'en';
  }

  const lang = navigator.language || navigator.languages?.[0] || 'en';

  if (lang.toLowerCase().startsWith('tr')) {
    return 'tr';
  }

  return 'en';
}

/**
 * Get CTA copy for a specific locale
 */
export function getCTACopy(locale?: Locale): CTACopyConfig {
  const resolvedLocale = locale || getClientLocale();
  return CTA_COPY[resolvedLocale] || CTA_COPY.en;
}
