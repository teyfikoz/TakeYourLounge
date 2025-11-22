#!/usr/bin/env python3
"""
TakeYourLounge - Image Scraper
Free image scraping system for airport lounges using multiple sources
"""

import csv
import json
import os
import time
import requests
from pathlib import Path
from typing import List, Dict, Optional
from urllib.parse import quote_plus
from dataclasses import dataclass


@dataclass
class ImageResult:
    """Image search result"""
    url: str
    thumbnail_url: str
    source: str
    width: int = 0
    height: int = 0
    title: str = ""


class ImageScraper:
    """
    Multi-source image scraper for lounge photos

    Sources (Free Tier):
    1. Bing Image Search API (Azure - Free tier: 1,000 calls/month)
    2. Pexels API (Free: Unlimited with credit)
    3. Unsplash API (Free: 50 requests/hour)
    4. DuckDuckGo Images (No API key required - scraping)
    """

    def __init__(self):
        self.bing_api_key = os.getenv('BING_API_KEY')
        self.pexels_api_key = os.getenv('PEXELS_API_KEY')
        self.unsplash_api_key = os.getenv('UNSPLASH_API_KEY')

        self.images_dir = Path(__file__).parent / "images"
        self.images_dir.mkdir(exist_ok=True)

        self.scraped_count = 0
        self.failed_count = 0
        self.cache = {}

    def search_bing(self, query: str, count: int = 3) -> List[ImageResult]:
        """
        Search Bing Images API (Free tier: 1,000 calls/month)

        Setup:
        1. Go to https://portal.azure.com
        2. Create "Bing Search v7" resource (Free tier)
        3. Get API key from Keys and Endpoint
        4. Set environment variable: BING_API_KEY
        """
        if not self.bing_api_key:
            return []

        url = "https://api.bing.microsoft.com/v7.0/images/search"
        headers = {"Ocp-Apim-Subscription-Key": self.bing_api_key}
        params = {
            "q": query,
            "count": count,
            "imageType": "Photo",
            "size": "Large"
        }

        try:
            response = requests.get(url, headers=headers, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()

            results = []
            for item in data.get('value', []):
                results.append(ImageResult(
                    url=item.get('contentUrl', ''),
                    thumbnail_url=item.get('thumbnailUrl', ''),
                    source='bing',
                    width=item.get('width', 0),
                    height=item.get('height', 0),
                    title=item.get('name', '')
                ))

            return results

        except Exception as e:
            print(f"   ⚠️  Bing search failed: {e}")
            return []

    def search_pexels(self, query: str, count: int = 3) -> List[ImageResult]:
        """
        Search Pexels API (Free: Unlimited with credit)

        Setup:
        1. Go to https://www.pexels.com/api/
        2. Create free account
        3. Get API key
        4. Set environment variable: PEXELS_API_KEY
        """
        if not self.pexels_api_key:
            return []

        url = "https://api.pexels.com/v1/search"
        headers = {"Authorization": self.pexels_api_key}
        params = {
            "query": query,
            "per_page": count,
            "orientation": "landscape"
        }

        try:
            response = requests.get(url, headers=headers, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()

            results = []
            for item in data.get('photos', []):
                results.append(ImageResult(
                    url=item['src'].get('large2x', ''),
                    thumbnail_url=item['src'].get('medium', ''),
                    source='pexels',
                    width=item.get('width', 0),
                    height=item.get('height', 0),
                    title=item.get('alt', '')
                ))

            return results

        except Exception as e:
            print(f"   ⚠️  Pexels search failed: {e}")
            return []

    def search_unsplash(self, query: str, count: int = 3) -> List[ImageResult]:
        """
        Search Unsplash API (Free: 50 requests/hour)

        Setup:
        1. Go to https://unsplash.com/developers
        2. Create app (free)
        3. Get Access Key
        4. Set environment variable: UNSPLASH_API_KEY
        """
        if not self.unsplash_api_key:
            return []

        url = "https://api.unsplash.com/search/photos"
        headers = {"Authorization": f"Client-ID {self.unsplash_api_key}"}
        params = {
            "query": query,
            "per_page": count,
            "orientation": "landscape"
        }

        try:
            response = requests.get(url, headers=headers, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()

            results = []
            for item in data.get('results', []):
                results.append(ImageResult(
                    url=item['urls'].get('regular', ''),
                    thumbnail_url=item['urls'].get('small', ''),
                    source='unsplash',
                    width=item.get('width', 0),
                    height=item.get('height', 0),
                    title=item.get('description', '')
                ))

            return results

        except Exception as e:
            print(f"   ⚠️  Unsplash search failed: {e}")
            return []

    def search_duckduckgo(self, query: str, count: int = 3) -> List[ImageResult]:
        """
        Search DuckDuckGo Images (No API key required)

        Note: This uses web scraping, so it may be less reliable
        """
        try:
            # DuckDuckGo instant answer API (no auth required)
            url = "https://api.duckduckgo.com/"
            params = {
                "q": query,
                "format": "json",
                "pretty": 1
            }

            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()

            # Note: DuckDuckGo API doesn't provide image search in free tier
            # This is a placeholder for future enhancement
            return []

        except Exception as e:
            print(f"   ⚠️  DuckDuckGo search failed: {e}")
            return []

    def generate_lounge_query(self, lounge: Dict) -> str:
        """Generate optimized search query for lounge"""
        name = lounge.get('name', '')
        airport = lounge.get('airport_name', '')
        city = lounge.get('city', '')

        # Priority order for query construction
        queries = [
            f"{name} {airport} lounge interior",
            f"{name} airport lounge {city}",
            f"{airport} {name} lounge",
            f"airport lounge {city}",
            "airport lounge interior"
        ]

        # Return first non-empty query
        for query in queries:
            if len(query.split()) >= 2:
                return query

        return "airport lounge interior"

    def search_images(self, lounge: Dict, max_images: int = 3) -> List[ImageResult]:
        """
        Search for lounge images across all sources

        Strategy:
        1. Try Bing (most reliable)
        2. Try Pexels (good quality)
        3. Try Unsplash (artistic)
        4. Fallback to generic "airport lounge" images
        """
        query = self.generate_lounge_query(lounge)
        lounge_id = lounge.get('id', 'unknown')

        # Check cache
        if lounge_id in self.cache:
            return self.cache[lounge_id]

        print(f"   🔍 Searching: {query[:60]}...")

        all_results = []

        # Try all sources
        if self.bing_api_key:
            all_results.extend(self.search_bing(query, max_images))

        if self.pexels_api_key and len(all_results) < max_images:
            all_results.extend(self.search_pexels(query, max_images - len(all_results)))

        if self.unsplash_api_key and len(all_results) < max_images:
            all_results.extend(self.search_unsplash(query, max_images - len(all_results)))

        # Fallback: Generic lounge images
        if len(all_results) < 1:
            generic_query = "luxury airport lounge interior"
            if self.bing_api_key:
                all_results.extend(self.search_bing(generic_query, 1))
            elif self.pexels_api_key:
                all_results.extend(self.search_pexels(generic_query, 1))

        # Cache results
        self.cache[lounge_id] = all_results[:max_images]

        return all_results[:max_images]

    def scrape_lounges(self, input_csv: Path, output_csv: Path,
                      max_lounges: Optional[int] = None,
                      images_per_lounge: int = 3,
                      delay: float = 1.0) -> None:
        """
        Scrape images for all lounges

        Args:
            input_csv: Input CSV with lounge data
            output_csv: Output CSV with image URLs
            max_lounges: Limit number of lounges to process (for testing)
            images_per_lounge: Number of images per lounge
            delay: Delay between requests (seconds)
        """
        print("\n📸 Starting image scraping...")

        # Load lounges
        lounges = []
        with open(input_csv, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for i, row in enumerate(reader):
                if max_lounges and i >= max_lounges:
                    break
                lounges.append(row)

        print(f"   Found {len(lounges)} lounges to process")

        # Check API keys
        if not any([self.bing_api_key, self.pexels_api_key, self.unsplash_api_key]):
            print("\n⚠️  WARNING: No API keys configured!")
            print("   Set environment variables:")
            print("   - BING_API_KEY (recommended)")
            print("   - PEXELS_API_KEY")
            print("   - UNSPLASH_API_KEY")
            print("\n   Continuing with limited functionality...\n")

        # Process each lounge
        for i, lounge in enumerate(lounges, 1):
            print(f"\n[{i}/{len(lounges)}] {lounge.get('name', 'Unknown')}")

            # Search images
            images = self.search_images(lounge, images_per_lounge)

            if images:
                # Update lounge with image URLs
                image_urls = [img.url for img in images]
                lounge['images'] = json.dumps(image_urls)
                lounge['image_sources'] = json.dumps([img.source for img in images])
                self.scraped_count += 1
                print(f"   ✅ Found {len(images)} images from {', '.join(set(img.source for img in images))}")
            else:
                lounge['images'] = '[]'
                lounge['image_sources'] = '[]'
                self.failed_count += 1
                print(f"   ❌ No images found")

            # Rate limiting
            time.sleep(delay)

        # Export results
        self._export_csv(lounges, output_csv)
        self._print_stats(len(lounges))

    def _export_csv(self, lounges: List[Dict], output_path: Path) -> None:
        """Export lounges with image URLs"""
        print(f"\n💾 Exporting results to {output_path}...")

        # Add image_sources field to fieldnames if not present
        if lounges:
            fieldnames = list(lounges[0].keys())
            if 'image_sources' not in fieldnames:
                fieldnames.append('image_sources')

            with open(output_path, 'w', encoding='utf-8', newline='') as f:
                writer = csv.DictWriter(f, fieldnames=fieldnames)
                writer.writeheader()
                writer.writerows(lounges)

        print(f"   ✅ Exported {len(lounges)} lounges")

    def _print_stats(self, total: int) -> None:
        """Print scraping statistics"""
        print("\n" + "="*60)
        print("📊 IMAGE SCRAPING STATISTICS")
        print("="*60)
        print(f"\n✅ Successfully Scraped: {self.scraped_count}/{total}")
        print(f"❌ Failed: {self.failed_count}/{total}")
        print(f"📈 Success Rate: {(self.scraped_count / total * 100):.1f}%")
        print("\n" + "="*60)


def main():
    """Main execution"""
    import sys

    print("""
╔═══════════════════════════════════════════════════════════╗
║              LOUNGE IMAGE SCRAPER                         ║
║        Free Multi-Source Image Collection                ║
╚═══════════════════════════════════════════════════════════╝
    """)

    data_dir = Path(__file__).parent
    input_csv = data_dir / "master_lounges_enriched.csv"
    output_csv = data_dir / "master_lounges_with_images.csv"

    if not input_csv.exists():
        print(f"❌ Error: {input_csv} not found!")
        print("   Please run enrich_lounges.py first.")
        sys.exit(1)

    # Parse command line arguments
    max_lounges = None
    if len(sys.argv) > 1:
        try:
            max_lounges = int(sys.argv[1])
            print(f"   Test mode: Processing first {max_lounges} lounges\n")
        except ValueError:
            print("   Usage: python3 image_scraper.py [max_lounges]")
            sys.exit(1)

    # Run scraper
    scraper = ImageScraper()
    scraper.scrape_lounges(
        input_csv=input_csv,
        output_csv=output_csv,
        max_lounges=max_lounges,
        images_per_lounge=3,
        delay=1.0
    )

    print("\n✅ Image scraping complete!")
    print(f"📁 Output: {output_csv}")
    print("\n💡 Tips:")
    print("   - Set API keys for better results (BING_API_KEY, PEXELS_API_KEY)")
    print("   - Bing offers 1,000 free searches/month")
    print("   - Pexels & Unsplash are completely free with credit")


if __name__ == "__main__":
    main()
