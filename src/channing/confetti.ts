import JSConfetti from 'js-confetti';

const instance = new JSConfetti();

export const fire = () => {
  instance.addConfetti({
    emojis: ['🦄', '🌈', '🌸'],
  });
};

export const fireSad = () => {
  instance.addConfetti({
    emojis: ['😒', '🙁'],
  });
};
