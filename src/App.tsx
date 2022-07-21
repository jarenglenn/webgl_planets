import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { BufferAttribute, BufferGeometry, Color } from "three";
import Hexasphere from "./hexaspherejs/hexasphere";
import { useMemo } from "react";
import { calculateSurfaceNormal, pointingAwayFromOrigin } from "./hexaspherejs/tile";

export default function App() {
  const { scene } = useThree();
  scene.background = new Color("#f1e3bb");

  var hexasphere = new Hexasphere(15, 3, 0.8);

  const triangles = hexasphere.tiles.map((tile) =>
    tile.faces.map((face) => {
      const normalVector = calculateSurfaceNormal(
        face.points[0],
        face.points[1],
        face.points[2]
      );

      const flipFactor = pointingAwayFromOrigin(face.centroid!, normalVector) ? -1 : 1;

      return face.points.map((point) =>
        [point.x, point.y, point.z].map((coordinate) => coordinate * flipFactor)
      );
    })
  );

  let vertices = useMemo(() => new Float32Array(triangles.flat(3)), [triangles]);

  const hexasphereGeometry = new BufferGeometry();
  hexasphereGeometry.setAttribute("position", new BufferAttribute(vertices, 3));

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
        <meshStandardMaterial color="red" />
      </mesh>
      <pointLight position={[10, 5, 10]} />
    </group>
  );
}
