import helloInspector from './helloInspector';
import Art, {ArtLayer, ArtOperation, ArtOperationType} from './Art';
import Vec2 from './Vec2';
import * as math from './math';
import GlitchyText from './GlitchyText';

helloInspector();

type ColorFn = (alpha: number) => string;
type Color = string | ColorFn;

const createArtLayer = (
  color: Color,
  type: ArtOperationType,
  layer: Partial<ArtLayer> = {},
  {
    p = 12,
    m = 200,
    e = 5,
    a = 4000,
    n = 4,
  }: Partial<{p: number; m: number; e: number; a: number; n: number}> = {},
): ArtLayer => {
  return {
    color: typeof color === 'string' ? color : color(1),
    size: 1,
    delta: 0,
    interval: 50,
    dropoff: 90,
    next: (t: number): ArtOperation => {
      const multiplier =
        Math.pow(Math.E, Math.cos(t)) -
        2 * Math.cos(n * t) -
        Math.pow(Math.sin(t / p), e);
      const position = new Vec2(
        Math.cos(Math.PI / 2 + t) * multiplier,
        Math.sin(Math.PI / 2 + t) * multiplier,
      ).mul(m);
      const alphaIntensity = new Vec2(0, 0).sub(position).mag() / a;
      return {
        type,
        color: typeof color === 'string' ? color : color(alphaIntensity),
        position,
      };
    },
    ...layer,
  };
};

const createGraph = (
  color: Color,
  type: ArtOperationType,
  size: number,
): ArtLayer =>
  createArtLayer(
    color,
    type,
    {
      size,
      delta: 1,
      interval: 20,
      dropoff: 100,
    },
    {
      p: 100,
      m: 100,
      n: 200,
      e: 1,
    },
  );

const graphEdges = createGraph((a) => `rgba(255, 32, 110, ${a})`, 'path', 2);

const graphqNodes = createGraph('#072ac8', 'circle', 2);

const createGraph2 = (
  color: Color,
  type: ArtOperationType,
  size: number,
): ArtLayer =>
  createArtLayer(
    color,
    type,
    {
      size,
      delta: 20,
      interval: 1,
      dropoff: 100,
      threshold: 800,
    },
    {
      p: 32,
      m: 400,
      n: 2,
      e: 1,
    },
  );

const graph2Nodes = createGraph2('rgb(233, 255, 112)', 'circle', 0.5);

const contourNodes = createArtLayer(
  'rgba(255, 32, 110, 0.5)',
  'circle',
  {
    size: 0.5,
    delta: 100,
    interval: 0.1,
    threshold: 40000,
    dropoff: 20000,
  },
  {
    p: 32,
    m: 600,
    n: 1,
  },
);

const init = () => {
  const artContainer = document.querySelector('#art');
  const me = document.querySelector('#me');
  let layers: ArtLayer[];
  if (window.matchMedia('(min-width: 600px)').matches) {
    layers = [graphEdges, graphqNodes, graph2Nodes, contourNodes];
  } else {
    layers = [graph2Nodes, {...contourNodes, threshold: 0}];
  }
  const art = new Art(artContainer, layers, me);

  art.initialize();
  GlitchyText.initializeAll();
};

window.addEventListener('load', init);
