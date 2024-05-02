declare type Line = {
  type: "line";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

declare type Circle = {
  type: "circle";
  cx: number;
  cy: number;
  r: number;
};

declare type Point = {
  x1: number;
  y1: number;
};

declare type Rect = {
  type: "rect";
  x: number;
  y: number;
  width: number;
  height: number;
};

declare type Shape = Line | Circle | Rect;

declare type ShapeMode = "line" | "circle" | "rect" | "pointer" | "eraser";
