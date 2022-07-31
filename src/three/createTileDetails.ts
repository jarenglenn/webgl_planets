import {
  BufferGeometry,
  CylinderGeometry,
  Euler,
  Float32BufferAttribute,
  Quaternion,
  SphereGeometry,
  Vector3,
} from "three";
import { mergeBufferGeometries } from "three/examples/jsm/utils/BufferGeometryUtils";
import Hexasphere from "../hexaspherejs/hexasphere";
import Tile from "../hexaspherejs/tile";
import { randomBetween, repeatArray } from "../util";
import { Biome, colorGeometry, outerCircumradius, scaledPoint } from "./tileUtils";

function randomRotate(geometry: BufferGeometry) {
  const eulerRotation = new Euler(
    randomBetween(0, 2 * Math.PI),
    randomBetween(0, 2 * Math.PI),
    randomBetween(0, 2 * Math.PI)
  );

  const quaternion = new Quaternion().setFromEuler(eulerRotation);
  geometry.applyQuaternion(quaternion);
}

function createRockGeometry(tile: Tile) {
  const tileRadius = outerCircumradius(tile);
  const rockRadius = randomBetween(tileRadius / 5, tileRadius / 2);
  const geometry = new SphereGeometry(rockRadius, 7, 7);

  const numVertices = geometry.attributes.position.count;
  const colors = repeatArray(Biome.Stone, numVertices);

  geometry.setAttribute("color", new Float32BufferAttribute(colors, 3, false));
  geometry.deleteAttribute("uv");

  geometry.computeVertexNormals();

  return geometry;
}

function createTreeGeometry(tile: Tile) {
  const tileRadius = outerCircumradius(tile);

  const treeHeight = randomBetween(tileRadius * 0.8, tileRadius * 1.6);
  const randomRotation = Math.random() * Math.PI * 2;

  // Leaves
  const bottomGeometry = new CylinderGeometry(0, tileRadius, treeHeight, 3);
  bottomGeometry.rotateY(randomRotation);
  bottomGeometry.translate(0, treeHeight * 0 + tileRadius * 1.2, 0);

  const middleGeometry = new CylinderGeometry(0, tileRadius * (23 / 30), treeHeight, 3);
  middleGeometry.rotateY(randomRotation);
  middleGeometry.translate(0, treeHeight * 0.6 + tileRadius * 1.2, 0);

  const topGeometry = new CylinderGeometry(0, tileRadius * (16 / 23), treeHeight, 3);
  topGeometry.rotateY(randomRotation);
  topGeometry.translate(0, treeHeight * 1.25 + tileRadius * 1.2, 0);

  // Trunk
  const trunkGeometry = new CylinderGeometry(
    tileRadius / 5,
    tileRadius / 5,
    treeHeight * 1.5
  );
  colorGeometry(trunkGeometry, "#543f23");

  const leaves = mergeBufferGeometries([bottomGeometry, middleGeometry, topGeometry]);
  colorGeometry(leaves, "#31703a");

  const tree = mergeBufferGeometries([leaves, trunkGeometry]);

  return tree;
}

interface DetailGeometries {
  trees: BufferGeometry[];
  rocks: BufferGeometry[];
}

function createTileDetail(tile: Tile, geometries: DetailGeometries) {
  tile.checkExists(["biome", "depthRatio"], "createTileDetail");

  // Rocks
  if (tile.biome === Biome.Sand && Math.random() < 0.2) {
    const rockGeometry = createRockGeometry(tile);

    // translate to tile center
    const { x, y, z } = scaledPoint(tile.centerPoint, tile.depthRatio!);
    rockGeometry.lookAt(new Vector3(x, y, z));

    const translateTo = scaledPoint(
      tile.centerPoint,
      tile.depthRatio! * randomBetween(0.98, 1.0)
    );
    randomRotate(rockGeometry);
    rockGeometry.translate(translateTo.x, translateTo.y, translateTo.z);

    geometries.rocks.push(rockGeometry);
  }
  // Trees
  else if (tile.biome === Biome.Grass && Math.random() < 0.1) {
    const treeGeometry = createTreeGeometry(tile);

    const to = scaledPoint(tile.centerPoint, tile.depthRatio!);
    treeGeometry.rotateX(Math.PI / 2); // rotate so tree points away from tile
    treeGeometry.lookAt(new Vector3(to.x, to.y, to.z)); // orient tree towards tile
    treeGeometry.translate(to.x, to.y, to.z); // move tree to tile
    geometries.trees.push(treeGeometry);
  }
}

export function createPlanetDetails(planet: Hexasphere) {
  const geometries: DetailGeometries = {
    trees: [],
    rocks: [],
  };

  planet.tiles.forEach((tile) => {
    createTileDetail(tile, geometries);
  });

  return {
    rocksGeometry: mergeBufferGeometries(geometries.rocks),
    treesGeometry: mergeBufferGeometries(geometries.trees),
  };
}
