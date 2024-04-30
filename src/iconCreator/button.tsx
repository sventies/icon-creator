import { FC, ReactNode } from "react";

interface Props {
  children: ReactNode;
  onClick: () => void;
}

const BUTTON_SIZE = 56;

const Button: FC<Props> = ({ children, onClick }) => {
  return (
    <button style={{ width: BUTTON_SIZE, height: BUTTON_SIZE }} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
