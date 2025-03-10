import './style.css';

import { GameModel } from './model/index.ts';
import { GameView } from './view/index.ts';

const model = new GameModel();
const view = new GameView();

model.onStateChange = (updates) => view.updateField(updates);
model.onMovesChange = (moves) => view.updateMoveCounter(moves);

view.onCellClick = (i) => model.click(i);
view.onRestartClick = () => model.reset();
view.createField(model.state);

(window as any).GAME = model;
