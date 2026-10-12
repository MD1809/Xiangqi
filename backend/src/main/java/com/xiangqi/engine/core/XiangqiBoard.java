package com.xiangqi.engine.core;

import com.xiangqi.engine.model.Move;
import com.xiangqi.engine.model.Piece;
import com.xiangqi.engine.model.PieceType;
import com.xiangqi.engine.model.Position;
import com.xiangqi.engine.model.Side;

public class XiangqiBoard {
    public static final int FILES = 9; // 0..8
    public static final int RANKS = 10; // 0..9

    private final Piece[][] grid;
    private Side currentTurn;
    private int halfMoveClock; // For 60-move rule
    private int fullMoveNumber; // Starting at 1

    public XiangqiBoard() {
        this.grid = new Piece[FILES][RANKS];
        this.currentTurn = Side.RED;
        this.halfMoveClock = 0;
        this.fullMoveNumber = 1;
    }

    public Piece getPiece(int x, int y) {
        if (!Position.isValid(x, y)) {
            return null;
        }
        return grid[x][y];
    }

    public Piece getPiece(Position pos) {
        return getPiece(pos.getX(), pos.getY());
    }

    public void setPiece(int x, int y, Piece piece) {
        if (Position.isValid(x, y)) {
            grid[x][y] = piece;
        }
    }

    public void setPiece(Position pos, Piece piece) {
        setPiece(pos.getX(), pos.getY(), piece);
    }

    public Piece removePiece(Position pos) {
        Piece existing = getPiece(pos);
        setPiece(pos, null);
        return existing;
    }

    public void clear() {
        for (int x = 0; x < FILES; x++) {
            for (int y = 0; y < RANKS; y++) {
                grid[x][y] = null;
            }
        }
        this.currentTurn = Side.RED;
        this.halfMoveClock = 0;
        this.fullMoveNumber = 1;
    }

    /**
     * Set up standard Xiangqi starting position.
     * Red at y=0..3, Black at y=6..9.
     */
    public void setupInitialPosition() {
        clear();

        // 1. Bên Đỏ (y = 0..3)
        // Hàng 0: R N B A K A B N R
        grid[0][0] = Piece.of(PieceType.ROOK, Side.RED);
        grid[1][0] = Piece.of(PieceType.KNIGHT, Side.RED);
        grid[2][0] = Piece.of(PieceType.BISHOP, Side.RED);
        grid[3][0] = Piece.of(PieceType.ADVISOR, Side.RED);
        grid[4][0] = Piece.of(PieceType.KING, Side.RED);
        grid[5][0] = Piece.of(PieceType.ADVISOR, Side.RED);
        grid[6][0] = Piece.of(PieceType.BISHOP, Side.RED);
        grid[7][0] = Piece.of(PieceType.KNIGHT, Side.RED);
        grid[8][0] = Piece.of(PieceType.ROOK, Side.RED);

        // Hàng 2: Pháo tại x=1 và x=7
        grid[1][2] = Piece.of(PieceType.CANNON, Side.RED);
        grid[7][2] = Piece.of(PieceType.CANNON, Side.RED);

        // Hàng 3: Tốt tại x=0, 2, 4, 6, 8
        for (int x = 0; x < FILES; x += 2) {
            grid[x][3] = Piece.of(PieceType.PAWN, Side.RED);
        }

        // 2. Bên Đen (y = 6..9)
        // Hàng 9: r n b a k a b n r
        grid[0][9] = Piece.of(PieceType.ROOK, Side.BLACK);
        grid[1][9] = Piece.of(PieceType.KNIGHT, Side.BLACK);
        grid[2][9] = Piece.of(PieceType.BISHOP, Side.BLACK);
        grid[3][9] = Piece.of(PieceType.ADVISOR, Side.BLACK);
        grid[4][9] = Piece.of(PieceType.KING, Side.BLACK);
        grid[5][9] = Piece.of(PieceType.ADVISOR, Side.BLACK);
        grid[6][9] = Piece.of(PieceType.BISHOP, Side.BLACK);
        grid[7][9] = Piece.of(PieceType.KNIGHT, Side.BLACK);
        grid[8][9] = Piece.of(PieceType.ROOK, Side.BLACK);

        // Hàng 7: Pháo tại x=1 và x=7
        grid[1][7] = Piece.of(PieceType.CANNON, Side.BLACK);
        grid[7][7] = Piece.of(PieceType.CANNON, Side.BLACK);

        // Hàng 6: Tốt tại x=0, 2, 4, 6, 8
        for (int x = 0; x < FILES; x += 2) {
            grid[x][6] = Piece.of(PieceType.PAWN, Side.BLACK);
        }

        this.currentTurn = Side.RED;
        this.halfMoveClock = 0;
        this.fullMoveNumber = 1;
    }

    public Position findKing(Side side) {
        for (int x = 3; x <= 5; x++) {
            int minY = (side == Side.RED) ? 0 : 7;
            int maxY = (side == Side.RED) ? 2 : 9;
            for (int y = minY; y <= maxY; y++) {
                Piece p = grid[x][y];
                if (p != null && p.getType() == PieceType.KING && p.getSide() == side) {
                    return Position.of(x, y);
                }
            }
        }
        // Fallback search full board if king was moved abnormally in custom test
        for (int x = 0; x < FILES; x++) {
            for (int y = 0; y < RANKS; y++) {
                Piece p = grid[x][y];
                if (p != null && p.getType() == PieceType.KING && p.getSide() == side) {
                    return Position.of(x, y);
                }
            }
        }
        return null;
    }

    /**
     * Applies a move directly on this board (destructive).
     */
    public Move makeMove(Position from, Position to) {
        Piece mover = getPiece(from);
        if (mover == null) {
            throw new IllegalArgumentException("No piece at " + from);
        }
        Piece captured = getPiece(to);
        setPiece(from, null);
        setPiece(to, mover);

        if (captured != null) {
            halfMoveClock = 0;
        } else {
            halfMoveClock++;
        }

        if (currentTurn == Side.BLACK) {
            fullMoveNumber++;
        }
        currentTurn = currentTurn.opponent();

        return new Move(from, to, mover, captured);
    }

    public void undoMove(Move move) {
        if (move == null) return;
        setPiece(move.getFrom(), move.getMovedPiece());
        setPiece(move.getTo(), move.getCapturedPiece());
        currentTurn = currentTurn.opponent();
        if (currentTurn == Side.BLACK) {
            fullMoveNumber--;
        }
        // Notice: accurate halfMoveClock rollback in full engine usually uses history stack
    }

    public XiangqiBoard copy() {
        XiangqiBoard clone = new XiangqiBoard();
        for (int x = 0; x < FILES; x++) {
            for (int y = 0; y < RANKS; y++) {
                clone.grid[x][y] = this.grid[x][y];
            }
        }
        clone.currentTurn = this.currentTurn;
        clone.halfMoveClock = this.halfMoveClock;
        clone.fullMoveNumber = this.fullMoveNumber;
        return clone;
    }

    public Side getCurrentTurn() {
        return currentTurn;
    }

    public void setCurrentTurn(Side currentTurn) {
        this.currentTurn = currentTurn;
    }

    public int getHalfMoveClock() {
        return halfMoveClock;
    }

    public void setHalfMoveClock(int halfMoveClock) {
        this.halfMoveClock = halfMoveClock;
    }

    public int getFullMoveNumber() {
        return fullMoveNumber;
    }

    public void setFullMoveNumber(int fullMoveNumber) {
        this.fullMoveNumber = fullMoveNumber;
    }
}
