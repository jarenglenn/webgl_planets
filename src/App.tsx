import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { BufferGeometry, Color, DoubleSide, Vector3 } from "three";
import Hexasphere from "./hexaspherejs/hexasphere";
import { useMemo } from "react";

export default function App() {
  const { scene } = useThree();
  scene.background = new Color("#f1e3bb");

  var hexasphere = new Hexasphere(5, 1, 1);

  const vertices = hexasphere.tiles
    .map((tile) =>
      tile.boundary.map((point) => {
        return new Vector3(point.x, point.y, point.z);
      })
    )
    .flat();

  const geo = useMemo(() => {
    const geometry = new BufferGeometry();
    geometry.setFromPoints(vertices);
    geometry.computeVertexNormals();
    return geometry;
  }, [vertices]);

  // var blob = new Blob([hexasphere.toObj()], { type: "text/plain;charset=utf-8" });

  // downloadFile(blob, "hexasphere.obj");

  return (
    <group>
      <OrbitControls />
      <mesh geometry={geo}>
        <meshStandardMaterial color="#87ceeb" side={DoubleSide} />
      </mesh>
      <pointLight position={[50, 50, 10]} />
      <ambientLight intensity={0.2} />
    </group>
  );
}
