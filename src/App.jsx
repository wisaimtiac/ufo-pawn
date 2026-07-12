import React, { useState } from 'react';
import { generateLevel } from './engine';
import { calculateBestEnemyMove, getLegalMoves } from './ai';
import { exportGameData, validateMove } from './utils';
import './App.css';

// Generiert exakt 16 zufällige Zeichen (Zahlen und Buchstaben)
const generateSeed = () => [...Array(16)].map(() => Math.floor(Math.random() * 36).toString(36)).join('');

export default function App() {
  const [level, setLevel] = useState(1);
  const [seed, setSeed] = useState(generateSeed);
  const [seedInput, setSeedInput] = useState('');
  const [gameState, setGameState] = useState(generateLevel(1, seed));
  const [trinkets, setTrinkets] = useState({}); 
  const [activeMoveMode, setActiveMoveMode] = useState(null); 
  const [metrics, setMetrics] = useState({ moves: 0, captures: 0 });
  const [gameOver, setGameOver] = useState(false);

  const handleTileClick = (x, y) => {
    if (gameOver) return;

    const proposedMove = { x, y };
    const currentMoveMode = activeMoveMode || '♚';
    const legalMoves = getLegalMoves(gameState.playerPos, gameState.board, currentMoveMode);

    if (validateMove(proposedMove, legalMoves)) {
      executePlayerMove(proposedMove);
    }
  };

  const executePlayerMove = (targetPos) => {
    let newBoard = [...gameState.board.map(row => [...row])];
    const targetPiece = newBoard[targetPos.y][targetPos.x];
    
    if (targetPiece && targetPiece.id === 'enemy_king') {
      setLevel(l => l + 1);
      setGameState(generateLevel(level + 1, seed));
      return;
    }

    let nextTrinkets = { ...trinkets };

    if (activeMoveMode) {
      nextTrinkets[activeMoveMode] -= 1;
      if (nextTrinkets[activeMoveMode] <= 0) {
        delete nextTrinkets[activeMoveMode];
        setActiveMoveMode(null); 
      }
    }

    if (targetPiece && !targetPiece.isPlayer && !['♟', '♚'].includes(targetPiece.type)) {
      nextTrinkets[targetPiece.type] = Math.min((nextTrinkets[targetPiece.type] || 0) + 3, 3);
      setMetrics(m => ({ ...m, captures: m.captures + 1 }));
    }

    setTrinkets(nextTrinkets);

    newBoard[gameState.playerPos.y][gameState.playerPos.x] = null;
    newBoard[targetPos.y][targetPos.x] = { type: '🛸', isPlayer: true };
    setMetrics(m => ({ ...m, moves: m.moves + 1 }));
    
    setGameState({ board: newBoard, playerPos: targetPos });
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
    exportGameData(metrics, seed);
    const newSeed = generateSeed();
    setLevel(1);
    setSeed(newSeed);
    setTrinkets({});
    setActiveMoveMode(null);
    setMetrics({ moves: 0, captures: 0 });
    setGameOver(false);
    setGameState(generateLevel(1, newSeed));
  };

  const playCustomSeed = () => {
    if (!seedInput.trim()) return;
    const newSeed = seedInput.trim();
    setLevel(1);
    setSeed(newSeed);
    setTrinkets({});
    setActiveMoveMode(null);
    setMetrics({ moves: 0, captures: 0 });
    setGameOver(false);
    setGameState(generateLevel(1, newSeed));
    setSeedInput('');
  };

  return (
    <div className="container">
      <h1> 🛸 UFO Pawn Level: {level} 🛸 </h1>
      <div className="board">
        {gameState.board.map((row, y) => (
          row.map((piece, x) => (
            <div 
              key={`${x}-${y}`} 
              className={`tile ${(x + y) % 2 === 0 ? 'light' : 'dark'}`}
              onClick={() => handleTileClick(x, y)}
            >
              {piece && <div className={`piece ${piece.isPlayer ? 'player' : 'enemy'}`}>{piece.type}</div>}
            </div>
          ))
        ))}
      </div>
      
      <div className="hud">
        <div 
          className={`trinket ${activeMoveMode === null ? 'active' : ''}`}
          onClick={() => setActiveMoveMode(null)}
        >
          <div>♚ Base</div>
          <div className="dots-grid">
            <div className="dot infinite">∞</div>
          </div>
        </div>
        {Object.entries(trinkets).map(([type, moves]) => (
          <div 
            key={type}
            className={`trinket ${activeMoveMode === type ? 'active' : ''}`}
            onClick={() => setActiveMoveMode(type)}
          >
            <div>{type}</div>
            <div className="dots-grid">
              {Array.from({ length: moves }).map((_, i) => (
                <div key={i} className="dot" />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="rules">
        <h3>How to Play</h3>
        <ul>
          <li><strong>Goal:</strong> Capture the enemy King ♚ to advance to the next level.</li>
          <li><strong>Base Move:</strong> Click on a tile to move. A base move is 1 tile in any direction.</li>
          <li><strong>Trinkets:</strong> Capture enemies to steal their movement type. Max 3 moves per piece. Select them in the HUD. Capturing the king gives you the trinket move back.</li>
          <li><strong>Survival:</strong> Don't get captured! The enemy actively hunts you down.</li>
		  <li><strong>Scoring:</strong> The txt-file will contain the number of moves, pieces captured and a seed.</li>
		  <li><strong>Seed:</strong> Type the seed into the text box below to try a rerun of exactly those levels.</li>
        </ul>
      </div>

      <div className="seed-controls">
        <input 
          type="text" 
          placeholder="Enter seed to retry..." 
          value={seedInput}
          onChange={(e) => setSeedInput(e.target.value)}
        />
        <button onClick={playCustomSeed}>Go</button>
      </div>

      {gameOver && (
        <div className="modal">
          <h2>Game Over</h2>
          <p>Level erreicht: {level}</p>
          <button onClick={resetGame}>Generate TXT & Try Again</button>
        </div>
      )}
    </div>
  );
}