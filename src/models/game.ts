import { batch, computed, effect, Signal, signal } from '@preact/signals';
import { add, BLUE, GREEN, invert, RED, WHITE } from '../lib/colors';
import { createRandom } from '../lib/random';

export interface IGameModelProps {
  cols: number;
  rows: number;
  initialState?: number[];
  solution?: number[];
  best?: Signal<number>;
  onRecord?: (moves: number) => void;
  loadHistory?: () => number[];
  saveHistory?: (history: number[]) => void;
}

export function createGameModel(props: IGameModelProps) {
  const {
    cols,
    rows,
    solution,
    best,
    initialState = getInitialState(cols * rows),
    onRecord,
    loadHistory,
    saveHistory,
  } = props;

  const history = signal(loadHistory ? loadHistory() : []);
  const state = signal(applyHistory(initialState, history.value));
  const inverted = signal(null as Record<number, boolean | undefined> | null);
  const currentSolution = signal(solution);

  const moves = computed(() => history.value.length);

  const solved = computed(() =>
    state.value.every((colorBin) => colorBin === WHITE.bin)
  );

  effect(() => {
    if (!moves.value) currentSolution.value = solution;
  });

  effect(() => {
    const solvedValue = solved.value;
    const bestValue = best?.peek();
    const movesValue = moves.peek();

    if (solvedValue && (!bestValue || bestValue > movesValue)) {
      onRecord?.(movesValue);
    }
  });

  effect(() => {
    saveHistory?.(history.value);
  });

  function getInitialState(cells: number) {
    const todayISOString = new Date().toISOString().split('T')[0];
    const todayTime = new Date(todayISOString).getTime();
    const random = createRandom(todayTime);

    const state = [] as number[];
    const colors = [RED.bin, GREEN.bin, BLUE.bin];

    for (let i = 0; i < cells; i++) {
      state[i] = colors[Math.floor(random() * colors.length)];
    }

    return state;
  }

  function getNeighborIndexes(i: number) {
    const x = i % cols;
    const y = Math.floor(i / cols);

    const row = [
      x - 1 >= 0 ? i - 1 : null,
      i,
      x + 1 < cols ? i + 1 : null,
    ].filter((i) => i !== null);

    return [
      y - 1 >= 0 ? row.map((i) => i - cols) : null,
      row,
      y + 1 < rows ? row.map((i) => i + cols) : null,
    ]
      .filter((i) => i !== null)
      .flat();
  }

  function getNextState(currentState: number[], clickedCellIndex: number) {
    const source = currentState[clickedCellIndex];
    const nextState = currentState.slice();

    let hasChanges = false;

    const isInverting = source === WHITE.bin;
    const neighbors = getNeighborIndexes(clickedCellIndex);
    const invertedIndexesMap = {} as Record<number, boolean | undefined>;

    neighbors.forEach((i) => {
      const target = nextState[i];

      if (isInverting) nextState[i] = invert(target);
      else nextState[i] = add(target, source);

      if (target !== nextState[i]) {
        nextState[clickedCellIndex] = WHITE.bin;
        hasChanges = true;
        if (isInverting) invertedIndexesMap[i] = true;
      }
    });

    if (hasChanges) return nextState;

    return currentState;
  }

  function applyHistory(currentState: number[], history: number[]) {
    return history.reduce(getNextState, currentState);
  }

  function getInvertedIndexesMap(currentState: number[], nextState: number[]) {
    return nextState.reduce((map, value, index) => {
      if (value === invert(currentState[index])) map[index] = true;
      return map;
    }, {} as Record<number, boolean | undefined>);
  }

  return {
    moves,
    state,
    inverted,
    currentSolution,

    click(cellIndex: number) {
      const currentState = state.value;
      const nextState = getNextState(currentState, cellIndex);

      if (solution && solution[moves.value] !== cellIndex) {
        currentSolution.value = undefined;
      }

      if (nextState !== currentState) {
        batch(() => {
          state.value = nextState;
          history.value = [...history.value, cellIndex];
          inverted.value = getInvertedIndexesMap(currentState, nextState);
        });
      }

      console.log(history.value);
    },

    reset() {
      batch(() => {
        state.value = initialState;
        history.value = [];
      });
    },
  };
}
