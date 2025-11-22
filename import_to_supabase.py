#!/usr/bin/env python3
"""
TakeYourLounge - Supabase Data Importer
Imports master lounge database to Supabase/PostgreSQL
"""

import csv
import json
import os
from pathlib import Path
from typing import List, Dict
from supabase import create_client, Client


class SupabaseImporter:
    """Import lounge data to Supabase"""

    def __init__(self, supabase_url: str = None, supabase_key: str = None):
        """
        Initialize Supabase client

        Args:
            supabase_url: Your Supabase project URL
            supabase_key: Your Supabase service role key (or anon key for testing)
        """
        # Get from environment variables if not provided
        self.url = supabase_url or os.getenv('SUPABASE_URL')
        self.key = supabase_key or os.getenv('SUPABASE_KEY')

        if not self.url or not self.key:
            raise ValueError(
                "Supabase credentials required. Set SUPABASE_URL and SUPABASE_KEY environment variables "
                "or pass them as parameters."
            )

        self.client: Client = create_client(self.url, self.key)
        self.batch_size = 100  # Insert in batches to avoid timeouts

    def parse_json_field(self, value: str) -> List:
        """Parse JSON string field"""
        try:
            return json.loads(value) if value else []
        except:
            return []

    def prepare_lounge_data(self, row: Dict) -> Dict:
        """Prepare lounge data for insertion"""
        return {
            'id': row['id'],
            'name': row['name'],
            'airport_code': row['airport_code'],
            'airport_name': row['airport_name'] or None,
            'city': row['city'] or None,
            'country': row['country'] or None,
            'terminal': row['terminal'] or None,
            'location': row['location'] or None,
            'open_hours': row['open_hours'] or None,
            'amenities': self.parse_json_field(row['amenities']),
            'access_methods': self.parse_json_field(row['access_methods']),
            'lounge_type': row['lounge_type'] or 'independent',
            'description': row['description'] or None,
            'conditions': row['conditions'] or None,
            'rating': float(row['rating']) if row['rating'] else 0.0,
            'review_count': int(row['review_count']) if row['review_count'] else 0,
            'max_capacity': int(row['max_capacity']) if row['max_capacity'] else 50,
            'current_occupancy': 0,
            'coordinates': row['coordinates'] or None,
            'images': self.parse_json_field(row['images']),
            'source': row['source'] or 'unknown',
            'is_active': True
        }

    def extract_airports(self, csv_path: Path) -> List[Dict]:
        """Extract unique airports from lounge data"""
        airports = {}

        with open(csv_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                code = row['airport_code']
                if code and code not in airports:
                    airports[code] = {
                        'airport_code': code,
                        'airport_name': row['airport_name'] or f"Airport {code}",
                        'city': row['city'] or 'Unknown',
                        'country': row['country'] or 'Unknown',
                        'timezone': None,
                        'coordinates': row['coordinates'] or None,
                        'total_lounges': 0
                    }

        return list(airports.values())

    def import_airports(self, csv_path: Path) -> None:
        """Import airports to Supabase"""
        print("\n📍 Extracting and importing airports...")

        airports = self.extract_airports(csv_path)
        print(f"   Found {len(airports)} unique airports")

        # Insert in batches
        for i in range(0, len(airports), self.batch_size):
            batch = airports[i:i + self.batch_size]
            try:
                self.client.table('airports').upsert(batch).execute()
                print(f"   ✅ Imported airports {i+1}-{min(i+self.batch_size, len(airports))}")
            except Exception as e:
                print(f"   ❌ Error importing airports batch {i}: {e}")

    def import_lounges(self, csv_path: Path) -> None:
        """Import lounges to Supabase"""
        print("\n🪑 Importing lounges...")

        lounges = []
        with open(csv_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                lounges.append(self.prepare_lounge_data(row))

        print(f"   Found {len(lounges)} lounges to import")

        # Insert in batches
        success_count = 0
        error_count = 0

        for i in range(0, len(lounges), self.batch_size):
            batch = lounges[i:i + self.batch_size]
            try:
                self.client.table('lounges').upsert(batch).execute()
                success_count += len(batch)
                print(f"   ✅ Imported lounges {i+1}-{min(i+self.batch_size, len(lounges))}")
            except Exception as e:
                error_count += len(batch)
                print(f"   ❌ Error importing lounges batch {i}: {e}")

        print(f"\n📊 Import Summary:")
        print(f"   ✅ Success: {success_count}")
        print(f"   ❌ Errors: {error_count}")

    def verify_import(self) -> None:
        """Verify imported data"""
        print("\n🔍 Verifying import...")

        try:
            # Count lounges
            lounge_count = self.client.table('lounges').select('id', count='exact').execute()
            print(f"   Total lounges in database: {lounge_count.count}")

            # Count airports
            airport_count = self.client.table('airports').select('airport_code', count='exact').execute()
            print(f"   Total airports in database: {airport_count.count}")

            # Sample top lounges
            top_lounges = self.client.table('lounges')\
                .select('name, city, country, rating')\
                .order('rating', desc=True)\
                .limit(5)\
                .execute()

            print("\n🏆 Top 5 Rated Lounges:")
            for lounge in top_lounges.data:
                print(f"   • {lounge['name']} ({lounge['city']}, {lounge['country']}) - Rating: {lounge['rating']}")

        except Exception as e:
            print(f"   ❌ Verification error: {e}")

    def run_full_import(self, csv_path: Path) -> None:
        """Run complete import process"""
        print("""
╔═══════════════════════════════════════════════════════════╗
║              SUPABASE DATA IMPORTER                       ║
║           TakeYourLounge.com Database                     ║
╚═══════════════════════════════════════════════════════════╝
        """)

        print(f"📂 Source file: {csv_path}")
        print(f"🌐 Supabase URL: {self.url}")

        # Step 1: Import airports
        self.import_airports(csv_path)

        # Step 2: Import lounges
        self.import_lounges(csv_path)

        # Step 3: Verify
        self.verify_import()

        print("\n✅ Import complete!")


def main():
    """Main execution"""
    import sys

    # Configuration
    csv_path = Path(__file__).parent / "master_lounges.csv"

    if not csv_path.exists():
        print(f"❌ Error: {csv_path} not found!")
        print("   Please run merge_lounges.py first to generate the master CSV.")
        sys.exit(1)

    # Check for environment variables
    if not os.getenv('SUPABASE_URL') or not os.getenv('SUPABASE_KEY'):
        print("""
⚠️  Supabase credentials not found!

Please set environment variables:

    export SUPABASE_URL="https://your-project.supabase.co"
    export SUPABASE_KEY="your-service-role-key"

Or pass them as command line arguments (not recommended for production):

    python3 import_to_supabase.py <url> <key>
        """)

        if len(sys.argv) == 3:
            url = sys.argv[1]
            key = sys.argv[2]
        else:
            sys.exit(1)
    else:
        url = None
        key = None

    try:
        # Install supabase if not available
        try:
            import supabase
        except ImportError:
            print("📦 Installing supabase package...")
            os.system("pip3 install supabase")
            print("   ✅ Supabase package installed")

        # Run import
        importer = SupabaseImporter(url, key)
        importer.run_full_import(csv_path)

    except Exception as e:
        print(f"\n❌ Import failed: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
