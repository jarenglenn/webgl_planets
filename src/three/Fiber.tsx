import { useMemo } from "react";
import { Color } from "three";
import { OrbitControls, PerspectiveCamera, Stars } from "@react-three/drei";
import { mergeBufferGeometries } from "three/examples/jsm/utils/BufferGeometryUtils";

import Hexasphere from "../hexaspherejs/hexasphere";
import { HexasphereArgs } from "../App";
import computeTileGeometry from "./computeTileGeometry.ts";
import { NoiseFunction2D } from "simplex-noise";

interface Props {
  hexasphereArgs: typeof HexasphereArgs;
  noise2D: NoiseFunction2D;
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
      computeTileGeometry(tile, props.hexasphereArgs, props.noise2D)
    );

    return mergeBufferGeometries(tileGeometries);
  }, [hexasphere, props]);

  return (
    <>
      <OrbitControls />
      <PerspectiveCamera position={[0, 0, 20]} makeDefault />

      <mesh geometry={hexasphereGeometry} receiveShadow castShadow>
        <meshPhongMaterial vertexColors={true} flatShading />
      </mesh>

      <Stars radius={100} depth={50} count={2500} factor={4} saturation={10} />

      <pointLight position={[200, 200, 200]} args={[new Color("#fff"), 1000]} />

      <ambientLight args={[new Color("#fff")]} />
    </>
  );
}
