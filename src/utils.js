// Seeded Random Number Generator (Mulberry32) for reproducible levels
export function seededRandom(seed) {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

// Client-Side Anti-Cheat: Validates if a proposed move exists in the legal moves array
export function validateMove(proposedMove, legalMoves) {
  return legalMoves.some(move => move.x === proposedMove.x && move.y === proposedMove.y);
}

// Data Science Export: Generates JSON of player metrics
export function exportGameData(metrics) {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(metrics));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", "chess_metrics.json");
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}