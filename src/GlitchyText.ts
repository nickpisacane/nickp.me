const GLITCHY_CLASS_PFX = `glitchy-text`;

export default class GlitchyText {
  private colors: string[] = [];
  private interval: number = -1;
  private delay: number = -1;
  private container: Element;

  public static createFromElement(element: Element): GlitchyText {
    const colors = element.getAttribute('data-glitchy-colors').split(' ');
    let interval = -1;
    if (element.hasAttribute('data-glitchy-interval')) {
      interval = parseInt(element.getAttribute('data-glitchy-interval'), 10);
    }

    return new GlitchyText(element, colors, interval);
  }

  public static initializeAll() {
    Array.from(document.querySelectorAll('.glitchy-text')).forEach(element => {
      GlitchyText.createFromElement(element);
    });
  }

  constructor(container: Element, colors: string[], interval: number = -1) {
    this.container = container;
    this.colors = colors;
    this.interval = interval;

    this.initialize();
  }

  private initialize() {
    const content = this.container.innerHTML;
    const original = document.createElement('div');
    original.className = `${GLITCHY_CLASS_PFX}__original`;
    original.innerHTML = content;
    this.container.innerHTML = '';
    this.container.appendChild(original);

    this.colors.forEach((color, idx) => {
      const layer = document.createElement('div');
      layer.className = `${GLITCHY_CLASS_PFX}__layer`;
      layer.innerHTML = content;
      layer.style.color = color;
      this.container.insertBefore(layer, original);

      if (this.interval > 0) {
        let animation = `glitch-text-${idx} 500ms linear ${this.interval}ms`;
        if (this.delay > 0) {
          animation += ` ${this.delay}ms`;
        }
        layer.style.animation = animation;
      }
    });

    if (this.interval > 0) {
      // TODO
    }
  }
}
