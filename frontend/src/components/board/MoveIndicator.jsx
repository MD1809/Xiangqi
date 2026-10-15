import React from 'react';

/**
 * MoveIndicator Component
 * Hiển thị chỉ dẫn nước đi hợp lệ: chấm ngọc bích ô trống hoặc vòng ngắm ăn quân.
 */
export default function MoveIndicator({ target, onClick }) {
  if (!target) return null;

  const isCapture = target.type === 'CAPTURE';

  if (isCapture) {
    return (
      <div
        onClick={onClick}
        role="button"
        tabIndex={0}
        className="absolute cursor-pointer flex items-center justify-center pointer-events-auto z-30 group"
        style={{
          left: `${(target.x / 8) * 100}%`,
          top: `${(target.visualRow / 9) * 100}%`,
          transform: 'translate(-50%, -50%)',
          width: '10.8%',
          aspectRatio: '1 / 1',
        }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full block filter drop-shadow-[0_0_10px_rgba(187,62,3,0.85)] group-hover:scale-105 transition-transform pointer-events-none"
        >
          {/* Vòng quay quanh quân cờ có thể ăn màu đỏ sát khí */}
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke="var(--indicator-capture-ring, #FF8A80)"
            strokeWidth="2.5"
            strokeDasharray="4 2"
            className="animate-spin"
            style={{ transformOrigin: '50px 50px', animationDuration: '8s' }}
          />
          {/* Chấm tròn ở tâm màu đỏ báo hiệu có thể ăn */}
          <circle
            cx="50"
            cy="50"
            r="9"
            fill="var(--indicator-capture-dot, #BB3E03)"
            stroke="var(--indicator-capture-ring, #FF8A80)"
            strokeWidth="2"
          />
        </svg>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Đi tới cột ${target.x + 1}, hàng ${target.y}`}
      className="absolute cursor-pointer flex items-center justify-center pointer-events-auto z-30 group"
      style={{
        left: `${(target.x / 8) * 100}%`,
        top: `${(target.visualRow / 9) * 100}%`,
        transform: 'translate(-50%, -50%)',
        width: '8%',
        aspectRatio: '1 / 1',
      }}
    >
      {/* Chấm ngọc bích tĩnh */}
      <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-jade-400 border border-jade-200 shadow-[0_0_8px_rgba(82,183,136,0.9)] group-hover:scale-125 transition-transform" />
    </div>
  );
}
