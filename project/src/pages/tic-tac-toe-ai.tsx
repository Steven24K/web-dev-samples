import React, { useState } from 'react';

// Types
type Player = 'X' | 'O';
type Cell = Player | null;
type Board = Cell[];
type Difficulty = 'Easy' | 'Moderate' | 'Hard' | 'Impossible';
type GameMode = 'PvP' | 'PvC' | 'CvC';

const initialBoard: Board = Array(9).fill(null);

const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6],            // diags
];

// Utility functions
function checkWinner(board: Board): Player | null {
    for (const [a, b, c] of winningCombos) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return null;
}

function isBoardFull(board: Board) {
    return board.every(cell => cell !== null);
}

// AI logic
function getAvailableMoves(board: Board) {
    return board.map((cell, idx) => cell === null ? idx : null).filter(idx => idx !== null) as number[];
}

function randomMove(board: Board) {
    const moves = getAvailableMoves(board);
    return moves[Math.floor(Math.random() * moves.length)];
}

// Minimax for Impossible difficulty
function minimax(board: Board, depth: number, isMax: boolean, ai: Player, human: Player): number {
    const winner = checkWinner(board);
    if (winner === ai) return 10 - depth;
    if (winner === human) return depth - 10;
    if (isBoardFull(board)) return 0;

    const moves = getAvailableMoves(board);
    if (isMax) {
        let best = -Infinity;
        for (const move of moves) {
            board[move] = ai;
            best = Math.max(best, minimax(board, depth + 1, false, ai, human));
            board[move] = null;
        }
        return best;
    } else {
        let best = Infinity;
        for (const move of moves) {
            board[move] = human;
            best = Math.min(best, minimax(board, depth + 1, true, ai, human));
            board[move] = null;
        }
        return best;
    }
}

function getBestMove(board: Board, ai: Player, human: Player): number {
    let bestScore = -Infinity;
    let move = -1;
    for (const idx of getAvailableMoves(board)) {
        board[idx] = ai;
        const score = minimax(board, 0, false, ai, human);
        board[idx] = null;
        if (score > bestScore) {
            bestScore = score;
            move = idx;
        }
    }
    return move;
}

// Moderate and Hard AI
function moderateMove(board: Board, ai: Player, human: Player): number {
    // Block if human can win next
    for (const idx of getAvailableMoves(board)) {
        board[idx] = human;
        if (checkWinner(board) === human) {
            board[idx] = null;
            return idx;
        }
        board[idx] = null;
    }
    // Otherwise random
    return randomMove(board);
}

function hardMove(board: Board, ai: Player, human: Player): number {
    // Win if possible
    for (const idx of getAvailableMoves(board)) {
        board[idx] = ai;
        if (checkWinner(board) === ai) {
            board[idx] = null;
            return idx;
        }
        board[idx] = null;
    }
    // Block if human can win next
    for (const idx of getAvailableMoves(board)) {
        board[idx] = human;
        if (checkWinner(board) === human) {
            board[idx] = null;
            return idx;
        }
        board[idx] = null;
    }
    // Otherwise random
    return randomMove(board);
}

function getAIMove(board: Board, ai: Player, human: Player, difficulty: Difficulty): number {
    switch (difficulty) {
        case 'Easy':
            return randomMove(board);
        case 'Moderate':
            return moderateMove(board, ai, human);
        case 'Hard':
            return hardMove(board, ai, human);
        case 'Impossible':
            return getBestMove(board, ai, human);
        default:
            return randomMove(board);
    }
}

