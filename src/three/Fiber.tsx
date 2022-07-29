import { Suspense, useMemo } from "react";
import { AxesHelper, Color } from "three";
import { Environment, OrbitControls, PerspectiveCamera, Stars } from "@react-three/drei";
import { mergeBufferGeometries } from "three/examples/jsm/utils/BufferGeometryUtils";

import Hexasphere from "../hexaspherejs/hexasphere";
import { HexasphereArgs } from "../App";
import computeTileGeometry from "./computeTileGeometry.ts";
import { NoiseFunction3D } from "simplex-noise";

interface Props {
  hexasphereArgs: typeof HexasphereArgs;
  noise3D: NoiseFunction3D;
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
      computeTileGeometry(tile, props.hexasphereArgs, props.noise3D)
    );

    return mergeBufferGeometries(tileGeometries);
  }, [hexasphere, props]);

  return (
    <>
      <OrbitControls />
      <PerspectiveCamera position={[0, 0, 20]} makeDefault />

      <mesh geometry={hexasphereGeometry} receiveShadow castShadow>
        <meshPhysicalMaterial vertexColors={true} flatShading />
      </mesh>

      <Stars radius={100} depth={50} count={2500} factor={4} saturation={10} />

      <pointLight
        position={[100, 0, 0]}
        args={[new Color("#fcd29f")]}
        intensity={150}
        distance={0}
        castShadow
      />

      <ambientLight intensity={0.025} />

      <primitive object={new AxesHelper(100)} />

      <Suspense fallback={null}>
        <Environment files="/assets/watermark_space.hdr" background={false} />
      </Suspense>
    </>
  );
}
