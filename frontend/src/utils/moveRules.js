/**
 * Bộ quy tắc kiểm tra và tính toán nước đi hợp lệ cho Cờ Tướng (Xiangqi Move Rules)
 */

const PALACE = {
  RED: { minX: 3, maxX: 5, minY: 0, maxY: 2 },
  BLACK: { minX: 3, maxX: 5, minY: 7, maxY: 9 },
};

function inPalace(x, y, side) {
  const p = PALACE[side];
  return x >= p.minX && x <= p.maxX && y >= p.minY && y <= p.maxY;
}

function getPieceAt(pieces, x, y) {
  return pieces.find((p) => p.x === x && p.y === y) || null;
}

function countPiecesBetween(pieces, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;

  if (dx !== 0 && dy !== 0) return -1;

  let count = 0;
  if (dx === 0) {
    const step = dy > 0 ? 1 : -1;
    let currY = y1 + step;
    while (currY !== y2) {
      if (getPieceAt(pieces, x1, currY)) count++;
      currY += step;
    }
  } else {
    const step = dx > 0 ? 1 : -1;
    let currX = x1 + step;
    while (currX !== x2) {
      if (getPieceAt(pieces, currX, y1)) count++;
      currX += step;
    }
  }
  return count;
}

function areKingsFacingEachOther(pieces) {
  const redKing = pieces.find((p) => p.type === 'KING' && p.side === 'RED');
  const blackKing = pieces.find((p) => p.type === 'KING' && p.side === 'BLACK');

  if (!redKing || !blackKing) return false;

  if (redKing.x === blackKing.x) {
    return countPiecesBetween(pieces, redKing.x, redKing.y, blackKing.x, blackKing.y) === 0;
  }
  return false;
}

function isKingInCheck(pieces, side) {
  const king = pieces.find((p) => p.type === 'KING' && p.side === side);
  if (!king) return false;

  const opponentSide = side === 'RED' ? 'BLACK' : 'RED';
  const opponentPieces = pieces.filter((p) => p.side === opponentSide);

  for (const enemy of opponentPieces) {
    if (isPseudoLegal(enemy, king.x, king.y, pieces)) {
      return true;
    }
  }
  return false;
}

function isPseudoLegal(mover, toX, toY, pieces) {
  if (toX < 0 || toX > 8 || toY < 0 || toY > 9) return false;
  if (mover.x === toX && mover.y === toY) return false;

  const target = getPieceAt(pieces, toX, toY);
  if (target && target.side === mover.side) return false;

  const dx = toX - mover.x;
  const dy = toY - mover.y;
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);

  switch (mover.type) {
    case 'KING':
      if (!inPalace(toX, toY, mover.side)) return false;
      return absDx + absDy === 1;

    case 'ADVISOR':
      if (!inPalace(toX, toY, mover.side)) return false;
      return absDx === 1 && absDy === 1;

    case 'BISHOP':
      if (mover.side === 'RED' && toY > 4) return false;
      if (mover.side === 'BLACK' && toY < 5) return false;
      if (absDx !== 2 || absDy !== 2) return false;
      return !getPieceAt(pieces, mover.x + dx / 2, mover.y + dy / 2);

    case 'KNIGHT':
      if (!((absDx === 1 && absDy === 2) || (absDx === 2 && absDy === 1))) return false;
      if (absDy === 2) {
        return !getPieceAt(pieces, mover.x, mover.y + dy / 2);
      }
      return !getPieceAt(pieces, mover.x + dx / 2, mover.y);

    case 'ROOK':
      if (dx !== 0 && dy !== 0) return false;
      return countPiecesBetween(pieces, mover.x, mover.y, toX, toY) === 0;

    case 'CANNON':
      if (dx !== 0 && dy !== 0) return false;
      const between = countPiecesBetween(pieces, mover.x, mover.y, toX, toY);
      return target ? between === 1 : between === 0;

    case 'PAWN':
      if (mover.side === 'RED') {
        if (mover.y <= 4) return dx === 0 && dy === 1;
        return (dx === 0 && dy === 1) || (absDx === 1 && dy === 0);
      }
      if (mover.y >= 5) return dx === 0 && dy === -1;
      return (dx === 0 && dy === -1) || (absDx === 1 && dy === 0);

    default:
      return false;
  }
}

/**
 * Tính toán toàn bộ các nước đi hợp lệ cho quân cờ đang chọn.
 */
export function getLegalMoves(mover, pieces) {
  if (!mover || !pieces) return [];

  const legalMoves = [];

  for (let x = 0; x <= 8; x++) {
    for (let y = 0; y <= 9; y++) {
      if (!isPseudoLegal(mover, x, y, pieces)) continue;

      // Giả lập nước đi để kiểm tra an toàn Tướng
      const simulatedPieces = pieces
        .filter((p) => !(p.x === x && p.y === y))
        .map((p) => (p.id === mover.id ? { ...p, x, y } : p));

      if (areKingsFacingEachOther(simulatedPieces)) continue;
      if (isKingInCheck(simulatedPieces, mover.side)) continue;

      const targetPiece = getPieceAt(pieces, x, y);
      legalMoves.push({
        x,
        y,
        visualRow: 9 - y,
        type: targetPiece ? 'CAPTURE' : 'EMPTY',
        capturedPiece: targetPiece,
      });
    }
  }

  return legalMoves;
}
