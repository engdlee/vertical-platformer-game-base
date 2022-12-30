import { CollisionBlock } from "../classes/CollisionBlock";

export interface Position {
  x: number;
  y: number;
}
export interface Velocity extends Position {}

export interface ISprite {
  position: Position;
  imageSrc: string;
  frameRate?: number;
  frameBuffer?: number;
  scale?: number;
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

export interface IAnimation {
  imageSrc: string;
  frameRate: number;
  frameBuffer: number;
  image?: HTMLImageElement;
}

export interface IAnimations {
  Idle: IAnimation;
  Run: IAnimation;
  Jump: IAnimation;
  Fall: IAnimation;
  FallLeft: IAnimation;
  RunLeft: IAnimation;
  IdleLeft: IAnimation;
  JumpLeft: IAnimation;
}
