import { Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { PCFSoftShadowMap } from "three";

import { HexasphereArgs } from "./App";
import Fiber from "./Fiber";
import ThreeConfig from "./ThreeConfig";

export default function ThreeCanvas(props: { hexasphereArgs: typeof HexasphereArgs }) {
  return (
    <Canvas shadows={{ type: PCFSoftShadowMap }}>
      <ThreeConfig />
      {/* <Stats /> */}
      <Fiber hexasphereArgs={props.hexasphereArgs} />
    </Canvas>
  );
}
