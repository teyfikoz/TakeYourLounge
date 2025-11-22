#!/usr/bin/env python3
"""
Add major airline lounges to the database
"""

import csv
from pathlib import Path

# Major airline lounges by region
AIRLINE_LOUNGES = [
    # MIDDLE EAST
    {'name': 'Emirates First Class Lounge', 'airport': 'Dubai International', 'airport_code': 'DXB', 'city': 'Dubai', 'country': 'United Arab Emirates', 'terminal': 'Terminal 3', 'airline': 'Emirates', 'lounge_type': 'airline'},
    {'name': 'Emirates Business Class Lounge', 'airport': 'Dubai International', 'airport_code': 'DXB', 'city': 'Dubai', 'country': 'United Arab Emirates', 'terminal': 'Terminal 3', 'airline': 'Emirates', 'lounge_type': 'airline'},
    {'name': 'Qatar Airways Al Mourjan Business Lounge', 'airport': 'Hamad International', 'airport_code': 'DOH', 'city': 'Doha', 'country': 'Qatar', 'terminal': '', 'airline': 'Qatar Airways', 'lounge_type': 'airline'},
    {'name': 'Qatar Airways Al Safwa First Lounge', 'airport': 'Hamad International', 'airport_code': 'DOH', 'city': 'Doha', 'country': 'Qatar', 'terminal': '', 'airline': 'Qatar Airways', 'lounge_type': 'airline'},
    {'name': 'Etihad First Class Lounge', 'airport': 'Abu Dhabi International', 'airport_code': 'AUH', 'city': 'Abu Dhabi', 'country': 'United Arab Emirates', 'terminal': 'Terminal 3', 'airline': 'Etihad', 'lounge_type': 'airline'},

    # EUROPE
    {'name': 'Turkish Airlines CIP Lounge', 'airport': 'Istanbul Airport', 'airport_code': 'IST', 'city': 'Istanbul', 'country': 'Turkey', 'terminal': 'International', 'airline': 'Turkish Airlines', 'lounge_type': 'airline'},
    {'name': 'Turkish Airlines Miles&Smiles Lounge', 'airport': 'Istanbul Airport', 'airport_code': 'IST', 'city': 'Istanbul', 'country': 'Turkey', 'terminal': 'International', 'airline': 'Turkish Airlines', 'lounge_type': 'airline'},
    {'name': 'Turkish Airlines Domestic Lounge', 'airport': 'Istanbul Airport', 'airport_code': 'IST', 'city': 'Istanbul', 'country': 'Turkey', 'terminal': 'Domestic', 'airline': 'Turkish Airlines', 'lounge_type': 'airline'},
    {'name': 'Lufthansa First Class Terminal', 'airport': 'Frankfurt Airport', 'airport_code': 'FRA', 'city': 'Frankfurt', 'country': 'Germany', 'terminal': 'Terminal 1', 'airline': 'Lufthansa', 'lounge_type': 'airline'},
    {'name': 'Lufthansa Senator Lounge', 'airport': 'Frankfurt Airport', 'airport_code': 'FRA', 'city': 'Frankfurt', 'country': 'Germany', 'terminal': 'Terminal 1', 'airline': 'Lufthansa', 'lounge_type': 'airline'},
    {'name': 'Lufthansa Business Lounge', 'airport': 'Munich Airport', 'airport_code': 'MUC', 'city': 'Munich', 'country': 'Germany', 'terminal': 'Terminal 2', 'airline': 'Lufthansa', 'lounge_type': 'airline'},
    {'name': 'British Airways Galleries First Lounge', 'airport': 'Heathrow Airport', 'airport_code': 'LHR', 'city': 'London', 'country': 'United Kingdom', 'terminal': 'Terminal 5', 'airline': 'British Airways', 'lounge_type': 'airline'},
    {'name': 'British Airways Galleries Club Lounge', 'airport': 'Heathrow Airport', 'airport_code': 'LHR', 'city': 'London', 'country': 'United Kingdom', 'terminal': 'Terminal 5', 'airline': 'British Airways', 'lounge_type': 'airline'},
    {'name': 'Air France La Premiere Lounge', 'airport': 'Charles de Gaulle Airport', 'airport_code': 'CDG', 'city': 'Paris', 'country': 'France', 'terminal': 'Terminal 2E', 'airline': 'Air France', 'lounge_type': 'airline'},
    {'name': 'KLM Crown Lounge', 'airport': 'Amsterdam Schiphol', 'airport_code': 'AMS', 'city': 'Amsterdam', 'country': 'Netherlands', 'terminal': '', 'airline': 'KLM', 'lounge_type': 'airline'},

    # ASIA PACIFIC
    {'name': 'Singapore Airlines SilverKris First Lounge', 'airport': 'Changi Airport', 'airport_code': 'SIN', 'city': 'Singapore', 'country': 'Singapore', 'terminal': 'Terminal 3', 'airline': 'Singapore Airlines', 'lounge_type': 'airline'},
    {'name': 'Singapore Airlines SilverKris Business Lounge', 'airport': 'Changi Airport', 'airport_code': 'SIN', 'city': 'Singapore', 'country': 'Singapore', 'terminal': 'Terminal 3', 'airline': 'Singapore Airlines', 'lounge_type': 'airline'},
    {'name': 'Cathay Pacific The Pier First Class Lounge', 'airport': 'Hong Kong International', 'airport_code': 'HKG', 'city': 'Hong Kong', 'country': 'Hong Kong', 'terminal': 'Terminal 1', 'airline': 'Cathay Pacific', 'lounge_type': 'airline'},
    {'name': 'Cathay Pacific The Wing First Class Lounge', 'airport': 'Hong Kong International', 'airport_code': 'HKG', 'city': 'Hong Kong', 'country': 'Hong Kong', 'terminal': 'Terminal 1', 'airline': 'Cathay Pacific', 'lounge_type': 'airline'},
    {'name': 'JAL First Class Lounge', 'airport': 'Tokyo Haneda', 'airport_code': 'HND', 'city': 'Tokyo', 'country': 'Japan', 'terminal': 'International', 'airline': 'JAL', 'lounge_type': 'airline'},
    {'name': 'ANA Suite Lounge', 'airport': 'Tokyo Narita', 'airport_code': 'NRT', 'city': 'Tokyo', 'country': 'Japan', 'terminal': 'Terminal 1', 'airline': 'ANA', 'lounge_type': 'airline'},
    {'name': 'Qantas First Lounge', 'airport': 'Sydney Airport', 'airport_code': 'SYD', 'city': 'Sydney', 'country': 'Australia', 'terminal': 'Terminal 1', 'airline': 'Qantas', 'lounge_type': 'airline'},

    # NORTH AMERICA
    {'name': 'Delta Sky Club', 'airport': 'Hartsfield-Jackson Atlanta', 'airport_code': 'ATL', 'city': 'Atlanta', 'country': 'United States', 'terminal': '', 'airline': 'Delta', 'lounge_type': 'airline'},
    {'name': 'United Club', 'airport': 'Newark Liberty International', 'airport_code': 'EWR', 'city': 'Newark', 'country': 'United States', 'terminal': '', 'airline': 'United', 'lounge_type': 'airline'},
    {'name': 'United Polaris Lounge', 'airport': "Chicago O'Hare", 'airport_code': 'ORD', 'city': 'Chicago', 'country': 'United States', 'terminal': '', 'airline': 'United', 'lounge_type': 'airline'},
    {'name': 'American Airlines Admirals Club', 'airport': 'Dallas/Fort Worth', 'airport_code': 'DFW', 'city': 'Dallas', 'country': 'United States', 'terminal': '', 'airline': 'American Airlines', 'lounge_type': 'airline'},
    {'name': 'Air Canada Maple Leaf Lounge', 'airport': 'Toronto Pearson', 'airport_code': 'YYZ', 'city': 'Toronto', 'country': 'Canada', 'terminal': 'Terminal 1', 'airline': 'Air Canada', 'lounge_type': 'airline'},
]


