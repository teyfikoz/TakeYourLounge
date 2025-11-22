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
