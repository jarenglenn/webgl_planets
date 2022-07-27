import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import {
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  Mesh,
  MeshStandardMaterial,
} from "three";
import Hexasphere from "./hexaspherejs/hexasphere";

export default function App() {
  const { scene } = useThree();
  scene.background = new Color("#f1e3bb");

  var hexasphere = new Hexasphere(5, 5, 1);

  for (const tile of hexasphere.tiles) {
    let vertices = [];
    let indices = [];

    const geometry = new BufferGeometry();

    for (const boundaryPoint of tile.boundary) {
      vertices.push(boundaryPoint.x, boundaryPoint.y, boundaryPoint.z);
    }

    indices.push(0, 1, 2, 0, 2, 3, 0, 3, 4);

    if (vertices.length > 15) {
      indices.push(0, 4, 5);
    }

    geometry.setAttribute("position", new Float32BufferAttribute(vertices, 3, false));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    var mesh = new Mesh(geometry, new MeshStandardMaterial({ color: 0x87ceeb }));
    scene.add(mesh);
  }

  return (
    <group>
      <OrbitControls />
      {/* <mesh geometry={geo}>
        <meshStandardMaterial color="#87ceeb" />
      </mesh> */}
      <pointLight position={[50, 50, 10]} />
      <ambientLight intensity={0.2} />
    </group>
  );
}
