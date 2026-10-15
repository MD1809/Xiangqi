import React, { Fragment } from 'react';
import PieceRenderer from './PieceRenderer';

const GRID_COLOR = 'var(--board-grid, #735C00)';

export default function XiangqiBoard({
  pieces = [],
  selectedPieceId = null,
  lastMovePieceId = null,
  onPieceClick,
  children,
  className = '',
}) {
  const topCoordinates = ['九', '八', '七', '六', '五', '四', '三', '二', '一'];
  const bottomCoordinates = ['一', '二', '三', '四', '五', '六', '七', '八', '九'];

  // Vị trí hoa văn chữ thập góc định vị (Pháo và Binh/Tốt)
  const positionMarks = [
    { x: 100, y: 200, left: true, right: true },
    { x: 700, y: 200, left: true, right: true },
    { x: 0, y: 300, left: false, right: true },
    { x: 200, y: 300, left: true, right: true },
    { x: 400, y: 300, left: true, right: true },
    { x: 600, y: 300, left: true, right: true },
    { x: 800, y: 300, left: true, right: false },
    { x: 100, y: 700, left: true, right: true },
    { x: 700, y: 700, left: true, right: true },
    { x: 0, y: 600, left: false, right: true },
    { x: 200, y: 600, left: true, right: true },
    { x: 400, y: 600, left: true, right: true },
    { x: 600, y: 600, left: true, right: true },
    { x: 800, y: 600, left: true, right: false },
  ];

  /**
   * Vẽ hoa văn góc chữ L quanh một giao điểm định vị.
   */
  const renderCornerMark = ({ x, y, left, right }, index) => {
    const d = 5;
    const len = 10;
    const paths = [];

    if (left) {
      paths.push(`M ${x - d - len} ${y - d} L ${x - d} ${y - d} L ${x - d} ${y - d - len}`);
      paths.push(`M ${x - d - len} ${y + d} L ${x - d} ${y + d} L ${x - d} ${y + d + len}`);
    }

    if (right) {
      paths.push(`M ${x + d + len} ${y - d} L ${x + d} ${y - d} L ${x + d} ${y - d - len}`);
      paths.push(`M ${x + d + len} ${y + d} L ${x + d} ${y + d} L ${x + d} ${y + d + len}`);
    }

    return (
      <g key={`corner-mark-${index}`} stroke={GRID_COLOR} strokeWidth="1.6" fill="none">
        {paths.map((dStr, pIdx) => (
          <path key={pIdx} d={dStr} />
        ))}
      </g>
    );
  };

  return (
    <div className={`w-full max-w-[650px] mx-auto select-none ${className}`}>
      <div className="w-full bg-gradient-to-b from-board-frame via-wood-950 to-wood-950 p-3 sm:p-5 rounded-2xl border-4 border-board-frame-border relative shadow-[0_20px_50px_rgba(0,0,0,0.85)]">

        {/* Nẹp góc đồng cổ */}
        <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-gold-400 pointer-events-none" />
        <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-gold-400 pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-gold-400 pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-gold-400 pointer-events-none" />

        <div
          className="relative w-full rounded-lg shadow-inner overflow-hidden border border-gold-600/70"
          style={{
            backgroundColor: 'var(--board-surface, #EED09D)',
            backgroundImage: `
              radial-gradient(#D6B379 1px, transparent 1px),
              linear-gradient(135deg, #EED2A4 0%, #DFBF88 50%, #D4B279 100%)
            `,
          }}
        >
          {/* Thủy ấn chữ "Kỳ" */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <span className="font-headline text-[130px] sm:text-[160px] font-black text-board-watermark">
              棋
            </span>
          </div>

          <svg
            className="w-full h-auto block pointer-events-none"
            viewBox="-50 -55 900 1010"
          >
            {topCoordinates.map((char, idx) => (
              <text
                key={`top-coord-${idx}`}
                x={idx * 100}
                y="-26"
                textAnchor="middle"
                dominantBaseline="central"
                fill={GRID_COLOR}
                fontFamily="'Noto Serif', serif"
                fontWeight="700"
                fontSize="22"
              >
                {char}
              </text>
            ))}

            <rect x="-8" y="-8" width="816" height="916" fill="none" stroke={GRID_COLOR} strokeWidth="1.5" />
            <rect x="0" y="0" width="800" height="900" fill="none" stroke={GRID_COLOR} strokeWidth="3" />

            {[0, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((y) => (
              <line key={`h-line-${y}`} x1="0" y1={y} x2="800" y2={y} stroke={GRID_COLOR} strokeWidth="1.6" />
            ))}

            <line x1="0" y1="0" x2="0" y2="900" stroke={GRID_COLOR} strokeWidth="1.6" />
            <line x1="800" y1="0" x2="800" y2="900" stroke={GRID_COLOR} strokeWidth="1.6" />
            {[100, 200, 300, 400, 500, 600, 700].map((x) => (
              <Fragment key={`v-line-${x}`}>
                <line x1={x} y1="0" x2={x} y2="400" stroke={GRID_COLOR} strokeWidth="1.6" />
                <line x1={x} y1="500" x2={x} y2="900" stroke={GRID_COLOR} strokeWidth="1.6" />
              </Fragment>
            ))}

            <line x1="300" y1="0" x2="500" y2="200" stroke={GRID_COLOR} strokeWidth="1.6" />
            <line x1="500" y1="0" x2="300" y2="200" stroke={GRID_COLOR} strokeWidth="1.6" />
            <line x1="300" y1="700" x2="500" y2="900" stroke={GRID_COLOR} strokeWidth="1.6" />
            <line x1="500" y1="700" x2="300" y2="900" stroke={GRID_COLOR} strokeWidth="1.6" />

            {positionMarks.map(renderCornerMark)}

            <text
              x="200"
              y="450"
              textAnchor="middle"
              dominantBaseline="central"
              fill={GRID_COLOR}
              fillOpacity="0.85"
              fontFamily="'Noto Serif', serif"
              fontWeight="900"
              fontSize="30"
              letterSpacing="12"
            >
              楚河
            </text>
            <text
              x="400"
              y="450"
              textAnchor="middle"
              dominantBaseline="central"
              fill={GRID_COLOR}
              fillOpacity="0.6"
              fontFamily="'Noto Serif', serif"
              fontStyle="italic"
              fontSize="12"
              letterSpacing="3"
            >
              — SỞ HÀ • HÁN GIỚI —
            </text>
            <text
              x="600"
              y="450"
              textAnchor="middle"
              dominantBaseline="central"
              fill={GRID_COLOR}
              fillOpacity="0.85"
              fontFamily="'Noto Serif', serif"
              fontWeight="900"
              fontSize="30"
              letterSpacing="12"
            >
              漢界
            </text>

            {bottomCoordinates.map((char, idx) => (
              <text
                key={`bottom-coord-${idx}`}
                x={idx * 100}
                y="936"
                textAnchor="middle"
                dominantBaseline="central"
                fill={GRID_COLOR}
                fontFamily="'Noto Serif', serif"
                fontWeight="700"
                fontSize="22"
              >
                {char}
              </text>
            ))}
          </svg>

          {/* Lớp chứa quân cờ tương tác */}
          <div
            className="absolute pointer-events-auto z-20"
            style={{
              left: `${(50 / 900) * 100}%`,
              top: `${(55 / 1010) * 100}%`,
              width: `${(800 / 900) * 100}%`,
              height: `${(900 / 1010) * 100}%`,
            }}
          >
            {pieces.map((piece) => (
              <div
                key={piece.id || `${piece.char}_${piece.x}_${piece.visualRow}`}
                className="absolute"
                style={{
                  left: `${(piece.x / 8) * 100}%`,
                  top: `${(piece.visualRow / 9) * 100}%`,
                  width: '10.8%',
                  aspectRatio: '1 / 1',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <PieceRenderer
                  piece={piece}
                  isSelected={selectedPieceId === piece.id}
                  isLastMove={lastMovePieceId === piece.id}
                  onClick={() => onPieceClick && onPieceClick(piece)}
                />
              </div>
            ))}
            {children}
          </div>
        </div>

      </div>
    </div>
  );
}
