import { FC, ReactNode } from "react";

interface Props {
  setShapeMode: (mode: "line" | "circle" | "rect") => void;
}

const BUTTON_SIZE = 56;

const Buttons: FC<Props> = ({ setShapeMode }) => {
  return (
    <div className="flex flex-row">
      <Button onClick={() => setShapeMode("line")}>L</Button>
      <Button onClick={() => setShapeMode("circle")}>C</Button>
      <Button onClick={() => setShapeMode("rect")}>R</Button>
    </div>
  );
};

interface ButtonProps {
  onClick: () => void;
  children: ReactNode;
}

const Button: FC<ButtonProps> = ({ children, onClick }) => {
  return (
    <button style={{ width: BUTTON_SIZE, height: BUTTON_SIZE }} onClick={onClick}>
      <span>{children}</span>
    </button>
  );
};

export default Buttons;
