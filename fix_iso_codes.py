#!/usr/bin/env python3
"""
Fix remaining ISO country codes to full names
"""

import csv
from pathlib import Path


# Complete ISO country code mapping
ISO_COUNTRY_MAP = {
    'AG': 'Antigua and Barbuda',
    'AL': 'Albania',
    'AW': 'Aruba',
    'BA': 'Bosnia and Herzegovina',
    'BB': 'Barbados',
    'BM': 'Bermuda',
    'BN': 'Brunei',
    'BO': 'Bolivia',
    'BS': 'Bahamas',
    'CR': 'Costa Rica',
    'CV': 'Cape Verde',
    'CW': 'Curacao',
    'DO': 'Dominican Republic',
    'EC': 'Ecuador',
    'EH': 'Western Sahara',
    'FJ': 'Fiji',
    'GD': 'Grenada',
    'GI': 'Gibraltar',
    'GP': 'Guadeloupe',
    'GQ': 'Equatorial Guinea',
    'GT': 'Guatemala',
    'GU': 'Guam',
    'GY': 'Guyana',
    'HN': 'Honduras',
    'IM': 'Isle of Man',
    'JE': 'Jersey',
    'JM': 'Jamaica',
    'KG': 'Kyrgyzstan',
    'LC': 'Saint Lucia',
    'ME': 'Montenegro',
    'MK': 'North Macedonia',
    'MO': 'Macau',
    'MP': 'Northern Mariana Islands',
    'PA': 'Panama',
    'PF': 'French Polynesia',
    'PR': 'Puerto Rico',
    'PY': 'Paraguay',
    'RW': 'Rwanda',
    'SV': 'El Salvador',
    'TT': 'Trinidad and Tobago',
    'TW': 'Taiwan',
    'UY': 'Uruguay',
    'VU': 'Vanuatu',
}


def main():
    csv_file = Path("master_lounges_with_airlines.csv")

    if not csv_file.exists():
        print(f"❌ Error: {csv_file} not found!")
        return

    print("🔧 Fixing ISO country codes...")
    print("=" * 60)

    # Read CSV
    lounges = []
    with open(csv_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames
        for row in reader:
            lounges.append(row)

    print(f"📊 Total lounges: {len(lounges)}")

    # Fix ISO codes
    fixed_count = 0
    for lounge in lounges:
        country = lounge.get('country', '').strip()
        if country in ISO_COUNTRY_MAP:
            old_country = country
            lounge['country'] = ISO_COUNTRY_MAP[country]
            fixed_count += 1
            if fixed_count <= 5:  # Show first 5 examples
                print(f"   ✅ {old_country} → {lounge['country']}")

    if fixed_count > 5:
        print(f"   ... and {fixed_count - 5} more")

    print(f"\n📊 Fixed {fixed_count} country codes")

    # Write updated CSV
    with open(csv_file, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(lounges)

    print(f"✅ CSV updated: {csv_file}")

    # Verify no ISO codes remain
    remaining_iso = set()
    for lounge in lounges:
        country = lounge.get('country', '').strip()
        if len(country) == 2 and country.isupper():
            remaining_iso.add(country)

    if remaining_iso:
        print(f"\n⚠️  Warning: {len(remaining_iso)} ISO codes still remain: {', '.join(sorted(remaining_iso))}")
    else:
        print(f"\n✅ All ISO codes fixed! No 2-letter codes remain.")


if __name__ == "__main__":
    main()
