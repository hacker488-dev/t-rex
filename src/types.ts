export interface CelestialBodyData {
  name: string;
  nameUrdu: string;
  description: string;
  descriptionUrdu: string;
  funFacts: string[];
  funFactsUrdu: string[];
  size: number; // A relative size for rendering
  diameterKm: number;
  color: string;
  orbitalRadius: number;
  orbitalSpeed: number;
  texture?: string; // Optional path to texture image
}

export interface SpacecraftData {
  name: string;
  nameUrdu: string;
  description: string;
  descriptionUrdu: string;
  funFacts: string[];
  funFactsUrdu: string[];
  size: number;
  diameterKm: number;
  color: string;
  position: [number, number, number]; // Assuming x, y, z coordinates
}

export interface AsteroidBeltData {
  name: string;
  nameUrdu: string;
  innerRadius: number;
  outerRadius: number;
  height: number;
  numberOfAsteroids: number;
  minSize: number;
  maxSize: number;
  color: string;
}

export interface KuiperBeltData {
  name: string;
  nameUrdu: string;
  innerRadius: number;
  outerRadius: number;
  height: number;
  numberOfObjects: number;
  minSize: number;
  maxSize: number;
  color: string;
}

export type SelectedObject = CelestialBodyData | SpacecraftData | AsteroidBeltData | KuiperBeltData | null;