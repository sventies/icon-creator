import { FC, useEffect, useState } from "react";
import HelperShapes from "./helperShapes";
import Buttons from "./buttons";
import Shapes from "./shapes";
import DraftShape from "./draftShape";
import { createShape } from "./createShape";
import useKeyPress from "./useKeyPress";

interface Props {}

const SIZE = 24;
const STROKE_WIDTH = 2;
const ARRAY = Array.from({ length: SIZE + 1 }, () => Array.from({ length: SIZE + 1 }, (_, j) => j));

const IconCreator: FC<Props> = () => {
  const [shapeMode, setShapeMode] = useState<ShapeMode>("line");
  const [draftPoint, setDraftPoint] = useState<Point | null>(null);
  const [temporalShapes, setTemporalShapes] = useState<(Line | Circle | Rect)[][]>([[]]);
  const [tempI, setTempI] = useState<number>(0);
  const [hovered, setHovered] = useState<[number, number] | null>(null);
  const [startXY, setStartXY] = useState([0, 0]);
  const [copyStatus, setCopyStatus] = useState<"idle" | "success" | "error">("idle");

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
    const shape = createShape(hovered, draftPoint, shapeMode);
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

  const draftShape = createShape(hovered, draftPoint, shapeMode);

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

  const onShapeClick = (shapeIndex: number) => {
    if (shapeMode === "eraser") {
      setTemporalShapes((prev) => {
        const newShapes = JSON.parse(JSON.stringify(shapes));
        newShapes.splice(shapeIndex, 1);
        return [...prev.slice(0, tempI + 1), newShapes];
      });
      setTempI((prev) => prev + 1);
    }
  };

  const esc = useKeyPress("Escape");
  useEffect(() => {
    if (esc) {
      setDraftPoint(null);
    }
  }, [esc]);

  const one = useKeyPress("1");
  useEffect(() => {
    if (one) {
      setShapeMode("line");
    }
  }, [one]);

  const two = useKeyPress("2");
  useEffect(() => {
    if (two) {
      setShapeMode("circle");
    }
  }, [two]);

  const three = useKeyPress("3");
  useEffect(() => {
    if (three) {
      setShapeMode("rect");
    }
  }, [three]);

  const four = useKeyPress("4");
  useEffect(() => {
    if (four) {
      setShapeMode("eraser");
    }
  }, [four]);

  const onCopy = async () => {
    const shapes = temporalShapes[tempI];
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width"${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}" fill="none" stroke="currentColor" stroke-width="${STROKE_WIDTH}" stroke-linecap="round" stroke-linejoin="round">
${shapes
  .map((shape) => {
    if (shape.type === "line") {
      return `  <line x1="${shape.x1}" y1="${shape.y1}" x2="${shape.x2}" y2="${shape.y2}" stroke="black" />`;
    } else if (shape.type === "circle") {
      return `  <circle cx="${shape.cx}" cy="${shape.cy}" r="${shape.r}" fill="none" stroke="black" />`;
    } else {
      return `  <rect x="${shape.x}" y="${shape.y}" width="${shape.width}" height="${shape.height}" />`;
    }
  })
  .join("\n")}
</svg>`;
    try {
      await navigator.clipboard.writeText(svg);
      setCopyStatus("success");
    } catch (error) {
      setCopyStatus("error");
    }
    setTimeout(() => {
      setCopyStatus("idle");
    }, 1000);
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
          onCopy={onCopy}
          copyStatus={copyStatus}
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
          <Shapes shapes={shapes} shapeMode={shapeMode} onShapeClick={onShapeClick} />
          <DraftShape draftShape={draftShape} />
        </svg>
        <div className="flex m-1 justify-center">
          <div
            style={{ height: 44, color: "black", background: "#f6f6f7", paddingLeft: 20 }}
            className="flex items-center justify-center rounded"
          >
            <span>Preview:</span>
            <div style={{ width: 44, height: 44 }} className="flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <Shapes shapes={shapes} shapeMode={shapeMode} onShapeClick={onShapeClick} />
                <DraftShape draftShape={draftShape} />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default IconCreator;
