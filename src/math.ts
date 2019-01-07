import Vec2 from './Vec2';

export const clamp = (v: number, min: number, max: number) =>
  v < min ? min : v > max ? max : v;

// Converts a center-origin based position into a corner?-origin based position (browser)
export const normalizePosition = (pos: Vec2, center: Vec2): Vec2 =>
  center.add(new Vec2(pos.x, -pos.y));

export const isBoxBounded = (
  normPos: Vec2,
  box: Vec2,
  bounds: Vec2,
): boolean => {
  const xMin = normPos.x - box.x / 2;
  const xMax = normPos.x + box.x / 2;
  const yMin = normPos.y - box.y / 2;
  const yMax = normPos.y + box.y / 2;
  // TODO
  return true;
};
