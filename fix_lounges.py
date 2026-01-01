#!/usr/bin/env python3
import json
import re
from collections import defaultdict

def to_title_case(text):
    """Convert text to proper title case"""
    if not text:
        return text

    # Words that should stay lowercase in title case (unless at start)
    lowercase_words = {'a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'in',
                       'of', 'on', 'or', 'the', 'to', 'with', 'via'}

    words = text.split()
    result = []

    for i, word in enumerate(words):
        # First word or word not in lowercase list
        if i == 0 or word.lower() not in lowercase_words:
            # Handle special cases like "VIP", "Wi-Fi", etc.
            if word.upper() in ['VIP', 'USA', 'UK', 'UAE', 'NYC', 'LA', 'SF']:
                result.append(word.upper())
            elif 'wi-fi' in word.lower():
                result.append('Wi-Fi')
            else:
                result.append(word.capitalize())
        else:
            result.append(word.lower())

    return ' '.join(result)

def find_duplicates(lounges):
    """Find duplicate lounges at same airport"""
    airport_lounges = defaultdict(list)

    for lounge in lounges:
        key = (lounge['airport_code'], lounge['name'].lower())
        airport_lounges[key].append(lounge)

    duplicates = {k: v for k, v in airport_lounges.items() if len(v) > 1}
    return duplicates

def main():
    # Read lounges data
    with open('web/src/data/lounges.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    print(f"Total lounges: {len(data['lounges'])}")

    # Find duplicates
    duplicates = find_duplicates(data['lounges'])
    print(f"\nFound {len(duplicates)} duplicate lounge name/airport combinations")

    if duplicates:
        print("\nDuplicate examples:")
        for (airport, name), lounges in list(duplicates.items())[:5]:
            print(f"  {airport} - {name}: {len(lounges)} entries")

    # Fix names and remove duplicates
    seen = set()
    fixed_lounges = []
    name_changes = 0
    removed = 0

    for lounge in data['lounges']:
        # Fix name to title case
        original_name = lounge['name']
        lounge['name'] = to_title_case(lounge['name'])

        if original_name != lounge['name']:
            name_changes += 1

        # Check for duplicate
        key = (lounge['airport_code'], lounge['name'].lower())
        if key not in seen:
            seen.add(key)
            fixed_lounges.append(lounge)
        else:
            removed += 1
            print(f"Removing duplicate: {lounge['airport_code']} - {lounge['name']}")

    print(f"\nChanges:")
    print(f"  - Fixed {name_changes} lounge names to title case")
    print(f"  - Removed {removed} duplicate entries")
    print(f"  - Total lounges after cleanup: {len(fixed_lounges)}")

    # Update data
    data['lounges'] = fixed_lounges
    data['total'] = len(fixed_lounges)

    # Save backup
    with open('web/src/data/lounges.backup.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    # Save updated data
    with open('web/src/data/lounges.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print("\n✅ Lounges data updated successfully!")
    print("   Backup saved to: lounges.backup.json")

if __name__ == '__main__':
    main()
