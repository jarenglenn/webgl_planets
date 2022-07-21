import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { BufferAttribute, BufferGeometry, Color, DoubleSide } from "three";
import Face from "./hexaspherejs/face";
import Hexasphere from "./hexaspherejs/hexasphere";
import Point from "./hexaspherejs/point";
import { useMemo } from "react";

type Tile = {
  centerPoint: Point;
  boundary: Point[];
  neighbors: Tile[];
  neighborIds: string[];
  faces: Face[];
};

export default function App() {
  var hexasphere = new Hexasphere(15, 3, 0.8);

  const { scene } = useThree();
  scene.background = new Color("#f1e3bb");

  const triangles = hexasphere.tiles.map((tile) => {
    return tile.faces.map((face) => {
      return face.points.map((point) => [point.x, point.y, point.z]);
    });
  });

  console.log(triangles);

  //tile[face][point]

  console.log(triangles);

  let vertices = useMemo(() => new Float32Array(triangles.flat(3)), [triangles]);

  const hexasphereGeometry = new BufferGeometry();

  hexasphereGeometry.setAttribute("position", new BufferAttribute(vertices, 3));

  // vertices = [
  //   // // front
  //   // { pos: [-1, -1, 1], norm: [0, 0, 1], uv: [0, 1] },
  //   // { pos: [1, -1, 1], norm: [0, 0, 1], uv: [1, 1] },
  //   // { pos: [-1, 1, 1], norm: [0, 0, 1], uv: [0, 0] },
  //   // { pos: [-1, 1, 1], norm: [0, 0, 1], uv: [0, 0] },
  //   // { pos: [1, -1, 1], norm: [0, 0, 1], uv: [1, 1] },
  //   // { pos: [1, 1, 1], norm: [0, 0, 1], uv: [1, 0] },
  //   // // right
  //   // { pos: [1, -1, 1], norm: [1, 0, 0], uv: [0, 1] },
  //   // { pos: [1, -1, -1], norm: [1, 0, 0], uv: [1, 1] },
  //   // { pos: [1, 1, 1], norm: [1, 0, 0], uv: [0, 0] },
  //   // { pos: [1, 1, 1], norm: [1, 0, 0], uv: [0, 0] },
  //   // { pos: [1, -1, -1], norm: [1, 0, 0], uv: [1, 1] },
  //   // { pos: [1, 1, -1], norm: [1, 0, 0], uv: [1, 0] },
  //   // // back
  //   // { pos: [1, -1, -1], norm: [0, 0, -1], uv: [0, 1] },
  //   // { pos: [-1, -1, -1], norm: [0, 0, -1], uv: [1, 1] },
  //   // { pos: [1, 1, -1], norm: [0, 0, -1], uv: [0, 0] },
  //   // { pos: [1, 1, -1], norm: [0, 0, -1], uv: [0, 0] },
  //   // { pos: [-1, -1, -1], norm: [0, 0, -1], uv: [1, 1] },
  //   // { pos: [-1, 1, -1], norm: [0, 0, -1], uv: [1, 0] },
  //   // // left
  //   // { pos: [-1, -1, -1], norm: [-1, 0, 0], uv: [0, 1] },
  //   // { pos: [-1, -1, 1], norm: [-1, 0, 0], uv: [1, 1] },
  //   // { pos: [-1, 1, -1], norm: [-1, 0, 0], uv: [0, 0] },
  //   // { pos: [-1, 1, -1], norm: [-1, 0, 0], uv: [0, 0] },
  //   // { pos: [-1, -1, 1], norm: [-1, 0, 0], uv: [1, 1] },
  //   // { pos: [-1, 1, 1], norm: [-1, 0, 0], uv: [1, 0] },
  //   // // top
  //   // { pos: [1, 1, -1], norm: [0, 1, 0], uv: [0, 1] },
  //   // { pos: [-1, 1, -1], norm: [0, 1, 0], uv: [1, 1] },
  //   // { pos: [1, 1, 1], norm: [0, 1, 0], uv: [0, 0] },
  //   // { pos: [1, 1, 1], norm: [0, 1, 0], uv: [0, 0] },
  //   // { pos: [-1, 1, -1], norm: [0, 1, 0], uv: [1, 1] },
  //   // { pos: [-1, 1, 1], norm: [0, 1, 0], uv: [1, 0] },
  //   // // bottom
  //   // { pos: [1, -1, 1], norm: [0, -1, 0], uv: [0, 1] },
  //   // { pos: [-1, -1, 1], norm: [0, -1, 0], uv: [1, 1] },
  //   // { pos: [1, -1, -1], norm: [0, -1, 0], uv: [0, 0] },
  //   // { pos: [1, -1, -1], norm: [0, -1, 0], uv: [0, 0] },
  //   // { pos: [-1, -1, 1], norm: [0, -1, 0], uv: [1, 1] },
  //   // { pos: [-1, -1, -1], norm: [0, -1, 0], uv: [1, 0] },
  // ];

  // const positions: number[] = [];
  // const normals: number[] = [];
  // const uvs: number[] = [];

  // for (const vertex of vertices) {
  //   positions.push(...vertex.pos);
  //   normals.push(...vertex.norm);
  //   uvs.push(...vertex.uv);
  // }

  const geo = useMemo(() => {
    const geometry = new BufferGeometry();
    const positionNumComponents = 3;
    geometry.setAttribute(
      "position",
      new BufferAttribute(new Float32Array(vertices), positionNumComponents)
    );
    return geometry;
  }, [vertices]);

  return (
    <group>
      <OrbitControls />
      <mesh geometry={geo}>
        <meshStandardMaterial color="red" side={DoubleSide} />
      </mesh>
      <pointLight position={[10, 5, 10]} />
    </group>
  );
}
