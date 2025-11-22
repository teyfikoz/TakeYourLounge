export interface Lounge {
  id: string;
  name: string;
  airport_code: string;
  airport_name: string;
  city: string;
  country: string;
  terminal?: string;
  location?: string;
  open_hours?: string;
  amenities: string[];
  access_methods: string[];
  lounge_type: 'independent' | 'operator' | 'centurion' | 'partner';
  description?: string;
  rating: number;
  review_count: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
  continent?: string;
  iso_country?: string;
  images: string[];
}

export interface LoungeData {
  total: number;
  lounges: Lounge[];
}

export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
  continent?: string;
  iso_country?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  lounge_count: number;
  avg_rating: number;
  terminals: Record<string, Lounge[]>;
  lounges: Lounge[];
  available_access_methods: string[];
  common_amenities: string[];
}

export interface AirportData {
  total: number;
  airports: Airport[];
}
