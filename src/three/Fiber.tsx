import { Suspense, useMemo } from "react";
import { AxesHelper, Color } from "three";
import {
  Environment,
  OrbitControls,
  PerspectiveCamera,
  Sphere,
  Stars,
} from "@react-three/drei";
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
      <PerspectiveCamera position={[100, 0, 0]} makeDefault />

      <mesh geometry={hexasphereGeometry} receiveShadow castShadow>
        <meshPhysicalMaterial vertexColors={true} flatShading />
      </mesh>

      <Stars radius={100} depth={50} count={2500} factor={4} saturation={10} />

      <directionalLight
        position={[100, 0, 0]}
        args={[new Color("#fcd29f")]}
        intensity={2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={150}
        shadow-camera-near={50}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
        shadow-bi
      />

      <Sphere args={[props.hexasphereArgs.radius]}>
        <meshPhysicalMaterial color="black" />
      </Sphere>

      <ambientLight intensity={0.025} />

      <primitive object={new AxesHelper(100)} />

      <Suspense fallback={null}>
        <Environment files="/assets/watermark_space.hdr" background={true} />
      </Suspense>
    </>
  );
}
