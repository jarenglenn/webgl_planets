import { useThree } from "@react-three/fiber";
import { Color } from "three";

export default function ThreeConfig() {
  const { scene } = useThree();
  scene.background = new Color("#FFEECC");

  return <></>;
}
