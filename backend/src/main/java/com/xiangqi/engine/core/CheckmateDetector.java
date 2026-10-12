package com.xiangqi.engine.core;

import com.xiangqi.engine.model.Move;
import com.xiangqi.engine.model.Side;

import java.util.List;

public final class CheckmateDetector {

    private CheckmateDetector() {
        // Utility class
    }

    public enum GameState {
        IN_PROGRESS,
        CHECK,
        CHECKMATE,
        STALEMATE,
        DRAW_BY_RULE_60_MOVES
    }

    /**
     * Kiểm tra xem bên `side` có đang bị chiếu không.
     */
    public static boolean isCheck(XiangqiBoard board, Side side) {
        return MoveValidator.isKingInCheck(board, side);
    }

    /**
     * Kiểm tra xem bên `side` có bị chiếu bí (Checkmate) hay không.
     * Điều kiện: Đang bị chiếu VÀ không còn bất kỳ nước cờ hợp lệ nào để giải chiếu.
     */
    public static boolean isCheckmate(XiangqiBoard board, Side side) {
        if (!isCheck(board, side)) {
            return false;
        }
        List<Move> legalMoves = MoveValidator.generateLegalMoves(board, side);
        return legalMoves.isEmpty();
    }

    /**
     * Kiểm tra xem bên `side` có bị hết nước đi (Stalemate) hay không.
     * Điều kiện: Tướng KHÔNG bị chiếu NHƯNG không còn bất kỳ nước cờ hợp lệ nào để đi.
     * Theo luật Cờ Tướng: Bên bị hết nước đi bị xử THUA.
     */
    public static boolean isStalemate(XiangqiBoard board, Side side) {
        if (isCheck(board, side)) {
            return false;
        }
        List<Move> legalMoves = MoveValidator.generateLegalMoves(board, side);
        return legalMoves.isEmpty();
    }

    /**
     * Đánh giá trạng thái ván cờ hiện tại cho bên đến lượt đi.
     */
    public static GameState evaluateGameState(XiangqiBoard board) {
        Side currentTurn = board.getCurrentTurn();

        // 1. Kiểm tra hòa 60 nước không ăn quân
        if (board.getHalfMoveClock() >= 120) { // 120 half-moves = 60 full moves
            return GameState.DRAW_BY_RULE_60_MOVES;
        }

        boolean inCheck = isCheck(board, currentTurn);
        List<Move> legalMoves = MoveValidator.generateLegalMoves(board, currentTurn);

        if (legalMoves.isEmpty()) {
            return inCheck ? GameState.CHECKMATE : GameState.STALEMATE;
        }

        return inCheck ? GameState.CHECK : GameState.IN_PROGRESS;
    }
}
