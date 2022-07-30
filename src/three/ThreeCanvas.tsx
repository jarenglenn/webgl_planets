import { Canvas } from "@react-three/fiber";
import { NoiseFunction3D } from "simplex-noise";

import { IPlanetArgs } from "../types";
import Fiber from "./Fiber";
import ThreeConfig from "./ThreeConfig";

interface Props {
  planetArgs: IPlanetArgs;
  noise3D: NoiseFunction3D;
}

export default function ThreeCanvas(props: Props) {
  return (
    <Canvas>
      <ThreeConfig />
      <Fiber {...props} />
    </Canvas>
  );
}
