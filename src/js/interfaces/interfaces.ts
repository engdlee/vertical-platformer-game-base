export interface Position {
  x: number;
  y: number;
}
export interface Velocity extends Position {}

export interface ISprite {
  position: Position;
  imageSrc: string;
}
