import { Suspense, useMemo, useRef } from "react";
import { AxesHelper, BufferGeometry, Color, Material, Mesh } from "three";
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

  const hexasphereRef = useRef<Mesh<BufferGeometry, Material>>(null);

  return (
    <>
      <OrbitControls />
      <PerspectiveCamera position={[100, 0, 0]} makeDefault />

      <mesh geometry={hexasphereGeometry} ref={hexasphereRef} receiveShadow castShadow>
        <meshPhysicalMaterial vertexColors={true} flatShading />
      </mesh>

      <Stars radius={100} depth={50} count={2500} factor={4} saturation={10} />

      <spotLight
        position={[100, 0, 0]}
        args={[new Color("#fcd29f")]}
        intensity={150}
        distance={0}
        castShadow
        shadow-mapSize-width={8192}
        shadow-mapSize-height={8192}
        shadow-camera-near={0.5}
        shadow-camera-far={500}
      />

      <Sphere args={[props.hexasphereArgs.radius]}>
        <meshPhysicalMaterial color="black" />
      </Sphere>

      <ambientLight intensity={0.025} />

      <primitive object={new AxesHelper(100)} />

      <Suspense fallback={null}>
        <Environment files="/assets/watermark_space.hdr" background={false} />
      </Suspense>
    </>
  );
}