def add_airline_lounges(input_csv: Path, output_csv: Path):
    """Add airline lounges to existing data"""
    print(f"\n✈️  Adding {len(AIRLINE_LOUNGES)} airline lounges...")

    # Read existing lounges
    existing = []
    with open(input_csv, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        existing = list(reader)

    print(f"   Existing: {len(existing)} lounges")

    # Add airline lounges
    for i, lounge in enumerate(AIRLINE_LOUNGES, 1):
        lounge_id = f"airline_{lounge['airport_code'].lower()}_{lounge['airline'].lower().replace(' ', '_')}_{i}"

        row = {
            'id': lounge_id,
            'name': lounge['name'],
            'airport_code': lounge['airport_code'],
            'airport_name': lounge['airport'],
            'city': lounge['city'],
            'country': lounge['country'],
            'terminal': lounge['terminal'],
            'location': '',
            'open_hours': '24 hours',
            'amenities': '["Premium Dining", "Shower Facilities", "Business Center", "Free Wi-Fi", "Comfortable Seating"]',
            'access_methods': f'["{lounge["airline"]} First/Business Class", "Star Alliance Gold", "Oneworld Emerald"]',
            'lounge_type': 'airline',
            'description': f'{lounge["name"]} - Premium {lounge["airline"]} lounge at {lounge["airport"]}.',
            'conditions': 'First/Business class passengers only',
            'rating': 4.5,
            'review_count': 0,
            'max_capacity': 200,
            'coordinates': '',
            'latitude': '',
            'longitude': '',
            'elevation_ft': '',
            'continent': '',
            'iso_country': '',
            'wikipedia_link': '',
            'images': '[]',
            'source': 'AirlineLounges',
            'created_at': ''
        }
        existing.append(row)

    # Write output
    fieldnames = existing[0].keys()
    with open(output_csv, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(existing)

    print(f"   ✅ Added {len(AIRLINE_LOUNGES)} airline lounges")
    print(f"   📊 Total: {len(existing)} lounges")


def main():
    print("""
╔═══════════════════════════════════════════════════════════╗
║          ADD AIRLINE LOUNGES                              ║
║   Emirates, Turkish Airlines, Lufthansa, etc.            ║
╚═══════════════════════════════════════════════════════════╝
    """)

    data_dir = Path(__file__).parent
    input_csv = data_dir / "master_lounges_fixed.csv"
    output_csv = data_dir / "master_lounges_with_airlines.csv"

    add_airline_lounges(input_csv, output_csv)

    print("\n✅ Airline lounges added!")
    print(f"📁 Output: {output_csv}")


if __name__ == "__main__":
    main()
