export const INITIAL_FEN = 'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w - - 0 1';

export const PIECE_MAP = {
  K: { name: 'Soái', symbol: '帥', side: 'RED', type: 'KING' },
  A: { name: 'Sĩ', symbol: '仕', side: 'RED', type: 'ADVISOR' },
  B: { name: 'Tượng', symbol: '相', side: 'RED', type: 'BISHOP' },
  N: { name: 'Mã', symbol: '傌', side: 'RED', type: 'KNIGHT' },
  R: { name: 'Xe', symbol: '俥', side: 'RED', type: 'ROOK' },
  C: { name: 'Pháo', symbol: '炮', side: 'RED', type: 'CANNON' },
  P: { name: 'Binh', symbol: '兵', side: 'RED', type: 'PAWN' },

  k: { name: 'Tướng', symbol: '將', side: 'BLACK', type: 'KING' },
  a: { name: 'Sĩ', symbol: '士', side: 'BLACK', type: 'ADVISOR' },
  b: { name: 'Tượng', symbol: '象', side: 'BLACK', type: 'BISHOP' },
  n: { name: 'Mã', symbol: '馬', side: 'BLACK', type: 'KNIGHT' },
  r: { name: 'Xe', symbol: '車', side: 'BLACK', type: 'ROOK' },
  c: { name: 'Pháo', symbol: '砲', side: 'BLACK', type: 'CANNON' },
  p: { name: 'Tốt', symbol: '卒', side: 'BLACK', type: 'PAWN' },
};

/**
 * Chuyển đổi chuỗi FEN cờ tướng thành danh sách các quân cờ kèm tọa độ.
 */
export function parseFEN(fen = INITIAL_FEN) {
  if (!fen || typeof fen !== 'string') return [];

  const parts = fen.trim().split(/\s+/);
  const ranks = parts[0].split('/');

  if (ranks.length !== 10) return [];

  const pieces = [];

  for (let visualRow = 0; visualRow < 10; visualRow++) {
    const rankY = 9 - visualRow;
    const rankStr = ranks[visualRow];
    let fileX = 0;

    for (const char of rankStr) {
      if (char >= '1' && char <= '9') {
        fileX += parseInt(char, 10);
      } else if (PIECE_MAP[char]) {
        const meta = PIECE_MAP[char];
        pieces.push({
          id: `${char}_${fileX}_${rankY}`,
          char,
          symbol: meta.symbol,
          name: meta.name,
          side: meta.side,
          type: meta.type,
          x: fileX,
          y: rankY,
          visualRow,
        });
        fileX++;
      } else {
        fileX++;
      }
    }
  }

  return pieces;
}
