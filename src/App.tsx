import { useState } from "react";
import styled from "styled-components";
import { createNoise3D } from "simplex-noise";

import ThreeCanvas from "./three/ThreeCanvas";
import { IHexasphereArgs } from "./types";
import { makeSeed } from "./util";
import Alea from "alea";

const CanvasWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const HTMLWrapper = styled.div`
  position: absolute;
  top: 0;
  z-index: 10;
  margin: 1rem;
  color: white;
`;

export const HexasphereArgs: IHexasphereArgs = {
  radius: 20,
  divisions: 5,
  tileScale: 0.975,
  frequency: 0.04,
};

export default function App() {
  const [hexasphereArgs, setHexasphereArgs] = useState(HexasphereArgs);
  const [seed, setSeed] = useState(makeSeed(10));

  const noise3D = createNoise3D(Alea(seed));

  const handleClick = (key: keyof typeof HexasphereArgs, value: number) => {
    setHexasphereArgs({
      ...hexasphereArgs,
      [key]: value,
    });
  };

  return (
    <CanvasWrapper>
      <HTMLWrapper>
        <p>tileScale: {hexasphereArgs.tileScale}</p>
        <input
          type="range"
          min={0.01}
          max={1}
          step={0.01}
          value={hexasphereArgs.tileScale}
          onChange={(event) => {
            handleClick("tileScale", event.target.valueAsNumber);
          }}
        />
        <p>divisions: {hexasphereArgs.divisions}</p>
        <input
          type="range"
          min={1}
          max={20}
          step={1}
          value={hexasphereArgs.divisions}
          onChange={(event) => {
            handleClick("divisions", event.target.valueAsNumber);
          }}
        />
        <p>radius: {hexasphereArgs.radius}</p>
        <input
          type="range"
          min={1}
          max={20}
          step={1}
          value={hexasphereArgs.radius}
          onChange={(event) => {
            handleClick("radius", event.target.valueAsNumber);
          }}
        />
        <p>frequency: {hexasphereArgs.frequency}</p>
        <input
          type="range"
          min={0.01}
          max={1}
          step={0.01}
          value={hexasphereArgs.frequency}
          onChange={(event) => {
            handleClick("frequency", event.target.valueAsNumber);
          }}
        />
        <button onClick={() => setSeed(makeSeed(10))}>Regenerate</button>
      </HTMLWrapper>
      <ThreeCanvas hexasphereArgs={hexasphereArgs} noise3D={noise3D} />;
    </CanvasWrapper>
  );
}
