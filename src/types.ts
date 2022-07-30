export interface IHexasphereArgs {
  radius: number;
  divisions: number;
  tileScale: number;
  frequency: number;
}

export type ColorArray = [number, number, number];

export type Point = { x: number; y: number; z: number };
