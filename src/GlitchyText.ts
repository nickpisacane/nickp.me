const GLITCHY_CLASS_PFX = `glitchy-text`;

const DEFAULT_COLORS = ['#ff196a', '#3fff19', '#2c19ff'];

export default class GlitchyText {
  private colors: string[] = [];
  private interval: number = -1;
  private delay: number = 0;
  private container: Element;

  public static createFromElement(element: Element): GlitchyText {
    const colors = element.hasAttribute('data-glitchy-colors')
      ? element.getAttribute('data-glitchy-colors').split(' ')
      : DEFAULT_COLORS;
    let interval = -1;
    let delay = 0;
    if (element.hasAttribute('data-glitchy-interval')) {
      interval = parseInt(element.getAttribute('data-glitchy-interval'), 10);
    }
    if (element.hasAttribute('data-glitchy-delay')) {
      delay = parseInt(element.getAttribute('data-glitchy-delay'), 10);
    }
    return new GlitchyText(element, colors, interval, delay);
  }

  public static initializeAll() {
    Array.from(document.querySelectorAll('.glitchy-text')).forEach(element => {
      GlitchyText.createFromElement(element);
    });
  }

  constructor(
    container: Element,
    colors: string[],
    interval: number = -1,
    delay: number = 0,
  ) {
    this.container = container;
    this.colors = colors;
    this.interval = interval;
    this.delay = delay;

    this.initialize();
  }

  private initialize() {
    const content = this.container.innerHTML;
    const className = this.container.getAttribute('data-glitchy-class') || '';
    const original = document.createElement('div');

    original.className = `${GLITCHY_CLASS_PFX}__original ${className}`;
    original.innerHTML = content;
    this.container.innerHTML = '';
    this.container.appendChild(original);

    this.colors.forEach((color, idx) => {
      const layer = document.createElement('div');
      layer.className = `${GLITCHY_CLASS_PFX}__layer ${className}`;
      layer.innerHTML = content;
      layer.style.color = color;
      this.container.insertBefore(layer, original);

      if (this.interval > 0) {
        setTimeout(() => {
          setInterval(() => {
            layer.style.animation = `glitchy-text-${idx + 1} 500ms linear`;
          }, this.interval);
        }, this.delay);

        layer.addEventListener(
          'animationend',
          () => {
            layer.style.animation = '';
          },
          false,
        );
      }
    });
  }
}
