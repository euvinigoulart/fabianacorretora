export interface Property {
  id: string | number;
  title: string;
  description?: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  bathrooms?: number;
  garages?: number;
  hasBBQ?: boolean;
  hasPool?: boolean;
  hasLaundry?: boolean;
  area: string;
  image: string;
  gallery?: string[];
  tag: string;
  type: 'sale' | 'rental';
}
