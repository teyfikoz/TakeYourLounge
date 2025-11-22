#!/usr/bin/env python3
"""
Download lounge images from Pexels API and save locally
"""

import os
import csv
import json
import time
import requests
from pathlib import Path
from urllib.parse import urlparse

# Pexels API Configuration
PEXELS_API_KEY = "3cY7tU038L8z24RG3ANvZwQi5m77xlzYCq2f6SKBZg08lEWlgb3XEmqu"
PEXELS_API_URL = "https://api.pexels.com/v1/search"

# Output directories
IMAGES_DIR = Path("web/public/images/lounges")
ATTRIBUTIONS_FILE = Path("web/src/data/photo_attributions.json")

# Rate limiting
REQUESTS_PER_HOUR = 200
REQUEST_DELAY = 3600 / REQUESTS_PER_HOUR  # ~18 seconds between requests


class PexelsImageDownloader:
    def __init__(self, api_key):
        self.api_key = api_key
        self.headers = {"Authorization": api_key}
        self.session = requests.Session()
        self.session.headers.update(self.headers)
        self.attributions = {}
        self.request_count = 0
        self.start_time = time.time()

    def search_images(self, query, per_page=3):
        """Search Pexels for images"""
        params = {
            "query": query,
            "per_page": per_page,
            "orientation": "landscape",
        }

        try:
            response = self.session.get(PEXELS_API_URL, params=params)
            response.raise_for_status()

            # Track rate limits
            self.request_count += 1
            remaining = response.headers.get("X-Ratelimit-Remaining")
            if remaining:
                print(f"   Rate limit remaining: {remaining}")

            data = response.json()
            return data.get("photos", [])

        except requests.exceptions.RequestException as e:
            print(f"   ❌ API Error: {e}")
            return []

    def download_image(self, url, save_path):
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

    def process_lounge(self, lounge_id, lounge_name, airport_name, city, skip_existing=True):
        """Process a single lounge"""
        # Create lounge directory
        lounge_dir = IMAGES_DIR / lounge_id
        lounge_dir.mkdir(parents=True, exist_ok=True)

        # Check if already downloaded
        if skip_existing and len(list(lounge_dir.glob("*.jpg"))) >= 2:
            print(f"   ⏭️  Already downloaded, skipping")
            return self.get_local_images(lounge_id)

        # Create search query
        queries = [
            f"{lounge_name} {airport_name}",
            f"airport lounge {city}",
            f"luxury airport lounge interior",
        ]

        photos = []
        for query in queries:
            photos = self.search_images(query, per_page=3)
            if photos:
                print(f"   ✅ Found {len(photos)} images with query: '{query}'")
                break
            time.sleep(1)  # Small delay between search attempts

        if not photos:
            print(f"   ⚠️  No images found, using fallback")
            # Fallback to generic lounge images
            photos = self.search_images("luxury airport lounge", per_page=3)

        # Download images
        local_images = []
        attributions = []

        for idx, photo in enumerate(photos[:3], 1):
            # Get medium quality image URL
            image_url = photo["src"]["large"]
            photographer = photo["photographer"]
            photographer_url = photo["photographer_url"]
            photo_url = photo["url"]

            # Save image
            image_path = lounge_dir / f"image_{idx}.jpg"
            print(f"   📥 Downloading image {idx}/3 by {photographer}...")

            if self.download_image(image_url, image_path):
                # Store local path (relative to public/)
                local_path = f"/images/lounges/{lounge_id}/image_{idx}.jpg"
                local_images.append(local_path)

                # Store attribution
                attributions.append(
                    {
                        "lounge_id": lounge_id,
                        "image_path": local_path,
                        "photographer": photographer,
                        "photographer_url": photographer_url,
                        "photo_url": photo_url,
                        "source": "Pexels",
                    }
                )

        # Store attributions
        if lounge_id not in self.attributions:
            self.attributions[lounge_id] = []
        self.attributions[lounge_id].extend(attributions)

        return local_images

    def get_local_images(self, lounge_id):
        """Get already downloaded images"""
        lounge_dir = IMAGES_DIR / lounge_id
        if not lounge_dir.exists():
            return []

        images = sorted(lounge_dir.glob("*.jpg"))
        return [f"/images/lounges/{lounge_id}/{img.name}" for img in images]

    def rate_limit_wait(self):
        """Wait if needed to respect rate limits"""
        elapsed = time.time() - self.start_time
        expected_time = self.request_count * REQUEST_DELAY

        if elapsed < expected_time:
            wait_time = expected_time - elapsed
            print(f"   ⏳ Rate limit: waiting {wait_time:.1f}s...")
            time.sleep(wait_time)

    def save_attributions(self):
        """Save all attributions to JSON"""
        ATTRIBUTIONS_FILE.parent.mkdir(parents=True, exist_ok=True)

        with open(ATTRIBUTIONS_FILE, "w", encoding="utf-8") as f:
            json.dump(self.attributions, f, indent=2, ensure_ascii=False)

        print(f"\n📁 Attributions saved to {ATTRIBUTIONS_FILE}")


