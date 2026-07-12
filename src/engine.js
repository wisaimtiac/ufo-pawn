import { seededRandom } from './utils';

export const PIECES = { KING: '♚', QUEEN: '♛', ROOK: '♜', BISHOP: '♝', KNIGHT: '♞', PAWN: '♟', RAINBOW: '⭐' };

export function generateLevel(level, seedStr) {
  const rng = seededRandom(hashCode(seedStr + level.toString()));
  let board = Array(8).fill(null).map(() => Array(8).fill(null));
  
  // Place Rainbow Pawn (Player)
  const playerPos = { x: Math.floor(rng() * 8), y: Math.floor(rng() * 8) };
  board[playerPos.y][playerPos.x] = { type: PIECES.RAINBOW, isPlayer: true, id: 'player' };

  // Place Enemies (4 to 8)
  const numEnemies = Math.floor(rng() * 5) + 4;
  let enemiesPlaced = 0;
  const enemyTypes = [PIECES.QUEEN, PIECES.ROOK, PIECES.BISHOP, PIECES.KNIGHT, PIECES.PAWN];

  // Guarantee one King
  placePieceSafely(board, { type: PIECES.KING, isPlayer: false, id: 'enemy_king' }, playerPos, rng);

  while (enemiesPlaced < numEnemies - 1) {
    const type = enemyTypes[Math.floor(rng() * enemyTypes.length)];
    placePieceSafely(board, { type, isPlayer: false, id: `enemy_${enemiesPlaced}` }, playerPos, rng);
    enemiesPlaced++;
  }

  return { board, playerPos };
}

// Prevents enemies from spawning in immediate capture range of player
function placePieceSafely(board, piece, playerPos, rng) {
  let placed = false;
  while (!placed) {
    let x = Math.floor(rng() * 8);
    let y = Math.floor(rng() * 8);
    let distance = Math.max(Math.abs(x - playerPos.x), Math.abs(y - playerPos.y));
    
    if (board[y][x] === null && distance > 2) {
      board[y][x] = piece;
      placed = true;
    }
  }
}

function hashCode(str) {
  let hash = 0;
  for (let i = 0, len = str.length; i < len; i++) {
      let chr = str.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0;
  }
  return hash;
}