import { FC, useState } from "react";
import HelperShapes from "./helperShapes";

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
  const [draftLine, setDraftLine] = useState<DraftLine | null>(null);
  const [lines, setLines] = useState<Line[]>([]);
  const [hovered, setHovered] = useState<[number, number] | null>(null);
  const [location, setLocation] = useState({ x: 0, y: 0 });
  const [wh, setWh] = useState({ width: 0, height: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [xy, setXy] = useState({ x: 0, y: 0 });
  const [startXY, setStartXY] = useState([0, 0]);

  const onClick = (i: number, j: number) => {
    if (!draftLine) {
      setDraftLine({ x1: i, y1: j });
      return;
    }
    setLines((prev) => [...prev, { ...draftLine, x2: i, y2: j }]);
    setDraftLine(null);
  };

  const hoveredCoords = hovered
    ? draftLine
      ? { x1: draftLine.x1, y1: draftLine.y1, x2: hovered[0], y2: hovered[1] }
      : { x1: hovered[0], y1: hovered[1], x2: hovered[0], y2: hovered[1] }
    : null;

  return (
    <>
      <div>{location.x + " " + location.y}</div>
      <div style={{ color: "blue" }}>{wh.width + " " + wh.height}</div>
      <div style={{ color: "green" }}>{offset.x + " " + offset.y}</div>
      <div style={{ color: "pink" }}>{xy.x + " " + xy.y}</div>
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
                  // onClick(i, j);
                }}
                //   onTouchMove={(e) => {
                //     e.preventDefault();
                //     setHovered([i, j]);
                //   }}
                onTouchMove={(e) => {
                  e.preventDefault();
                  const node = e.target as HTMLElement;
                  const parent = node.parentElement as HTMLElement;
                  const parentRect = parent.getBoundingClientRect();
                  const rect = node.getBoundingClientRect();
                  const { width, height } = rect;
                  setWh({ width, height });
                  if (!rect) return;
                  console.log("rect");
                  const location = e.targetTouches[0];
                  const offsetLeft = node.offsetLeft;
                  const offsetTop = node.offsetTop;
                  setOffset({ x: offsetLeft, y: offsetTop });
                  // const x = location.clientX;
                  //   const y = location.clientY;
                  const xx = location.clientX - startXY[0];
                  const yy = location.clientY - startXY[1];
                  setXy({ x: xx, y: yy });
                  const _i = Math.round((xx / parentRect.width) * SIZE);
                  const _j = Math.round((yy / parentRect.height) * SIZE);
                  setHovered([_i + i, _j + j]);
                  const relativeX = xx - rect.left;
                  const relativeY = yy - rect.top;
                  const ii = Math.round((relativeX / width) * SIZE);
                  const jj = Math.round((relativeY / height) * SIZE);
                  // // snap to grid
                  // const i = Math.round(((x - rect.left) / width) * SIZE);
                  // const j = Math.round(((y - rect.top) / height) * SIZE);
                  setLocation({ x: i + ii, y: j + jj });
                }}
                //   onTouchStart={(e) => {
                //     e.preventDefault();
                //     setHovered([i, j]);
                //   }}
                //   onTouchEnd={() => onClick(i, j)}
                //   onPointerEnter={() => setHovered([i, j])}
                //   onTouchMove={(e) => {
                //     e.preventDefault();
                //     //     //   onClick(i, j);
                //     setHovered([i, j]);
                //     //   }}
                //     //   onTouchMove={(e) => {
                //     //     // e.preventDefault();
                //   }}
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
          {draftLine && (
            <line {...draftLine} x2={draftLine.x1} y2={draftLine.y1} stroke="black" style={{ pointerEvents: "none" }} />
          )}
          {hoveredCoords && <line {...hoveredCoords} stroke="#00000044" style={{ pointerEvents: "none" }} />}
        </svg>
      </div>
    </>
  );
};

export default IconCreator;
