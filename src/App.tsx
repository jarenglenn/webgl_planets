import { useState } from "react";
import styled from "styled-components";
import { createNoise3D } from "simplex-noise";

import ThreeCanvas from "./three/ThreeCanvas";
import { IPlanetArgs } from "./types";
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

export const PlanetArgs: IPlanetArgs = {
  radius: 20,
  divisions: 20,
  tileScale: 1,
  frequency: 0.048,
};

export default function App() {
  const [planetArgs, setPlanetArgs] = useState(PlanetArgs);
  const [seed, setSeed] = useState(makeSeed(10));

  const noise3D = createNoise3D(Alea(seed));

  const handleClick = (key: keyof IPlanetArgs, value: number) => {
    setPlanetArgs({
      ...planetArgs,
      [key]: value,
    });
  };

  return (
    <CanvasWrapper>
      <HTMLWrapper>
        <p>tileScale: {planetArgs.tileScale}</p>
        <input
          type="range"
          min={0.01}
          max={1}
          step={0.01}
          value={planetArgs.tileScale}
          onChange={(event) => {
            handleClick("tileScale", event.target.valueAsNumber);
          }}
        />
        <p>divisions: {planetArgs.divisions}</p>
        <input
          type="range"
          min={1}
          max={100}
          step={5}
          value={planetArgs.divisions}
          onChange={(event) => {
            handleClick("divisions", event.target.valueAsNumber);
          }}
        />
        <p>radius: {planetArgs.radius}</p>
        <input
          type="range"
          min={1}
          max={20}
          step={1}
          value={planetArgs.radius}
          onChange={(event) => {
            handleClick("radius", event.target.valueAsNumber);
          }}
        />
        <p>frequency: {planetArgs.frequency}</p>
        <input
          type="range"
          min={0.001}
          max={0.1}
          step={0.001}
          value={planetArgs.frequency}
          onChange={(event) => {
            handleClick("frequency", event.target.valueAsNumber);
          }}
        />
        <button onClick={() => setSeed(makeSeed(10))}>Regenerate</button>
      </HTMLWrapper>
      <ThreeCanvas planetArgs={planetArgs} noise3D={noise3D} />;
    </CanvasWrapper>
  );
}
