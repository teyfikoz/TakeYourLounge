#!/usr/bin/env python3
"""
Google Places API Airport Lounge Extractor
License: Licensed API usage
Source: Google Places API

Extracts airport lounge data using Google Places API
Free tier: 5,000 queries/month
"""

import requests
import json
import time
import os
from typing import List, Dict
import sys

class GooglePlacesLoungeExtractor:
    """
    Extract airport lounges using Google Places API
    ✅ Legal: Licensed API - Free tier available
    """

    def __init__(self, api_key: str):
        if not api_key or api_key == 'YOUR_API_KEY':
            print("❌ Error: Google Places API key required")
            print("\n📝 Get your free API key:")
            print("   1. Go to: https://console.cloud.google.com")
            print("   2. Enable 'Places API'")
            print("   3. Create credentials -> API Key")
            print("   4. Free tier: 5,000 requests/month")
            print("\n💡 Usage: python 3_google_places_lounges.py YOUR_API_KEY")
            sys.exit(1)

        self.api_key = api_key
        self.base_url = "https://maps.googleapis.com/maps/api/place"
        self.lounges = []
        self.request_count = 0

    def search_lounges_at_airport(self, airport_code: str, airport_coords: Dict) -> List[Dict]:
        """
        Search for lounges at a specific airport
        """
        if not airport_coords or 'lat' not in airport_coords:
            print(f"⚠️  Skipping {airport_code}: No coordinates")
            return []

        # Nearby Search API
        url = f"{self.base_url}/nearbysearch/json"

        params = {
            'location': f"{airport_coords['lat']},{airport_coords['lng']}",
            'radius': 3000,  # 3km radius
            'keyword': 'airport lounge',
            'key': self.api_key
        }

        try:
            response = requests.get(url, params=params, timeout=10)
            self.request_count += 1

            if response.status_code == 200:
                data = response.json()

                if data['status'] == 'OK':
                    results = data.get('results', [])
                    print(f"✅ {airport_code}: Found {len(results)} lounges")
                    return self.parse_google_results(results, airport_code)
                elif data['status'] == 'ZERO_RESULTS':
                    print(f"ℹ️  {airport_code}: No lounges found")
                    return []
                else:
                    print(f"⚠️  {airport_code}: {data['status']}")
                    return []
            else:
                print(f"❌ {airport_code}: HTTP {response.status_code}")
                return []

        except Exception as e:
            print(f"❌ {airport_code}: {e}")
            return []

    def get_place_details(self, place_id: str) -> Dict:
        """
        Get detailed information about a place
        """
        url = f"{self.base_url}/details/json"

        params = {
            'place_id': place_id,
            'fields': 'name,formatted_address,geometry,rating,user_ratings_total,website,opening_hours,photos,formatted_phone_number',
            'key': self.api_key
        }

        try:
            response = requests.get(url, params=params, timeout=10)
            self.request_count += 1

            if response.status_code == 200:
                data = response.json()
                if data['status'] == 'OK':
                    return data.get('result', {})

        except Exception as e:
            print(f"⚠️  Details error: {e}")

        return {}

    def parse_google_results(self, results: List[Dict], airport_code: str) -> List[Dict]:
        """
        Parse Google Places API results
        """
        lounges = []

        for place in results:
            place_id = place.get('place_id', '')

            # Basic info from nearby search
            lounge = {
                'id': f"google_{place_id}",
                'name': place.get('name', 'Unknown Lounge'),
                'airport_code': airport_code,
                'airport_name': '',

                'source': 'Google Places API',
                'source_license': 'Google Maps Platform Terms',
                'source_attribution': 'Google Maps',
                'google_place_id': place_id,

                # Location
                'latitude': place.get('geometry', {}).get('location', {}).get('lat'),
                'longitude': place.get('geometry', {}).get('location', {}).get('lng'),
                'address': place.get('vicinity', ''),

                # Ratings
                'rating': place.get('rating', 0.0),
                'review_count': place.get('user_ratings_total', 0),

                # Type detection
                'types': place.get('types', []),
                'business_status': place.get('business_status', ''),

                # Photos
                'has_photos': len(place.get('photos', [])) > 0,
                'photo_count': len(place.get('photos', [])),

                # Metadata
                'verified': False,
                'verification_source': 'google_places',
                'lounge_type': self.determine_lounge_type(place)
            }

            lounges.append(lounge)

        return lounges

    def determine_lounge_type(self, place: Dict) -> str:
        """
        Determine lounge type from place data
        """
        name = place.get('name', '').lower()
        types = [t.lower() for t in place.get('types', [])]

        if 'priority pass' in name:
            return 'priority_pass'
        elif 'plaza premium' in name:
            return 'plaza_premium'
        elif 'centurion' in name or 'amex' in name:
            return 'amex_centurion'
        elif 'airline' in name or 'airways' in name:
            return 'airline'
        else:
            return 'independent'

    def load_airports(self) -> List[Dict]:
        """
        Load airport data with coordinates
        """
        # Try to load from existing airport data
        data_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')
        airports_file = os.path.join(data_dir, 'airports.json')

        if os.path.exists(airports_file):
            with open(airports_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                return data.get('airports', [])

        # Fallback: Major airports
        print("⚠️  No airports.json found, using major airports only")
        return self.get_major_airports()

    def get_major_airports(self) -> List[Dict]:
        """
        Major world airports (fallback)
        """
        return [
            {'code': 'IST', 'lat': 41.2753, 'lng': 28.7519, 'name': 'Istanbul Airport'},
            {'code': 'DXB', 'lat': 25.2532, 'lng': 55.3657, 'name': 'Dubai International'},
            {'code': 'LHR', 'lat': 51.4700, 'lng': -0.4543, 'name': 'London Heathrow'},
            {'code': 'JFK', 'lat': 40.6413, 'lng': -73.7781, 'name': 'New York JFK'},
            {'code': 'CDG', 'lat': 49.0097, 'lng': 2.5479, 'name': 'Paris Charles de Gaulle'},
            {'code': 'SIN', 'lat': 1.3644, 'lng': 103.9915, 'name': 'Singapore Changi'},
            {'code': 'HKG', 'lat': 22.3080, 'lng': 113.9185, 'name': 'Hong Kong Intl'},
            {'code': 'AMS', 'lat': 52.3105, 'lng': 4.7683, 'name': 'Amsterdam Schiphol'},
            {'code': 'FRA', 'lat': 50.0379, 'lng': 8.5622, 'name': 'Frankfurt'},
            {'code': 'LAX', 'lat': 33.9416, 'lng': -118.4085, 'name': 'Los Angeles'},
            {'code': 'ORD', 'lat': 41.9742, 'lng': -87.9073, 'name': 'Chicago O\'Hare'},
            {'code': 'DFW', 'lat': 32.8998, 'lng': -97.0403, 'name': 'Dallas Fort Worth'},
            {'code': 'ATL', 'lat': 33.6407, 'lng': -84.4277, 'name': 'Atlanta'},
            {'code': 'NRT', 'lat': 35.7720, 'lng': 140.3929, 'name': 'Tokyo Narita'},
            {'code': 'ICN', 'lat': 37.4602, 'lng': 126.4407, 'name': 'Seoul Incheon'},
        ]

    def save_to_json(self, filename: str):
        """
        Save lounges to JSON file
        """
        output = {
            'total': len(self.lounges),
            'source': 'Google Places API',
            'license': 'Google Maps Platform Terms of Service',
            'attribution': 'Map data ©2025 Google',
            'extracted_at': time.strftime('%Y-%m-%d %H:%M:%S'),
            'api_requests_used': self.request_count,
            'lounges': self.lounges
        }

        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(output, f, indent=2, ensure_ascii=False)

        print(f"✅ Saved {len(self.lounges)} lounges to {filename}")
        print(f"📊 API requests used: {self.request_count}")

    def extract(self, limit_airports: int = None) -> List[Dict]:
        """
        Main extraction method
        """
        print("🚀 Starting Google Places lounge extraction...")
        print("=" * 60)

        # Load airports
        airports = self.load_airports()

        if limit_airports:
            airports = airports[:limit_airports]
            print(f"ℹ️  Limited to {limit_airports} airports (API quota management)")

        print(f"📍 Querying {len(airports)} airports...")
        print()

        all_lounges = []

        for i, airport in enumerate(airports, 1):
            airport_code = airport.get('code', airport.get('iata', ''))
            coords = {
                'lat': airport.get('lat', airport.get('latitude')),
                'lng': airport.get('lng', airport.get('longitude'))
            }

            print(f"[{i}/{len(airports)}] ", end='')

            lounges = self.search_lounges_at_airport(airport_code, coords)
            all_lounges.extend(lounges)

            # Rate limiting (to avoid quota issues)
            if i % 10 == 0:
                print(f"\n⏸️  Rate limiting... (requests: {self.request_count})")
                time.sleep(2)

        self.lounges = all_lounges

        print()
        print("=" * 60)
        print(f"✅ Total lounges extracted: {len(self.lounges)}")

        return self.lounges


def main():
    """
    Main execution
    """
    # Get API key from command line
    if len(sys.argv) < 2:
        print("❌ Usage: python 3_google_places_lounges.py YOUR_API_KEY [limit_airports]")
        print("\n📝 Get your free API key:")
        print("   https://console.cloud.google.com/google/maps-apis/start")
        sys.exit(1)

    api_key = sys.argv[1]
    limit_airports = int(sys.argv[2]) if len(sys.argv) > 2 else None

    extractor = GooglePlacesLoungeExtractor(api_key)

    # Extract lounges
    lounges = extractor.extract(limit_airports=limit_airports)

    # Save to file
    output_file = os.path.join(
        os.path.dirname(os.path.dirname(__file__)),
        'data',
        'lounges_google.json'
    )

    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    extractor.save_to_json(output_file)

    # Statistics
    print("\n📊 Google Places Lounge Statistics:")
    print(f"   Total: {len(lounges)}")
    print(f"   API requests: {extractor.request_count}")
    print(f"   Avg lounges per airport: {len(lounges) / (limit_airports or 15):.1f}")

    # By type
    types = {}
    for lounge in lounges:
        ltype = lounge.get('lounge_type', 'unknown')
        types[ltype] = types.get(ltype, 0) + 1

    print("\n   By Type:")
    for ltype, count in sorted(types.items(), key=lambda x: x[1], reverse=True):
        print(f"   - {ltype}: {count}")

    # With ratings
    with_ratings = sum(1 for l in lounges if l.get('rating', 0) > 0)
    print(f"\n   With ratings: {with_ratings} ({with_ratings/len(lounges)*100:.1f}%)")


if __name__ == "__main__":
    main()
