import { FC, useState } from "react";
import HelperShapes from "./helperShapes";
import Button from "./button";

interface Props {}

interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface DraftLine {
  x1: number;
  y1: number;
}

const SIZE = 24;
const STROKE_WIDTH = 2;
const ARRAY = Array.from({ length: SIZE + 1 }, () => Array.from({ length: SIZE + 1 }, (_, j) => j));

const IconCreator: FC<Props> = () => {
  const [shapeMode, setShapeMode] = useState<"line" | "circle" | "rect">("line");
  const [draftPoint, setDraftPoint] = useState<DraftLine | null>(null);
  const [lines, setLines] = useState<Line[]>([]);
  const [hovered, setHovered] = useState<[number, number] | null>(null);
  const [startXY, setStartXY] = useState([0, 0]);

  const onClick = (i: number, j: number) => {
    if (!draftPoint) {
      setDraftPoint({ x1: i, y1: j });
      return;
    }
    setLines((prev) => [...prev, { ...draftPoint, x2: i, y2: j }]);
    setDraftPoint(null);
  };

  const hoveredLine = hovered
    ? draftPoint
      ? shapeMode === "line"
        ? { x1: draftPoint.x1, y1: draftPoint.y1, x2: hovered[0], y2: hovered[1] }
        : null
      : { x1: hovered[0], y1: hovered[1], x2: hovered[0], y2: hovered[1] }
    : null;

  return (
    <>
      <div className="flex flex-row">
        <Button onClick={() => setShapeMode("line")}>L</Button>
        <Button onClick={() => setShapeMode("circle")}>C</Button>
        <Button onClick={() => setShapeMode("rect")}>R</Button>
      </div>
      <div
        style={{
          transform: "translateX(-12px)",
          width: "min(100vw, 480px)",
          height: "min(100vw, 480px)",
          margin: "auto",
          border: "1px solid black",
          userSelect: "none",
        }}
        onTouchStart={(e) => e.preventDefault()}
      >
        <svg
          style={{
            width: "100%",
            height: "100%",
            touchAction: "none",
            backgroundColor: "white",
          }}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          stroke="currentColor"
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {ARRAY.map((row, i) =>
            row.map((_, j) => (
              <rect
                onMouseUp={() => onClick(i, j)}
                onTouchEnd={() => {
                  if (hovered) {
                    onClick(hovered[0], hovered[1]);
                  }
                }}
                key={i + "-" + j}
                x={i - 1 / 2}
                y={j - 1 / 2}
                width={1}
                height={1}
                fill="white"
                stroke="none"
                strokeWidth="0.03"
                onMouseEnter={() => setHovered([i, j])}
                onTouchStart={(e) => {
                  const startXY = e.targetTouches[0];
                  setStartXY([startXY.clientX, startXY.clientY]);
                  setHovered([i, j]);
                }}
                onTouchMove={(e) => {
                  e.preventDefault();
                  const node = e.target as HTMLElement;
                  const parent = node.parentElement as HTMLElement;
                  const parentRect = parent.getBoundingClientRect();
                  const location = e.targetTouches[0];
                  const x = location.clientX - startXY[0];
                  const y = location.clientY - startXY[1];
                  const _i = Math.round((x / parentRect.width) * SIZE);
                  const _j = Math.round((y / parentRect.height) * SIZE);
                  setHovered([_i + i, _j + j]);
                }}
                onMouseLeave={() => setHovered(null)}
                style={{
                  userSelect: "none",
                  touchAction: "none",
                }}
                onClick={() => null}
              />
            ))
          )}
          <HelperShapes size={SIZE} array={ARRAY} strokeWidth={STROKE_WIDTH} />
          {lines.map((line, k) => (
            <line {...line} stroke="black" key={k} style={{ pointerEvents: "none" }} />
          ))}
          {draftPoint && (
            <line
              {...draftPoint}
              x2={draftPoint.x1}
              y2={draftPoint.y1}
              stroke="black"
              style={{ pointerEvents: "none" }}
            />
          )}
          {hoveredLine && <line {...hoveredLine} stroke="#00000044" style={{ pointerEvents: "none" }} />}
        </svg>
      </div>
    </>
  );
};

export default IconCreator;
