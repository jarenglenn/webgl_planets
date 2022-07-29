import { Canvas } from "@react-three/fiber";
import { NoiseFunction2D } from "simplex-noise";
import { PCFSoftShadowMap } from "three";

import { IHexasphereArgs } from "../types";
import Fiber from "./Fiber";
import ThreeConfig from "./ThreeConfig";

interface Props {
  hexasphereArgs: IHexasphereArgs;
  noise2D: NoiseFunction2D;
}

export default function ThreeCanvas(props: Props) {
  return (
    <Canvas shadows={{ type: PCFSoftShadowMap }}>
      <ThreeConfig />
      <Fiber {...props} />
    </Canvas>
  );
}