def update_lounges_csv_with_images(csv_file, downloader):
    """Update CSV with local image paths"""
    print(f"\n📝 Updating {csv_file} with local image paths...")

    rows = []
    with open(csv_file, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames

        # Add images column if not exists
        if "local_images" not in fieldnames:
            fieldnames = list(fieldnames) + ["local_images"]

        for row in reader:
            lounge_id = row.get("id", "")
            if lounge_id:
                local_images = downloader.get_local_images(lounge_id)
                row["local_images"] = json.dumps(local_images)
            rows.append(row)

    # Write updated CSV
    with open(csv_file, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f"   ✅ CSV updated with {len(rows)} lounges")


def main():
    print("🖼️  Pexels Image Downloader for TakeYourLounge")
    print("=" * 60)

    # Initialize downloader
    downloader = PexelsImageDownloader(PEXELS_API_KEY)

    # Create directories
    IMAGES_DIR.mkdir(parents=True, exist_ok=True)

    # Read lounges CSV
    csv_file = Path("master_lounges_with_airlines.csv")
    if not csv_file.exists():
        print(f"❌ Error: {csv_file} not found!")
        return

    lounges = []
    with open(csv_file, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        lounges = list(reader)

    print(f"\n📊 Found {len(lounges)} lounges")
    print(f"📁 Images will be saved to: {IMAGES_DIR}")
    print(f"⏱️  Rate limit: {REQUESTS_PER_HOUR} requests/hour (~{REQUEST_DELAY:.1f}s delay)")

    # Ask for confirmation
    mode = input("\n🔍 Download mode:\n  1. Download all (slow, ~11 hours for 2,272 lounges)\n  2. Sample (first 50 lounges)\n  3. Test (first 5 lounges)\n\nChoose [1/2/3]: ").strip()

    if mode == "1":
        target_lounges = lounges
        print(f"\n✅ Downloading images for ALL {len(target_lounges)} lounges...")
        print(f"⏱️  Estimated time: ~{len(target_lounges) * REQUEST_DELAY / 3600:.1f} hours")
    elif mode == "2":
        target_lounges = lounges[:50]
        print(f"\n✅ Downloading images for {len(target_lounges)} sample lounges...")
    else:
        target_lounges = lounges[:5]
        print(f"\n✅ Downloading images for {len(target_lounges)} test lounges...")

    confirm = input("Continue? [y/N]: ").strip().lower()
    if confirm != "y":
        print("❌ Cancelled")
        return

    # Process lounges
    print("\n" + "=" * 60)
    for idx, lounge in enumerate(target_lounges, 1):
        lounge_id = lounge.get("id", "")
        lounge_name = lounge.get("name", "Unknown Lounge")
        airport_name = lounge.get("airport_name", "")
        city = lounge.get("city", "")

        print(f"\n[{idx}/{len(target_lounges)}] {lounge_name} ({lounge_id})")
        print(f"   🏢 {airport_name}, {city}")

        try:
            local_images = downloader.process_lounge(
                lounge_id, lounge_name, airport_name, city, skip_existing=True
            )

            if local_images:
                print(f"   ✅ Downloaded {len(local_images)} images")
            else:
                print(f"   ⚠️  No images downloaded")

            # Rate limiting
            downloader.rate_limit_wait()

        except KeyboardInterrupt:
            print("\n\n⚠️  Interrupted by user")
            break
        except Exception as e:
            print(f"   ❌ Error: {e}")
            continue

    # Save attributions
    downloader.save_attributions()

    # Update CSV
    update_lounges_csv_with_images(csv_file, downloader)

    # Regenerate web data
    print("\n🔄 Regenerating web data with local images...")
    os.system("python3 generate_web_data.py")

    print("\n" + "=" * 60)
    print(f"✅ Complete! Processed {len(target_lounges)} lounges")
    print(f"📊 Total API requests: {downloader.request_count}")
    print(f"📁 Images saved to: {IMAGES_DIR}")
    print(f"📄 Attributions: {ATTRIBUTIONS_FILE}")


if __name__ == "__main__":
    main()
