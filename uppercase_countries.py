#!/usr/bin/env python3
"""
Convert all country names to UPPERCASE
"""

import csv
from pathlib import Path


def main():
    csv_file = Path("master_lounges_with_airlines.csv")

    if not csv_file.exists():
        print(f"❌ Error: {csv_file} not found!")
        return

    print("🔠 Converting country names to UPPERCASE...")
    print("=" * 60)

    # Read CSV
    lounges = []
    with open(csv_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames
        for row in reader:
            lounges.append(row)

    print(f"📊 Total lounges: {len(lounges)}")

    # Convert to uppercase
    converted_count = 0
    for lounge in lounges:
        country = lounge.get('country', '').strip()
        if country and country != country.upper():
            old_country = country
            lounge['country'] = country.upper()
            converted_count += 1
            if converted_count <= 5:  # Show first 5 examples
                print(f"   ✅ {old_country} → {lounge['country']}")

    if converted_count > 5:
        print(f"   ... and {converted_count - 5} more")

    print(f"\n📊 Converted {converted_count} country names to UPPERCASE")

    # Write updated CSV
    with open(csv_file, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(lounges)

    print(f"✅ CSV updated: {csv_file}")


if __name__ == "__main__":
    main()
