import { Canvas } from "@react-three/fiber";
import { NoiseFunction3D } from "simplex-noise";
import { PCFSoftShadowMap } from "three";

import { IHexasphereArgs } from "../types";
import Fiber from "./Fiber";
import ThreeConfig from "./ThreeConfig";

interface Props {
  hexasphereArgs: IHexasphereArgs;
  noise3D: NoiseFunction3D;
}

export default function ThreeCanvas(props: Props) {
  return (
    <Canvas shadows={{ type: PCFSoftShadowMap }}>
      <ThreeConfig />
      <Fiber {...props} />
    </Canvas>
  );
}