// Main Component
const TicTacToeAI: React.FC = () => {
    // Game state
    const [board, setBoard] = useState<Board>(initialBoard);
    const [history, setHistory] = useState<Board[]>([initialBoard]);
    const [step, setStep] = useState(0);
    const [xIsNext, setXIsNext] = useState(true);
    const [scores, setScores] = useState({ X: 0, O: 0, Draws: 0 });
    const [gameMode, setGameMode] = useState<GameMode>('PvC');
    const [difficulty, setDifficulty] = useState<Difficulty>('Moderate');
    const [aiPlayer, setAiPlayer] = useState<Player>('O');
    const [status, setStatus] = useState<string>('Next: X');
    const [undoUsed, setUndoUsed] = useState(false);

    // Determine players
    const isAI = (player: Player) => {
        if (gameMode === 'PvP') return false;
        if (gameMode === 'PvC') return player === aiPlayer;
        if (gameMode === 'CvC') return true;
        return false;
    };

    // Handle move
    const handleClick = (idx: number) => {
        if (board[idx] || checkWinner(board)) return;
        if (isAI(xIsNext ? 'X' : 'O')) return; // Prevent human clicking on AI turn

        const newBoard = board.slice();
        newBoard[idx] = xIsNext ? 'X' : 'O';
        updateGame(newBoard);
    };

    // Update game state after move
    const updateGame = (newBoard: Board) => {
        const winner = checkWinner(newBoard);
        const draw = isBoardFull(newBoard) && !winner;

        setBoard(newBoard);
        setHistory(prev => [...prev.slice(0, step + 1), newBoard]);
        setStep(prev => prev + 1);
        setXIsNext(prev => !prev);

        if (winner) {
            setScores(prev => ({ ...prev, [winner]: prev[winner] + (undoUsed ? 0 : 1) }));
            setStatus(`Winner: ${winner}`);
        } else if (draw) {
            setScores(prev => ({ ...prev, Draws: prev.Draws + (undoUsed ? 0 : 1) }));
            setStatus('Draw!');
        } else {
            setStatus(`Next: ${xIsNext ? 'O' : 'X'}`);
        }
        setUndoUsed(false);
    };

    // Undo move
    const handleUndo = () => {
        if (step === 0) return;
        setStep(prev => prev - 1);
        setBoard(history[step - 1]);
        setXIsNext((step - 1) % 2 === 0);
        setStatus(`Next: ${(step - 1) % 2 === 0 ? 'X' : 'O'}`);
        setUndoUsed(true);
    };

    // Restart game
    const handleRestart = () => {
        setBoard(initialBoard);
        setHistory([initialBoard]);
        setStep(0);
        setXIsNext(true);
        setStatus('Next: X');
        setUndoUsed(false);
    };

    // AI move effect
    React.useEffect(() => {
        const currentPlayer = xIsNext ? 'X' : 'O';
        if (isAI(currentPlayer) && !checkWinner(board) && !isBoardFull(board)) {
            const move = getAIMove(board.slice(), currentPlayer, currentPlayer === 'X' ? 'O' : 'X', difficulty);
            setTimeout(() => {
                const newBoard = board.slice();
                newBoard[move] = currentPlayer;
                updateGame(newBoard);
            }, 500);
        }
        // eslint-disable-next-line
    }, [board, xIsNext, gameMode, difficulty]);

    // Change game mode
    const handleModeChange = (mode: GameMode) => {
        setGameMode(mode);
        setAiPlayer(mode === 'PvC' ? 'O' : 'X');
        handleRestart();
    };

    // Change difficulty
    const handleDifficultyChange = (diff: Difficulty) => {
        setDifficulty(diff);
        handleRestart();
    };

    // Render
    return (
        <div className="ttt-container">
            <h1 className="ttt-title">Advanced Tic Tac Toe AI</h1>
            <div className="ttt-controls">
                <label>
                    Game Mode:
                    <select
                        className="ttt-select"
                        value={gameMode}
                        onChange={e => handleModeChange(e.target.value as GameMode)}
                    >
                        <option value="PvP">Player vs Player</option>
                        <option value="PvC">Player vs Computer</option>
                        <option value="CvC">Computer vs Computer</option>
                    </select>
                </label>
                <label>
                    Difficulty:
                    <select
                        className="ttt-select"
                        value={difficulty}
                        onChange={e => handleDifficultyChange(e.target.value as Difficulty)}
                    >
                        <option value="Easy">Easy</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Hard">Hard</option>
                        <option value="Impossible">Impossible</option>
                    </select>
                </label>
                <button className="ttt-btn" onClick={handleRestart}>Restart</button>
                <button className="ttt-btn" onClick={handleUndo} disabled={step === 0}>Undo</button>
            </div>
            <div className="ttt-status">{status}</div>
            <div className="ttt-board">
                {board.map((cell, idx) => (
                    <button
                        key={idx}
                        className={`ttt-cell ${cell ? 'ttt-cell-filled' : ''}`}
                        onClick={() => handleClick(idx)}
                        disabled={!!cell || checkWinner(board) != null || isAI(xIsNext ? 'X' : 'O')}
                    >
                        {cell}
                    </button>
                ))}
            </div>
            <div className="ttt-scores">
                <span className="ttt-score">X: {scores.X}</span>
                <span className="ttt-score">O: {scores.O}</span>
                <span className="ttt-score">Draws: {scores.Draws}</span>
            </div>
            <div className="ttt-tutorial">
                <h2 className="ttt-tutorial-title">Step-by-Step Tutorial: Build Advanced Tic Tac Toe AI</h2>
                <ol className="ttt-tutorial-list">
                    <li>Set up a new React project and create a TicTacToe component.</li>
                    <li>Define the board state as an array of 9 cells, each cell can be 'X', 'O', or null.</li>
                    <li>Implement logic to check for a winner and for a draw.</li>
                    <li>Add UI for the board, scores, and controls (restart, undo, mode, difficulty).</li>
                    <li>Implement move history and undo functionality, affecting the score if used.</li>
                    <li>Allow selection of game mode: Player vs Player, Player vs Computer, Computer vs Computer.</li>
                    <li>Implement AI logic for computer moves with multiple difficulties:
                        <ul>
                            <li>Easy: random moves.</li>
                            <li>Moderate: block immediate wins.</li>
                            <li>Hard: block and win if possible.</li>
                            <li>Impossible: use minimax algorithm for perfect play.</li>
                        </ul>
                    </li>
                    <li>Use React Hooks to manage state and effects for AI turns.</li>
                    <li>Style the game using CSS classes (see class names in the markup).</li>
                    <li>Test all features and polish the UI.</li>
                </ol>
            </div>
        </div>
    );
};

export default TicTacToeAI;