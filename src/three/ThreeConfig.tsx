import { ACESFilmicToneMapping, Color, sRGBEncoding, PCFSoftShadowMap } from "three";
import { useThree } from "@react-three/fiber";

export default function ThreeConfig() {
  const { gl: renderer, scene } = useThree();
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.outputEncoding = sRGBEncoding;
  renderer.physicallyCorrectLights = true;

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;

  scene.background = new Color("#444");

  return <></>;
}
