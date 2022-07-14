import Face from "./hexaspherejs/face";
import Hexasphere from "./hexaspherejs/hexasphere";
import Point from "./hexaspherejs/point";

type Tile = {
  centerPoint: Point;
  boundary: Point[];
  neighbors: Tile[];
  neighborIds: string[];
  faces: Face[];
};

export default function App() {
  const hexasphere = new Hexasphere(15, 5, 0.9);

  const tile: Tile = hexasphere.tiles[1];
  console.log(tile);

  return <h1>Hello, world!</h1>;
}
