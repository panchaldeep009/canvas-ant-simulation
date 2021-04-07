export interface BaseElement {
  x: number,
  y: number,
  draw: (x: BaseElement['x'], y: BaseElement['y']) => void;
}