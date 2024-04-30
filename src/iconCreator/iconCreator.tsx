import { FC, useEffect, useState } from "react";
import HelperShapes from "./helperShapes";
import Buttons from "./buttons";

interface Props {}

interface Line {
  type: "line";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface Circle {
  type: "circle";
  cx: number;
  cy: number;
  r: number;
}

interface Point {
  x1: number;
  y1: number;
}

interface Rect {
  type: "rect";
  x: number;
  y: number;
  width: number;
  height: number;
}

const SIZE = 24;
const STROKE_WIDTH = 2;
const ARRAY = Array.from({ length: SIZE + 1 }, () => Array.from({ length: SIZE + 1 }, (_, j) => j));

const getDraft: (
  hovered: [number, number] | null,
  draftPoint: Point | null,
  shapeMode: "line" | "circle" | "rect" | "pointer"
) => Line | Circle | Rect | null = (hovered, draftPoint, shapeMode) => {
  if (!hovered) return null;
  if (!draftPoint) {
    switch (shapeMode) {
      case "circle":
      case "line":
      case "rect":
        return { type: "line" as const, x1: hovered[0], y1: hovered[1], x2: hovered[0], y2: hovered[1] };
      default:
        return null;
    }
  }

  switch (shapeMode) {
    case "line":
      return { type: "line" as const, x1: draftPoint.x1, y1: draftPoint.y1, x2: hovered[0], y2: hovered[1] };
    case "circle":
      return {
        type: "circle" as const,
        cx: draftPoint.x1,
        cy: draftPoint.y1,
        r: Math.hypot(draftPoint.x1 - hovered[0], draftPoint.y1 - hovered[1]),
      };
    case "rect": {
      const maxX = Math.max(hovered[0], draftPoint.x1);
      const maxY = Math.max(hovered[1], draftPoint.y1);
      const minX = Math.min(hovered[0], draftPoint.x1);
      const minY = Math.min(hovered[1], draftPoint.y1);
      return {
        type: "rect" as const,
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY,
      };
    }
  }
  return null;
};

const IconCreator: FC<Props> = () => {
  const [shapeMode, setShapeMode] = useState<"line" | "circle" | "rect" | "pointer">("line");
  const [draftPoint, setDraftPoint] = useState<Point | null>(null);
  const [temporalShapes, setTemporalShapes] = useState<(Line | Circle | Rect)[][]>([[]]);
  const [tempI, setTempI] = useState<number>(0);
  const [hovered, setHovered] = useState<[number, number] | null>(null);
  const [startXY, setStartXY] = useState([0, 0]);

  const shapes = temporalShapes[tempI] || [];

  useEffect(() => {
    setDraftPoint(null);
    setHovered(null);
  }, [shapeMode]);

  const finishShape = (i: number, j: number) => {
    if (!draftPoint) {
      setDraftPoint({ x1: i, y1: j });
      return;
    }
    const shape = getDraft(hovered, draftPoint, shapeMode);
    if (shape) {
      setTemporalShapes((prev) => {
        const newShapes = JSON.parse(JSON.stringify(shapes));
        newShapes.push(shape);
        return [...prev.slice(0, tempI + 1), newShapes];
      });
      setTempI((prev) => prev + 1);
    }
    setDraftPoint(null);
  };

  const draftShape = getDraft(hovered, draftPoint, shapeMode);

  const pointerEvents = shapeMode === "pointer" ? "all" : "none";

  const onUndo = () =>
    setTempI((prev) => {
      if (prev === 0) return prev;
      return prev - 1;
    });

  const onRedo = () => {
    setTempI((prev) => {
      if (prev === temporalShapes.length - 1) return prev;
      return prev + 1;
    });
  };

  return (
    <>
      <div className="p-2 flex items-center">
        <Buttons
          setShapeMode={setShapeMode}
          shapeMode={shapeMode}
          onUndo={onUndo}
          onRedo={onRedo}
          isFirst={tempI === 0}
          isLast={tempI === temporalShapes.length - 1}
        />
      </div>
      <div
        style={{
          width: "min(100vw, 480px)",
          height: "min(100vw, 480px)",
          margin: "auto",
          border: "1px solid black",
          userSelect: "none",
        }}
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
                onMouseUp={() => finishShape(i, j)}
                onTouchEnd={() => {
                  if (hovered) {
                    finishShape(hovered[0], hovered[1]);
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
          {shapes.map((line, k) =>
            line.type === "line" ? (
              <line {...line} key={k} style={{ pointerEvents }} className="stroke-black hover:stroke-blue-400" />
            ) : line.type === "circle" ? (
              <circle {...line} fill="none" stroke="black" key={k} style={{ pointerEvents }} />
            ) : (
              <rect {...line} fill="none" stroke="black" key={k} style={{ pointerEvents }} />
            )
          )}
          {draftShape?.type === "line" && <line {...draftShape} stroke="#00000044" style={{ pointerEvents: "none" }} />}
          {draftShape?.type === "circle" && (
            <circle {...draftShape} fill="none" stroke="#00000044" style={{ pointerEvents: "none" }} />
          )}
          {draftShape?.type === "rect" && (
            <rect {...draftShape} fill="none" stroke="#00000044" style={{ pointerEvents: "none" }} />
          )}
        </svg>
      </div>
    </>
  );
};

export default IconCreator;
