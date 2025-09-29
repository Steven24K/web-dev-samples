// FILE: app.ts
/*
  TypeScript logic for Tic Tac Toe
  - Human vs Human and Human vs CPU
  - CPU difficulties: easy (random), medium (block/win heuristics), hard (minimax)
  - Saves each game's result to localStorage under key `ttt_history`
*/

type Cell = 'X' | 'O' | '';

type Mode = 'human' | 'cpu';

type Difficulty = 'easy' | 'medium' | 'hard';

interface GameResult { winner: 'X' | 'O' | 'draw'; timestamp: number }

const STORAGE_KEY = 'ttt_history_v1';

// DOM refs
const boardEl = document.getElementById('board') as HTMLDivElement;
const resetBtn = document.getElementById('resetBtn') as HTMLButtonElement;
const modeSel = document.getElementById('mode') as HTMLSelectElement;
const diffSel = document.getElementById('difficulty') as HTMLSelectElement;
const diffLabel = document.getElementById('difficultyLabel') as HTMLLabelElement;
const playerSymbolSel = document.getElementById('playerSymbol') as HTMLSelectElement;
const currentTurnEl = document.getElementById('turnPlayer') as HTMLSpanElement;
const resultEl = document.getElementById('result') as HTMLDivElement;
const scoresEl = document.getElementById('scores') as HTMLDivElement;
const clearHistoryBtn = document.getElementById('clearHistory') as HTMLButtonElement;

let board: Cell[] = Array(9).fill('');
let currentPlayer: Cell = 'X';
let playerIs: Cell = 'X';
let mode: Mode = 'cpu';
let difficulty: Difficulty = 'hard';
let gameOver = false;

// Utils
function saveResult(r: GameResult){
  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as GameResult[];
  existing.push(r);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  renderScores();
}

function clearHistory(){
  localStorage.removeItem(STORAGE_KEY);
  renderScores();
}

function renderScores(){
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as GameResult[];
  const winsX = data.filter(d=>d.winner==='X').length;
  const winsO = data.filter(d=>d.winner==='O').length;
  const draws = data.filter(d=>d.winner==='draw').length;
  scoresEl.innerHTML = `X: ${winsX} — O: ${winsO} — Draws: ${draws} <br/><small>Games: ${data.length}</small>`;
}

// Rendering
function renderBoard(){
  boardEl.innerHTML = '';
  board.forEach((v, i) => {
    const cell = document.createElement('div');
    cell.className = `cell ${v? v.toLowerCase() : 'empty'}`;
    cell.dataset.index = String(i);
    cell.setAttribute('role','button');
    cell.setAttribute('aria-label', `cell ${i+1}`);
    cell.innerHTML = v ? `<span class="mark">${v}</span>` : '';
    cell.addEventListener('click', onCellClick);
    boardEl.appendChild(cell);
  });
  currentTurnEl.textContent = gameOver ? '—' : currentPlayer;
}

function onCellClick(e: Event){
  if(gameOver) return;
  const idx = Number((e.currentTarget as HTMLElement).dataset.index);
  if(board[idx]) return;
  makeMove(idx, currentPlayer);
}

function makeMove(idx: number, player: Cell){
  board[idx] = player;
  animateCell(idx);
  const winner = checkWinner(board);
  if(winner){
    gameOver = true;
    if(winner === 'draw'){
      resultEl.textContent = 'Gelijkspel!';
      saveResult({winner:'draw', timestamp:Date.now()});
    } else {
      resultEl.textContent = `${winner} wint!`;
      saveResult({winner: winner, timestamp:Date.now()});
      highlightWinningLine(board, winner);
    }
    currentTurnEl.textContent = '—';
    return;
  }
  currentPlayer = (currentPlayer === 'X') ? 'O' : 'X';
  renderBoard();

  if(!gameOver && mode === 'cpu' && currentPlayer !== playerIs){
    // CPU turn
    setTimeout(() => cpuTurn(), 300);
  }
}

function animateCell(idx:number){
  const el = boardEl.querySelector(`.cell[data-index=\"${idx}\"]`);
  if(!el) return;
  el.classList.remove('empty');
}

// Game logic
function checkWinner(b: Cell[]): 'X'|'O'|'draw'|null{
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for(const [a,bIdx,c] of lines){
    if(b[a] && b[a] === b[bIdx] && b[a] === b[c]) return b[a] as 'X'|'O';
  }
  if(b.every(cell=>cell)) return 'draw';
  return null;
}

