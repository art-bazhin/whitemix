const HISTORY_KEY = 'HISTORY';

export function getHistory(): number[] {
  try {
    const historyString = localStorage.getItem(HISTORY_KEY) || '[]';
    return JSON.parse(historyString);
  } catch (e) {
    return [];
  }
}

export function setHistory(history: number[]) {
  try {
    return localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (e) {}
}
