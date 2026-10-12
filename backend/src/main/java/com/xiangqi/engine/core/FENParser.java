package com.xiangqi.engine.core;

import com.xiangqi.engine.model.Piece;
import com.xiangqi.engine.model.Side;

public final class FENParser {

    private FENParser() {
        // Utility class
    }

    public static final String INITIAL_FEN = "rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w - - 0 1";

    /**
     * Tải trạng thái bàn cờ từ chuỗi FEN.
     */
    public static XiangqiBoard parse(String fen) {
        if (fen == null || fen.trim().isEmpty()) {
            throw new IllegalArgumentException("FEN string cannot be null or empty");
        }

        String[] tokens = fen.trim().split("\\s+");
        String boardPart = tokens[0];

        XiangqiBoard board = new XiangqiBoard();
        board.clear();

        String[] ranks = boardPart.split("/");
        if (ranks.length != XiangqiBoard.RANKS) {
            throw new IllegalArgumentException("FEN must contain exactly 10 ranks, got: " + ranks.length);
        }

        // Hàng đầu tiên trong FEN là hàng 9 (Bên Đen), đến hàng cuối cùng là hàng 0 (Bên Đỏ)
        for (int i = 0; i < XiangqiBoard.RANKS; i++) {
            int rankY = 9 - i;
            String rankStr = ranks[i];
            int fileX = 0;

            for (char c : rankStr.toCharArray()) {
                if (Character.isDigit(c)) {
                    int emptyCount = c - '0';
                    fileX += emptyCount;
                } else {
                    if (fileX >= XiangqiBoard.FILES) {
                        throw new IllegalArgumentException("Invalid FEN rank: file index exceeds 8 in rank " + rankY);
                    }
                    Piece piece = Piece.fromFenChar(c);
                    board.setPiece(fileX, rankY, piece);
                    fileX++;
                }
            }

            if (fileX != XiangqiBoard.FILES) {
                throw new IllegalArgumentException("Invalid rank width in FEN for rank " + rankY + ", expected 9 but got " + fileX);
            }
        }

        // Token 1: Lượt đi (w hoặc r là Đỏ, b là Đen)
        if (tokens.length > 1) {
            String turnStr = tokens[1].toLowerCase();
            if (turnStr.equals("w") || turnStr.equals("r")) {
                board.setCurrentTurn(Side.RED);
            } else if (turnStr.equals("b")) {
                board.setCurrentTurn(Side.BLACK);
            }
        }

        // Token 4 & 5: Halfmove clock & Fullmove number (nếu có)
        if (tokens.length >= 6) {
            try {
                board.setHalfMoveClock(Integer.parseInt(tokens[4]));
                board.setFullMoveNumber(Integer.parseInt(tokens[5]));
            } catch (NumberFormatException ignored) {
            }
        } else if (tokens.length == 4) {
            // Định dạng rút gọn: [board] [turn] [halfmove] [fullmove]
            try {
                board.setHalfMoveClock(Integer.parseInt(tokens[2]));
                board.setFullMoveNumber(Integer.parseInt(tokens[3]));
            } catch (NumberFormatException ignored) {
            }
        }

        return board;
    }

    /**
     * Xuất trạng thái bàn cờ hiện tại thành chuỗi FEN chuẩn.
     */
    public static String toFEN(XiangqiBoard board) {
        StringBuilder sb = new StringBuilder();

        // 1. Ma trận bàn cờ từ hàng 9 xuống hàng 0
        for (int rankY = 9; rankY >= 0; rankY--) {
            int emptyCount = 0;
            for (int fileX = 0; fileX < XiangqiBoard.FILES; fileX++) {
                Piece piece = board.getPiece(fileX, rankY);
                if (piece == null) {
                    emptyCount++;
                } else {
                    if (emptyCount > 0) {
                        sb.append(emptyCount);
                        emptyCount = 0;
                    }
                    sb.append(piece.getFenChar());
                }
            }
            if (emptyCount > 0) {
                sb.append(emptyCount);
            }
            if (rankY > 0) {
                sb.append("/");
            }
        }

        // 2. Lượt đi
        sb.append(" ").append(board.getCurrentTurn() == Side.RED ? "w" : "b");

        // 3. Quy chuẩn FEN cờ tướng (Castling & En-passant không có, ký hiệu - -)
        sb.append(" - - ");

        // 4. Số nước đếm hòa & số thứ tự nước đi
        sb.append(board.getHalfMoveClock()).append(" ").append(board.getFullMoveNumber());

        return sb.toString();
    }
}
