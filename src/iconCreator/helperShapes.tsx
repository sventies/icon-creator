import { FC } from "react";

const MANY_HELPERS = false;
interface Props {
  size: number;
  array: number[][];
  strokeWidth: number;
}

const HelperShapes: FC<Props> = ({ size, array, strokeWidth }) => {
  const rx = strokeWidth / 2;
  return (
    <g style={{ pointerEvents: "none" }}>
      <Grid array={array} size={size} />
      {MANY_HELPERS && (
        <>
          <RectBig rx={rx} />
          <RectHigh rx={rx} />
          <RectWide rx={rx} />
        </>
      )}
      <RectMid rx={rx} />
      <Circle r={10} />
    </g>
  );
};

const RectBig: FC<{ rx: number }> = ({ rx }) => {
  return <rect x={2} y={2} width={20} height={20} fill="none" strokeWidth="0.12" stroke="orange" rx={rx} />;
};

const RectHigh: FC<{ rx: number }> = ({ rx }) => {
  return <rect x={4} y={2} width={16} height={20} fill="none" strokeWidth="0.12" stroke="orange" rx={rx} />;
};

const RectWide: FC<{ rx: number }> = ({ rx }) => {
  return <rect x={2} y={4} width={20} height={16} fill="none" strokeWidth="0.12" stroke="orange" rx={rx} />;
};

const RectMid: FC<{ rx: number }> = ({ rx }) => {
  return <rect x={3} y={3} width={18} height={18} fill="none" strokeWidth="0.12" stroke="orange" rx={rx} />;
};

const Circle: FC<{ r: number }> = ({ r }) => {
  return <circle cx={12} cy={12} r={r} fill="none" strokeWidth="0.12" stroke="orange" />;
};

const Grid: FC<{ array: number[][]; size: number }> = ({ array, size }) => {
  return (
    <>
      {array.map((_, i) =>
        i ? (
          <line
            key={i}
            x1={i}
            x2={i}
            y1={0}
            y2={size}
            stroke={i % 2 ? "lightgray" : "gray"}
            strokeWidth={i % 2 ? "0.03" : "0.06"}
            style={{ pointerEvents: "none" }}
          />
        ) : null
      )}
      {array[0].map((_, j) =>
        j ? (
          <line
            key={j}
            y1={j}
            y2={j}
            x1={0}
            x2={size}
            stroke={j % 2 ? "lightgray" : "gray"}
            strokeWidth={j % 2 ? "0.03" : "0.06"}
            style={{ pointerEvents: "none" }}
          />
        ) : null
      )}
    </>
  );
};

export default HelperShapes;
