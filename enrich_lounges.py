#!/usr/bin/env python3
"""
TakeYourLounge - Lounge Data Enrichment
Enriches lounge data with airport information (coordinates, timezone, etc.)
"""

import csv
import json
from pathlib import Path
from typing import Dict, Optional, List
from dataclasses import dataclass


@dataclass
class Airport:
    """Airport reference data"""
    iata_code: str
    name: str
    latitude: float
    longitude: float
    elevation_ft: Optional[int]
    city: str
    country: str
    iso_country: str
    continent: str
    timezone: Optional[str] = None
    wikipedia: Optional[str] = None


class LoungeEnricher:
    """Enrich lounge data with airport information"""

    def __init__(self, airports_csv: Path, lounges_csv: Path):
        self.airports_csv = airports_csv
        self.lounges_csv = lounges_csv
        self.airports: Dict[str, Airport] = {}
        self.enriched_count = 0
        self.missing_count = 0

    def load_airports(self) -> None:
        """Load airport data with IATA codes"""
        print("\n📍 Loading airport data...")

        with open(self.airports_csv, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            loaded = 0

            for row in reader:
                iata = row.get('iata_code', '').strip()

                # Only load airports with IATA codes
                if not iata:
                    continue

                try:
                    airport = Airport(
                        iata_code=iata,
                        name=row.get('name', ''),
                        latitude=float(row.get('latitude_deg', 0)),
                        longitude=float(row.get('longitude_deg', 0)),
                        elevation_ft=int(row.get('elevation_ft', 0)) if row.get('elevation_ft') else None,
                        city=row.get('municipality', ''),
                        country=row.get('iso_country', ''),
                        iso_country=row.get('iso_country', ''),
                        continent=row.get('continent', ''),
                        wikipedia=row.get('wikipedia_link', '')
                    )

                    self.airports[iata] = airport
                    loaded += 1

                except (ValueError, TypeError):
                    continue

        print(f"   ✅ Loaded {loaded} airports with IATA codes")

    def enrich_lounges(self, output_csv: Path, output_json: Path) -> None:
        """Enrich lounges with airport data"""
        print("\n🔄 Enriching lounge data...")

        enriched_lounges = []
        missing_airports = set()

        with open(self.lounges_csv, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)

            for row in reader:
                airport_code = row.get('airport_code', '').strip().upper()

                # Try to find airport data
                airport = self.airports.get(airport_code)

                if airport:
                    # Enrich with airport data
                    row['latitude'] = str(airport.latitude)
                    row['longitude'] = str(airport.longitude)
                    row['coordinates'] = f"{airport.latitude},{airport.longitude}"
                    row['elevation_ft'] = str(airport.elevation_ft) if airport.elevation_ft else ''
                    row['continent'] = airport.continent
                    row['iso_country'] = airport.iso_country
                    row['wikipedia_link'] = airport.wikipedia or ''

                    # Update airport name if missing
                    if not row.get('airport_name'):
                        row['airport_name'] = airport.name

                    # Update city/country if missing
                    if not row.get('city'):
                        row['city'] = airport.city
                    if not row.get('country'):
                        row['country'] = self._format_country_name(airport.iso_country)

                    self.enriched_count += 1
                else:
                    # Mark as missing
                    row['latitude'] = ''
                    row['longitude'] = ''
                    row['coordinates'] = ''
                    row['continent'] = ''
                    row['iso_country'] = ''
                    row['wikipedia_link'] = ''

                    missing_airports.add(airport_code)
                    self.missing_count += 1

                enriched_lounges.append(row)

        print(f"   ✅ Enriched {self.enriched_count} lounges")
        print(f"   ⚠️  Missing airport data for {self.missing_count} lounges")

        if missing_airports:
            print(f"\n📋 Missing airport codes (showing first 20):")
            for code in sorted(missing_airports)[:20]:
                print(f"   • {code}")

        # Export enriched CSV
        self._export_csv(enriched_lounges, output_csv)

        # Export enriched JSON
        self._export_json(enriched_lounges, output_json)

    def _format_country_name(self, iso_code: str) -> str:
        """Convert ISO country code to full name"""
        # Basic mapping (can be extended)
        country_map = {
            'US': 'United States',
            'GB': 'United Kingdom',
            'FR': 'France',
            'DE': 'Germany',
            'ES': 'Spain',
            'IT': 'Italy',
            'TR': 'Turkey',
            'AE': 'United Arab Emirates',
            'SA': 'Saudi Arabia',
            'JP': 'Japan',
            'CN': 'China',
            'IN': 'India',
            'AU': 'Australia',
            'CA': 'Canada',
            'MX': 'Mexico',
            'BR': 'Brazil',
            'SG': 'Singapore',
            'HK': 'Hong Kong',
            'TH': 'Thailand',
            'MY': 'Malaysia',
            'ID': 'Indonesia',
            'PH': 'Philippines',
            'KR': 'South Korea',
            'RU': 'Russia',
            'NL': 'Netherlands',
            'BE': 'Belgium',
            'CH': 'Switzerland',
            'AT': 'Austria',
            'SE': 'Sweden',
            'NO': 'Norway',
            'DK': 'Denmark',
            'FI': 'Finland',
            'PL': 'Poland',
            'CZ': 'Czech Republic',
            'GR': 'Greece',
            'PT': 'Portugal',
            'IE': 'Ireland',
            'NZ': 'New Zealand',
            'ZA': 'South Africa',
            'EG': 'Egypt',
            'IL': 'Israel',
            'QA': 'Qatar',
            'KW': 'Kuwait',
            'OM': 'Oman',
            'BH': 'Bahrain',
            'JO': 'Jordan',
            'LB': 'Lebanon',
            'KE': 'Kenya',
            'NG': 'Nigeria',
            'GH': 'Ghana',
            'AR': 'Argentina',
            'CL': 'Chile',
            'CO': 'Colombia',
            'PE': 'Peru',
            'VE': 'Venezuela',
        }
        return country_map.get(iso_code, iso_code)

    def _export_csv(self, lounges: List[Dict], output_path: Path) -> None:
        """Export enriched CSV"""
        print(f"\n💾 Exporting enriched CSV to {output_path}...")

        # Define fieldnames (add new fields)
        fieldnames = [
            'id', 'name', 'airport_code', 'airport_name', 'city', 'country',
            'terminal', 'location', 'open_hours', 'amenities', 'access_methods',
            'lounge_type', 'description', 'conditions', 'rating', 'review_count',
            'max_capacity', 'coordinates', 'latitude', 'longitude', 'elevation_ft',
            'continent', 'iso_country', 'wikipedia_link', 'images', 'source', 'created_at'
        ]

        with open(output_path, 'w', encoding='utf-8', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction='ignore')
            writer.writeheader()
            writer.writerows(lounges)

        print(f"   ✅ Exported {len(lounges)} enriched lounges")

    def _export_json(self, lounges: List[Dict], output_path: Path) -> None:
        """Export enriched JSON"""
        print(f"\n💾 Exporting enriched JSON to {output_path}...")

        # Parse JSON fields
        for lounge in lounges:
            for field in ['amenities', 'access_methods', 'images']:
                try:
                    lounge[field] = json.loads(lounge[field])
                except:
                    lounge[field] = []

        data = {
            'metadata': {
                'total_lounges': len(lounges),
                'enriched_count': self.enriched_count,
                'missing_count': self.missing_count,
                'data_sources': [
                    'PriorityPass', 'Supabase', 'Amex', 'DreamFolks',
                    'PlazaPremium', 'TAV', 'OpenFlights Airports'
                ]
            },
            'lounges': lounges
        }

        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

        print(f"   ✅ Exported {len(lounges)} enriched lounges")

    def generate_airport_reference(self, output_csv: Path) -> None:
        """Generate airport reference CSV for database"""
        print(f"\n📊 Generating airport reference CSV...")

        # Get unique airports from enriched lounges
        airports_in_lounges = {}

        with open(self.lounges_csv, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                code = row.get('airport_code', '').strip().upper()
                if code and code in self.airports:
                    airports_in_lounges[code] = self.airports[code]

        # Export airport reference
        fieldnames = [
            'airport_code', 'airport_name', 'city', 'country', 'iso_country',
            'latitude', 'longitude', 'elevation_ft', 'continent', 'timezone',
            'wikipedia_link', 'total_lounges'
        ]

        with open(output_csv, 'w', encoding='utf-8', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()

            for code, airport in sorted(airports_in_lounges.items()):
                writer.writerow({
                    'airport_code': airport.iata_code,
                    'airport_name': airport.name,
                    'city': airport.city,
                    'country': self._format_country_name(airport.iso_country),
                    'iso_country': airport.iso_country,
                    'latitude': airport.latitude,
                    'longitude': airport.longitude,
                    'elevation_ft': airport.elevation_ft,
                    'continent': airport.continent,
                    'timezone': airport.timezone or '',
                    'wikipedia_link': airport.wikipedia or '',
                    'total_lounges': 0  # Will be calculated in database
                })

        print(f"   ✅ Generated {len(airports_in_lounges)} airport records")

    def print_stats(self) -> None:
        """Print enrichment statistics"""
        print("\n" + "="*60)
        print("📊 ENRICHMENT STATISTICS")
        print("="*60)
        print(f"\n✅ Successfully Enriched: {self.enriched_count}")
        print(f"⚠️  Missing Airport Data: {self.missing_count}")
        print(f"📍 Total Airports with IATA: {len(self.airports)}")
        print(f"📈 Coverage: {(self.enriched_count / (self.enriched_count + self.missing_count) * 100):.1f}%")
        print("\n" + "="*60)


def main():
    """Main execution"""
    print("""
╔═══════════════════════════════════════════════════════════╗
║              LOUNGE DATA ENRICHMENT                       ║
║        Adding Airport Coordinates & Metadata             ║
╚═══════════════════════════════════════════════════════════╝
    """)

    data_dir = Path(__file__).parent

    # File paths
    airports_csv = data_dir / "airports.csv"
    lounges_csv = data_dir / "master_lounges.csv"
    output_csv = data_dir / "master_lounges_enriched.csv"
    output_json = data_dir / "master_lounges_enriched.json"
    airport_ref_csv = data_dir / "airports_reference.csv"

    # Check files exist
    if not airports_csv.exists():
        print(f"❌ Error: {airports_csv} not found!")
        return

    if not lounges_csv.exists():
        print(f"❌ Error: {lounges_csv} not found!")
        print("   Please run merge_lounges.py first.")
        return

    # Run enrichment
    enricher = LoungeEnricher(airports_csv, lounges_csv)
    enricher.load_airports()
    enricher.enrich_lounges(output_csv, output_json)
    enricher.generate_airport_reference(airport_ref_csv)
    enricher.print_stats()

    print("\n✅ Enrichment complete!")
    print(f"\n📁 Output files:")
    print(f"   • {output_csv}")
    print(f"   • {output_json}")
    print(f"   • {airport_ref_csv}")


if __name__ == "__main__":
    main()
