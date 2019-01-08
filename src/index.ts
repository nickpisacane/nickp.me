import helloInspector from './helloInspector';
import Art, {ArtLayer, ArtOperation, ArtOperationType} from './Art';
import Vec2 from './Vec2';
import * as math from './math';
import GlitchyText from './GlitchyText';

helloInspector();

const butterFly: ArtLayer = {
  color: 'rgba(125, 0, 255, 0.5)',
  size: 3,
  delta: 20,
  interval: 10,
  threshold: 10000,
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
      type: t % 2 ? 'circle' : 'square',
      color: `rgba(${math.clamp(255 * redIntensity, 0, 255)}, 0, ${math.clamp(
        255 * blueIntensity,
        0,
        255,
      )}, ${math.clamp(alphaIntensity, 0, 0.5)})`,
      position,
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
    const position = new Vec2(Math.cos(t), Math.sin(t)).mul(1.5 * t);
    const alphaIntensity = 1 / (new Vec2(0, 0).sub(position).mag() / 200);
    return {
      type: 'path',
      position,
      color: `rgba(0, 120, 200, ${math.clamp(0.8 * alphaIntensity, 0, 1)})`,
    };
  },
};

const SPIRAL_BASE = 0;

interface SimpleSpiralOptions {
  color: string;
  factor: number;
  type: ArtOperationType;
  size?: number;
  delta?: number;
  dropoff?: number;
  threshold?: number;
  angleOffset?: number;
  inverted?: boolean;
}

const createSpiral = ({
  color,
  factor,
  type,
  size = 4,
  delta = 1,
  dropoff = 50,
  threshold = 0,
  angleOffset = 0,
  inverted = false,
}: SimpleSpiralOptions): ArtLayer => {
  const x = inverted ? Math.sin : Math.cos;
  const y = inverted ? Math.cos : Math.sin;

  return {
    color,
    size,
    delta,
    threshold,
    dropoff,
    next: (t: number): ArtOperation => ({
      type,
      position: new Vec2(
        x(t / factor + angleOffset),
        y(t / factor + angleOffset),
      ).mul(SPIRAL_BASE + t * factor * 10),
    }),
  };
};

const spirals: ArtLayer[] = [
  createSpiral({
    color: 'rgba(255, 120, 150, 0.5)',
    type: 'circle',
    factor: 16,
    angleOffset: Math.PI / 2,
  }),
  createSpiral({
    color: 'rgba(0, 0, 255, 0.5)',
    type: 'path',
    factor: 16,
    threshold: 50,
    angleOffset: Math.PI / 2,
  }),
  createSpiral({
    color: 'rgba(255, 120, 150, 0.5)',
    type: 'circle',
    factor: 16,
    inverted: true,
    angleOffset: 0,
  }),
  createSpiral({
    color: 'rgba(0, 0, 255, 0.5)',
    type: 'path',
    factor: 16,
    threshold: 50,
    inverted: true,
    angleOffset: 0,
  }),
  createSpiral({
    color: 'red',
    type: 'circle',
    factor: 8,
    threshold: 100,
    angleOffset: Math.PI,
  }),
  createSpiral({
    color: 'blue',
    type: 'path',
    factor: 8,
    threshold: 150,
    angleOffset: Math.PI,
  }),
  createSpiral({
    color: 'red',
    type: 'circle',
    factor: 8,
    inverted: true,
    threshold: 100,
    angleOffset: Math.PI / 2,
  }),
  createSpiral({
    color: 'blue',
    type: 'path',
    factor: 8,
    threshold: 150,
    inverted: true,
    angleOffset: Math.PI / 2,
  }),
];

const init = () => {
  const artContainer = document.querySelector('#art');
  const art = new Art(artContainer, [butterFly, dreamCatcher, ...spirals]);

  art.initialize();
  (window as any).feather.replace();
  GlitchyText.initializeAll();
};

window.addEventListener('load', init);
