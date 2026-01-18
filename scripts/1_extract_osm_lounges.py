#!/usr/bin/env python3
"""
OpenStreetMap Airport Lounge Extractor
License: ODbL (Open Database License) - Attribution required
Source: OpenStreetMap contributors

Extracts airport lounges from OSM using Overpass API
"""

import requests
import json
import time
from typing import List, Dict
import os

class OSMLoungeExtractor:
    """
    Extract airport lounges from OpenStreetMap
    ✅ Legal: ODbL license - Attribution required
    """

    def __init__(self):
        self.overpass_url = "https://overpass-api.de/api/interpreter"
        self.lounges = []

    def query_lounges_by_airport(self, airport_code: str, radius_km: float = 5.0) -> List[Dict]:
        """
        Query OSM for lounges near an airport
        """
        # Overpass QL query
        query = f"""
        [out:json][timeout:25];
        (
          // Airport lounges tagged as amenity=lounge
          node["amenity"="lounge"](around:{int(radius_km * 1000)},{self.get_airport_coords(airport_code)});
          way["amenity"="lounge"](around:{int(radius_km * 1000)},{self.get_airport_coords(airport_code)});

          // Alternative tagging: aeroway=lounge
          node["aeroway"="lounge"](around:{int(radius_km * 1000)},{self.get_airport_coords(airport_code)});
          way["aeroway"="lounge"](around:{int(radius_km * 1000)},{self.get_airport_coords(airport_code)});

          // Terminal buildings with lounge facilities
          node["terminal"="lounge"](around:{int(radius_km * 1000)},{self.get_airport_coords(airport_code)});
        );
        out body;
        >;
        out skel qt;
        """

        try:
            response = requests.post(
                self.overpass_url,
                data={"data": query},
                timeout=30
            )

            if response.status_code == 200:
                data = response.json()
                return self.parse_osm_elements(data['elements'], airport_code)
            else:
                print(f"❌ Error querying {airport_code}: {response.status_code}")
                return []

        except Exception as e:
            print(f"❌ Exception for {airport_code}: {e}")
            return []

    def query_all_airport_lounges(self) -> List[Dict]:
        """
        Query for all airport lounges globally
        More efficient than per-airport queries
        """
        query = """
        [out:json][timeout:60];
        (
          node["amenity"="lounge"]["aeroway"];
          way["amenity"="lounge"]["aeroway"];
          node["aeroway"="lounge"];
          way["aeroway"="lounge"];
        );
        out body;
        >;
        out skel qt;
        """

        print("🔍 Querying OSM for all airport lounges globally...")

        try:
            response = requests.post(
                self.overpass_url,
                data={"data": query},
                timeout=90
            )

            if response.status_code == 200:
                data = response.json()
                print(f"✅ Found {len(data['elements'])} OSM elements")
                return self.parse_osm_elements(data['elements'])
            else:
                print(f"❌ Error: {response.status_code}")
                return []

        except Exception as e:
            print(f"❌ Exception: {e}")
            return []

    def parse_osm_elements(self, elements: List[Dict], airport_code: str = None) -> List[Dict]:
        """
        Parse OSM elements into lounge data structure
        """
        lounges = []

        for element in elements:
            if element['type'] not in ['node', 'way']:
                continue

            tags = element.get('tags', {})

            # Extract lounge information
            lounge = {
                'id': f"osm_{element['id']}",
                'name': tags.get('name', tags.get('operator', 'Unknown Lounge')),
                'airport_code': airport_code or tags.get('iata', tags.get('ref:iata', '')),
                'airport_name': tags.get('airport', ''),
                'source': 'OpenStreetMap',
                'source_license': 'ODbL',
                'source_attribution': '© OpenStreetMap contributors',
                'osm_id': element['id'],
                'osm_type': element['type'],

                # Location
                'latitude': element.get('lat'),
                'longitude': element.get('lon'),
                'terminal': tags.get('terminal', tags.get('level', '')),
                'location': tags.get('location', ''),

                # Operator & Type
                'operator': tags.get('operator', ''),
                'lounge_type': self.determine_lounge_type(tags),

                # Access & Amenities
                'access': tags.get('access', ''),
                'fee': tags.get('fee', ''),
                'opening_hours': tags.get('opening_hours', ''),

                # Amenities (if tagged)
                'wifi': tags.get('wifi', tags.get('internet_access')) == 'yes',
                'food': tags.get('food', '') == 'yes',
                'bar': tags.get('bar', '') == 'yes',
                'shower': tags.get('shower', '') == 'yes',

                # Metadata
                'osm_url': f"https://www.openstreetmap.org/{element['type']}/{element['id']}",
                'verified': False,
                'verification_source': 'osm_data',
                'last_updated': tags.get('check_date', 'unknown')
            }

            lounges.append(lounge)

        return lounges

    def determine_lounge_type(self, tags: Dict) -> str:
        """
        Determine lounge type from OSM tags
        """
        operator = tags.get('operator', '').lower()

        if 'priority pass' in operator:
            return 'priority_pass'
        elif 'plaza premium' in operator:
            return 'plaza_premium'
        elif 'amex' in operator or 'american express' in operator:
            return 'amex_centurion'
        elif 'airline' in operator or tags.get('airline'):
            return 'airline'
        else:
            return 'independent'

    def get_airport_coords(self, airport_code: str) -> str:
        """
        Get airport coordinates (simplified - should use airport database)
        """
        # TODO: Load from airports database
        # For now, return empty to use global query
        return ""

    def save_to_json(self, filename: str):
        """
        Save lounges to JSON file
        """
        output = {
            'total': len(self.lounges),
            'source': 'OpenStreetMap',
            'license': 'ODbL',
            'attribution': '© OpenStreetMap contributors (openstreetmap.org/copyright)',
            'extracted_at': time.strftime('%Y-%m-%d %H:%M:%S'),
            'lounges': self.lounges
        }

        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(output, f, indent=2, ensure_ascii=False)

        print(f"✅ Saved {len(self.lounges)} lounges to {filename}")

    def extract(self) -> List[Dict]:
        """
        Main extraction method
        """
        print("🚀 Starting OSM lounge extraction...")
        print("=" * 60)

        # Query all airport lounges
        self.lounges = self.query_all_airport_lounges()

        print("=" * 60)
        print(f"✅ Total lounges extracted: {len(self.lounges)}")

        return self.lounges


def main():
    """
    Main execution
    """
    extractor = OSMLoungeExtractor()

    # Extract lounges
    lounges = extractor.extract()

    # Save to file
    output_file = os.path.join(
        os.path.dirname(os.path.dirname(__file__)),
        'data',
        'lounges_osm.json'
    )

    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    extractor.save_to_json(output_file)

    # Statistics
    print("\n📊 OSM Lounge Statistics:")
    print(f"   Total: {len(lounges)}")

    # By type
    types = {}
    for lounge in lounges:
        ltype = lounge.get('lounge_type', 'unknown')
        types[ltype] = types.get(ltype, 0) + 1

    print("\n   By Type:")
    for ltype, count in sorted(types.items(), key=lambda x: x[1], reverse=True):
        print(f"   - {ltype}: {count}")

    # By operator
    operators = {}
    for lounge in lounges:
        op = lounge.get('operator', 'unknown')
        if op:
            operators[op] = operators.get(op, 0) + 1

    print("\n   Top Operators:")
    for op, count in sorted(operators.items(), key=lambda x: x[1], reverse=True)[:10]:
        print(f"   - {op}: {count}")


if __name__ == "__main__":
    main()
