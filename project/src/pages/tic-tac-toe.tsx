import React from "react";

export const TicTacToe: React.FC = () => <div className="container">
    <header className="header" id="header">
        <h1>Welcome to the world famous Tic Tac Toe game!</h1>
        <p>
            Tic-tac-toe, noughts and crosses, or Xs and Os is a paper-and-pencil game for two players
            who take turns marking the spaces in a three-by-three grid with X or O.
            The player who succeeds in placing three of their marks in a horizontal, vertical, or diagonal row is the
            winner.
        </p>
        <a target="_blank" aria-label="Wikipedia" href="https://en.wikipedia.org/wiki/Tic-tac-toe">Wikipedia</a>
        <a aria-label="Reset" href="./tic-tac-toe.html">Reset game</a>
        <a aria-label="Reset" href="../index.html">Back to home</a>
    </header>

    <main className="main-content">
        <div id="game-grid" className="game-grid"></div>
        <div className="players">
            <div id="player-x" className="player turn">&#9932;</div>
            <div id="player-o" className="player">&#9898;</div>
        </div>
    </main>

    <h1>For reference:</h1>

    <script src="https://gist.github.com/Steven24K/7eb42baf2a05ed6a43a959bd8c9bc8dd.js"></script>

    <script src="../tic-tac-toe.ts"></script>
</div> 