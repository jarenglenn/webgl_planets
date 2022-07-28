import { useMemo } from "react";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { BufferGeometry, Color, Float32BufferAttribute } from "three";
import { mergeBufferGeometries } from "three/examples/jsm/utils/BufferGeometryUtils";
import Hexasphere from "./hexaspherejs/hexasphere";
import { HexasphereArgs } from "./App";

interface Props {
  hexasphereArgs: typeof HexasphereArgs;
}

function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

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
      const ratio = getRandomArbitrary(1, props.hexasphereArgs.maxTileRatio);
      for (const boundaryPoint of tile.boundary) {
        vertices.push(
          boundaryPoint.x * ratio,
          boundaryPoint.y * ratio,
          boundaryPoint.z * ratio
        );
      }

      // Inside triangles
      // prettier-ignore
      indices.push(
        0, 1, 2,
        0, 2, 3,
        0, 3, 4,
      );

      let i = 5; // first index of outside triangle

      if (vertices.length > 30) {
        indices.push(0, 4, 5);
        i++;
      }

      // Outside triangles
      // prettier-ignore
      indices.push(
        i, i + 1, i + 2,
        i, i + 2, i + 3,
        i, i + 3, i + 4,
      );

      if (vertices.length > 30) {
        indices.push(i, i + 4, i + 5);
      }

      // Side triangles

      // prettier-ignore
      indices.push(
        0, i + 1, i,
        0, 1, i + 1,
        1, i + 2, i + 1,
        1, 2, i + 2,
        2, i + 3, i + 2,
        2, 3, i + 3,
        3, i + 4, i + 3,
        3, 4, i + 4,
      );

      if (vertices.length > 30) {
        // prettier-ignore
        indices.push(
          5, 11, 10,
          5, 6, 11,
          4, 5, 10,
          5, 0, 6
        );
      } else {
        // prettier-ignore
        indices.push(
          4, 0, i + 4,
          0, i, i + 4
        );
      }

      geometry.setAttribute("position", new Float32BufferAttribute(vertices, 3, false));
      geometry.setIndex(indices);
      geometry.computeVertexNormals();

      tileGeometries.push(geometry);
    }

    return mergeBufferGeometries(tileGeometries);
  }, [hexasphere, props.hexasphereArgs.maxTileRatio]);

  return (
    <>
      <OrbitControls />
      <PerspectiveCamera position={[0, 0, 20]} makeDefault />

      <mesh geometry={hexasphereGeometry} receiveShadow castShadow>
        <meshPhongMaterial color="#007A39" />
      </mesh>

      <pointLight position={[200, 200, 200]} args={[new Color("#88eeff"), 1000]} />

      <ambientLight args={[new Color("#88eeff")]} />
    </>
  );
}
