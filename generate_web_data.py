#!/usr/bin/env python3
"""
Generate static JSON data for Next.js web app
"""

import csv
import json
from pathlib import Path


def generate_lounges_json(input_csv: Path, output_json: Path, limit: int = None):
    """Generate lounges.json for web app"""
    print(f"\n📊 Generating web data from {input_csv}...")

    lounges = []
    with open(input_csv, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for i, row in enumerate(reader):
            if limit and i >= limit:
                break

            # Parse JSON fields
            try:
                amenities = json.loads(row.get('amenities', '[]'))
            except:
                amenities = []

            try:
                access_methods = json.loads(row.get('access_methods', '[]'))
            except:
                access_methods = []

            # Get local images if available
            try:
                local_images = json.loads(row.get('local_images', '[]'))
            except:
                local_images = []

            # Use local images or fallback to placeholders
            if local_images:
                images = local_images
            else:
                images = [
                    f"https://picsum.photos/seed/{row.get('id', 'lounge')}/800/600",
                    f"https://picsum.photos/seed/{row.get('id', 'lounge')}2/800/600",
                ]

            # Create lounge object
            lounge = {
                'id': row.get('id', ''),
                'name': row.get('name', ''),
                'airport_code': row.get('airport_code', ''),
                'airport_name': row.get('airport_name', ''),
                'city': row.get('city', ''),
                'country': row.get('country', ''),
                'terminal': row.get('terminal', ''),
                'location': row.get('location', ''),
                'open_hours': row.get('open_hours', ''),
                'amenities': amenities,
                'access_methods': access_methods,
                'lounge_type': row.get('lounge_type', 'independent'),
                'description': row.get('description', ''),
                'rating': float(row.get('rating', 0) or 0),
                'review_count': int(row.get('review_count', 0) or 0),
                'coordinates': {
                    'lat': float(row.get('latitude', 0) or 0),
                    'lng': float(row.get('longitude', 0) or 0)
                } if row.get('latitude') else None,
                'continent': row.get('continent', ''),
                'iso_country': row.get('iso_country', ''),
                'images': images
            }

            lounges.append(lounge)

    # Export JSON
    output_data = {
        'total': len(lounges),
        'lounges': lounges
    }

    with open(output_json, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)

    print(f"   ✅ Generated {len(lounges)} lounges")
    print(f"   📁 Output: {output_json}")


def main():
    data_dir = Path(__file__).parent
    input_csv = data_dir / "master_lounges_with_airlines.csv"
    output_json = data_dir / "web" / "src" / "data" / "lounges.json"

    # Create data directory
    output_json.parent.mkdir(parents=True, exist_ok=True)

    if not input_csv.exists():
        print(f"❌ Error: {input_csv} not found!")
        return

    # Generate all lounges (or limit for testing)
    generate_lounges_json(input_csv, output_json, limit=None)

    print("\n✅ Web data generation complete!")


if __name__ == "__main__":
    main()
