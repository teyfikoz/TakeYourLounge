import { NextRequest, NextResponse } from 'next/server';

// Simplified translation - can be enhanced with HF models later
const SUPPORTED_LANGUAGES = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  tr: 'Türkçe',
  ar: 'العربية',
  zh: '中文',
  ja: '日本語'
};

export async function POST(request: NextRequest) {
  try {
    const { text, targetLang, sourceLang = 'en' } = await request.json();

    if (!SUPPORTED_LANGUAGES[targetLang as keyof typeof SUPPORTED_LANGUAGES]) {
      return NextResponse.json(
        { error: 'Unsupported language' },
        { status: 400 }
      );
    }

    // For now, return original text with language marker
    // TODO: Implement actual translation with HuggingFace models
    const translation = `[${targetLang}] ${text}`;

    return NextResponse.json({
      translation,
      sourceLang,
      targetLang,
      supported: Object.keys(SUPPORTED_LANGUAGES)
    });

  } catch (error: any) {
    console.error('Translation Error:', error);
    return NextResponse.json(
      { error: 'Translation failed', details: error.message },
      { status: 500 }
    );
  }
}

export const runtime = 'edge';
