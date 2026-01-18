#!/usr/bin/env python3
"""
Wikidata Airport Lounge Extractor
License: CC0 (Public Domain)
Source: Wikidata

Extracts airport lounge data from Wikidata SPARQL endpoint
"""

import requests
import json
import time
import os
from typing import List, Dict

class WikidataLoungeExtractor:
    """
    Extract airport lounges from Wikidata
    ✅ Legal: CC0 license - Public domain
    """

    def __init__(self):
        self.endpoint = "https://query.wikidata.org/sparql"
        self.lounges = []

    def query_lounges(self) -> List[Dict]:
        """
        SPARQL query for airport lounges
        """
        query = """
        SELECT DISTINCT
          ?lounge ?loungeLabel
          ?airport ?airportLabel ?iata
          ?operator ?operatorLabel
          ?location ?locationLabel
          ?coords
          ?terminal
          ?website
        WHERE {
          # Airport lounges
          ?lounge wdt:P31 wd:Q1248784.  # instance of: airport lounge

          # Airport information
          OPTIONAL {
            ?lounge wdt:P4969 ?airport.  # located at airport
            ?airport wdt:P238 ?iata.     # IATA code
          }

          # Operator
          OPTIONAL { ?lounge wdt:P137 ?operator. }

          # Location details
          OPTIONAL { ?lounge wdt:P131 ?location. }

          # Coordinates
          OPTIONAL { ?lounge wdt:P625 ?coords. }

          # Terminal
          OPTIONAL { ?lounge wdt:P5389 ?terminal. }

          # Website
          OPTIONAL { ?lounge wdt:P856 ?website. }

          SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
        }
        ORDER BY ?airportLabel
        """

        print("🔍 Querying Wikidata for airport lounges...")

        try:
            response = requests.get(
                self.endpoint,
                params={
                    'query': query,
                    'format': 'json'
                },
                headers={
                    'User-Agent': 'TakeYourLounge/1.0 (https://takeyourlounge.com; legal data aggregation)'
                },
                timeout=60
            )

            if response.status_code == 200:
                data = response.json()
                results = data['results']['bindings']
                print(f"✅ Found {len(results)} Wikidata lounges")
                return self.parse_wikidata_results(results)
            else:
                print(f"❌ Error: {response.status_code}")
                return []

        except Exception as e:
            print(f"❌ Exception: {e}")
            return []

    def query_airline_lounges(self) -> List[Dict]:
        """
        Query for airline-operated lounges (better coverage)
        """
        query = """
        SELECT DISTINCT
          ?lounge ?loungeLabel
          ?airport ?airportLabel ?iata
          ?airline ?airlineLabel
          ?coords
          ?country ?countryLabel
        WHERE {
          # Airline lounges
          {
            ?lounge wdt:P31 wd:Q1248784.  # airport lounge
          } UNION {
            ?lounge wdt:P31 wd:Q11997503. # business lounge
          }

          # Airline operator
          OPTIONAL {
            ?lounge wdt:P137 ?airline.
            ?airline wdt:P31 wd:Q46970.   # airline
          }

          # Airport
          OPTIONAL {
            ?lounge wdt:P4969 ?airport.
            ?airport wdt:P238 ?iata.
            ?airport wdt:P17 ?country.
          }

          # Coordinates
          OPTIONAL { ?lounge wdt:P625 ?coords. }

          SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
        }
        LIMIT 1000
        """

        print("🔍 Querying Wikidata for airline lounges...")

        try:
            response = requests.get(
                self.endpoint,
                params={
                    'query': query,
                    'format': 'json'
                },
                headers={
                    'User-Agent': 'TakeYourLounge/1.0'
                },
                timeout=60
            )

            if response.status_code == 200:
                data = response.json()
                results = data['results']['bindings']
                print(f"✅ Found {len(results)} airline lounges")
                return self.parse_wikidata_results(results)
            else:
                print(f"❌ Error: {response.status_code}")
                return []

        except Exception as e:
            print(f"❌ Exception: {e}")
            return []

    def parse_wikidata_results(self, results: List[Dict]) -> List[Dict]:
        """
        Parse Wikidata SPARQL results
        """
        lounges = []

        for result in results:
            # Extract Wikidata ID
            lounge_uri = result.get('lounge', {}).get('value', '')
            wikidata_id = lounge_uri.split('/')[-1] if lounge_uri else ''

            # Parse coordinates
            coords_str = result.get('coords', {}).get('value', '')
            lat, lng = None, None
            if coords_str and 'Point(' in coords_str:
                try:
                    # Format: Point(lng lat)
                    coords = coords_str.replace('Point(', '').replace(')', '').split()
                    lng = float(coords[0])
                    lat = float(coords[1])
                except:
                    pass

            lounge = {
                'id': f"wikidata_{wikidata_id}",
                'name': result.get('loungeLabel', {}).get('value', 'Unknown Lounge'),
                'airport_code': result.get('iata', {}).get('value', ''),
                'airport_name': result.get('airportLabel', {}).get('value', ''),
                'country': result.get('countryLabel', {}).get('value', ''),
                'city': result.get('locationLabel', {}).get('value', ''),

                'source': 'Wikidata',
                'source_license': 'CC0',
                'source_attribution': 'Wikidata contributors',
                'wikidata_id': wikidata_id,
                'wikidata_url': lounge_uri,

                # Operator
                'operator': result.get('operatorLabel', {}).get('value', result.get('airlineLabel', {}).get('value', '')),
                'airline': result.get('airlineLabel', {}).get('value', ''),

                # Location
                'latitude': lat,
                'longitude': lng,
                'terminal': result.get('terminal', {}).get('value', ''),

                # Additional info
                'website': result.get('website', {}).get('value', ''),

                # Metadata
                'verified': False,
                'verification_source': 'wikidata',
                'lounge_type': 'airline' if result.get('airlineLabel') else 'independent'
            }

            lounges.append(lounge)

        return lounges

    def save_to_json(self, filename: str):
        """
        Save lounges to JSON file
        """
        output = {
            'total': len(self.lounges),
            'source': 'Wikidata',
            'license': 'CC0 (Public Domain)',
            'attribution': 'Wikidata contributors (wikidata.org)',
            'extracted_at': time.strftime('%Y-%m-%d %H:%M:%S'),
            'lounges': self.lounges
        }

        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(output, f, indent=2, ensure_ascii=False)

        print(f"✅ Saved {len(self.lounges)} lounges to {filename}")

    def extract(self) -> List[Dict]:
        """
        Main extraction method
        """
        print("🚀 Starting Wikidata lounge extraction...")
        print("=" * 60)

        # Query general lounges
        lounges1 = self.query_lounges()
        time.sleep(2)  # Rate limiting

        # Query airline lounges
        lounges2 = self.query_airline_lounges()

        # Merge and deduplicate
        all_lounges = lounges1 + lounges2
        seen_ids = set()
        unique_lounges = []

        for lounge in all_lounges:
            wikidata_id = lounge.get('wikidata_id', '')
            if wikidata_id and wikidata_id not in seen_ids:
                seen_ids.add(wikidata_id)
                unique_lounges.append(lounge)

        self.lounges = unique_lounges

        print("=" * 60)
        print(f"✅ Total unique lounges: {len(self.lounges)}")

        return self.lounges


def main():
    """
    Main execution
    """
    extractor = WikidataLoungeExtractor()

    # Extract lounges
    lounges = extractor.extract()

    # Save to file
    output_file = os.path.join(
        os.path.dirname(os.path.dirname(__file__)),
        'data',
        'lounges_wikidata.json'
    )

    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    extractor.save_to_json(output_file)

    # Statistics
    print("\n📊 Wikidata Lounge Statistics:")
    print(f"   Total: {len(lounges)}")

    # By country
    countries = {}
    for lounge in lounges:
        country = lounge.get('country', 'unknown')
        if country:
            countries[country] = countries.get(country, 0) + 1

    print("\n   Top Countries:")
    for country, count in sorted(countries.items(), key=lambda x: x[1], reverse=True)[:10]:
        print(f"   - {country}: {count}")

    # By operator
    operators = {}
    for lounge in lounges:
        op = lounge.get('operator', 'unknown')
        if op and op != 'unknown':
            operators[op] = operators.get(op, 0) + 1

    print("\n   Top Operators:")
    for op, count in sorted(operators.items(), key=lambda x: x[1], reverse=True)[:10]:
        print(f"   - {op}: {count}")


if __name__ == "__main__":
    main()
