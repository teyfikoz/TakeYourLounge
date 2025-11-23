#!/usr/bin/env python3
"""
Remove duplicate lounges from master CSV
"""

import csv
from pathlib import Path
from collections import defaultdict


def normalize_name(name: str) -> str:
    """Normalize lounge name for comparison - keep domestic/international distinction"""
    name = name.lower().strip()

    # Preserve domestic/international keywords
    is_domestic = 'domestic' in name
    is_international = 'international' in name

    # Remove common words (but NOT domestic/international)
    replacements = [
        'lounge', 'vip', 'the', 'executive', 'business', 'class',
        'premium', 'club', 'sala', 'salon', 'first', 'departure', 'departures'
    ]
    for word in replacements:
        name = name.replace(word, '')

    # Remove extra spaces
    name = ' '.join(name.split())

    # Re-add domestic/international flag at end
    if is_domestic:
        name += '_domestic'
    if is_international:
        name += '_international'

    return name


def create_lounge_key(row: dict) -> str:
    """Create unique key for lounge comparison"""
    name = normalize_name(row.get('name', ''))
    airport = row.get('airport_code', '').strip().upper()
    terminal = row.get('terminal', '').strip()
    city = row.get('city', '').strip().lower()

    # Key: airport_code + city + normalized_name + terminal
    # Include city to handle cases where airport_code is missing
    return f"{airport}_{city}_{name}_{terminal}"


def main():
    csv_file = Path("master_lounges_with_airlines.csv")

    if not csv_file.exists():
        print(f"❌ Error: {csv_file} not found!")
        return

    print("🔍 Analyzing duplicates in master CSV...")
    print("=" * 60)

    # Read all lounges
    lounges = []
    with open(csv_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames
        for row in reader:
            lounges.append(row)

    print(f"📊 Total lounges before: {len(lounges)}")

    # Group by unique key
    lounge_groups = defaultdict(list)
    for idx, lounge in enumerate(lounges):
        key = create_lounge_key(lounge)
        lounge_groups[key].append((idx, lounge))

    # Find duplicates
    duplicates_found = []
    for key, group in lounge_groups.items():
        if len(group) > 1:
            duplicates_found.append((key, group))

    print(f"\n🔍 Found {len(duplicates_found)} duplicate groups:")
    print("-" * 60)

    # Show duplicates
    for key, group in duplicates_found[:10]:  # Show first 10
        print(f"\n🔴 Duplicate group: {key}")
        for idx, lounge in group:
            print(f"   [{idx}] {lounge.get('name')} - {lounge.get('airport_code')} "
                  f"({lounge.get('terminal', 'N/A')}) - {lounge.get('city')}")

    if len(duplicates_found) > 10:
        print(f"\n   ... and {len(duplicates_found) - 10} more duplicate groups")

    # Remove duplicates (keep first occurrence)
    unique_lounges = []
    seen_keys = set()
    removed_count = 0

    for lounge in lounges:
        key = create_lounge_key(lounge)
        if key not in seen_keys:
            unique_lounges.append(lounge)
            seen_keys.add(key)
        else:
            removed_count += 1
            # print(f"   Removing duplicate: {lounge.get('name')} - {lounge.get('airport_code')}")

    print(f"\n📉 Removed {removed_count} duplicate lounges")
    print(f"✅ Unique lounges after: {len(unique_lounges)}")

    # Write cleaned CSV
    output_file = Path("master_lounges_with_airlines.csv")
    backup_file = Path("master_lounges_with_airlines.backup.csv")

    # Create backup
    import shutil
    shutil.copy(csv_file, backup_file)
    print(f"\n💾 Backup created: {backup_file}")

    # Write cleaned data
    with open(output_file, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(unique_lounges)

    print(f"✅ Cleaned CSV saved: {output_file}")
    print(f"\n📊 Summary:")
    print(f"   Before: {len(lounges)} lounges")
    print(f"   After:  {len(unique_lounges)} lounges")
    print(f"   Removed: {removed_count} duplicates")


if __name__ == "__main__":
    main()
