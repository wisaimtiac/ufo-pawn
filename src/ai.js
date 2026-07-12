export function calculateBestEnemyMove(board, playerPos) {
  let enemies = getEnemyPositions(board);
  
  // 1. SOFORTIGER SIEG: Prüfen, ob eine Figur den Spieler direkt schlagen kann
  for (let enemy of enemies) {
    const legalMoves = getLegalMoves(enemy, board);
    for (let move of legalMoves) {
      if (move.x === playerPos.x && move.y === playerPos.y) {
        return { from: enemy, to: move };
      }
    }
  }

  // 2. Alle Gegner sammeln, die überhaupt einen gültigen Zug machen können
  let validEnemies = [];
  let enemyMovesMap = new Map();

  for (let enemy of enemies) {
    const legalMoves = getLegalMoves(enemy, board);
    if (legalMoves.length > 0) {
      validEnemies.push(enemy);
      enemyMovesMap.set(enemy.id, legalMoves);
    }
  }

  // Falls sich kein Gegner bewegen kann
  if (validEnemies.length === 0) return null;

  // 3. EINE zufällige Figur für diesen Zug auswählen
  const randomEnemy = validEnemies[Math.floor(Math.random() * validEnemies.length)];
  const legalMoves = enemyMovesMap.get(randomEnemy.id);

  // 4. Jagen: Distanz zum Spieler MINIMIEREN
  let bestMove = null;
  let minDistance = Infinity;
  for (let move of legalMoves) {
    const dist = Math.max(Math.abs(move.x - playerPos.x), Math.abs(move.y - playerPos.y));
    if (dist < minDistance) {
      minDistance = dist;
      bestMove = { from: randomEnemy, to: move };
    }
  }

  return bestMove;
}

function getEnemyPositions(board) {
  let positions = [];
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      // WICHTIG: Überspringe den Spieler UND den feindlichen König ('♚')
      if (board[y][x] && !board[y][x].isPlayer && board[y][x].type !== '♚') {
        positions.push({ x, y, piece: board[y][x], id: board[y][x].id });
      }
    }
  }
  return positions;
}

export function getLegalMoves(pos, board, playerMoveOverride = null) {
  const piece = board[pos.y][pos.x];
  if (!piece) return [];
  
  const moves = [];
  
  const checkAndAdd = (x, y) => {
    if (x >= 0 && x < 8 && y >= 0 && y < 8) {
      const target = board[y][x];
      if (target === null || target.isPlayer !== piece.isPlayer) {
        moves.push({ x, y });
        return target === null;
      }
    }
    return false;
  };

  const slide = (directions) => {
    for (let [dx, dy] of directions) {
      for (let i = 1; i < 8; i++) {
        if (!checkAndAdd(pos.x + (dx * i), pos.y + (dy * i))) break;
      }
    }
  };

  const straights = [[0, 1], [1, 0], [0, -1], [-1, 0]];
  const diagonals = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
  const knightJumps = [[1, 2], [2, 1], [-1, 2], [-2, 1], [1, -2], [2, -1], [-1, -2], [-2, -1]];

  const moveType = (piece.isPlayer && playerMoveOverride) ? playerMoveOverride : piece.type;

  switch (moveType) {
    case '♜': slide(straights); break;
    case '♝': slide(diagonals); break;
    case '♛': slide(straights); slide(diagonals); break;
    case '♚': [...straights, ...diagonals].forEach(([dx, dy]) => checkAndAdd(pos.x + dx, pos.y + dy)); break;
    case '♞': knightJumps.forEach(([dx, dy]) => checkAndAdd(pos.x + dx, pos.y + dy)); break;
    case '♟':
      const dy = piece.isPlayer ? -1 : 1;
      if (pos.y + dy >= 0 && pos.y + dy < 8) {
        if (board[pos.y + dy][pos.x] === null) {
          moves.push({ x: pos.x, y: pos.y + dy });
        }
      }
      [-1, 1].forEach(dx => {
        const nx = pos.x + dx;
        const ny = pos.y + dy;
        if (nx >= 0 && nx < 8 && ny >= 0 && ny < 8) {
          const target = board[ny][nx];
          if (target !== null && target.isPlayer !== piece.isPlayer) {
            moves.push({ x: nx, y: ny });
          }
        }
      });
      break;
  }
  return moves;
}