import React, { useState, useEffect } from 'react';
import { generateLevel } from './engine';
import { calculateBestEnemyMove, getLegalMoves } from './ai';
import { exportGameData, validateMove } from './utils';
import './App.css';

export default function App() {
  const [level, setLevel] = useState(1);
  const [seed] = useState(() => Math.random().toString(36).substring(7));
  const [gameState, setGameState] = useState(generateLevel(1, seed));
  const [trinkets, setTrinkets] = useState([]);
  const [activeMoveMode, setActiveMoveMode] = useState(0); // 0 = King, 1 = Trinket 1, etc.
  const [metrics, setMetrics] = useState({ moves: 0, captures: 0 });
  const [gameOver, setGameOver] = useState(false);

  // Cycle trinkets on player click (No UI)
  const handlePlayerClick = () => {
    setActiveMoveMode((prev) => (prev + 1) % (trinkets.length + 1));
  };

  const handleTileClick = (x, y) => {
    if (gameOver) return;

    const proposedMove = { x, y };
    const legalMoves = getLegalMoves(gameState.playerPos, gameState.board); // Modify to pass activeMoveMode

    if (validateMove(proposedMove, legalMoves)) {
      executePlayerMove(proposedMove);
    }
  };

  const executePlayerMove = (targetPos) => {
    let newBoard = [...gameState.board.map(row => [...row])];
    const targetPiece = newBoard[targetPos.y][targetPos.x];
    
    // Win Condition
    if (targetPiece && targetPiece.id === 'enemy_king') {
      setLevel(l => l + 1);
      setGameState(generateLevel(level + 1, seed));
      return;
    }

    // Capture logic & Trinket collection
    if (targetPiece && !targetPiece.isPlayer && !['♟', '♚'].includes(targetPiece.type)) {
      setTrinkets(prev => prev.length < 3 ? [...prev, targetPiece.type] : prev);
      setMetrics(m => ({ ...m, captures: m.captures + 1 }));
    }

    // Move player
    newBoard[gameState.playerPos.y][gameState.playerPos.x] = null;
    newBoard[targetPos.y][targetPos.x] = { type: '⭐', isPlayer: true };
    setMetrics(m => ({ ...m, moves: m.moves + 1 }));
    
    setGameState({ board: newBoard, playerPos: targetPos });

    // Trigger AI turn slightly delayed for UX
    setTimeout(() => executeAITurn(newBoard, targetPos), 300);
  };

  const executeAITurn = (currentBoard, playerPos) => {
    const aiMove = calculateBestEnemyMove(currentBoard, playerPos);
    if (aiMove) {
      let newBoard = [...currentBoard.map(row => [...row])];
      const piece = newBoard[aiMove.from.y][aiMove.from.x];
      newBoard[aiMove.from.y][aiMove.from.x] = null;
      newBoard[aiMove.to.y][aiMove.to.x] = piece;

      if (aiMove.to.x === playerPos.x && aiMove.to.y === playerPos.y) {
        setGameOver(true);
      } else {
        setGameState({ board: newBoard, playerPos });
      }
    }
  };

  const resetGame = () => {
    exportGameData(metrics);
    setLevel(1);
    setTrinkets([]);
    setMetrics({ moves: 0, captures: 0 });
    setGameOver(false);
    setGameState(generateLevel(1, Math.random().toString(36).substring(7)));
  };

  return (
    <div className="container">
      <h1>Level: {level}</h1>
      <div className="board">
        {gameState.board.map((row, y) => (
          row.map((piece, x) => (
            <div 
              key={`${x}-${y}`} 
              className={`tile ${(x + y) % 2 === 0 ? 'light' : 'dark'}`}
              onClick={() => handleTileClick(x, y)}
            >
              {piece && (
                <div 
                  className={`piece ${piece.isPlayer ? 'player' : 'enemy'}`}
                  onClick={(e) => {
                    if (piece.isPlayer) {
                      e.stopPropagation();
                      handlePlayerClick();
                    }
                  }}
                >
                  {piece.type}
                </div>
              )}
            </div>
          ))
        ))}
      </div>
      
      {gameOver && (
        <div className="modal">
          <h2>Game Over</h2>
          <p>You reached level {level}</p>
          <button onClick={resetGame}>Try Again</button>
          <button onClick={() => window.location.href = 'https://github.com/yourprofile'}>Quit to Portfolio</button>
        </div>
      )}
    </div>
  );
}