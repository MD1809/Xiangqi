import React, { useState, useEffect } from 'react';
import { ShieldCheck, Database, Server, RefreshCw, Sparkles, Swords, Crown, BookOpen } from 'lucide-react';

export default function App() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/health');
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      const data = await res.json();
      setHealth(data);
    } catch (err) {
      setError(err.message || 'Không thể kết nối đến Backend');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-gold-500 selection:text-wood-950">
      {/* Header Hoàng Cung */}
      <header className="border-b border-wood-800/80 bg-wood-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-cinnabar-600 flex items-center justify-center shadow-gold-glow border border-gold-300/40">
              <span className="font-headline font-bold text-wood-950 text-xl leading-none">帥</span>
            </div>
            <div>
              <h1 className="font-headline text-2xl font-bold tracking-wide gold-gradient-text">
                KỲ VƯƠNG
              </h1>
              <p className="text-xs text-parchment-400 font-serif tracking-widest uppercase">
                Đông Á Cổ Phong Kỳ Nghệ
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-xs font-mono">
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-wood-850 border border-gold-600/30">
              <span className="w-2 h-2 rounded-full bg-jade-400 animate-pulse"></span>
              <span className="text-parchment-300">Phase 1: Khởi Tạo Dự Án</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-12 flex-1 w-full flex flex-col items-center justify-center">
        {/* Banner Hero */}
        <div className="text-center mb-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-4 py-1 rounded-full bg-cinnabar-900/40 border border-cinnabar-600/40 text-cinnabar-400 text-xs mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Môi Trường Phát Triển Cục Bộ Sẵn Sàng (Task 1.1.1)</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-headline font-bold mb-4 tracking-tight">
            Nền Tảng Cờ Tướng Trực Tuyến
          </h2>
          <p className="text-parchment-300 text-sm md:text-base leading-relaxed">
            Hệ thống Spring Boot 3 &amp; Vite React đã được thiết lập thành công. Kết nối trực tiếp cơ sở dữ liệu MySQL cục bộ chuẩn bị cho Bộ máy luật cờ tướng thuần túy (Task 1.1.2).
          </p>
        </div>

        {/* Trạng Thái Hệ Thống Card */}
        <div className="w-full max-w-xl bg-wood-900/70 border border-wood-700/60 rounded-xl p-6 shadow-2xl backdrop-blur relative overflow-hidden chinese-corner border-gold-ornate">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-wood-800">
            <div className="flex items-center space-x-2.5">
              <Server className="w-5 h-5 text-gold-400" />
              <h3 className="font-headline font-semibold text-lg text-parchment-100">
                Kiểm Tra Kết Nối Hệ Thống
              </h3>
            </div>
            <button
              onClick={checkHealth}
              disabled={loading}
              className="px-3 py-1.5 rounded-md bg-wood-800 hover:bg-wood-700 border border-gold-600/40 text-xs text-gold-300 flex items-center space-x-1.5 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Làm mới</span>
            </button>
          </div>

          <div className="space-y-3 font-mono text-sm">
            {/* Backend Service Status */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-wood-950/70 border border-wood-800/80">
              <div className="flex items-center space-x-2.5">
                <ShieldCheck className="w-4 h-4 text-gold-400" />
                <span className="text-parchment-300 text-xs">Spring Boot Backend</span>
              </div>
              <span className={`px-2.5 py-0.5 rounded text-xs font-semibold ${
                health?.status === 'UP' ? 'bg-jade-800/60 text-jade-300 border border-jade-500/40' : 'bg-cinnabar-900/60 text-cinnabar-300 border border-cinnabar-500/40'
              }`}>
                {health?.status === 'UP' ? 'HOẠT ĐỘNG (UP: 8080)' : (loading ? 'Đang kiểm tra...' : 'MẤT KẾT NỐI')}
              </span>
            </div>

            {/* MySQL Database Status */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-wood-950/70 border border-wood-800/80">
              <div className="flex items-center space-x-2.5">
                <Database className="w-4 h-4 text-gold-400" />
                <span className="text-parchment-300 text-xs">Cơ sở dữ liệu MySQL (Port 3306)</span>
              </div>
              <span className={`px-2.5 py-0.5 rounded text-xs font-semibold ${
                health?.database === 'CONNECTED' ? 'bg-jade-800/60 text-jade-300 border border-jade-500/40' : 'bg-cinnabar-900/60 text-cinnabar-300 border border-cinnabar-500/40'
              }`}>
                {health?.database === 'CONNECTED' ? `ĐÃ KẾT NỐI (${health?.databaseProduct || 'MySQL'})` : (loading ? 'Đang kiểm tra...' : 'CHƯA KẾT NỐI')}
              </span>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-cinnabar-900/40 border border-cinnabar-600/60 text-xs text-cinnabar-300">
                Lỗi: {error}
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-wood-800/80 flex items-center justify-between text-xs text-parchment-400 font-serif">
            <span>Database: <strong className="text-gold-400">xiangqi_db</strong></span>
            <span>Frontend: <strong className="text-gold-400">Vite 5.4 + React 18</strong></span>
          </div>
        </div>

        {/* Định Hướng Các Bước Kế Tiếp */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 w-full max-w-xl">
          <div className="p-4 rounded-lg bg-wood-900/40 border border-wood-800/60 hover:border-gold-600/30 transition-colors">
            <Swords className="w-5 h-5 text-gold-400 mb-2" />
            <h4 className="font-headline text-sm font-semibold text-parchment-200">1. Core Engine</h4>
            <p className="text-xs text-parchment-400 mt-1">Triển khai bàn cờ 10x9, các quân cờ, luật di chuyển và xác thực nước đi.</p>
          </div>
          <div className="p-4 rounded-lg bg-wood-900/40 border border-wood-800/60 hover:border-gold-600/30 transition-colors">
            <Crown className="w-5 h-5 text-gold-400 mb-2" />
            <h4 className="font-headline text-sm font-semibold text-parchment-200">2. Giao Diện Bàn Cờ</h4>
            <p className="text-xs text-parchment-400 mt-1">Đồng bộ các mẫu giao diện từ Stitch uiXiangqi theo phong cách Cổ phong Á Đông.</p>
          </div>
          <div className="p-4 rounded-lg bg-wood-900/40 border border-wood-800/60 hover:border-gold-600/30 transition-colors">
            <BookOpen className="w-5 h-5 text-gold-400 mb-2" />
            <h4 className="font-headline text-sm font-semibold text-parchment-200">3. WebSocket PvP</h4>
            <p className="text-xs text-parchment-400 mt-1">Đồng bộ nước đi thời gian thực giữa 2 người chơi qua STOMP / WebSocket.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-wood-900 py-6 text-center text-xs text-parchment-400/60 font-serif">
        <p>Kỳ Vương © 2026 • Nghệ Thuật Cờ Tướng Hoàng Gia Đông Á</p>
      </footer>
    </div>
  );
}
