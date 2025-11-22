#!/usr/bin/env python3
"""
TakeYourLounge - CSV Merger & Database Builder
Combines all lounge CSV files into a unified master database
"""

import csv
import json
import re
from pathlib import Path
from typing import Dict, List, Optional
from dataclasses import dataclass, asdict
from datetime import datetime


@dataclass
class Lounge:
    """Unified lounge data model"""
    id: str
    name: str
    airport_code: str
    airport_name: str
    city: str
    country: str
    terminal: Optional[str] = None
    location: Optional[str] = None
    open_hours: Optional[str] = None
    amenities: List[str] = None
    access_methods: List[str] = None
    lounge_type: Optional[str] = None  # independent, airline, operator, centurion, partner
    description: Optional[str] = None
    conditions: Optional[str] = None
    rating: float = 0.0
    review_count: int = 0
    max_capacity: int = 50
    coordinates: Optional[str] = None
    images: List[str] = None
    source: str = "unknown"
    created_at: str = None

    def __post_init__(self):
        if self.amenities is None:
            self.amenities = ["Free Wi-Fi", "Food & Beverages", "Comfortable Seating"]
        if self.access_methods is None:
            self.access_methods = []
        if self.images is None:
            self.images = []
        if self.created_at is None:
            self.created_at = datetime.now().isoformat()


