import { CollisionBlock } from "../classes/CollisionBlock";

export interface Position {
  x: number;
  y: number;
}
export interface Velocity extends Position {}

export interface ISprite {
  position: Position;
  imageSrc: string;
}

export interface IPlayer {
  position: Position;
  collisionBlocks: CollisionBlock[];
}

export interface IObject {
  position: Position;
  width: number;
  height: number;
}
