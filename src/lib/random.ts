export function createRandom(
  seed: number,
  a = 48271,
  c = 0,
  m = Math.pow(2, 31) - 1
) {
  let value = seed;

  return function () {
    value = (value * a + c) % m;
    return value / m;
  };
}
