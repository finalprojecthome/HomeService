export interface Province {
  id: number;
  name: string;
}

export interface District {
  id: number;
  name: string;
}

export interface SubDistrict {
  id: number;
  name: string;
  latitude: number | null;
  longitude: number | null;
  postCode: number;
}
