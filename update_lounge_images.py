#!/usr/bin/env python3
import json
import random

# Placeholder image URLs - using a free placeholder service
# These will be actual images that load properly
PLACEHOLDER_IMAGES = [
    "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&h=600&fit=crop&q=80",  # Modern lounge
    "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&h=600&fit=crop&q=80",  # Comfortable seating
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop&q=80",  # Restaurant/lounge
    "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&h=600&fit=crop&q=80",  # Premium lounge
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=600&fit=crop&q=80",  # Hotel lobby style
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop&q=80",  # Business lounge
]

def update_lounge_images(input_file, output_file):
    """Update all lounge images to use placeholder images from Unsplash"""

    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    print(f"Total lounges: {len(data['lounges'])}")

    updated_count = 0
    for lounge in data['lounges']:
        if 'images' in lounge and lounge['images']:
            # Assign 3 random images to each lounge
            lounge['images'] = random.sample(PLACEHOLDER_IMAGES, min(3, len(PLACEHOLDER_IMAGES)))
            updated_count += 1

    print(f"Updated {updated_count} lounges with new placeholder images")

    # Save updated data
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=True)

    print(f"✅ Saved to {output_file}")

if __name__ == '__main__':
    input_file = 'web/src/data/lounges.json'
    output_file = 'web/src/data/lounges.json'

    update_lounge_images(input_file, output_file)
