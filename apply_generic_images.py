#!/usr/bin/env python3
"""
Apply generic lounge images to all lounges
Each lounge gets 3 images from the generic collection (rotated)
"""

import csv
import json
from pathlib import Path

# Paths
GENERIC_IMAGES_DIR = Path("web/public/images/generic-lounges")
CSV_FILE = Path("master_lounges_with_airlines.csv")
OUTPUT_JSON = Path("web/src/data/lounges.json")


def main():
    print("🔄 Applying Generic Lounge Images to All Lounges")
    print("=" * 60)

    # Get generic images
    generic_images = sorted(GENERIC_IMAGES_DIR.glob("*.jpg"))
    print(f"📊 Found {len(generic_images)} generic images")

    if not generic_images:
        print("❌ No generic images found! Run download_generic_lounge_images.py first")
        return

    # Convert to web paths
    generic_image_paths = [
        f"/images/generic-lounges/{img.name}" for img in generic_images
    ]

    print(f"📁 Generic images:")
    for path in generic_image_paths[:5]:
        print(f"   - {path}")
    if len(generic_image_paths) > 5:
        print(f"   ... and {len(generic_image_paths) - 5} more")

    # Read CSV
    lounges = []
    with open(CSV_FILE, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames
        for row in reader:
            lounges.append(row)

    print(f"\n📊 Processing {len(lounges)} lounges...")

    # Assign images to each lounge (rotate through generic images)
    for idx, lounge in enumerate(lounges):
        # Get 3 images for this lounge (rotated)
        start_idx = (idx * 3) % len(generic_image_paths)
        lounge_images = []

        for i in range(3):
            img_idx = (start_idx + i) % len(generic_image_paths)
            lounge_images.append(generic_image_paths[img_idx])

        # Update lounge with image paths
        lounge['local_images'] = json.dumps(lounge_images)

    # Save updated CSV
    with open(CSV_FILE, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(lounges)

    print(f"   ✅ Updated {len(lounges)} lounges in CSV")

    # Generate web data
    print(f"\n🔄 Regenerating web data...")
    import subprocess
    subprocess.run(["python3", "generate_web_data.py"], check=True)

    print("\n" + "=" * 60)
    print("✅ Generic images applied to all lounges!")
    print(f"📊 {len(lounges)} lounges × 3 images each")
    print(f"📁 Using {len(generic_image_paths)} generic images (rotated)")


if __name__ == "__main__":
    main()
