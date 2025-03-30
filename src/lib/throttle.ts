export function throttle<A extends unknown[], R>(
  fn: (...args: A) => R,
  time: number
) {
  let timeoutId = 0;
  let calls = 0;

  const throttled = function (this: unknown, ...args: A) {
    if (timeoutId) {
      calls++;
      return;
    }

    fn.apply(this, args);

    timeoutId = setTimeout(() => {
      timeoutId = 0;
      if (!calls) return;

      calls = 0;
      throttled.apply(this, args);
    }, time);
  };

  return throttled;
}
