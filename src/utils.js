// Seeded Random Number Generator (Mulberry32) for reproducible levels
export function seededRandom(seed) {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

// Validates if a proposed move exists in the legal moves array
export function validateMove(proposedMove, legalMoves) {
  return legalMoves.some(move => move.x === proposedMove.x && move.y === proposedMove.y);
}

// Export: Generates time stamped TXT of player metrics and seed of that run
export const exportGameData = (metrics, seed) => {
  const now = new Date();
  const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}`;

  const textContent = `Chess Game Metrics\n------------------\nSeed: ${seed}\nMoves: ${metrics.moves}\nCaptures: ${metrics.captures}\n`;
  
  const blob = new Blob([textContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `starry_pawn_${timestamp}.txt`; 
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};