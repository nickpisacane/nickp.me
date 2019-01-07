import Vec2 from './Vec2';
import {ArtEntity, CircleEntity, SquareEntity, PathEntity} from './ArtEntity';
import {debounce, throttle} from './utils';

export type ArtOperationType = 'path' | 'circle' | 'square';

export interface ArtOperation {
  type: ArtOperationType;
  color?: string;
  position: Vec2;
}

export interface ArtLayer {
  interval?: number;
  delta?: number;
  threshold?: number;
  dropoff?: number;
  size: number;
  color: string;
  next: (time: number) => ArtOperation | null;
}

interface ArtLayerContext {
  absoluteTime: number;
  currentTime: number;
  time: number;
  layer: ArtLayer;
  active: boolean;
}

const createLayerContext = (layer: ArtLayer): ArtLayerContext => ({
  active: typeof layer.threshold === 'number' ? layer.threshold === 0 : true,
  absoluteTime: 0,
  currentTime: 0,
  time: 0,
  layer,
});

export default class Art {
  private canvas: HTMLCanvasElement;
  private targetEl: Element;
  private context: CanvasRenderingContext2D;

  private segmentTime: number = 10;
  private center: Vec2;
  private bounds: Vec2;
  private drawing: boolean = false;
  private entities: ArtEntity[] = [];
  private entityPos: number = 0;
  private updating: boolean = false;
  private drawTimer: number | null = null;
  private updateTimer: number | null = null;

  // max entities per layer per draw
  private maxEntityPerDraw: number = 100;
  private maxEntityPerUpdate: number = 1000;

  private reactionLayers: ArtLayerContext[];
  private intervalLayers: ArtLayerContext[];
  private intervalHandlers: number[];

  private handleResize = debounce(() => {
    console.log('resize: ');
    this.context.clearRect(0, 0, this.bounds.x, this.bounds.y);
    this.calculateSize();

    this.entityPos = 0;
    this.safeUpdate();
  }, 300);

  private handleMouseMove = () => {
    this.addTime(1);
  };

  private handleClick = () => {
    this.addTime(2);
  };

  private draw = () => this.drawImpl();

  private update = () => this.updateImpl();

  constructor(targetEl: Element, layers: ArtLayer[] = []) {
    this.targetEl = targetEl;

    this.reactionLayers = layers
      .filter(layer => typeof layer.interval !== 'number')
      .map(createLayerContext);
    this.intervalLayers = layers
      .filter(layer => typeof layer.interval === 'number')
      .map(createLayerContext);
  }

  private calculateSize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.bounds = new Vec2(width, height);
    this.center = this.bounds.mul(0.5);
    this.canvas.width = width;
    this.canvas.height = height;
  }

  public initialize() {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.targetEl.appendChild(this.canvas);
    this.calculateSize();
    this.intervalHandlers = this.intervalLayers.map(
      (ctx: ArtLayerContext, index: number) =>
        setInterval(
          () => {
            this.renderIntervalLayer(ctx);
          },
          ctx.layer.interval as number,
        ),
    );
    window.addEventListener('resize', this.handleResize, false);
    window.addEventListener('mousemove', this.handleMouseMove, false);
    window.addEventListener('click', this.handleClick, false);
  }

  public destroy() {
    clearTimeout(this.drawTimer);
    clearTimeout(this.updateTimer);
    this.intervalHandlers.forEach(timer => clearInterval(timer));
    this.targetEl.removeChild(this.canvas);
    window.removeEventListener('resize', this.handleResize, false);
    window.removeEventListener('mousemove', this.handleMouseMove, false);
    window.removeEventListener('click', this.handleClick, false);
  }

  public addTime(time: number) {
    this.reactionLayers.forEach(ctx => {
      this.addTimeToLayer(ctx, time);
    });
    this.safeDraw();
  }

  private addTimeToLayer(ctx: ArtLayerContext, time: number) {
    const deltaTime = time * (ctx.layer.delta || 1);
    ctx.absoluteTime += deltaTime;
    if (
      typeof ctx.layer.threshold === 'number' &&
      ctx.absoluteTime > ctx.layer.threshold
    ) {
      ctx.active = true;
    }

    if (ctx.active) {
      ctx.time += deltaTime;
    }
  }

  private maybeDropoffLayer(ctx: ArtLayerContext) {
    if (
      typeof ctx.layer.dropoff === 'number' &&
      ctx.currentTime > ctx.layer.dropoff
    ) {
      ctx.active = false;
    }
  }

  private handleLayerActivation(ctx: ArtLayerContext) {
    if (
      typeof ctx.layer.threshold === 'number' &&
      ctx.time > ctx.layer.threshold
    ) {
      ctx.active = true;
    }
    if (typeof ctx.layer.dropoff === 'number' && ctx.time > ctx.layer.dropoff) {
      ctx.active = false;
    }
  }

  private renderIntervalLayer(ctx: ArtLayerContext) {
    this.addTimeToLayer(ctx, 1);

    for (; ctx.currentTime < ctx.time && ctx.active; ctx.currentTime++) {
      const entity = this.getNextEntity(ctx.layer, ctx.currentTime);
      if (entity) {
        this.entities.push(entity);
        this.safeUpdate();
      }
      this.maybeDropoffLayer(ctx);
    }
  }

  private getNextEntity(layer: ArtLayer, time: number): ArtEntity | null {
    const nextOp = layer.next(time);

    if (!nextOp) return null;

    const color = nextOp.color || layer.color;
    switch (nextOp.type) {
      case 'circle':
        return new CircleEntity(color, layer.size, nextOp.position);
      case 'square':
        return new SquareEntity(color, layer.size, nextOp.position);
      case 'path':
        const prevOp = layer.next(time - 1);
        if (!prevOp) return null;
        return new PathEntity(
          color,
          layer.size,
          prevOp.position,
          nextOp.position,
        );
    }
  }

  private drawImpl() {
    this.drawing = true;

    let shouldContinue = false;
    for (let i = 0; i < this.reactionLayers.length; i++) {
      const ctx = this.reactionLayers[i];

      if (!ctx.active) {
        continue;
      }

      for (
        let t = 0;
        ctx.currentTime < ctx.time && t < this.maxEntityPerDraw && ctx.active;
        ctx.currentTime++, t++
      ) {
        const entity = this.getNextEntity(ctx.layer, ctx.currentTime);
        if (entity) {
          this.entities.push(entity);
        }
        this.maybeDropoffLayer(ctx);
      }
    }

    this.safeUpdate();

    if (shouldContinue) {
      this.drawTimer = setTimeout(this.draw, this.segmentTime);
    } else {
      this.drawing = false;
    }
  }

  private safeDraw() {
    if (!this.drawing) {
      this.draw();
    }
  }

  private updateImpl() {
    this.updating = true;

    for (
      let t = 0;
      this.entityPos < this.entities.length && t < this.maxEntityPerUpdate;
      this.entityPos++, t++
    ) {
      this.entities[this.entityPos].render(
        this.context,
        this.center,
        this.bounds,
      );
    }

    if (this.entityPos < this.entities.length) {
      this.updateTimer = setTimeout(this.update, 10);
    } else {
      this.updating = false;
    }
  }

  private safeUpdate() {
    if (!this.updating) {
      this.update();
    }
  }
}
