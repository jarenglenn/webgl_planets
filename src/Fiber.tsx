import { useMemo } from "react";
import { OrbitControls, Stats } from "@react-three/drei";
import { BufferGeometry, Float32BufferAttribute } from "three";
import { mergeBufferGeometries } from "three/examples/jsm/utils/BufferGeometryUtils";
import Hexasphere from "./hexaspherejs/hexasphere";
import ThreeConfig from "./ThreeConfig";

export default function Fiber() {
  var hexasphere = useMemo(() => new Hexasphere(5, 10, 0.99), []);

  const hexasphereGeometry = useMemo(() => {
    const tileGeometries: BufferGeometry[] = [];

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

      tileGeometries.push(geometry);
    }

    const mergedGeometry = mergeBufferGeometries(tileGeometries);
    return mergedGeometry;
  }, [hexasphere]);

  return (
    <>
      <ThreeConfig />
      <Stats />

      <OrbitControls />

      <mesh geometry={hexasphereGeometry}>
        <meshPhysicalMaterial color="#87ceeb" />
      </mesh>

      <pointLight position={[100, 50, 10]} intensity={0.5} />
      <ambientLight intensity={0.2} />
    </>
  );
}