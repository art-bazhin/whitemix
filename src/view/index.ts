import { ROWS, COLS } from '../constants';
import { getColor } from '../lib/colors';

export class GameView {
  private field = document.getElementById('field')!;
  private moveCounter = document.getElementById('moves')!;
  private restartButton = document.getElementById('restart')!;

  public onCellClick: (cellIndex: number) => void = () => {};
  public onRestartClick: () => void = () => {};

  constructor() {
    initStyle();

    this.restartButton.addEventListener('click', () => this.onRestartClick());
  }

  public createField(initialState: number[]) {
    initialState.forEach((bin, i) => {
      const cell = document.createElement('button');

      cell.setAttribute('class', getCellClassName(bin));
      cell.addEventListener('click', () => this.onCellClick(i));

      this.field.appendChild(cell);
    });
  }

  public updateField(updatedCells: (number | null)[]) {
    updatedCells.forEach((bin, i) => {
      if (bin === null) return;

      const cell = this.field.children[i];
      cell.setAttribute('class', getCellClassName(bin));
    });
  }

  public updateMoveCounter(moves: number) {
    this.moveCounter.textContent = String(moves);
  }
}

function getCellClassName(bin: number) {
  return `cell ${getColor(bin).name}`;
}

function initStyle() {
  const el = document.createElement('style');

  el.setAttribute('type', 'text/css');
  el.textContent = `
    .field { 
      grid-template-columns: repeat(${COLS}, 1fr);
      grid-template-rows: repeat(${ROWS}, 1fr);
    }
  `;

  document.head.appendChild(el);
}
