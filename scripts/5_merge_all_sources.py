#!/usr/bin/env python3
"""
Merge All Lounge Data Sources
Combines:
- Transformed existing data
- OpenStreetMap data
- Wikidata data
- Google Places data
- User submissions (future)

Deduplicates and creates master database
"""

import json
import os
from typing import List, Dict, Set
from collections import defaultdict
import hashlib

class LoungeDataMerger:
    """
    Merge and deduplicate lounge data from multiple sources
    """

    def __init__(self):
        self.lounges = []
        self.duplicates_found = 0
        self.data_sources = []

    def load_source(self, filename: str, source_name: str) -> List[Dict]:
        """
        Load lounges from a JSON file
        """
        if not os.path.exists(filename):
            print(f"⚠️  {source_name}: File not found - {filename}")
            return []

        try:
            with open(filename, 'r', encoding='utf-8') as f:
                data = json.load(f)
                lounges = data.get('lounges', [])
                print(f"✅ {source_name}: Loaded {len(lounges)} lounges")
                return lounges
        except Exception as e:
            print(f"❌ {source_name}: Error loading - {e}")
            return []

    def generate_lounge_key(self, lounge: Dict) -> str:
        """
        Generate unique key for deduplication
        Based on name + airport code (case-insensitive)
        """
        name = lounge.get('name', '').lower().strip()
        airport = lounge.get('airport_code', '').upper().strip()

        # Normalize name (remove common words)
        name = name.replace('lounge', '').replace('the', '').strip()

        return f"{airport}_{name}"

    def calculate_similarity(self, lounge1: Dict, lounge2: Dict) -> float:
        """
        Calculate similarity between two lounges (0-1)
        """
        score = 0.0
        total = 0.0

        # Name similarity
        total += 1.0
        if lounge1.get('name', '').lower() == lounge2.get('name', '').lower():
            score += 1.0
        elif lounge1.get('name', '').lower() in lounge2.get('name', '').lower():
            score += 0.5

        # Airport code (critical)
        total += 2.0
        if lounge1.get('airport_code', '').upper() == lounge2.get('airport_code', '').upper():
            score += 2.0

        # Terminal
        total += 0.5
        if lounge1.get('terminal', '') and lounge2.get('terminal', ''):
            if lounge1.get('terminal') == lounge2.get('terminal'):
                score += 0.5

        # Coordinates (if available)
        total += 0.5
        if (lounge1.get('latitude') and lounge2.get('latitude') and
            lounge1.get('longitude') and lounge2.get('longitude')):
            # Simple distance check (rough)
            lat_diff = abs(lounge1['latitude'] - lounge2['latitude'])
            lng_diff = abs(lounge1['longitude'] - lounge2['longitude'])
            if lat_diff < 0.01 and lng_diff < 0.01:  # ~1km
                score += 0.5

        return score / total if total > 0 else 0.0

    def merge_lounges(self, existing: Dict, new: Dict) -> Dict:
        """
        Merge two lounge records (keep best data from both)
        """
        merged = existing.copy()

        # Merge data sources
        existing_sources = existing.get('data_sources', [existing.get('source', 'unknown')])
        new_sources = [new.get('source', 'unknown')]
        if isinstance(existing_sources, str):
            existing_sources = [existing_sources]

        merged['data_sources'] = list(set(existing_sources + new_sources))
        merged['source'] = 'multiple_sources'

        # Keep best coordinates
        if not merged.get('latitude') and new.get('latitude'):
            merged['latitude'] = new['latitude']
            merged['longitude'] = new['longitude']

        # Merge amenities
        existing_amenities = set(existing.get('amenities', []))
        new_amenities = set(new.get('amenities', []))
        merged['amenities'] = list(existing_amenities | new_amenities)

        # Merge access methods
        existing_access = set(existing.get('access_methods', []))
        new_access = set(new.get('access_methods', []))
        merged['access_methods'] = list(existing_access | new_access)

        # Keep more detailed description
        if len(new.get('description', '')) > len(existing.get('description', '')):
            merged['description'] = new['description']

        # Keep best terminal info
        if not merged.get('terminal') and new.get('terminal'):
            merged['terminal'] = new['terminal']

        # Keep best hours
        if not merged.get('open_hours') and new.get('open_hours'):
            merged['open_hours'] = new['open_hours']

        # Merge verification status
        if new.get('verified') and not existing.get('verified'):
            merged['verified'] = True
            merged['verification_source'] = new.get('verification_source', 'unknown')

        # Add OSM/Wikidata IDs if available
        if new.get('osm_id'):
            merged['osm_id'] = new['osm_id']
            merged['osm_url'] = new.get('osm_url', '')

        if new.get('wikidata_id'):
            merged['wikidata_id'] = new['wikidata_id']
            merged['wikidata_url'] = new.get('wikidata_url', '')

        if new.get('google_place_id'):
            merged['google_place_id'] = new['google_place_id']

        # Keep best rating
        if new.get('rating', 0) > existing.get('rating', 0):
            merged['rating'] = new['rating']
            merged['review_count'] = new.get('review_count', 0)

        merged['merge_count'] = existing.get('merge_count', 1) + 1

        return merged

    def deduplicate_and_merge(self, all_lounges: List[Dict]) -> List[Dict]:
        """
        Deduplicate and merge lounge data
        """
        print("\n🔍 Deduplicating and merging...")
        print("=" * 60)

        lounge_map = {}  # key -> lounge
        processed = 0

        for lounge in all_lounges:
            processed += 1
            if processed % 200 == 0:
                print(f"   Processed: {processed}/{len(all_lounges)}")

            key = self.generate_lounge_key(lounge)

            if key in lounge_map:
                # Check similarity to confirm it's a duplicate
                similarity = self.calculate_similarity(lounge_map[key], lounge)

                if similarity > 0.7:  # 70% similar = duplicate
                    self.duplicates_found += 1
                    lounge_map[key] = self.merge_lounges(lounge_map[key], lounge)
                else:
                    # Different lounge with similar key
                    # Add suffix
                    counter = 1
                    while f"{key}_{counter}" in lounge_map:
                        counter += 1
                    lounge_map[f"{key}_{counter}"] = lounge
            else:
                lounge_map[key] = lounge

        unique_lounges = list(lounge_map.values())

        print(f"✅ Deduplication complete")
        print(f"   Input: {len(all_lounges)} lounges")
        print(f"   Duplicates merged: {self.duplicates_found}")
        print(f"   Output: {len(unique_lounges)} unique lounges")

        return unique_lounges

    def merge_all_sources(self, data_dir: str) -> List[Dict]:
        """
        Load and merge all data sources
        """
        print("🚀 Merging all lounge data sources...")
        print("=" * 60)

        all_lounges = []

        # 1. Transformed existing data
        transformed = self.load_source(
            os.path.join(data_dir, 'lounges_transformed.json'),
            'Transformed Data'
        )
        all_lounges.extend(transformed)
        self.data_sources.append({'name': 'Transformed', 'count': len(transformed)})

        # 2. OpenStreetMap
        osm = self.load_source(
            os.path.join(data_dir, 'lounges_osm.json'),
            'OpenStreetMap'
        )
        all_lounges.extend(osm)
        self.data_sources.append({'name': 'OSM', 'count': len(osm)})

        # 3. Wikidata
        wikidata = self.load_source(
            os.path.join(data_dir, 'lounges_wikidata.json'),
            'Wikidata'
        )
        all_lounges.extend(wikidata)
        self.data_sources.append({'name': 'Wikidata', 'count': len(wikidata)})

        # 4. Google Places
        google = self.load_source(
            os.path.join(data_dir, 'lounges_google.json'),
            'Google Places'
        )
        all_lounges.extend(google)
        self.data_sources.append({'name': 'Google Places', 'count': len(google)})

        print("=" * 60)
        print(f"📊 Total lounges before deduplication: {len(all_lounges)}")

        # Deduplicate and merge
        unique_lounges = self.deduplicate_and_merge(all_lounges)

        return unique_lounges

    def save_master_database(self, lounges: List[Dict], output_file: str):
        """
        Save master lounge database
        """
        output = {
            'total': len(lounges),
            'data_sources': self.data_sources,
            'total_before_dedup': sum(s['count'] for s in self.data_sources),
            'duplicates_merged': self.duplicates_found,
            'deduplication_rate': f"{self.duplicates_found / sum(s['count'] for s in self.data_sources) * 100:.1f}%",

            'license': 'Mixed - See individual lounge data_sources',
            'attributions': {
                'osm': '© OpenStreetMap contributors (openstreetmap.org/copyright)',
                'wikidata': 'Wikidata contributors (wikidata.org)',
                'google': 'Map data ©2025 Google',
                'community': 'TakeYourLounge Community',
                'images': 'Unsplash (unsplash.com/license)'
            },

            'legal_notice': (
                'This database combines data from multiple sources including OpenStreetMap (ODbL), '
                'Wikidata (CC0), Google Places API (Licensed), and community contributions. '
                'All information is provided as-is. Users should verify details with lounge operators. '
                'See individual lounge records for specific data sources.'
            ),

            'created_at': '2025-01-04',
            'version': '2.0.0',

            'lounges': lounges
        }

        os.makedirs(os.path.dirname(output_file), exist_ok=True)
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(output, f, indent=2, ensure_ascii=False)

        print(f"\n✅ Saved master database: {output_file}")
        print(f"   Total lounges: {len(lounges)}")

    def print_statistics(self, lounges: List[Dict]):
        """
        Print detailed statistics
        """
        print("\n📊 MASTER DATABASE STATISTICS")
        print("=" * 60)

        print(f"\n📍 TOTAL LOUNGES: {len(lounges)}")

        # Data sources
        print("\n🔗 DATA SOURCES:")
        for source in self.data_sources:
            print(f"   - {source['name']}: {source['count']} lounges")

        # Multi-source lounges
        multi_source = sum(1 for l in lounges if len(l.get('data_sources', [])) > 1)
        print(f"\n✅ Multi-source verified: {multi_source} lounges ({multi_source/len(lounges)*100:.1f}%)")

        # By country
        countries = defaultdict(int)
        for lounge in lounges:
            country = lounge.get('country', 'Unknown')
            if country:
                countries[country] += 1

        print(f"\n🌍 COUNTRIES: {len(countries)}")
        print("   Top 10:")
        for country, count in sorted(countries.items(), key=lambda x: x[1], reverse=True)[:10]:
            print(f"   - {country}: {count}")

        # By airport
        airports = defaultdict(int)
        for lounge in lounges:
            airport = lounge.get('airport_code', 'Unknown')
            if airport:
                airports[airport] += 1

        print(f"\n✈️  AIRPORTS: {len(airports)}")
        print("   Top 10:")
        for airport, count in sorted(airports.items(), key=lambda x: x[1], reverse=True)[:10]:
            print(f"   - {airport}: {count} lounges")

        # With coordinates
        with_coords = sum(1 for l in lounges if l.get('latitude'))
        print(f"\n📍 With coordinates: {with_coords} ({with_coords/len(lounges)*100:.1f}%)")

        # With ratings
        with_ratings = sum(1 for l in lounges if l.get('rating', 0) > 0)
        print(f"⭐ With ratings: {with_ratings} ({with_ratings/len(lounges)*100:.1f}%)")

        # Verified
        verified = sum(1 for l in lounges if l.get('verified'))
        print(f"✅ Verified: {verified} ({verified/len(lounges)*100:.1f}%)")


def main():
    """
    Main execution
    """
    merger = LoungeDataMerger()

    # Paths
    base_dir = os.path.dirname(os.path.dirname(__file__))
    data_dir = os.path.join(base_dir, 'data')
    output_file = os.path.join(data_dir, 'lounges_master.json')

    # Merge all sources
    lounges = merger.merge_all_sources(data_dir)

    # Save master database
    merger.save_master_database(lounges, output_file)

    # Statistics
    merger.print_statistics(lounges)

    print("\n" + "=" * 60)
    print("✅ MERGE COMPLETE!")
    print("\n📝 Next step: Export to CSV")
    print("   Run: python 6_export_to_csv.py")


if __name__ == "__main__":
    main()
