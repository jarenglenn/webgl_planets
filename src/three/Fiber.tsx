import { useMemo } from "react";
import { Color } from "three";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { mergeBufferGeometries } from "three/examples/jsm/utils/BufferGeometryUtils";

import Hexasphere from "../hexaspherejs/hexasphere";
import { HexasphereArgs } from "../App";
import { computeTileGeometry } from "./hexasphereUtils";

interface Props {
  hexasphereArgs: typeof HexasphereArgs;
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
    const tileGeometries = hexasphere.tiles.map((tile) =>
      computeTileGeometry(tile, props.hexasphereArgs)
    );

    return mergeBufferGeometries(tileGeometries);
  }, [hexasphere, props.hexasphereArgs]);

  return (
    <>
      <OrbitControls />
      <PerspectiveCamera position={[0, 0, 20]} makeDefault />

      <mesh geometry={hexasphereGeometry} receiveShadow castShadow>
        <meshPhongMaterial color="#567d46" flatShading />
      </mesh>

      <pointLight position={[200, 200, 200]} args={[new Color("#fff"), 1000]} />

      <ambientLight args={[new Color("#fff")]} />
    </>
  );
}
