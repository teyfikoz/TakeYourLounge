'use client';

import { useEffect, useState } from 'react';

interface Attribution {
  lounge_id: string;
  image_path: string;
  photographer: string;
  photographer_url: string;
  photo_url: string;
  source: string;
}

interface PhotoAttributionProps {
  loungeId: string;
  imagePath: string;
}

export default function PhotoAttribution({ loungeId, imagePath }: PhotoAttributionProps) {
  const [attribution, setAttribution] = useState<Attribution | null>(null);

  useEffect(() => {
    // Load attributions
    fetch('/data/photo_attributions.json')
      .then((res) => res.json())
      .then((data) => {
        const loungeAttrs = data[loungeId] || [];
        const attr = loungeAttrs.find((a: Attribution) => a.image_path === imagePath);
        setAttribution(attr);
      })
      .catch((err) => console.error('Failed to load attributions:', err));
  }, [loungeId, imagePath]);

  if (!attribution) {
    return null;
  }

  return (
    <div className="text-xs text-gray-500 mt-2">
      Photo by{' '}
      <a
        href={attribution.photographer_url}
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-brand-600"
      >
        {attribution.photographer}
      </a>{' '}
      on{' '}
      <a
        href={attribution.photo_url}
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-brand-600"
      >
        Pexels
      </a>
    </div>
  );
}
