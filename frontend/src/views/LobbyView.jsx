import React, { useState } from 'react';
import {
  Swords, Trophy, Crown, Coins, Gem, Bell, Settings,
  LogIn, PlusCircle, Bot, BookOpen, MessageSquare, Lock,
  Clock, Flame, ChevronRight, Shield, LayoutGrid
} from 'lucide-react';
import DevNoticeModal from '../components/common/DevNoticeModal';
import seasonBanner from '../assets/banners/season_banner.jpg';

export default function LobbyView({ onNavigateToArena }) {
  const [selectedTime, setSelectedTime] = useState('15');
  const [pinCode, setPinCode] = useState('');
  const [modalFeature, setModalFeature] = useState(null);

  // Hiển thị modal thông báo tính năng đang phát triển
  const showDevNotice = (featureName) => {
    setModalFeature(featureName);
  };

  // Đóng modal thông báo tính năng
  const closeDevNotice = () => {
    setModalFeature(null);
  };

  return (
    <div className="min-h-screen bg-wood-900 text-parchment-200 flex flex-col antialiased selection:bg-gold-400 selection:text-on-gold">
      {/* Modal thông báo */}
      <DevNoticeModal
        isOpen={Boolean(modalFeature)}
        onClose={closeDevNotice}
        featureName={modalFeature || ''}
      />

      {/* Header */}
      <header className="w-full px-4 sm:px-8 flex items-center justify-between border-b border-wood-500 bg-wood-950/90 backdrop-blur-md sticky top-0 z-40 h-20 shadow-2xl">

        <div className="flex items-center gap-3 shrink-0">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-cinnabar-700 via-wood-800 to-wood-950 border-2 border-gold-500 shadow-lg">
            <span className="font-headline text-2xl font-bold text-gold-400 tracking-wide select-none">
              帥
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-2xl font-headline font-bold text-gold-400 tracking-wider">
                KỲ VƯƠNG
              </span>
            </div>
            <p className="text-[10px] text-parchment-400 tracking-widest leading-none font-headline uppercase">
              Đỉnh Cao Cờ Tướng
            </p>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-6">
          <button
            className="text-gold-400 font-bold border-b-2 border-gold-400 pb-1 flex items-center gap-1.5 transition-all text-sm font-headline"
          >
            <span>Sảnh Chính</span>
          </button>
          <button
            onClick={() => showDevNotice('Bảng Xếp Hạng')}
            className="text-parchment-300 hover:text-gold-300 transition-colors px-2 py-1 text-sm font-headline"
          >
            Bảng Xếp Hạng
          </button>
          <button
            onClick={() => showDevNotice('Cửa Hàng')}
            className="text-parchment-300 hover:text-gold-300 transition-colors px-2 py-1 text-sm font-headline"
          >
            Cửa Hàng
          </button>
          <button
            onClick={() => showDevNotice('Góp Ý & Báo Lỗi')}
            className="text-parchment-300 hover:text-gold-300 transition-colors px-2 py-1 text-sm font-headline"
          >
            Góp Ý
          </button>
        </nav>

        <div className="flex items-center gap-4 shrink-0">
          <div className="hidden sm:flex items-center gap-2 bg-wood-850 px-3 py-1 rounded-lg border border-wood-500">

            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-wood-950 border border-wood-500/60 text-xs">
              <Coins className="w-4 h-4 text-gold-400" />
              <span className="font-mono font-bold text-gold-300">12,500</span>
            </div>

            <div className="flex items-center gap-1.5 pl-2 pr-1 py-0.5 rounded bg-wood-950 border border-wood-500/60 text-xs">
              <Gem className="w-3.5 h-3.5 text-jade-300" />
              <span className="font-mono font-bold text-jade-300">450</span>
              <button
                onClick={() => showDevNotice('Nạp Bích Ngọc')}
                className="ml-1 w-4 h-4 rounded flex items-center justify-center bg-gold-400 text-on-gold hover:brightness-110 active:scale-95 text-[10px] font-bold"
                title="Nạp Ngọc"
              >
                +
              </button>
            </div>
          </div>


          <div className="flex items-center gap-1 text-parchment-300">
            <button
              onClick={() => showDevNotice('Hộp Thư Tín')}
              className="p-2 rounded-lg hover:text-gold-400 hover:bg-wood-850 transition-colors"
              title="Thông Báo"
            >
              <Bell className="w-4 h-4" />
            </button>
            <button
              onClick={() => showDevNotice('Cài Đặt Hệ Thống')}
              className="p-2 rounded-lg hover:text-gold-400 hover:bg-wood-850 transition-colors"
              title="Cài Đặt"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>

          <div className="pl-2 border-l border-wood-500">
            <button
              onClick={() => showDevNotice('Đăng Nhập Tài Khoản')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-gold-500 to-gold-400 text-on-gold font-headline text-xs font-bold shadow-md hover:brightness-110 active:scale-95 transition-all border border-gold-400"
            >
              <LogIn className="w-3.5 h-3.5 text-on-gold" />
              <span>Đăng Nhập</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1720px] mx-auto px-4 md:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Cột trái: Bảng xếp hạng & Trò chuyện */}
        <aside className="lg:col-span-3 flex flex-col justify-between self-stretch h-full gap-4">
          <div className="bg-wood-850 border border-wood-500 rounded-xl p-4 shadow-xl relative overflow-hidden flex flex-col gap-4">

            <div className="flex items-center justify-between pb-3 border-b border-wood-500">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-gold-400" />
                <div>
                  <h2 className="font-headline text-base font-bold text-gold-400 tracking-wide">
                    BẢNG XẾP HẠNG
                  </h2>
                  <p className="text-[10px] text-parchment-400 uppercase tracking-wider font-mono">
                    CHIẾN LỰC RANK
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="p-2.5 rounded-lg bg-gradient-to-r from-wood-600 via-wood-800 to-wood-950 border border-gold-400/60 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-gold-400 text-on-gold font-bold text-xs shadow">
                      1
                      <Crown className="w-3 h-3 text-gold-400 absolute -top-2" />
                    </div>
                    <div>
                      <p className="font-headline text-xs font-bold text-gold-400 leading-none">
                        Cửu Thiên Kỳ Thánh
                      </p>
                      <span className="text-[10px] text-jade-300 font-semibold">Cửu Trọng Kỳ Các</span>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-gold-400">2,240</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-wood-800 border border-wood-500 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center justify-center w-7 h-7 rounded-full bg-parchment-400 text-wood font-bold text-xs">
                    2
                  </div>
                  <div>
                    <p className="font-headline text-xs font-semibold text-parchment-200 leading-none">
                      Bắc Hải Long Vương
                    </p>
                    <span className="text-[10px] text-parchment-300">Bắc Hải Bang</span>
                  </div>
                </div>
                <span className="font-mono text-xs font-bold text-parchment-200">2,190</span>
              </div>

              <div className="p-2.5 rounded-lg bg-wood-800 border border-wood-500 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gold-800 text-gold-300 font-bold text-xs">
                    3
                  </div>
                  <div>
                    <p className="font-headline text-xs font-semibold text-parchment-200 leading-none">
                      Tiêu Dao Kỳ Ma
                    </p>
                    <span className="text-[10px] text-parchment-300">Tiêu Dao Phái</span>
                  </div>
                </div>
                <span className="font-mono text-xs font-bold text-parchment-200">2,150</span>
              </div>

              <div className="p-2 rounded-lg bg-wood-950/70 border border-wood-500/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 text-center text-parchment-400 font-bold">4</span>
                  <div>
                    <p className="font-body text-xs text-parchment-300">Đông Phương Bất Bại</p>
                    <span className="text-[10px] text-parchment-400">Nhật Nguyệt Giáo</span>
                  </div>
                </div>
                <span className="font-mono font-semibold text-parchment-300">2,080</span>
              </div>

              <div className="p-2 rounded-lg bg-wood-950/70 border border-wood-500/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 text-center text-parchment-400 font-bold">5</span>
                  <div>
                    <p className="font-body text-xs text-parchment-300">Thái Hư Đạo Nhân</p>
                    <span className="text-[10px] text-parchment-400">Thái Hư Quán</span>
                  </div>
                </div>
                <span className="font-mono font-semibold text-parchment-300">2,010</span>
              </div>
            </div>

            <div className="pt-3 border-t border-wood-500 bg-wood-950/90 -mx-4 -mb-4 p-4 rounded-b-xl flex flex-col gap-2">
              <span className="text-[11px] font-headline font-bold text-gold-400">Thứ Hạng Của Bạn</span>
              <div className="p-2.5 rounded-lg bg-wood-800 border border-wood-500 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center justify-center w-7 h-7 rounded-full bg-wood-600 text-parchment-400 font-bold text-xs border border-wood-500">
                    -
                  </div>
                  <div>
                    <p className="font-headline text-xs font-semibold text-parchment-200 leading-none">
                      Bạn
                    </p>
                    <span className="text-[10px] text-parchment-400">Chưa đấu xếp hạng</span>
                  </div>
                </div>
                <span className="font-headline text-xs font-bold text-parchment-400">Vô hạng</span>
              </div>
            </div>
          </div>

          <div
            onClick={() => showDevNotice('Trà Quán Kỳ Hội (Đàm Đạo)')}
            className="mt-auto p-3.5 rounded-xl bg-wood-850 border border-wood-500 shadow-xl hover:border-gold-400/60 transition-all cursor-pointer group flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-full bg-wood-600 text-gold-400 border border-wood-500 group-hover:scale-105 transition-transform">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <p className="font-headline text-xs text-gold-400 font-bold">Trò Chuyện Kỳ Hữu</p>
                <p className="text-[10px] text-parchment-400">Kết nối kỳ hữu mọi miền</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-parchment-400 group-hover:text-gold-400 transition-colors" />
          </div>
        </aside>

        {/* Cột phải: Đấu trường & Lối tắt */}
        <section className="flex flex-col gap-6 lg:col-span-9">
          {/* Banner mùa giải */}
          <div className="relative w-full rounded-xl overflow-hidden border-2 border-gold-500 shadow-2xl bg-wood-950 min-h-[175px] flex items-center">
            <div
              className="absolute inset-0 z-0 opacity-40 mix-blend-luminosity bg-cover bg-center"
              style={{ backgroundImage: `url(${seasonBanner})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-wood-950 via-wood-950/85 to-transparent z-0" />

            <div className="relative z-10 p-5 md:p-6 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="max-w-lg">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-cinnabar-700/80 text-cinnabar-300 border border-wood-500 mb-2 text-xs font-bold">
                  <Flame className="w-3.5 h-3.5" />
                  <span>MÙA GIẢI I KHỞI TRANH</span>
                </div>
                <h1 className="font-headline text-2xl md:text-3xl font-bold text-gold-400 tracking-wide mb-1 leading-tight">
                  KỲ VƯƠNG TRANH BÁ
                </h1>
                <p className="font-headline text-xs md:text-sm text-parchment-300 italic mb-2">
                  "Long Phụng Tranh Châu - Thần Cơ Định Quốc"
                </p>
                <div className="flex items-center gap-2 text-xs font-mono text-gold-300">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Còn 04 ngày 18 giờ kết thúc</span>
                </div>
              </div>

              <div
                onClick={() => showDevNotice('Rương Thần Cơ Mùa Giải')}
                className="cursor-pointer p-3 rounded-xl bg-wood-850/90 border border-gold-400/50 text-center shadow-lg hover:scale-105 transition-transform shrink-0"
              >
                <Crown className="w-8 h-8 text-gold-400 mx-auto mb-1" />
                <p className="text-[11px] font-headline text-gold-400 font-bold">Rương Mùa I</p>
              </div>
            </div>
          </div>

          {/* Chế độ thi đấu */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Đấu xếp hạng */}
            <div className="relative rounded-xl p-5 bg-gradient-to-b from-cinnabar-950 via-wood-850 to-wood-950 border-2 border-cinnabar-700 shadow-xl flex flex-col justify-between overflow-hidden">
              <div>
                <h2 className="font-headline text-lg font-bold text-gold-400 mb-1">
                  TÌM TRẬN XẾP HẠNG
                </h2>
                <p className="text-xs text-parchment-300 mb-4">
                  Khẳng định bản lĩnh với các kỳ thủ cùng đẳng cấp. Tích lũy điểm thăng hàm.
                </p>

                <div className="p-4 rounded-xl bg-wood-950/90 shadow-lg mb-4">
                  <div className="flex items-start gap-3.5 mb-3">
                    <div className="flex flex-col items-center shrink-0">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-cinnabar-700 via-wood-600 to-gold-500 p-0.5 border-2 border-gold-400 flex items-center justify-center shadow-md">
                        <Shield className="w-7 h-7 text-gold-400" />
                      </div>
                      <span className="mt-1 font-mono text-xs font-bold text-gold-400">1,650 Elo</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-headline text-base font-bold text-gold-300">Kỳ Hiệp III</h3>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-parchment-400 mb-2">
                        <span>Thắng: <strong className="text-gold-400">64.8%</strong> (142/219)</span>
                        <span>-</span>
                        <span>Chuỗi: <strong className="text-jade-300">3 trận</strong></span>
                      </div>

                      <div className="pt-2 border-t border-wood-500/60">
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="text-parchment-300">Tiến độ lên <strong className="text-gold-300">Kỳ Sư</strong></span>
                          <span className="font-mono text-parchment-400">1,800</span>
                        </div>
                        <div className="w-full bg-wood-600 h-2 rounded-full overflow-hidden border border-wood-500/40">
                          <div className="bg-gradient-to-r from-cinnabar-700 via-gold-500 to-gold-400 h-full rounded-full" style={{ width: '75%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-wood-500/50 flex items-end justify-end text-[11px] text-parchment-400">
                    <span>Quy chuẩn: <strong className="text-parchment-300">Mỗi bên 15 phút</strong></span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => showDevNotice('Hàng Đợi Ghép Trận Xếp Hạng')}
                className="w-full py-3.5 px-4 rounded-lg bg-gradient-to-r from-cinnabar-700 via-gold-500 to-gold-400 text-on-gold font-headline text-sm font-bold tracking-wider shadow-xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-gold-400"
              >
                <Swords className="w-5 h-5 text-on-gold" />
                <span className="text-on-gold">KHIÊU CHIẾN NGAY</span>
              </button>
            </div>

            {/* Phòng giao hữu */}
            <div className="relative rounded-xl p-5 bg-gradient-to-b from-wood-800 via-wood-850 to-wood-950 border border-wood-500 shadow-xl flex flex-col justify-between overflow-hidden hover:border-gold-500/50 transition-all">
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h2 className="font-headline text-lg font-bold text-gold-400 mb-1">
                      PHÒNG GIAO HỮU
                    </h2>
                    <p className="text-xs text-parchment-300 mb-4">
                      Đấu trí cùng bằng hữu
                    </p>
                  </div>
                  <span className="text-parchment-400 text-xs flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" /> Phòng Riêng
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-wood-950 border border-wood-500 mb-3.5">
                  <label className="block text-[11px] text-parchment-400 mb-1">Vào phòng bằng mã số</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value)}
                      placeholder="Nhập PIN 6 số..."
                      maxLength={6}
                      className="flex-1 bg-wood-850 border border-wood-500 rounded px-3 py-1.5 text-xs text-gold-400 placeholder-parchment-400 focus:outline-none focus:border-gold-400"
                    />
                    <button
                      onClick={() => showDevNotice('Vào Phòng Riêng Bằng Mã PIN')}
                      className="px-3 py-1.5 rounded bg-wood-600 hover:bg-wood-500 text-gold-300 text-xs font-bold border border-wood-500 transition-colors"
                    >
                      VÀO PHÒNG
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-[11px] font-mono text-parchment-400 mb-1.5 uppercase">Thời Gian Mỗi Bên</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: '10', label: '10 Phút', sub: '(Nhanh)' },
                      { key: '15', label: '15 Phút', sub: '(Chuẩn)' },
                      { key: '20', label: '20 Phút', sub: '(Chậm)' }
                    ].map((time) => (
                      <button
                        key={time.key}
                        onClick={() => setSelectedTime(time.key)}
                        className={`py-1.5 px-2 rounded text-xs transition-all ${selectedTime === time.key
                          ? 'bg-gold-500 text-on-gold font-bold border-2 border-gold-400'
                          : 'bg-wood-700 text-parchment-300 border border-wood-500 hover:border-gold-400'
                          }`}
                      >
                        <div className={selectedTime === time.key ? 'text-on-gold font-bold' : ''}>{time.label}</div>
                        <div className={`text-[10px] ${selectedTime === time.key ? 'text-on-gold/80 font-medium' : 'opacity-70'}`}>{time.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => showDevNotice(`Tạo Phòng Kỳ Đài Mới (${selectedTime} Phút)`)}
                className="w-full py-3.5 px-4 rounded bg-wood-700 hover:bg-gold-500 border-2 border-gold-500/70 text-gold-400 hover:text-on-gold font-headline text-sm font-bold tracking-wide transition-all flex items-center justify-center gap-2 shadow-lg group"
              >
                <PlusCircle className="w-5 h-5 text-gold-400 group-hover:text-on-gold transition-colors" />
                <span className="text-gold-400 group-hover:text-on-gold transition-colors">TẠO PHÒNG MỚI</span>
              </button>
            </div>

          </div>

          {/* Lối tắt nhanh */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div
              onClick={() => showDevNotice('Đấu Luyện Với AI')}
              className="cursor-pointer p-3.5 rounded-lg bg-wood-850 border border-wood-500 hover:border-gold-400/60 flex items-center gap-3 transition-all group"
            >
              <div className="w-9 h-9 rounded bg-wood-950 flex items-center justify-center text-gold-400 group-hover:scale-110 transition-transform">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <p className="font-headline text-xs font-bold text-parchment-200 group-hover:text-gold-400">Tập Luyện AI</p>
                <p className="text-[10px] text-parchment-400">Nâng Cao Trình Độ</p>
              </div>
            </div>

            <div
              onClick={onNavigateToArena}
              className="cursor-pointer p-3.5 rounded-lg bg-wood-850 border border-wood-500 hover:border-gold-400/60 flex items-center gap-3 transition-all group"
            >
              <div className="w-9 h-9 rounded bg-wood-950 flex items-center justify-center text-gold-400 group-hover:scale-110 transition-transform">
                <LayoutGrid className="w-5 h-5 text-gold-400" />
              </div>
              <div>
                <p className="font-headline text-xs font-bold text-parchment-200 group-hover:text-gold-400 transition-colors">Xếp Cờ</p>
                <p className="text-[10px] text-parchment-400">Nghiên cứu Thế Cờ</p>
              </div>
            </div>

            <div
              onClick={() => showDevNotice('Kỳ Phổ Điển Phạm Cổ')}
              className="cursor-pointer p-3.5 rounded-lg bg-wood-850 border border-wood-500 hover:border-gold-400/60 flex items-center gap-3 transition-all group"
            >
              <div className="w-9 h-9 rounded bg-wood-950 flex items-center justify-center text-jade-300 group-hover:scale-110 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <p className="font-headline text-xs font-bold text-parchment-200 group-hover:text-jade-300">Kỳ Phổ Điển Phạm</p>
                <p className="text-[10px] text-parchment-400">Khai Phá Trí Tuệ</p>
              </div>
            </div>
          </div>

        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-wood-500/60 py-4 text-center text-xs text-parchment-400 font-headline">
        <p>Kỳ Vương © 2026 • Đỉnh Cao Cờ Tướng Hoàng Gia Đông Á</p>
      </footer>
    </div>
  );
}
