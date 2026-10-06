export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface Location {
  id: string;
  name: string;
  categoryId: string;
  address: string;
  latitude: number;
  longitude: number;
  description: string;
  history: string;
  images: string[];
  videos: string[];
}
