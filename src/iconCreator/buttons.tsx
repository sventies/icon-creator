import { FC, ReactNode } from "react";
import { Minus, Circle, Square, MousePointer, Undo, Redo } from "lucide-react";

interface Props {
  setShapeMode: (mode: "line" | "circle" | "rect" | "pointer") => void;
  shapeMode: "line" | "circle" | "rect" | "pointer";
}

const BUTTON_SIZE = 44;

const Buttons: FC<Props> = ({ setShapeMode, shapeMode }) => {
  return (
    <div className="flex flex-row m-auto rounded" style={{ overflow: "hidden" }}>
      <Button isActive={shapeMode === "pointer"} onClick={() => setShapeMode("pointer")}>
        <MousePointer size={16} />
      </Button>
      <Button isActive={shapeMode === "line"} onClick={() => setShapeMode("line")}>
        <Minus size={16} />
      </Button>
      <Button isActive={shapeMode === "circle"} onClick={() => setShapeMode("circle")}>
        <Circle size={16} />
      </Button>
      <Button isActive={shapeMode === "rect"} onClick={() => setShapeMode("rect")}>
        <Square size={16} />
      </Button>
      <Divider />
      <Button onClick={() => setShapeMode("rect")}>
        <Undo size={16} />
      </Button>
      <Button onClick={() => setShapeMode("rect")}>
        <Redo size={16} />
      </Button>
    </div>
  );
};

interface ButtonProps {
  onClick: () => void;
  children: ReactNode;
  isActive?: boolean;
}

const Button: FC<ButtonProps> = ({ children, onClick, isActive = false }) => {
  const className = getClassName(isActive);
  return (
    <button
      className="bg-white group p-1 text-black"
      style={{ width: BUTTON_SIZE, height: BUTTON_SIZE }}
      onClick={onClick}
    >
      <span
        className={className}
        // style={{ display: "block" }}
      >
        {children}
      </span>
    </button>
  );
};

const Divider = () => (
  <div className={`h-[${BUTTON_SIZE}px] w-[1px] bg-white flex items-center justify-center`}>
    <div className="bg-gray-400 w-full h-[28px]" />
  </div>
);

const getClassName = (isActive: boolean) => {
  const start = "group-hover:border border-gray-500 w-full h-full flex items-center justify-center rounded";
  if (isActive) {
    return start + " bg-gray-800 group-hover:bg-gray-700 text-white";
  } else {
    return start;
  }
};

export default Buttons;
