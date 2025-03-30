import { useMemo } from 'preact/hooks';
import { getColor } from '../lib/colors';
import { createGameModel, IGameModelProps } from '../models/game';
import { throttle } from '../lib/throttle';
import { useSignal } from '@preact/signals';

export interface IGameProps extends IGameModelProps {
  hideStatusBar?: boolean;
}

const ANIMATION_DURATION = 200;

export function Game(props: IGameProps) {
  const { cols, rows, solution, best, hideStatusBar } = props;

  const model = useMemo(() => createGameModel(props), []);
  const flipingAllSignal = useSignal(false);

  const moves = model.moves.value;
  const state = model.state.value;
  const inverted = model.inverted.value;
  const flippingAll = flipingAllSignal.value;

  const click = useMemo(
    () =>
      throttle((i: number) => {
        model.click(i);
        setTimeout(() => (model.inverted.value = null), ANIMATION_DURATION);
      }, ANIMATION_DURATION + 20),
    []
  );

  const reset = () => {
    if (!moves) return;
    model.reset();
    flipingAllSignal.value = true;
    setTimeout(() => (flipingAllSignal.value = false), ANIMATION_DURATION);
  };

  const fieldClassName = 'field' + (flippingAll ? ' flip-all' : '');

  return (
    <div className="game">
      {!hideStatusBar && (
        <div class="status-bar">
          <div>Moves: {moves}</div>
          {best ? <div>Best: {best}</div> : null}
        </div>
      )}
      <div
        class={fieldClassName}
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr`,
          gridTemplateRows: `repeat(${rows}, 1fr`,
        }}
      >
        {state.map((bin, i) => {
          let className = `cell ${getColor(bin).name}`;

          if (inverted?.[i]) className += ' flip';

          return (
            <button className={className} onClick={() => click(i)}>
              {moves < (solution?.length || 0) - 1 && solution?.[moves] === i
                ? moves + 1
                : ''}
            </button>
          );
        })}
      </div>
      <button
        class="restart"
        onClick={!(flippingAll || inverted) ? reset : undefined}
      >
        Restart
      </button>
    </div>
  );
}