function highlightWinningLine(b: Cell[], winner: 'X'|'O'){
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for(const line of lines){
    const [a,bidx,c] = line;
    if(b[a] === winner && b[bidx]===winner && b[c]===winner){
      line.forEach(i => {
        const el = boardEl.querySelector(`.cell[data-index=\"${i}\"]`);
        if(el) el.animate([
          {boxShadow:'0 0 10px rgba(255,255,255,0.06), 0 0 30px rgba(0,245,255,0.18)'},
          {boxShadow:'0 0 30px rgba(126,255,166,0.2), 0 0 80px rgba(0,245,255,0.12)'}
        ],{duration:900,iterations:3});
      });
      break;
    }
  }
}

// CPU strategies
function cpuTurn(){
  let move = -1;
  if(difficulty === 'easy') move = cpuRandomMove();
  else if(difficulty === 'medium') move = cpuMediumMove();
  else move = cpuMinimaxMove();

  if(move >= 0) makeMove(move, currentPlayer);
}

function cpuRandomMove(){
  const empties = board.map((v,i)=> v? -1:i).filter(i=>i>=0);
  return empties[Math.floor(Math.random()*empties.length)];
}

function cpuMediumMove(){
  // Try to win
  const me = currentPlayer;
  const them = me === 'X' ? 'O' : 'X';
  for(let i=0;i<9;i++){
    if(!board[i]){
      const copy = board.slice(); copy[i] = me;
      if(checkWinner(copy) === me) return i;
    }
  }
  // Block opponent
  for(let i=0;i<9;i++){
    if(!board[i]){
      const copy = board.slice(); copy[i] = them as Cell;
      if(checkWinner(copy) === them) return i;
    }
  }
  // Center
  if(!board[4]) return 4;
  // Random corner
  const corners = [0,2,6,8].filter(i=>!board[i]);
  if(corners.length) return corners[Math.floor(Math.random()*corners.length)];
  return cpuRandomMove();
}

function cpuMinimaxMove(){
  const me = currentPlayer;
  const them = me === 'X' ? 'O' : 'X';

  function scoreFor(winner: 'X'|'O'|'draw'|null){
    if(winner === me) return 10;
    if(winner === 'draw') return 0;
    if(winner === them) return -10;
    return 0;
  }

  function minimax(b: Cell[], player: Cell): {idx:number,score:number}[]{
    const winner = checkWinner(b);
    if(winner !== null){
      return [{idx:-1, score: scoreFor(winner)}];
    }
    const moves: {idx:number,score:number}[] = [];
    for(let i=0;i<9;i++){
      if(!b[i]){
        const copy = b.slice(); copy[i] = player;
        const next = minimax(copy, player === 'X' ? 'O' : 'X');
        // worst-case from child's perspective
        const scores = next.map(n=>n.score);
        const score = player === me ? Math.max(...scores) : Math.min(...scores);
        moves.push({idx:i, score});
      }
    }
    return moves;
  }

  const moves = minimax(board.slice(), me);
  if(!moves.length) return cpuRandomMove();
  // pick best
  let best = moves[0];
  for(const m of moves) if(m.score > best.score) best = m;
  return best.idx;
}

// Controls
function resetGame(){
  board = Array(9).fill('');
  currentPlayer = 'X';
  gameOver = false;
  resultEl.textContent = '';
  renderBoard();
}

modeSel.addEventListener('change', ()=>{
  mode = modeSel.value as Mode;
  diffLabel.style.display = mode === 'cpu' ? 'inline-block' : 'none';
  resetGame();
});

diffSel.addEventListener('change', ()=>{
  difficulty = diffSel.value as Difficulty;
});

playerSymbolSel.addEventListener('change', ()=>{
  playerIs = playerSymbolSel.value as Cell;
  resetGame();
});

resetBtn.addEventListener('click', ()=> resetGame());
clearHistoryBtn.addEventListener('click', ()=> clearHistory());

// Init
function init(){
  // defaults
  mode = (modeSel.value as Mode) || 'cpu';
  difficulty = (diffSel.value as Difficulty) || 'hard';
  playerIs = (playerSymbolSel.value as Cell) || 'X';
  diffLabel.style.display = mode === 'cpu' ? 'inline-block' : 'none';
  renderScores();
  renderBoard();
}

init();

// Expose some quick debugging on window (optional)
(window as any).ttt = { board, resetGame };
