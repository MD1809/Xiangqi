import React from 'react';
import { PIECE_MAP } from '../../utils/fenUtils';

/**
 * PieceRenderer Component
 * Render quân cờ tướng bằng đồ họa vector SVG hoàng triều.
 */
export default function PieceRenderer({
  piece,
  isSelected = false,
  isLastMove = false,
  onClick,
  className = '',
}) {
  if (!piece) return null;

  let char = typeof piece === 'string' ? piece : piece.char;
  let symbol = typeof piece === 'object' && piece.symbol ? piece.symbol : null;
  let side = typeof piece === 'object' && piece.side ? piece.side : null;

  if (!symbol || !side) {
    const meta = PIECE_MAP[char];
    if (meta) {
      symbol = meta.symbol;
      side = meta.side;
    } else {
      symbol = char;
      side = char === char.toUpperCase() ? 'RED' : 'BLACK';
    }
  }

  const isRed = side === 'RED';
  const pieceId = `piece-${char}`;

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`${isRed ? 'Phe Đỏ' : 'Phe Đen'} - ${symbol}`}
      className={`relative w-full h-full cursor-pointer select-none transition-transform duration-200 ease-out flex items-center justify-center ${
        isSelected
          ? 'scale-110 -translate-y-1 z-30 drop-shadow-[0_12px_20px_rgba(242,202,80,0.6)]'
          : 'hover:scale-105 active:scale-95'
      } ${className}`}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full block filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.65)]"
      >
        {/* SVG Gradients */}
        <defs>
          <radialGradient
            id={`${pieceId}-red-surface`}
            cx="38%"
            cy="32%"
            r="68%"
            fx="35%"
            fy="30%"
          >
            <stop offset="0%" stopColor="var(--piece-red-bg-top)" />
            <stop offset="65%" stopColor="var(--piece-red-bg-mid)" />
            <stop offset="100%" stopColor="var(--piece-red-bg-bottom)" />
          </radialGradient>

          <radialGradient
            id={`${pieceId}-black-surface`}
            cx="38%"
            cy="32%"
            r="68%"
            fx="35%"
            fy="30%"
          >
            <stop offset="0%" stopColor="var(--piece-black-bg-top)" />
            <stop offset="65%" stopColor="var(--piece-black-bg-mid)" />
            <stop offset="100%" stopColor="var(--piece-black-bg-bottom)" />
          </radialGradient>

          <linearGradient id={`${pieceId}-gold-rim`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFE088" />
            <stop offset="45%" stopColor="var(--piece-red-border-gold)" />
            <stop offset="100%" stopColor="#735C00" />
          </linearGradient>

          <linearGradient id={`${pieceId}-jade-rim`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9DDCBB" />
            <stop offset="45%" stopColor="var(--piece-black-border-jade)" />
            <stop offset="100%" stopColor="#1B4332" />
          </linearGradient>
        </defs>

        {/* Khối thân quân cờ */}
        <circle cx="50" cy="52" r="46" fill="rgba(0, 0, 0, 0.4)" />
        <circle
          cx="50"
          cy="50"
          r="45.5"
          fill={isRed ? `url(#${pieceId}-red-surface)` : `url(#${pieceId}-black-surface)`}
          stroke={isRed ? `url(#${pieceId}-gold-rim)` : `url(#${pieceId}-jade-rim)`}
          strokeWidth="2.8"
        />

        {/* Viền nẹp trang trí */}
        <circle
          cx="50"
          cy="50"
          r="38"
          fill="none"
          stroke={isRed ? 'var(--piece-red-ring-gold)' : 'var(--piece-black-ring-jade)'}
          strokeWidth="1.2"
          strokeOpacity="0.8"
        />
        <circle
          cx="50"
          cy="50"
          r="36.5"
          fill="none"
          stroke={isRed ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.6)'}
          strokeWidth="0.8"
        />
        <ellipse
          cx="50"
          cy="23"
          rx="25"
          ry="11"
          fill="white"
          opacity={isRed ? '0.07' : '0.05'}
        />

        {/* Chữ Hán thư pháp */}
        <text
          x="50"
          y="52.5"
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="'Noto Serif', 'Noto Serif SC', serif"
          fontWeight="900"
          fontSize="46"
          fill="rgba(0, 0, 0, 0.75)"
        >
          {symbol}
        </text>
        <text
          x="50"
          y="51"
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="'Noto Serif', 'Noto Serif SC', serif"
          fontWeight="900"
          fontSize="46"
          fill={isRed ? 'var(--piece-red-text)' : 'var(--piece-black-text)'}
          filter={
            isSelected
              ? isRed
                ? 'drop-shadow(0 0 6px var(--piece-red-glow))'
                : 'drop-shadow(0 0 6px var(--piece-black-glow))'
              : undefined
          }
        >
          {symbol}
        </text>

        {/* Hiệu ứng trạng thái */}
        {isSelected && (
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke="var(--piece-red-ring-gold)"
            strokeWidth="2.5"
            strokeDasharray="4 2"
            className="animate-spin"
            style={{ transformOrigin: '50px 50px', animationDuration: '8s' }}
          />
        )}
        {isLastMove && !isSelected && (
          <circle
            cx="50"
            cy="82"
            r="3"
            fill={isRed ? 'var(--piece-red-ring-gold)' : 'var(--piece-black-ring-jade)'}
          />
        )}
      </svg>
    </div>
  );
}
