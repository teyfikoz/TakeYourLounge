#!/usr/bin/env python3
"""
Generate airport data from lounges for Next.js web app
"""

import csv
import json
from pathlib import Path
from collections import defaultdict


def generate_airports_json(input_csv: Path, output_json: Path):
    """Generate airports.json grouped by airport"""
    print(f"\n📊 Generating airport data from {input_csv}...")

    # Group lounges by airport
    airports_data = defaultdict(lambda: {
        'lounges': [],
        'info': {}
    })

    with open(input_csv, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            airport_code = row.get('airport_code', '')
            if not airport_code:
                continue

            # Parse JSON fields
            try:
                amenities = json.loads(row.get('amenities', '[]'))
            except:
                amenities = []

            try:
                access_methods = json.loads(row.get('access_methods', '[]'))
            except:
                access_methods = []

            # Add lounge to airport
            lounge = {
                'id': row.get('id', ''),
                'name': row.get('name', ''),
                'terminal': row.get('terminal', ''),
                'location': row.get('location', ''),
                'open_hours': row.get('open_hours', ''),
                'amenities': amenities,
                'access_methods': access_methods,
                'lounge_type': row.get('lounge_type', 'independent'),
                'description': row.get('description', ''),
                'rating': float(row.get('rating', 0) or 0),
                'review_count': int(row.get('review_count', 0) or 0),
                'images': [
                    f"https://picsum.photos/seed/{row.get('id', 'lounge')}/800/600",
                    f"https://picsum.photos/seed/{row.get('id', 'lounge')}2/800/600",
                ]
            }

            airports_data[airport_code]['lounges'].append(lounge)

            # Store airport info (will be same for all lounges at this airport)
            if not airports_data[airport_code]['info']:
                airports_data[airport_code]['info'] = {
                    'code': airport_code,
                    'name': row.get('airport_name', ''),
                    'city': row.get('city', ''),
                    'country': row.get('country', ''),
                    'continent': row.get('continent', ''),
                    'iso_country': row.get('iso_country', ''),
                    'coordinates': {
                        'lat': float(row.get('latitude', 0) or 0),
                        'lng': float(row.get('longitude', 0) or 0)
                    } if row.get('latitude') else None,
                }

    # Convert to list and calculate stats
    airports_list = []
    for code, data in airports_data.items():
        info = data['info']
        lounges = data['lounges']

        # Calculate average rating
        rated_lounges = [l for l in lounges if l['rating'] > 0]
        avg_rating = sum(l['rating'] for l in rated_lounges) / len(rated_lounges) if rated_lounges else 0

        # Group by terminal
        terminals = defaultdict(list)
        for lounge in lounges:
            terminal = lounge.get('terminal', 'Unknown')
            terminals[terminal].append(lounge)

        airport_obj = {
            **info,
            'lounge_count': len(lounges),
            'avg_rating': round(avg_rating, 1),
            'terminals': dict(terminals),
            'lounges': sorted(lounges, key=lambda l: (l['terminal'] or 'ZZZ', l['name'])),
            # Aggregate access methods
            'available_access_methods': list(set(
                method
                for lounge in lounges
                for method in lounge.get('access_methods', [])
            )),
            # Most common amenities
            'common_amenities': list(set(
                amenity
                for lounge in lounges
                for amenity in lounge.get('amenities', [])
            ))[:10],  # Top 10
        }
        airports_list.append(airport_obj)

    # Sort by lounge count (most popular first)
    airports_list.sort(key=lambda a: (-a['lounge_count'], a['name']))

    # Export JSON
    output_data = {
        'total': len(airports_list),
        'airports': airports_list
    }

    with open(output_json, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)

    print(f"   ✅ Generated {len(airports_list)} airports")
    print(f"   📊 Top 10 airports by lounge count:")
    for airport in airports_list[:10]:
        print(f"      {airport['code']} - {airport['name']}: {airport['lounge_count']} lounges")
    print(f"   📁 Output: {output_json}")


def main():
    data_dir = Path(__file__).parent
    input_csv = data_dir / "master_lounges_with_airlines.csv"
    output_json = data_dir / "web" / "src" / "data" / "airports.json"

    # Create data directory
    output_json.parent.mkdir(parents=True, exist_ok=True)

    if not input_csv.exists():
        print(f"❌ Error: {input_csv} not found!")
        return

    generate_airports_json(input_csv, output_json)

    print("\n✅ Airport data generation complete!")


if __name__ == "__main__":
    main()
