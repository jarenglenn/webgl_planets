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
import computeTileGeometry from "./computeTileGeometry";
import { NoiseFunction3D } from "simplex-noise";
import { IPlanetArgs } from "../types";
import { createPlanetDetails } from "./createTileDetails";

interface Props {
  planetArgs: IPlanetArgs;
  noiseFunctions: {
    planet: NoiseFunction3D;
    trees: NoiseFunction3D;
  };
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
      computeTileGeometry(tile, props.planetArgs, props.noiseFunctions.planet)
    );
    const geometry = mergeBufferGeometries(tileGeometries);

    return geometry;
  }, [planet, props.planetArgs, props.noiseFunctions]);

  const { rocksGeometry, treesGeometry } = useMemo(() => {
    return createPlanetDetails(planet, props.noiseFunctions.trees);
  }, [planet, props.noiseFunctions]);

  return (
    <>
      <OrbitControls
        maxDistance={250}
        minDistance={props.planetArgs.radius * 1.5}
        autoRotate
        autoRotateSpeed={0.2}
        enablePan={false}
      />
      <PerspectiveCamera position={[100, 0, 0]} makeDefault />

      <mesh geometry={planetGeometry} receiveShadow castShadow>
        <meshPhysicalMaterial
          vertexColors
          flatShading
          envMapIntensity={0.3}
          polygonOffset={true}
          polygonOffsetFactor={0.001}
          polygonOffsetUnits={1}
        />
      </mesh>

      <mesh receiveShadow geometry={treesGeometry} castShadow>
        <meshPhysicalMaterial flatShading envMapIntensity={0.2} vertexColors />
      </mesh>

      <mesh receiveShadow geometry={rocksGeometry} castShadow>
        <meshPhysicalMaterial vertexColors flatShading envMapIntensity={0.2} />
      </mesh>

      <Stars radius={100} depth={50} count={2500} factor={4} saturation={10} />

      <directionalLight
        position={[50, 0, 0]}
        args={[new Color("#fcd29f")]}
        intensity={2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={100}
        shadow-camera-near={0.1}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
        // shadow-bias={-0.001}
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
