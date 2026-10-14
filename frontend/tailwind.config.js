/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Nền Gỗ Mun Trầm & Than Củi (Wood)
        'wood': {
          950: '#140D07', // Siêu trầm: Header, Inner container, Nền modal
          900: '#19120C', // Nền trang chính toàn màn hình
          850: '#221A14', // Nền thẻ card, panel bento, input
          800: '#261E18', // Nền thẻ rank, item danh sách
          700: '#312822', // Nền button phụ, select option chưa chọn
          600: '#3D332C', // Background thanh tiến độ, badge nền tối
          500: '#4D4635', // Viền thẻ mặc định cổ phong (Border đồng)
        },
        // Vàng Kim Hoàng Gia (Gold)
        'gold': {
          300: '#FFE088', // Text sáng, ánh kim nổi bật
          400: '#F2CA50', // Vàng hoàng kim sáng, icon, active tab, rank 1
          500: '#D4AF37', // Vàng kim chủ đạo, viền nổi bật, nút CTA
          600: '#997D24', // Vàng trầm, viền thứ cấp
          700: '#735C00', // Bóng đổ, viền đậm
          800: '#574500', // Nền huy hiệu rank 3
          900: '#3C2F00', // Chữ trên nền vàng (Contrast text)
          950: '#241A00', // Chữ tối trên nền rank 2
        },
        // Đỏ Sơn Son Cung Đình (Cinnabar)
        'cinnabar': {
          300: '#FFB3AE', // Text highlight đỏ / tag mùa giải
          400: '#FF8A80',
          500: '#BB3E03', // Đỏ cam rực rỡ
          600: '#9B2226',
          700: '#8F191F', // Đỏ sơn son chủ đạo / thẻ xếp hạng
          900: '#5F1215',
          950: '#2B1012', // Gradient đỉnh thẻ xếp hạng
        },
        // Ngọc Bích Hoàng Tộc (Jade)
        'jade': {
          300: '#9DDCBB', // Màu ngọc bích sáng: ngọc bảo, chuỗi thắng
          400: '#82C0A0', // Tag online, highlight nhẹ
          500: '#52B788', // Ngọc bích chuẩn
          600: '#2D6A4F',
          800: '#1B4332',
        },
        // Giấy Dó & Mực Nho (Parchment)
        'parchment': {
          100: '#FDFBF7', // Trắng giấy dó sáng
          200: '#F0DFD5', // Chữ body chính
          300: '#D0C5AF', // Chữ phụ, mô tả, nav link phụ
          400: '#99907C', // Chữ mờ, placeholder, ghi chú
        },
        // Màu chữ tương phản cao trên nền vàng kim
        'on-gold': '#140D07',
        // Bàn Cờ Hoàng Triều (Xiangqi Board)
        'board': {
          frame: '#2D1B10', // Viền khung gỗ ngoài
          'frame-border': '#8C6B2D', // Chỉ nẹp đồng khung
          surface: '#EED09D', // Màu nền gỗ bàn cờ
          grid: '#735C00', // Nét mực kẻ bàn cờ & chữ Sở Hà Hán Giới
          watermark: '#574500', // Thủy ấn chữ Kỳ chìm
        },
      },
      fontFamily: {
        headline: ['"Noto Serif"', 'serif'],
        body: ['"Be Vietnam Pro"', 'sans-serif'],
        mono: ['"Space Grotesk"', 'monospace'],
      },
      boxShadow: {
        'gold-glow': '0 0 20px rgba(212, 175, 55, 0.35)',
        'cinnabar-glow': '0 0 25px rgba(187, 62, 3, 0.4)',
        'jade-glow': '0 0 20px rgba(45, 106, 79, 0.35)',
      },
      borderColor: {
        DEFAULT: '#4D4635',
      },
    },
  },
  plugins: [],
};
