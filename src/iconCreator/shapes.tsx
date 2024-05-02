import { FC } from "react";

interface Props {
  shapes: Shape[];
  shapeMode: ShapeMode;
  onShapeClick: (index: number) => void;
}

const Shapes: FC<Props> = ({ shapes, shapeMode, onShapeClick }) => {
  const pointerEvents = shapeMode === "pointer" || shapeMode === "eraser" ? "all" : "none";
  const className =
    shapeMode === "pointer"
      ? "stroke-black hover:stroke-blue-500"
      : shapeMode === "eraser"
      ? "stroke-black hover:stroke-red-500"
      : "stroke-black";

  return shapes.map((line, k) =>
    line.type === "line" ? (
      <line
        {...line}
        key={k}
        style={{ pointerEvents, cursor: "pointer" }}
        className={className}
        onClick={() => onShapeClick(k)}
      />
    ) : line.type === "circle" ? (
      <circle
        {...line}
        fill="none"
        stroke="black"
        key={k}
        style={{ pointerEvents, cursor: "pointer" }}
        className={className}
        onClick={() => onShapeClick(k)}
      />
    ) : (
      <rect
        {...line}
        fill="none"
        stroke="black"
        key={k}
        style={{ pointerEvents, cursor: "pointer" }}
        className={className}
        onClick={() => onShapeClick(k)}
      />
    )
  );
};

export default Shapes;
