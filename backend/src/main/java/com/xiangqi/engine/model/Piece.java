package com.xiangqi.engine.model;

import java.util.Objects;

public class Piece {
    private final PieceType type;
    private final Side side;

    public Piece(PieceType type, Side side) {
        this.type = Objects.requireNonNull(type, "PieceType cannot be null");
        this.side = Objects.requireNonNull(side, "Side cannot be null");
    }

    public static Piece of(PieceType type, Side side) {
        return new Piece(type, side);
    }

    public PieceType getType() {
        return type;
    }

    public Side getSide() {
        return side;
    }

    public char getFenChar() {
        char c = type.getFenChar();
        return side == Side.RED ? Character.toUpperCase(c) : Character.toLowerCase(c);
    }

    public static Piece fromFenChar(char c) {
        Side side = Character.isUpperCase(c) ? Side.RED : Side.BLACK;
        PieceType type = PieceType.fromFenChar(c);
        return new Piece(type, side);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Piece piece)) return false;
        return type == piece.type && side == piece.side;
    }

    @Override
    public int hashCode() {
        return Objects.hash(type, side);
    }

    @Override
    public String toString() {
        return side.name() + " " + type.name() + " (" + getFenChar() + ")";
    }
}
