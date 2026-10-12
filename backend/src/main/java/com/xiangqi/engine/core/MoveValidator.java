package com.xiangqi.engine.core;

import com.xiangqi.engine.model.Move;
import com.xiangqi.engine.model.Piece;
import com.xiangqi.engine.model.Position;
import com.xiangqi.engine.model.Side;

import java.util.ArrayList;
import java.util.List;

public final class MoveValidator {

    private MoveValidator() {
        // Utility class
    }

    /**
     * Checks if a move is fully legal (geometry, obstacles, no self-check, no flying general).
     */
    public static boolean isLegalMove(XiangqiBoard board, Position from, Position to) {
        if (!isPseudoLegalMove(board, from, to)) {
            return false;
        }

        // Test the move on a cloned board to verify King safety
        XiangqiBoard testBoard = board.copy();
        Piece mover = testBoard.getPiece(from);
        testBoard.makeMove(from, to);

        // 1. Kiểm tra Lộ mặt tướng (Flying General)
        if (areKingsFacingEachOther(testBoard)) {
            return false;
        }

        // 2. Tướng của bên vừa đi không được bị chiếu (No self-check)
        if (isKingInCheck(testBoard, mover.getSide())) {
            return false;
        }

        return true;
    }

    /**
     * Checks piece movement rules, obstacles, and basic capture criteria without simulating king safety.
     */
    public static boolean isPseudoLegalMove(XiangqiBoard board, Position from, Position to) {
        if (from == null || to == null || from.equals(to)) {
            return false;
        }

        Piece mover = board.getPiece(from);
        if (mover == null) {
            return false;
        }

        Piece target = board.getPiece(to);
        // Không được ăn quân cùng phe
        if (target != null && target.getSide() == mover.getSide()) {
            return false;
        }

        int dx = to.getX() - from.getX();
        int dy = to.getY() - from.getY();

        return switch (mover.getType()) {
            case KING -> isValidKingMove(mover, to, dx, dy);
            case ADVISOR -> isValidAdvisorMove(mover, to, dx, dy);
            case BISHOP -> isValidBishopMove(board, mover, from, to, dx, dy);
            case KNIGHT -> isValidKnightMove(board, from, to, dx, dy);
            case ROOK -> isValidRookMove(board, from, to, dx, dy);
            case CANNON -> isValidCannonMove(board, from, to, dx, dy, target);
            case PAWN -> isValidPawnMove(mover, from, dx, dy);
        };
    }

    // --- 1. Tướng / Soái (King) ---
    private static boolean isValidKingMove(Piece king, Position to, int dx, int dy) {
        // Chỉ được di chuyển trong Cung
        if (!to.inPalace(king.getSide())) {
            return false;
        }
        // Đi 1 ô ngang hoặc dọc
        return (Math.abs(dx) + Math.abs(dy)) == 1;
    }

    // --- 2. Sĩ (Advisor) ---
    private static boolean isValidAdvisorMove(Piece advisor, Position to, int dx, int dy) {
        // Chỉ được di chuyển trong Cung
        if (!to.inPalace(advisor.getSide())) {
            return false;
        }
        // Đi chéo đúng 1 ô
        return Math.abs(dx) == 1 && Math.abs(dy) == 1;
    }

    // --- 3. Tượng (Bishop / Elephant) ---
    private static boolean isValidBishopMove(XiangqiBoard board, Piece bishop, Position from, Position to, int dx, int dy) {
        // Không được qua sông
        if (bishop.getSide() == Side.RED && to.getY() > 4) {
            return false;
        }
        if (bishop.getSide() == Side.BLACK && to.getY() < 5) {
            return false;
        }
        // Đi chéo đúng 2 ô (hình vuông 2x2)
        if (Math.abs(dx) != 2 || Math.abs(dy) != 2) {
            return false;
        }
        // Cản mắt tượng: Giao điểm chính giữa phải trống
        int eyeX = (from.getX() + to.getX()) / 2;
        int eyeY = (from.getY() + to.getY()) / 2;
        return board.getPiece(eyeX, eyeY) == null;
    }

    // --- 4. Mã (Knight / Horse) ---
    private static boolean isValidKnightMove(XiangqiBoard board, Position from, Position to, int dx, int dy) {
        int absDx = Math.abs(dx);
        int absDy = Math.abs(dy);

        // Nước đi chữ L (1x2 hoặc 2x1)
        if (!((absDx == 1 && absDy == 2) || (absDx == 2 && absDy == 1))) {
            return false;
        }

        // Kiểm tra cản chân mã
        if (absDy == 2) {
            // Đi dọc 2 ô: Chân mã nằm ở ô sát hướng dọc
            int legY = from.getY() + (dy / 2);
            if (board.getPiece(from.getX(), legY) != null) {
                return false; // Bị cản chân
            }
        } else {
            // Đi ngang 2 ô: Chân mã nằm ở ô sát hướng ngang
            int legX = from.getX() + (dx / 2);
            if (board.getPiece(legX, from.getY()) != null) {
                return false; // Bị cản chân
            }
        }

        return true;
    }

