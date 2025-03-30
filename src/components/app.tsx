import { COLS, ROWS } from '../constants';
import { getHistory, setHistory } from '../lib/storage';
import { Game } from './game';

export function App() {
  return (
    <>
      <header></header>
      <Game
        loadHistory={getHistory}
        saveHistory={setHistory}
        cols={COLS}
        rows={ROWS}
      />
      <footer></footer>
    </>
  );
}
