import { Suspense, useMemo } from "react";
import { Color } from "three";
import {
  Environment,
  OrbitControls,
  PerspectiveCamera,
  Sphere,
  Stars,
} from "@react-three/drei";
import { mergeBufferGeometries } from "three/examples/jsm/utils/BufferGeometryUtils";

import Hexasphere from "../hexaspherejs/hexasphere";
import computeTileGeometry from "./computeTileGeometry.ts";
import { NoiseFunction3D } from "simplex-noise";
import { IPlanetArgs } from "../types";

interface Props {
  planetArgs: IPlanetArgs;
  noise3D: NoiseFunction3D;
}

export default function Fiber(props: Props) {
  const planet = useMemo(
    () =>
      new Hexasphere(
        props.planetArgs.radius,
        props.planetArgs.divisions,
        props.planetArgs.tileScale
      ),
    [props.planetArgs]
  );

  const planetGeometry = useMemo(() => {
    const tileGeometries = planet.tiles.map((tile) =>
      computeTileGeometry(tile, props.planetArgs, props.noise3D)
    );

    return mergeBufferGeometries(tileGeometries);
  }, [planet, props]);

  return (
    <>
      <OrbitControls />
      <PerspectiveCamera position={[100, 0, 0]} makeDefault />

      <mesh geometry={planetGeometry} receiveShadow castShadow>
        <meshPhysicalMaterial vertexColors={true} flatShading envMapIntensity={0.2} />
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

      <Sphere args={[props.planetArgs.radius]}>
        <meshPhysicalMaterial color="black" />
      </Sphere>

      <ambientLight intensity={0.025} />

      <Suspense fallback={null}>
        <Environment files="/assets/space.hdr" background={false} />
      </Suspense>
    </>
  );
}
