export const createShape: (
  hovered: [number, number] | null,
  draftPoint: Point | null,
  shapeMode: ShapeMode
) => Shape | null = (hovered, draftPoint, shapeMode) => {
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
    case "circle": {
      const r = Math.round(Math.hypot(draftPoint.x1 - hovered[0], draftPoint.y1 - hovered[1]));
      if (r === 0) return { type: "line" as const, x1: hovered[0], y1: hovered[1], x2: hovered[0], y2: hovered[1] };
      return {
        type: "circle" as const,
        cx: draftPoint.x1,
        cy: draftPoint.y1,
        r,
      };
    }

    case "rect": {
      const maxX = Math.max(hovered[0], draftPoint.x1);
      const maxY = Math.max(hovered[1], draftPoint.y1);
      const minX = Math.min(hovered[0], draftPoint.x1);
      const minY = Math.min(hovered[1], draftPoint.y1);
      const width = maxX - minX;
      const height = maxY - minY;
      if (width === 0) {
        return { type: "line" as const, x1: minX, y1: minY, x2: minX, y2: maxY };
      }
      if (height === 0) {
        return { type: "line" as const, x1: minX, y1: minY, x2: maxX, y2: minY };
      }
      return {
        type: "rect" as const,
        x: minX,
        y: minY,
        width,
        height,
      };
    }
  }
  return null;
};
