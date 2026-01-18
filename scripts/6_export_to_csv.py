#!/usr/bin/env python3
"""
Export Lounge Database to CSV Files
Creates multiple CSV files organized by:
- Region (continent)
- Country
- City
- Airport

Output: Desktop/lounge_exports/
"""

import json
import csv
import os
from typing import List, Dict
from collections import defaultdict
import pathlib

class LoungeCSVExporter:
    """
    Export lounge database to organized CSV files
    """

    def __init__(self):
        self.lounges = []
        self.export_dir = None

    def load_master_database(self, filename: str) -> List[Dict]:
        """
        Load master lounge database
        """
        print(f"📂 Loading master database: {filename}")

        with open(filename, 'r', encoding='utf-8') as f:
            data = json.load(f)
            lounges = data.get('lounges', [])
            print(f"✅ Loaded {len(lounges)} lounges")
            return lounges

    def get_csv_headers(self) -> List[str]:
        """
        CSV column headers
        """
        return [
            'id',
            'name',
            'airport_code',
            'airport_name',
            'city',
            'country',
            'continent',
            'iso_country',
            'region',
            'terminal',
            'location',
            'latitude',
            'longitude',
            'open_hours',
            'amenities',
            'access_methods',
            'lounge_type',
            'operator',
            'description',
            'rating',
            'review_count',
            'verified',
            'verification_source',
            'data_sources',
            'source_attribution',
            'website',
            'image_1',
            'image_2',
            'image_3',
            'osm_id',
            'osm_url',
            'wikidata_id',
            'wikidata_url',
            'google_place_id',
            'legal_disclaimer',
            'last_updated'
        ]

    def lounge_to_csv_row(self, lounge: Dict) -> Dict:
        """
        Convert lounge dict to CSV row
        """
        # Get images
        images = lounge.get('images', [])
        image_1 = images[0] if len(images) > 0 else ''
        image_2 = images[1] if len(images) > 1 else ''
        image_3 = images[2] if len(images) > 2 else ''

        # Format lists as comma-separated
        amenities = '; '.join(lounge.get('amenities', []))
        access_methods = '; '.join(lounge.get('access_methods', []))
        data_sources = '; '.join(lounge.get('data_sources', [lounge.get('source', 'unknown')]))

        return {
            'id': lounge.get('id', ''),
            'name': lounge.get('name', ''),
            'airport_code': lounge.get('airport_code', ''),
            'airport_name': lounge.get('airport_name', ''),
            'city': lounge.get('city', ''),
            'country': lounge.get('country', ''),
            'continent': lounge.get('continent', ''),
            'iso_country': lounge.get('iso_country', ''),
            'region': self.get_region(lounge.get('continent', '')),
            'terminal': lounge.get('terminal', ''),
            'location': lounge.get('location', ''),
            'latitude': lounge.get('latitude', ''),
            'longitude': lounge.get('longitude', ''),
            'open_hours': lounge.get('open_hours', ''),
            'amenities': amenities,
            'access_methods': access_methods,
            'lounge_type': lounge.get('lounge_type', ''),
            'operator': lounge.get('operator', ''),
            'description': lounge.get('description', ''),
            'rating': lounge.get('rating', 0),
            'review_count': lounge.get('review_count', 0),
            'verified': lounge.get('verified', False),
            'verification_source': lounge.get('verification_source', ''),
            'data_sources': data_sources,
            'source_attribution': lounge.get('source_attribution', ''),
            'website': lounge.get('website', ''),
            'image_1': image_1,
            'image_2': image_2,
            'image_3': image_3,
            'osm_id': lounge.get('osm_id', ''),
            'osm_url': lounge.get('osm_url', ''),
            'wikidata_id': lounge.get('wikidata_id', ''),
            'wikidata_url': lounge.get('wikidata_url', ''),
            'google_place_id': lounge.get('google_place_id', ''),
            'legal_disclaimer': lounge.get('legal_disclaimer', ''),
            'last_updated': lounge.get('last_updated', '')
        }

    def get_region(self, continent: str) -> str:
        """
        Map continent code to readable region
        """
        region_map = {
            'AF': 'Africa',
            'AS': 'Asia',
            'EU': 'Europe',
            'NA': 'North America',
            'SA': 'South America',
            'OC': 'Oceania',
            'AN': 'Antarctica'
        }
        return region_map.get(continent, continent)

    def write_csv(self, lounges: List[Dict], filename: str, category: str = 'all'):
        """
        Write lounges to CSV file
        """
        if not lounges:
            return

        filepath = os.path.join(self.export_dir, filename)
        os.makedirs(os.path.dirname(filepath), exist_ok=True)

        with open(filepath, 'w', newline='', encoding='utf-8') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=self.get_csv_headers())
            writer.writeheader()

            for lounge in lounges:
                row = self.lounge_to_csv_row(lounge)
                writer.writerow(row)

        print(f"✅ {category}: {len(lounges)} lounges -> {filename}")

    def export_all_lounges(self):
        """
        Export complete database
        """
        print("\n📊 Exporting complete database...")
        self.write_csv(
            self.lounges,
            'all_lounges.csv',
            'ALL LOUNGES'
        )

    def export_by_region(self):
        """
        Export by continent/region
        """
        print("\n🌍 Exporting by region...")

        regions = defaultdict(list)
        for lounge in self.lounges:
            continent = lounge.get('continent', 'Unknown')
            region = self.get_region(continent)
            regions[region].append(lounge)

        for region, lounges in sorted(regions.items()):
            filename = f'by_region/{region.lower().replace(" ", "_")}.csv'
            self.write_csv(lounges, filename, f'REGION: {region}')

    def export_by_country(self):
        """
        Export by country
        """
        print("\n🏳️  Exporting by country...")

        countries = defaultdict(list)
        for lounge in self.lounges:
            country = lounge.get('country', 'Unknown')
            if country:
                countries[country].append(lounge)

        for country, lounges in sorted(countries.items()):
            safe_name = country.replace('/', '_').replace('\\', '_')
            filename = f'by_country/{safe_name}.csv'
            self.write_csv(lounges, filename, f'COUNTRY: {country}')

    def export_by_city(self):
        """
        Export by city
        """
        print("\n🏙️  Exporting by city...")

        cities = defaultdict(list)
        for lounge in self.lounges:
            city = lounge.get('city', 'Unknown')
            country = lounge.get('country', '')
            if city:
                key = f"{city}, {country}" if country else city
                cities[key].append(lounge)

        # Only export cities with 2+ lounges (avoid too many small files)
        for city, lounges in sorted(cities.items()):
            if len(lounges) >= 2:
                safe_name = city.replace('/', '_').replace('\\', '_').replace(', ', '_')
                filename = f'by_city/{safe_name}.csv'
                self.write_csv(lounges, filename, f'CITY: {city}')

    def export_by_airport(self):
        """
        Export by airport
        """
        print("\n✈️  Exporting by airport...")

        airports = defaultdict(list)
        for lounge in self.lounges:
            airport = lounge.get('airport_code', 'Unknown')
            if airport and airport != 'Unknown':
                airports[airport].append(lounge)

        for airport, lounges in sorted(airports.items()):
            filename = f'by_airport/{airport}.csv'
            self.write_csv(lounges, filename, f'AIRPORT: {airport}')

    def export_summary_statistics(self):
        """
        Export summary CSV with statistics
        """
        print("\n📊 Generating summary statistics...")

        # By airport summary
        airports = defaultdict(lambda: {
            'airport_code': '',
            'airport_name': '',
            'city': '',
            'country': '',
            'continent': '',
            'lounge_count': 0,
            'verified_count': 0,
            'with_priority_pass': 0,
            'avg_rating': 0,
            'data_sources': set()
        })

        for lounge in self.lounges:
            code = lounge.get('airport_code', '')
            if not code:
                continue

            stats = airports[code]
            stats['airport_code'] = code
            stats['airport_name'] = lounge.get('airport_name', '')
            stats['city'] = lounge.get('city', '')
            stats['country'] = lounge.get('country', '')
            stats['continent'] = lounge.get('continent', '')
            stats['lounge_count'] += 1

            if lounge.get('verified'):
                stats['verified_count'] += 1

            if 'Priority Pass' in lounge.get('access_methods', []):
                stats['with_priority_pass'] += 1

            if lounge.get('rating', 0) > 0:
                stats['avg_rating'] += lounge['rating']

            sources = lounge.get('data_sources', [])
            if isinstance(sources, list):
                stats['data_sources'].update(sources)

        # Write summary
        summary_file = os.path.join(self.export_dir, 'summary_by_airport.csv')
        with open(summary_file, 'w', newline='', encoding='utf-8') as csvfile:
            headers = [
                'airport_code', 'airport_name', 'city', 'country', 'continent',
                'lounge_count', 'verified_count', 'with_priority_pass',
                'avg_rating', 'data_sources'
            ]
            writer = csv.DictWriter(csvfile, fieldnames=headers)
            writer.writeheader()

            for code, stats in sorted(airports.items()):
                # Calculate average rating
                if stats['lounge_count'] > 0:
                    stats['avg_rating'] = round(stats['avg_rating'] / stats['lounge_count'], 2)

                # Format data sources
                stats['data_sources'] = '; '.join(sorted(stats['data_sources']))

                writer.writerow(stats)

        print(f"✅ Summary: {len(airports)} airports -> summary_by_airport.csv")

    def create_readme(self):
        """
        Create README file for export directory
        """
        readme_path = os.path.join(self.export_dir, 'README.txt')

        content = f"""
TakeYourLounge - Lounge Database Export
Generated: 2025-01-04
Total Lounges: {len(self.lounges)}

DIRECTORY STRUCTURE:
├── all_lounges.csv                    Complete database
├── summary_by_airport.csv             Airport-level statistics
├── by_region/                         Lounges grouped by continent
├── by_country/                        Lounges grouped by country
├── by_city/                           Lounges grouped by city (2+ lounges)
└── by_airport/                        Lounges grouped by airport code

DATA SOURCES:
- OpenStreetMap (ODbL license)
- Wikidata (CC0 - Public Domain)
- Google Places API (Licensed)
- Community contributions

ATTRIBUTION REQUIRED:
- OpenStreetMap: © OpenStreetMap contributors (openstreetmap.org/copyright)
- Wikidata: Wikidata contributors (wikidata.org)
- Google Maps: Map data ©2025 Google
- Images: Unsplash (unsplash.com/license)

LEGAL NOTICE:
This data is provided as-is for informational purposes. All lounge information
should be verified with the lounge operator before visiting. We make no
guarantees of accuracy or completeness.

For questions: info@tsynca.com
Website: https://takeyourlounge.com

© 2025 TakeYourLounge.com - All Rights Reserved
"""

        with open(readme_path, 'w', encoding='utf-8') as f:
            f.write(content.strip())

        print(f"\n✅ README created: {readme_path}")

    def export_all(self, output_dir: str):
        """
        Main export method - creates all CSV files
        """
        self.export_dir = output_dir
        os.makedirs(output_dir, exist_ok=True)

        print("🚀 Starting CSV export...")
        print("=" * 60)

        # All exports
        self.export_all_lounges()
        self.export_by_region()
        self.export_by_country()
        self.export_by_city()
        self.export_by_airport()
        self.export_summary_statistics()
        self.create_readme()

        print("=" * 60)
        print("✅ EXPORT COMPLETE!")
        print(f"\n📂 Output directory: {output_dir}")
        print(f"   Total files created: {len(list(pathlib.Path(output_dir).rglob('*.csv')))}")


def main():
    """
    Main execution
    """
    exporter = LoungeCSVExporter()

    # Paths
    base_dir = os.path.dirname(os.path.dirname(__file__))
    data_dir = os.path.join(base_dir, 'data')
    input_file = os.path.join(data_dir, 'lounges_master.json')

    # Output to Desktop
    desktop = os.path.join(os.path.expanduser('~'), 'Desktop')
    output_dir = os.path.join(desktop, 'lounge_exports')

    # Load data
    exporter.lounges = exporter.load_master_database(input_file)

    # Export all
    exporter.export_all(output_dir)

    # Final statistics
    print("\n📊 EXPORT STATISTICS:")
    print(f"   Total lounges: {len(exporter.lounges)}")

    regions = len(set(exporter.get_region(l.get('continent', '')) for l in exporter.lounges))
    countries = len(set(l.get('country') for l in exporter.lounges if l.get('country')))
    airports = len(set(l.get('airport_code') for l in exporter.lounges if l.get('airport_code')))

    print(f"   Regions: {regions}")
    print(f"   Countries: {countries}")
    print(f"   Airports: {airports}")

    print(f"\n✅ All CSV files saved to: {output_dir}")


if __name__ == "__main__":
    main()
