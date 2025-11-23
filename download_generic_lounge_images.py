#!/usr/bin/env python3
"""
Download generic airport lounge images from Pexels API
These will be used as placeholder images for all lounges
"""

import os
import requests
from pathlib import Path

# Pexels API Configuration
PEXELS_API_KEY = "3cY7tU038L8z24RG3ANvZwQi5m77xlzYCq2f6SKBZg08lEWlgb3XEmqu"
PEXELS_API_URL = "https://api.pexels.com/v1/search"

# Output directory
GENERIC_IMAGES_DIR = Path("web/public/images/generic-lounges")

# Generic lounge search queries
QUERIES = [
    "luxury airport lounge interior",
    "business class lounge seating",
    "airport VIP lounge",
    "premium airport lounge food",
    "airport lounge comfortable seats",
    "modern airport lounge",
    "airport executive lounge",
    "airport lounge workspace",
    "airport lounge relaxation area",
    "first class airport lounge",
    "airport lounge dining area",
    "airport lounge bar",
    "airport lounge windows view",
    "airport lounge elegant interior",
    "airport lounge amenities",
]


def download_image(url, save_path):
    """Download image from URL"""
    try:
        response = requests.get(url, stream=True, timeout=30)
        response.raise_for_status()

        with open(save_path, "wb") as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)

        return True
    except Exception as e:
        print(f"   ❌ Download error: {e}")
        return False


def main():
    print("🖼️  Generic Lounge Images Downloader")
    print("=" * 60)

    # Create directory
    GENERIC_IMAGES_DIR.mkdir(parents=True, exist_ok=True)

    headers = {"Authorization": PEXELS_API_KEY}
    session = requests.Session()
    session.headers.update(headers)

    print(f"📁 Saving to: {GENERIC_IMAGES_DIR}\n")

    downloaded = 0

    for idx, query in enumerate(QUERIES, 1):
        print(f"[{idx}/{len(QUERIES)}] Searching: '{query}'")

        # Search Pexels
        params = {
            "query": query,
            "per_page": 1,
            "orientation": "landscape",
        }

        try:
            response = session.get(PEXELS_API_URL, params=params)
            response.raise_for_status()
            data = response.json()

            photos = data.get("photos", [])
            if not photos:
                print(f"   ⚠️  No images found")
                continue

            photo = photos[0]
            image_url = photo["src"]["large"]
            photographer = photo["photographer"]

            # Save image
            image_path = GENERIC_IMAGES_DIR / f"lounge_{idx}.jpg"
            print(f"   📥 Downloading by {photographer}...")

            if download_image(image_url, image_path):
                downloaded += 1
                print(f"   ✅ Saved: {image_path.name}")

        except Exception as e:
            print(f"   ❌ Error: {e}")
            continue

    print("\n" + "=" * 60)
    print(f"✅ Downloaded {downloaded}/{len(QUERIES)} generic lounge images")
    print(f"📁 Location: {GENERIC_IMAGES_DIR}")

    # Create image list
    images = sorted(GENERIC_IMAGES_DIR.glob("*.jpg"))
    print(f"\n📊 Available images:")
    for img in images:
        size_kb = img.stat().st_size / 1024
        print(f"   - {img.name} ({size_kb:.1f} KB)")


if __name__ == "__main__":
    main()
