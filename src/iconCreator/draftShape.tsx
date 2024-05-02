import { FC } from "react";

interface Props {
  draftShape: Shape | null;
}

const DraftShape: FC<Props> = ({ draftShape }) => {
  if (!draftShape) return null;
  switch (draftShape.type) {
    case "line":
      return <line {...draftShape} stroke="#00000044" style={{ pointerEvents: "none" }} />;
    case "circle":
      return <circle {...draftShape} fill="none" stroke="#00000044" style={{ pointerEvents: "none" }} />;
    case "rect":
      return <rect {...draftShape} fill="none" stroke="#00000044" style={{ pointerEvents: "none" }} />;
  }
};

export default DraftShape;
