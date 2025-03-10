import { ROWS, CELLS, COLS } from '../constants';
import { add, BLUE, GREEN, inverse, RED, WHITE } from '../lib/colors';
import { createRandom } from '../lib/random';

export class GameModel {
  private initialState: number[] = this.getInitialState();
  private history: number[][] = [];

  constructor() {}

  public onStateChange: (updatedCells: (number | null)[]) => void = () => {};
  public onMovesChange: (moves: number) => void = () => {};

  public click(cellIndex: number) {
    const currentState = this.state;
    const source = currentState[cellIndex];
    const nextState = currentState.slice();

    getNeighborIndexes(cellIndex).forEach((i) => {
      const target = nextState[i];

      if (source === WHITE.bin) nextState[i] = inverse(target);
      else nextState[i] = add(target, source);

      if (target !== nextState[i]) nextState[cellIndex] = WHITE.bin;
    });

    let hasChanges = false;

    const updatedCells = nextState.map((bin, i) => {
      if (currentState[i] !== bin) {
        hasChanges = true;
        return bin;
      }

      return null;
    });

    if (hasChanges) {
      this.history.push(nextState);
      this.emitUpdates(updatedCells);
    }
  }

  public reset() {
    this.history = [];
    this.emitUpdates();
  }

  public back() {
    this.history.pop();
    this.emitUpdates();
  }

  public get state() {
    return this.history.length
      ? this.history[this.history.length - 1]
      : this.initialState;
  }

  public get moves() {
    return this.history.length;
  }

  public get isWin() {
    return this.state.every((colorBin) => colorBin === WHITE.bin);
  }

  private emitUpdates(updatedCells: (number | null)[] = this.state) {
    this.onStateChange(updatedCells);
    this.onMovesChange(this.moves);
  }

  private getInitialState() {
    const todayISOString = new Date().toISOString().split('T')[0];
    const todayTime = new Date(todayISOString).getTime();
    const random = createRandom(todayTime);

    const state = [] as number[];
    const colors = [RED.bin, GREEN.bin, BLUE.bin];

    for (let i = 0; i < CELLS; i++) {
      state[i] = 0b100;
      // state[i] = colors[Math.floor(random() * colors.length)];
    }

    state[0] = 0b001;

    // state[0] = RED.bin;
    // state[1] = GREEN.bin;
    // state[2] = BLUE.bin;

    // state[5] = GREEN.bin;
    // state[6] = BLUE.bin;
    // state[7] = RED.bin;

    // state[5] = RED.bin;
    // state[6] = GREEN.bin;
    // state[7] = BLUE.bin;

    // state[10] = RED.bin;
    // state[11] = GREEN.bin;
    // state[12] = BLUE.bin;

    return state;
  }
}

function getNeighborIndexes(i: number) {
  const x = i % COLS;
  const y = Math.floor(i / COLS);

  const row = [
    x - 1 >= 0 ? i - 1 : null,
    i,
    x + 1 < COLS ? i + 1 : null,
  ].filter((i) => i !== null);

  return [
    y - 1 >= 0 ? row.map((i) => i - COLS) : null,
    row,
    y + 1 < ROWS ? row.map((i) => i + COLS) : null,
  ]
    .filter((i) => i !== null)
    .flat();
}
