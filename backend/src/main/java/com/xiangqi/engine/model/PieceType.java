package com.xiangqi.engine.model;

public enum PieceType {
    KING('k', "Tướng/Soái"),
    ADVISOR('a', "Sĩ"),
    BISHOP('b', "Tượng"),
    KNIGHT('n', "Mã"),
    ROOK('r', "Xe"),
    CANNON('c', "Pháo"),
    PAWN('p', "Tốt/Binh");

    private final char fenChar;
    private final String vietnameseName;

    PieceType(char fenChar, String vietnameseName) {
        this.fenChar = fenChar;
        this.vietnameseName = vietnameseName;
    }

    public char getFenChar() {
        return fenChar;
    }

    public String getVietnameseName() {
        return vietnameseName;
    }

    public static PieceType fromFenChar(char c) {
        char lower = Character.toLowerCase(c);
        for (PieceType type : values()) {
            if (type.fenChar == lower) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown piece char: " + c);
    }
}