    // --- 5. Xe (Rook / Chariot) ---
    private static boolean isValidRookMove(XiangqiBoard board, Position from, Position to, int dx, int dy) {
        // Đi thẳng ngang hoặc dọc
        if (dx != 0 && dy != 0) {
            return false;
        }
        // Không được có bất kỳ quân nào cản đường
        return countPiecesBetween(board, from, to) == 0;
    }

    // --- 6. Pháo (Cannon) ---
    private static boolean isValidCannonMove(XiangqiBoard board, Position from, Position to, int dx, int dy, Piece target) {
        // Đi thẳng ngang hoặc dọc
        if (dx != 0 && dy != 0) {
            return false;
        }

        int betweenCount = countPiecesBetween(board, from, to);
        if (target == null) {
            // Nước đi thường (không ăn quân): Không có quân cản
            return betweenCount == 0;
        } else {
            // Nước ăn quân: Phải có đúng 1 quân làm ngòi ở giữa
            return betweenCount == 1;
        }
    }

    // --- 7. Tốt / Binh (Pawn) ---
    private static boolean isValidPawnMove(Piece pawn, Position from, int dx, int dy) {
        int absDx = Math.abs(dx);

        if (pawn.getSide() == Side.RED) {
            // Đỏ tiến lên (y tăng dần)
            if (from.getY() <= 4) {
                // Chưa qua sông: Chỉ được tiến thẳng 1 ô
                return dx == 0 && dy == 1;
            } else {
                // Đã qua sông: Tiến thẳng 1 ô HOẶC đi ngang 1 ô, không được lùi
                return (dx == 0 && dy == 1) || (absDx == 1 && dy == 0);
            }
        } else {
            // Đen tiến xuống (y giảm dần)
            if (from.getY() >= 5) {
                // Chưa qua sông: Chỉ được tiến thẳng 1 ô
                return dx == 0 && dy == -1;
            } else {
                // Đã qua sông: Tiến thẳng 1 ô HOẶC đi ngang 1 ô, không được lùi
                return (dx == 0 && dy == -1) || (absDx == 1 && dy == 0);
            }
        }
    }

    /**
     * Đếm số quân cờ nằm strictly giữa hai vị trí trên cùng một hàng hoặc cột.
     */
    public static int countPiecesBetween(XiangqiBoard board, Position from, Position to) {
        int dx = to.getX() - from.getX();
        int dy = to.getY() - from.getY();

        if (dx != 0 && dy != 0) {
            return -1; // Không cùng hàng/cột
        }

        int count = 0;
        if (dx == 0) {
            int step = (dy > 0) ? 1 : -1;
            int currentY = from.getY() + step;
            while (currentY != to.getY()) {
                if (board.getPiece(from.getX(), currentY) != null) {
                    count++;
                }
                currentY += step;
            }
        } else {
            int step = (dx > 0) ? 1 : -1;
            int currentX = from.getX() + step;
            while (currentX != to.getX()) {
                if (board.getPiece(currentX, from.getY()) != null) {
                    count++;
                }
                currentX += step;
            }
        }
        return count;
    }

    /**
     * Quy tắc Lộ mặt tướng (Flying General):
     * Hai tướng không được đối mặt trực tiếp trên cùng một cột mà không có quân cản.
     */
    public static boolean areKingsFacingEachOther(XiangqiBoard board) {
        Position redKing = board.findKing(Side.RED);
        Position blackKing = board.findKing(Side.BLACK);

        if (redKing == null || blackKing == null) {
            return false;
        }

        if (redKing.getX() == blackKing.getX()) {
            return countPiecesBetween(board, redKing, blackKing) == 0;
        }

        return false;
    }

    /**
     * Kiểm tra Tướng của phe `side` có đang bị chiếu hay không.
     */
    public static boolean isKingInCheck(XiangqiBoard board, Side side) {
        Position kingPos = board.findKing(side);
        if (kingPos == null) {
            return false;
        }

        Side opponent = side.opponent();

        // Duyệt mọi quân của đối thủ xem có quân nào có thể ăn Tướng không
        for (int x = 0; x < XiangqiBoard.FILES; x++) {
            for (int y = 0; y < XiangqiBoard.RANKS; y++) {
                Piece piece = board.getPiece(x, y);
                if (piece != null && piece.getSide() == opponent) {
                    Position attackerPos = Position.of(x, y);
                    if (isPseudoLegalMove(board, attackerPos, kingPos)) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    /**
     * Sinh tất cả các nước đi hợp lệ cho phe `side`.
     */
    public static List<Move> generateLegalMoves(XiangqiBoard board, Side side) {
        List<Move> legalMoves = new ArrayList<>();

        for (int x = 0; x < XiangqiBoard.FILES; x++) {
            for (int y = 0; y < XiangqiBoard.RANKS; y++) {
                Piece piece = board.getPiece(x, y);
                if (piece != null && piece.getSide() == side) {
                    Position from = Position.of(x, y);

                    // Quét các ô đích tiềm năng
                    for (int targetX = 0; targetX < XiangqiBoard.FILES; targetX++) {
                        for (int targetY = 0; targetY < XiangqiBoard.RANKS; targetY++) {
                            Position to = Position.of(targetX, targetY);
                            if (isLegalMove(board, from, to)) {
                                legalMoves.add(new Move(from, to, piece, board.getPiece(to)));
                            }
                        }
                    }
                }
            }
        }

        return legalMoves;
    }
}
