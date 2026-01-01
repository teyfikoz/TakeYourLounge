import { MetadataRoute } from 'next';
import loungeData from '@/data/lounges.json';
import airportData from '@/data/airports.json';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://takeyourlounge.com';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/lounges`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/airports`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Lounge pages
  const loungePages: MetadataRoute.Sitemap = loungeData.lounges.map((lounge: any) => ({
    url: `${baseUrl}/lounges/${lounge.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Airport pages
  const airportPages: MetadataRoute.Sitemap = airportData.airports.map((airport: any) => ({
    url: `${baseUrl}/airports/${airport.code}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...loungePages, ...airportPages];
}
