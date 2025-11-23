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

# Generic lounge search queries (100 variations)
QUERIES = [
    # Luxury & Premium (20)
    "luxury airport lounge interior",
    "premium airport lounge",
    "elegant airport lounge",
    "upscale airport lounge",
    "deluxe airport lounge",
    "high-end airport lounge",
    "sophisticated lounge interior",
    "lavish airport lounge",
    "exclusive airport lounge",
    "posh airport lounge",
    "luxurious lounge seating",
    "opulent airport lounge",
    "premium lounge design",
    "luxury lounge furniture",
    "elegant lounge decor",
    "upscale lounge amenities",
    "refined airport lounge",
    "prestigious airport lounge",
    "elite airport lounge",
    "luxury travel lounge",

    # Business & Executive (20)
    "business class lounge seating",
    "executive airport lounge",
    "business lounge workspace",
    "corporate airport lounge",
    "professional lounge area",
    "business traveler lounge",
    "executive seating area",
    "business class interior",
    "corporate lounge design",
    "professional workspace lounge",
    "business lounge meeting room",
    "executive lounge chairs",
    "business class amenities",
    "corporate travel lounge",
    "professional lounge services",
    "business lounge facilities",
    "executive comfort zone",
    "business class dining",
    "corporate lounge bar",
    "executive relaxation area",

    # First Class & VIP (20)
    "first class airport lounge",
    "VIP airport lounge",
    "first class seating",
    "VIP lounge interior",
    "first class dining",
    "VIP lounge amenities",
    "first class workspace",
    "VIP relaxation area",
    "first class lounge bar",
    "VIP lounge services",
    "first class comfort",
    "VIP lounge design",
    "first class facilities",
    "VIP travel lounge",
    "first class lounge food",
    "VIP lounge seating",
    "first class interior",
    "VIP lounge experience",
    "first class lounge view",
    "VIP premium lounge",

    # Specific Areas (20)
    "airport lounge dining area",
    "airport lounge bar counter",
    "airport lounge seating area",
    "airport lounge workspace",
    "airport lounge relaxation zone",
    "airport lounge food station",
    "airport lounge beverage bar",
    "airport lounge reading area",
    "airport lounge sleeping pods",
    "airport lounge shower facilities",
    "airport lounge meeting room",
    "airport lounge buffet area",
    "airport lounge coffee station",
    "airport lounge wine bar",
    "airport lounge quiet zone",
    "airport lounge entertainment area",
    "airport lounge business center",
    "airport lounge spa area",
    "airport lounge terrace",
    "airport lounge observation deck",

    # Modern & Design (20)
    "modern airport lounge design",
    "contemporary lounge interior",
    "minimalist airport lounge",
    "modern lounge furniture",
    "sleek airport lounge",
    "contemporary seating area",
    "modern lounge architecture",
    "stylish airport lounge",
    "modern lounge lighting",
    "contemporary lounge decor",
    "modern comfort lounge",
    "chic airport lounge",
    "modern lounge ambiance",
    "trendy airport lounge",
    "modern lounge space",
    "contemporary lounge design",
    "modern airport interior",
    "stylish lounge seating",
    "modern lounge atmosphere",
    "contemporary airport lounge",
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
