import { useMemo } from "react";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { BufferGeometry, DoubleSide, Float32BufferAttribute } from "three";
import { mergeBufferGeometries } from "three/examples/jsm/utils/BufferGeometryUtils";
import Hexasphere from "./hexaspherejs/hexasphere";
import { HexasphereArgs } from "./App";

interface Props {
  hexasphereArgs: typeof HexasphereArgs;
}

const depthRatio = 1.5;

export default function Fiber(props: Props) {
  const hexasphere = useMemo(
    () =>
      new Hexasphere(
        props.hexasphereArgs.radius,
        props.hexasphereArgs.divisions,
        props.hexasphereArgs.tileScale
      ),
    [props.hexasphereArgs]
  );

  const hexasphereGeometry = useMemo(() => {
    const tileGeometries: BufferGeometry[] = [];

    for (const tile of hexasphere.tiles) {
      let vertices: number[] = [];
      let indices: number[] = [];

      const geometry = new BufferGeometry();

      // Inside points
      for (const boundaryPoint of tile.boundary) {
        vertices.push(boundaryPoint.x, boundaryPoint.y, boundaryPoint.z);
      }

      // Outside points
      for (const boundaryPoint of tile.boundary) {
        vertices.push(
          boundaryPoint.x * depthRatio,
          boundaryPoint.y * depthRatio,
          boundaryPoint.z * depthRatio
        );
      }

      // Inside triangles

      // prettier-ignore
      indices.push(
        0, 1, 2,
        0, 2, 3,
        0, 3, 4,
      );

      let outsideIndex = 5;

      if (vertices.length > 30) {
        indices.push(0, 4, 5);
        outsideIndex++;
      }

      // prettier-ignore
      indices.push(
        outsideIndex, outsideIndex + 1, outsideIndex + 2,
        outsideIndex, outsideIndex + 2, outsideIndex + 3,
        outsideIndex, outsideIndex + 3, outsideIndex + 4,
      );

      if (vertices.length > 30) {
        indices.push(outsideIndex, outsideIndex + 4, outsideIndex + 5);
      }

      geometry.setAttribute("position", new Float32BufferAttribute(vertices, 3, false));
      geometry.setIndex(indices);
      geometry.computeVertexNormals();

      tileGeometries.push(geometry);
    }

    return mergeBufferGeometries(tileGeometries);
  }, [hexasphere]);

  return (
    <>
      <OrbitControls />
      <PerspectiveCamera position={[0, 0, 50]} makeDefault />

      <mesh geometry={hexasphereGeometry}>
        <meshPhysicalMaterial color="#87ceeb" />
      </mesh>

      <pointLight position={[100, 50, 10]} intensity={0.5} />
      <ambientLight intensity={0.2} />
    </>
  );
}
