import { useState } from "react";
import styled from "styled-components";

import ThreeCanvas from "./three/ThreeCanvas";
import { IHexasphereArgs } from "./types";

const CanvasWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const HTMLWrapper = styled.div`
  position: absolute;
  top: 0;
  z-index: 10;
  margin: 1rem;
`;

export const HexasphereArgs: IHexasphereArgs = {
  radius: 10,
  divisions: 5,
  tileScale: 1,
  maxTileRatio: 1.5,
};

export default function App() {
  const [hexasphereArgs, setHexasphereArgs] = useState(HexasphereArgs);

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
        <p>maxTileRatio: {hexasphereArgs.maxTileRatio}</p>
        <input
          type="range"
          min={1}
          max={2}
          step={0.01}
          value={hexasphereArgs.maxTileRatio}
          onChange={(event) => {
            handleClick("maxTileRatio", event.target.valueAsNumber);
          }}
        />
      </HTMLWrapper>
      <ThreeCanvas hexasphereArgs={hexasphereArgs} />;
    </CanvasWrapper>
  );
}
