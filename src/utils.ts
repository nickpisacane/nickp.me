export type BasicFunc = () => void;

export const debounce = (fn: BasicFunc, time: number): BasicFunc => {
  let timer: number | null = null;
  const handler = () => {
    timer = null;
    fn();
  };

  return () => {
    clearTimeout(timer);
    setTimeout(handler, time);
  };
};

export const throttle = (fn: BasicFunc, time: number): BasicFunc => {
  let block = false;
  const release = () => {
    block = false;
  };

  return () => {
    if (!block) {
      fn();
      block = true;
      setTimeout(release, time);
    }
  };
};
