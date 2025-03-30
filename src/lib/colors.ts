type ColorBinary = number;

interface IColor {
  name: string;
  bin: ColorBinary;
}

export const COLORS = [
  { name: 'red', bin: 0b100 },
  { name: 'green', bin: 0b010 },
  { name: 'blue', bin: 0b001 },
  { name: 'cyan', bin: 0b011 },
  { name: 'magenta', bin: 0b101 },
  { name: 'yellow', bin: 0b110 },
  { name: 'white', bin: 0b111 },
];

const COLOR_NAME_MAP = COLORS.reduce((map, color) => {
  map[color.name] = color;
  return map;
}, {} as Record<string, IColor>);

const COLOR_BIN_MAP = COLORS.reduce((map, color) => {
  map[color.bin] = color;
  return map;
}, {} as Record<ColorBinary, IColor>);

export const RED = getColor('red');
export const GREEN = getColor('green');
export const BLUE = getColor('blue');
export const WHITE = getColor('white');

export function getColor(id: string | ColorBinary): IColor {
  if (typeof id === 'number') return COLOR_BIN_MAP[id];
  return COLOR_NAME_MAP[id];
}

export function add(target: ColorBinary, source: ColorBinary) {
  if (target & source) return target;
  return target | source;
}

export function invert(target: ColorBinary) {
  if (target === WHITE.bin) return target;
  return WHITE.bin - target;
}
