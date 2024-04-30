import { FC, ReactNode } from "react";
import {
  Minus,
  Circle,
  Square,
  // MousePointer,
  Undo,
  Redo,
  Eraser,
  Clipboard,
} from "lucide-react";

interface Props {
  setShapeMode: (mode: ShapeMode) => void;
  shapeMode: ShapeMode;
  onUndo: () => void;
  onRedo: () => void;
  isFirst: boolean;
  isLast: boolean;
  onCopy: () => void;
}

const BUTTON_SIZE = 44;

const Buttons: FC<Props> = ({ setShapeMode, shapeMode, onUndo, onRedo, isFirst, isLast, onCopy }) => {
  return (
    <div className="flex flex-row m-auto rounded" style={{ overflow: "hidden" }}>
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

      {/* <Button isActive={shapeMode === "pointer"} onClick={() => setShapeMode("pointer")}>
        <MousePointer size={16} />
      </Button> */}
      <Button isActive={shapeMode === "eraser"} onClick={() => setShapeMode("eraser")}>
        <Eraser size={16} />
      </Button>

      <Divider />

      <Button onClick={onUndo} isDisabled={isFirst}>
        <Undo size={16} />
      </Button>
      <Button onClick={onRedo} isDisabled={isLast}>
        <Redo size={16} />
      </Button>

      <Divider />

      <Button onClick={onCopy}>
        <Clipboard size={16} />
      </Button>
    </div>
  );
};

interface ButtonProps {
  onClick: () => void;
  children: ReactNode;
  isActive?: boolean;
  isDisabled?: boolean;
}

const Button: FC<ButtonProps> = ({ children, onClick, isActive = false, isDisabled = false }) => {
  const className = getClassName(isActive, isDisabled);
  return (
    <button
      className={`bg-white group p-1 ${isDisabled ? "text-gray-400 cursor-default" : "text-black cursor-pointer"}`}
      style={{ width: BUTTON_SIZE, height: BUTTON_SIZE }}
      onClick={onClick}
    >
      <span className={className}>{children}</span>
    </button>
  );
};

const Divider = () => (
  <div className={`h-[${BUTTON_SIZE}px] w-[1px] bg-white flex items-center justify-center`}>
    <div className="bg-gray-400 w-full h-[28px]" />
  </div>
);

const getClassName = (isActive: boolean, isDisabled: boolean) => {
  const start = "border-gray-500 w-full h-full flex items-center justify-center rounded";
  if (isActive) {
    return start + " bg-gray-800 group-hover:bg-gray-700 text-white";
  } else if (isDisabled) {
    return start;
  } else {
    return start + " group-hover:border";
  }
};

export default Buttons;
