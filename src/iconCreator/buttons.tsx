import { FC, ReactNode } from "react";
import { Minus, Circle, Square } from "lucide-react";

interface Props {
  setShapeMode: (mode: "line" | "circle" | "rect") => void;
  shapeMode: "line" | "circle" | "rect";
}

const BUTTON_SIZE = 56;

const Buttons: FC<Props> = ({ setShapeMode, shapeMode }) => {
  return (
    <div className="flex flex-row">
      <Button isActive={shapeMode === "line"} onClick={() => setShapeMode("line")}>
        <Minus />
      </Button>
      <Button isActive={shapeMode === "circle"} onClick={() => setShapeMode("circle")}>
        <Circle />
      </Button>
      <Button isActive={shapeMode === "rect"} onClick={() => setShapeMode("rect")}>
        <Square />
      </Button>
    </div>
  );
};

interface ButtonProps {
  onClick: () => void;
  children: ReactNode;
  isActive: boolean;
}

const Button: FC<ButtonProps> = ({ children, onClick, isActive }) => {
  const className = getClassName(isActive);
  return (
    <button
      className="bg-white group p-2 text-black"
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

const getClassName = (isActive: boolean) => {
  const start = "group-hover:border border-gray-500 w-full h-full flex items-center justify-center rounded";
  if (isActive) {
    return start + " bg-gray-800 group-hover:bg-gray-700 text-white";
  } else {
    return start;
  }
};

export default Buttons;
