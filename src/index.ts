import helloInspector from './helloInspector';
import Art, {ArtLayer, ArtOperation} from './Art';
import Vec2 from './Vec2';
import * as math from './math';

helloInspector();

// const flower: TimeArtLayer = (t: number): TimeArtEntity => ({
//   color: 'purple',
//   shape: Shapes.CIRCLE,
//   size: 1,
//   pos: new Vec2(
//     (0.5 + Math.cos(3 * t)) * Math.cos(t),
//     (0.5 + Math.sin(3 * t)) * Math.sin(t),
//   ),
// });

// const butterFly: TimeArtLayer = (t: number): TimeArtEntity => {
//   const m =
//     Math.pow(Math.E, Math.cos(t)) -
//     2 * Math.cos(4 * t) -
//     Math.pow(Math.sin(t / 12), 5);
//   return {
//     color: 'purple',
//     shape: Shapes.CIRCLE,
//     size: 1,
//     pos: new Vec2(Math.sin(t) * m, Math.cos(t) * m).mul(10),
//   };
// };

const createDreamCatcherLayer = (
  radius: number,
  color: string,
  size: number,
  threshold: number | undefined = undefined,
  dropoff: number | undefined = undefined,
  interval: number | undefined = undefined,
): ArtLayer => {
  return {
    color,
    size,
    interval,
    threshold,
    dropoff,
    next: (t: number): ArtOperation => {
      return {
        type: 'path',
        position: new Vec2(Math.cos(t), Math.sin(t)).mul(radius),
      };
    },
  };
};

const spiral: ArtLayer = {
  color: 'rgba(0, 125, 255, 0.1)',
  size: 10,
  delta: 2,
  next: (t: number): ArtOperation => {
    const position = new Vec2(Math.sin(t), Math.cos(t)).mul(t);

    return {
      type: 'square',
      position,
      color: `rgba(0, 125, 255, ${math.clamp(0.05 * (t / 200), 0.1, 1)})`,
    };
  },
};

const butterFly: ArtLayer = {
  color: 'rgba(125, 0, 255, 0.5)',
  size: 1,
  delta: 20,
  interval: 10,
  dropoff: 90000,
  next: (t: number): ArtOperation => {
    const m =
      Math.pow(Math.E, Math.cos(t)) -
      2 * Math.cos(4 * t) -
      Math.pow(Math.sin(t / 12), 5);
    const position = new Vec2(
      Math.cos(Math.PI / 2 + t) * m,
      Math.sin(Math.PI / 2 + t) * m,
    ).mul(200);
    const alphaIntensity = new Vec2(0, 0).sub(position).mag() / 4000;
    const redIntensity = new Vec2(200, 200).sub(position).mag() / 400;
    const blueIntensity = new Vec2(-200, -200).sub(position).mag() / 400;
    return {
      type: 'circle',
      color: `rgba(${math.clamp(255 * redIntensity, 0, 255)}, 0, ${math.clamp(
        255 * blueIntensity,
        0,
        255,
      )}, ${math.clamp(alphaIntensity, 0, 1)})`,
      position,
    };
  },
};

const wave: ArtLayer = {
  color: 'green',
  size: 1,
  next: (t: number): ArtOperation => {
    const position = new Vec2(30 * Math.cos(t), 30 * Math.sin(t)).subScalar(t);
    const alphaIntensity = new Vec2(0, 0).sub(position).mag() / 1000;
    return {
      type: 'circle',
      position,
      color: `rgba(0, 255, 120, ${math.clamp(alphaIntensity, 0, 1)})`,
    };
  },
};

const dreamCatcher: ArtLayer = {
  color: `rgba(0, 120, 200, 0.1)`,
  size: 2,
  interval: 100,
  delta: 5,
  dropoff: 5000,
  next: (t: number): ArtOperation => {
    const position = new Vec2(Math.cos(t), Math.sin(t)).mul(128 + 1.5 * t);
    const alphaIntensity = 1 / (new Vec2(0, 0).sub(position).mag() / 100);
    return {
      type: 'path',
      position,
      color: `rgba(0, 120, 200, ${math.clamp(1 * alphaIntensity, 0, 1)})`,
    };
  },
};

const init = () => {
  const artContainer = document.querySelector('#art');
  const art = new Art(artContainer, [butterFly, wave, dreamCatcher]);

  art.initialize();
  // art.addTime(100);
  (window as any).art = art;
};

window.addEventListener('load', init);
