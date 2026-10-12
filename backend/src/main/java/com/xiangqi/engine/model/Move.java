package com.xiangqi.engine.model;

import java.util.Objects;

public class Move {
    private final Position from;
    private final Position to;
    private final Piece movedPiece;
    private final Piece capturedPiece;

    public Move(Position from, Position to, Piece movedPiece, Piece capturedPiece) {
        this.from = Objects.requireNonNull(from, "from cannot be null");
        this.to = Objects.requireNonNull(to, "to cannot be null");
        this.movedPiece = Objects.requireNonNull(movedPiece, "movedPiece cannot be null");
        this.capturedPiece = capturedPiece;
    }

    public Move(Position from, Position to, Piece movedPiece) {
        this(from, to, movedPiece, null);
    }

    public Position getFrom() {
        return from;
    }

    public Position getTo() {
        return to;
    }

    public Piece getMovedPiece() {
        return movedPiece;
    }

    public Piece getCapturedPiece() {
        return capturedPiece;
    }

    public boolean isCapture() {
        return capturedPiece != null;
    }

    /**
     * Standard UCI-like notation: e.g. "b2e2" or "b2-e2"
     */
    public String toNotation() {
        return from.toAlgebraic() + "-" + to.toAlgebraic();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Move move)) return false;
        return from.equals(move.from) && to.equals(move.to);
    }

    @Override
    public int hashCode() {
        return Objects.hash(from, to);
    }

    @Override
    public String toString() {
        return toNotation() + (capturedPiece != null ? " [x " + capturedPiece.getFenChar() + "]" : "");
    }
}
