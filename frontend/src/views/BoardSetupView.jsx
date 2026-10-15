import React, { useState } from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import XiangqiBoard from '../components/board/XiangqiBoard';
import { parseFEN, INITIAL_FEN } from '../utils/fenUtils';

export default function BoardSetupView({ onNavigateToLobby }) {
  const [pieces, setPieces] = useState(() => parseFEN(INITIAL_FEN));
  const [selectedPieceId, setSelectedPieceId] = useState(null);


  const handlePieceClick = (piece) => {
    setSelectedPieceId((prevId) => (prevId === piece.id ? null : piece.id));
  };

  const handleResetBoard = () => {
    setPieces(parseFEN(INITIAL_FEN));
    setSelectedPieceId(null);
  };

  return (
    <div className="min-h-screen bg-wood-950 text-parchment-200 flex flex-col justify-between selection:bg-gold-400 selection:text-on-gold">
      {/* Top Header */}
      <header className="border-b border-wood-700 bg-wood-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateToLobby}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-wood-800 hover:bg-wood-700 border border-wood-500 text-xs font-headline font-bold text-gold-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay Lại Sảnh</span>
            </button>
            <div className="h-4 w-px bg-wood-500" />
            <h1 className="font-headline text-lg font-bold text-gold-300">
              Xếp Cờ
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetBoard}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-wood-800 hover:bg-wood-700 border border-wood-500 text-xs font-headline text-parchment-200 hover:text-gold-300 transition-colors"
              title="Đặt lại thế cờ ban đầu"
            >
              <RotateCcw className="w-3.5 h-3.5 text-gold-400" />
              <span className="hidden sm:inline">Dàn Trận Ban Đầu</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Board Content */}
      <main className="max-w-5xl mx-auto px-4 py-6 flex-1 w-full flex flex-col items-center">
        {/* Khung bàn cờ */}
        <div className="w-full flex justify-center mb-6">
          <XiangqiBoard
            pieces={pieces}
            selectedPieceId={selectedPieceId}
            onPieceClick={handlePieceClick}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-wood-700 py-3 text-center text-xs text-parchment-400 font-headline">
        <p>Kỳ Vương © 2026 • Đỉnh Cao Cờ Tướng Hoàng Gia Đông Á</p>
      </footer>
    </div>
  );
}