class LoungeMerger:
    """Merges multiple lounge CSV sources into unified database"""

    def __init__(self, data_dir: Path):
        self.data_dir = Path(data_dir)
        self.lounges: Dict[str, Lounge] = {}
        self.duplicates = 0
        self.merged = 0

    def clean_text(self, text: Optional[str]) -> Optional[str]:
        """Clean and normalize text"""
        if not text or text.strip() == "":
            return None
        # Remove BOM and extra whitespace
        cleaned = text.strip().replace('\ufeff', '')
        return cleaned if cleaned else None

    def generate_id(self, name: str, airport_code: str, terminal: str = None) -> str:
        """Generate unique lounge ID"""
        # Normalize name and airport
        clean_name = re.sub(r'[^a-z0-9]+', '_', name.lower())
        clean_airport = airport_code.lower() if airport_code else 'unknown'

        base_id = f"{clean_airport}_{clean_name}"

        # Add terminal suffix if exists
        if terminal:
            clean_terminal = re.sub(r'[^a-z0-9]+', '_', terminal.lower())
            base_id = f"{base_id}_{clean_terminal}"

        # Truncate to reasonable length
        return base_id[:100]

    def parse_json_array(self, value: Optional[str]) -> List[str]:
        """Parse JSON array from CSV string"""
        if not value or value.strip() == "[]":
            return []
        try:
            return json.loads(value)
        except:
            # Fallback: split by comma
            return [v.strip() for v in value.split(',') if v.strip()]

    def merge_lounge(self, new_lounge: Lounge) -> None:
        """Merge lounge data, combining info from multiple sources"""
        lounge_id = new_lounge.id

        if lounge_id in self.lounges:
            # Merge with existing
            existing = self.lounges[lounge_id]
            self.duplicates += 1

            # Keep most detailed information
            if not existing.description and new_lounge.description:
                existing.description = new_lounge.description
            if not existing.location and new_lounge.location:
                existing.location = new_lounge.location
            if not existing.open_hours and new_lounge.open_hours:
                existing.open_hours = new_lounge.open_hours
            if not existing.conditions and new_lounge.conditions:
                existing.conditions = new_lounge.conditions

            # Merge access methods
            existing.access_methods = list(set(existing.access_methods + new_lounge.access_methods))

            # Merge amenities
            existing.amenities = list(set(existing.amenities + new_lounge.amenities))

            # Update rating if new one is higher
            if new_lounge.rating > existing.rating:
                existing.rating = new_lounge.rating
                existing.review_count = new_lounge.review_count

        else:
            # Add new lounge
            self.lounges[lounge_id] = new_lounge
            self.merged += 1

    def process_prioritypass(self) -> None:
        """Process PriorityPass CSV"""
        print("\n📋 Processing PriorityPass data...")
        csv_path = self.data_dir / "prioritypass_lounges.csv"

        with open(csv_path, 'r', encoding='utf-8-sig') as f:
            reader = csv.DictReader(f)
            count = 0

            for row in reader:
                name = self.clean_text(row.get('Lounge Name'))
                airport_code = self.clean_text(row.get('Airport (IATA)'))

                if not name or not airport_code:
                    continue

                lounge = Lounge(
                    id=self.generate_id(name, airport_code, row.get('Terminal')),
                    name=name,
                    airport_code=airport_code,
                    airport_name=self.clean_text(row.get('Airport Full', '')),
                    city=self.clean_text(row.get('City', '')),
                    country=self.clean_text(row.get('Country', '')),
                    terminal=self.clean_text(row.get('Terminal')),
                    location=self.clean_text(row.get('Location')),
                    open_hours=self.clean_text(row.get('Hours')),
                    conditions=self.clean_text(row.get('Conditions')),
                    lounge_type='independent',
                    access_methods=['Priority Pass'],
                    source='PriorityPass'
                )

                self.merge_lounge(lounge)
                count += 1

            print(f"   ✅ Processed {count} PriorityPass lounges")

    def process_supabase(self) -> None:
        """Process Supabase CSV (already normalized)"""
        print("\n📋 Processing Supabase data...")
        csv_path = self.data_dir / "supabase_lounges.csv"

        with open(csv_path, 'r', encoding='utf-8-sig') as f:
            reader = csv.DictReader(f)
            count = 0

            for row in reader:
                name = self.clean_text(row.get('name'))
                airport_code = self.clean_text(row.get('airport'))

                if not name or not airport_code:
                    continue

                lounge = Lounge(
                    id=self.clean_text(row.get('id', self.generate_id(name, airport_code, row.get('terminal')))),
                    name=name,
                    airport_code=airport_code,
                    airport_name='',
                    city=self.clean_text(row.get('city', '')),
                    country=self.clean_text(row.get('country', '')),
                    terminal=self.clean_text(row.get('terminal')),
                    location=self.clean_text(row.get('location')),
                    open_hours=self.clean_text(row.get('open_hours')),
                    amenities=self.parse_json_array(row.get('amenities')),
                    access_methods=self.parse_json_array(row.get('access_methods')),
                    lounge_type=self.clean_text(row.get('lounge_type', 'independent')),
                    description=self.clean_text(row.get('description')),
                    rating=float(row.get('rating', 0) or 0),
                    review_count=int(row.get('review_count', 0) or 0),
                    max_capacity=int(row.get('max_capacity', 50) or 50),
                    coordinates=self.clean_text(row.get('coordinates')),
                    source='Supabase'
                )

                self.merge_lounge(lounge)
                count += 1

            print(f"   ✅ Processed {count} Supabase lounges")

    def process_amex(self) -> None:
        """Process American Express Centurion lounges"""
        print("\n📋 Processing Amex Centurion data...")
        csv_path = self.data_dir / "amex_global_lounges_sample.csv"

        with open(csv_path, 'r', encoding='utf-8-sig') as f:
            reader = csv.DictReader(f)
            count = 0

            for row in reader:
                name = self.clean_text(row.get('name'))
                airport = self.clean_text(row.get('airport'))

                if not name or not airport:
                    continue

                # Extract airport code from airport name (rough heuristic)
                airport_code = 'AMEX'  # Fallback

                lounge = Lounge(
                    id=self.generate_id(name, airport_code, row.get('terminal')),
                    name=name,
                    airport_code=airport_code,
                    airport_name=airport,
                    city=self.clean_text(row.get('city', '')),
                    country=self.clean_text(row.get('country', '')),
                    terminal=self.clean_text(row.get('terminal')),
                    location=self.clean_text(row.get('location')),
                    lounge_type='centurion',
                    access_methods=['American Express Platinum', 'Centurion Card'],
                    description=self.clean_text(row.get('description')),
                    amenities=['Premium Dining', 'Spa Services', 'Private Workspace', 'Shower Facilities'],
                    source='Amex'
                )

                self.merge_lounge(lounge)
                count += 1

            print(f"   ✅ Processed {count} Amex Centurion lounges")

    def process_dreamfolks(self) -> None:
        """Process DreamFolks partner lounges"""
        print("\n📋 Processing DreamFolks data...")
        csv_path = self.data_dir / "dreamfolks_lounges_sample.csv"

        with open(csv_path, 'r', encoding='utf-8-sig') as f:
            reader = csv.DictReader(f)
            count = 0

            for row in reader:
                name = self.clean_text(row.get('name'))
                airport = self.clean_text(row.get('airport'))

                if not name or not airport:
                    continue

                airport_code = 'DF'  # Fallback

                lounge = Lounge(
                    id=self.generate_id(name, airport_code, row.get('terminal')),
                    name=name,
                    airport_code=airport_code,
                    airport_name=airport,
                    city=self.clean_text(row.get('city', '')),
                    country=self.clean_text(row.get('country', '')),
                    terminal=self.clean_text(row.get('terminal')),
                    location=self.clean_text(row.get('location')),
                    lounge_type='partner',
                    access_methods=['DreamFolks'],
                    description=self.clean_text(row.get('description')),
                    source='DreamFolks'
                )

                self.merge_lounge(lounge)
                count += 1

            print(f"   ✅ Processed {count} DreamFolks lounges")

    def process_plaza_premium(self) -> None:
        """Process Plaza Premium lounges"""
        print("\n📋 Processing Plaza Premium data...")
        csv_path = self.data_dir / "plaza_premium_lounges_sample.csv"

        with open(csv_path, 'r', encoding='utf-8-sig') as f:
            reader = csv.DictReader(f)
            count = 0

            for row in reader:
                name = self.clean_text(row.get('name'))
                airport = self.clean_text(row.get('airport'))

                if not name or not airport:
                    continue

                airport_code = 'PP'  # Fallback

                lounge = Lounge(
                    id=self.generate_id(name, airport_code, row.get('terminal')),
                    name=name,
                    airport_code=airport_code,
                    airport_name=airport,
                    city=self.clean_text(row.get('city', '')),
                    country=self.clean_text(row.get('country', '')),
                    terminal=self.clean_text(row.get('terminal')),
                    location=self.clean_text(row.get('location')),
                    lounge_type='operator',
                    access_methods=['Plaza Premium', 'Priority Pass'],
                    description=self.clean_text(row.get('description')),
                    source='PlazaPremium'
                )

                self.merge_lounge(lounge)
                count += 1

            print(f"   ✅ Processed {count} Plaza Premium lounges")

    def process_tav(self) -> None:
        """Process TAV lounges (Turkey focused)"""
        print("\n📋 Processing TAV data...")
        csv_path = self.data_dir / "TAV_Lounges__preview_.csv"

        with open(csv_path, 'r', encoding='utf-8-sig') as f:
            reader = csv.DictReader(f)
            count = 0

            for row in reader:
                name = self.clean_text(row.get('Lounge Name'))
                airport = self.clean_text(row.get('Airport'))

                if not name or not airport:
                    continue

                airport_code = 'TAV'  # Fallback

                lounge = Lounge(
                    id=self.generate_id(name, airport_code),
                    name=name,
                    airport_code=airport_code,
                    airport_name=airport,
                    city=self.clean_text(row.get('City', '')),
                    country=self.clean_text(row.get('Country', 'Turkey')),
                    location=self.clean_text(row.get('Notes')),
                    lounge_type='operator',
                    access_methods=['TAV Passport', 'Priority Pass'],
                    source='TAV'
                )

                self.merge_lounge(lounge)
                count += 1

            print(f"   ✅ Processed {count} TAV lounges")

    def export_master_csv(self, output_path: Path) -> None:
        """Export master CSV file"""
        print(f"\n💾 Exporting master CSV to {output_path}...")

        fieldnames = [
            'id', 'name', 'airport_code', 'airport_name', 'city', 'country',
            'terminal', 'location', 'open_hours', 'amenities', 'access_methods',
            'lounge_type', 'description', 'conditions', 'rating', 'review_count',
            'max_capacity', 'coordinates', 'images', 'source', 'created_at'
        ]

        with open(output_path, 'w', encoding='utf-8', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()

            for lounge in sorted(self.lounges.values(), key=lambda l: (l.country or '', l.city or '', l.name or '')):
                row = asdict(lounge)
                # Convert lists to JSON strings
                row['amenities'] = json.dumps(row['amenities'])
                row['access_methods'] = json.dumps(row['access_methods'])
                row['images'] = json.dumps(row['images'])
                writer.writerow(row)

        print(f"   ✅ Exported {len(self.lounges)} lounges to CSV")

    def export_master_json(self, output_path: Path) -> None:
        """Export master JSON file"""
        print(f"\n💾 Exporting master JSON to {output_path}...")

        data = {
            'metadata': {
                'total_lounges': len(self.lounges),
                'sources': ['PriorityPass', 'Supabase', 'Amex', 'DreamFolks', 'PlazaPremium', 'TAV'],
                'generated_at': datetime.now().isoformat(),
                'duplicates_merged': self.duplicates
            },
            'lounges': [asdict(l) for l in sorted(self.lounges.values(), key=lambda l: (l.country or '', l.city or '', l.name or ''))]
        }

        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

        print(f"   ✅ Exported {len(self.lounges)} lounges to JSON")

    def generate_stats(self) -> Dict:
        """Generate statistics about the merged database"""
        stats = {
            'total_lounges': len(self.lounges),
            'duplicates_merged': self.duplicates,
            'countries': len(set(l.country for l in self.lounges.values() if l.country)),
            'cities': len(set(l.city for l in self.lounges.values() if l.city)),
            'airports': len(set(l.airport_code for l in self.lounges.values() if l.airport_code)),
            'lounge_types': {},
            'access_methods': {},
            'sources': {}
        }

        for lounge in self.lounges.values():
            # Count lounge types
            lounge_type = lounge.lounge_type or 'unknown'
            stats['lounge_types'][lounge_type] = stats['lounge_types'].get(lounge_type, 0) + 1

            # Count access methods
            for method in lounge.access_methods:
                stats['access_methods'][method] = stats['access_methods'].get(method, 0) + 1

            # Count sources
            stats['sources'][lounge.source] = stats['sources'].get(lounge.source, 0) + 1

        return stats

    def print_stats(self) -> None:
        """Print merger statistics"""
        stats = self.generate_stats()

        print("\n" + "="*60)
        print("📊 LOUNGE DATABASE STATISTICS")
        print("="*60)
        print(f"\n🎯 Total Unique Lounges: {stats['total_lounges']}")
        print(f"🔄 Duplicates Merged: {stats['duplicates_merged']}")
        print(f"🌍 Countries: {stats['countries']}")
        print(f"🏙️  Cities: {stats['cities']}")
        print(f"✈️  Airports: {stats['airports']}")

        print("\n📂 Lounge Types:")
        for ltype, count in sorted(stats['lounge_types'].items(), key=lambda x: -x[1]):
            print(f"   • {ltype}: {count}")

        print("\n🎫 Access Methods:")
        for method, count in sorted(stats['access_methods'].items(), key=lambda x: -x[1])[:10]:
            print(f"   • {method}: {count}")

        print("\n📚 Data Sources:")
        for source, count in sorted(stats['sources'].items(), key=lambda x: -x[1]):
            print(f"   • {source}: {count}")

        print("\n" + "="*60)


def main():
    """Main execution"""
    print("""
╔═══════════════════════════════════════════════════════════╗
║                  TAKEYOURLOUNGE.COM                       ║
║              Lounge Database Merger v1.0                  ║
╚═══════════════════════════════════════════════════════════╝
    """)

    data_dir = Path(__file__).parent
    merger = LoungeMerger(data_dir)

    # Process all sources
    merger.process_prioritypass()
    merger.process_supabase()
    merger.process_amex()
    merger.process_dreamfolks()
    merger.process_plaza_premium()
    merger.process_tav()

    # Export results
    merger.export_master_csv(data_dir / "master_lounges.csv")
    merger.export_master_json(data_dir / "master_lounges.json")

    # Print statistics
    merger.print_stats()

    print("\n✅ Database merge complete!")
    print(f"📁 Output files:")
    print(f"   • master_lounges.csv")
    print(f"   • master_lounges.json")


if __name__ == "__main__":
    main()
