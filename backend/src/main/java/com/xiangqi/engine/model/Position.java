package com.xiangqi.engine.model;

import java.util.Objects;

public class Position {
    private final int x; // 0..8
    private final int y; // 0..9

    public Position(int x, int y) {
        if (!isValid(x, y)) {
            throw new IllegalArgumentException("Position out of bounds: (" + x + ", " + y + ")");
        }
        this.x = x;
        this.y = y;
    }

    public static Position of(int x, int y) {
        return new Position(x, y);
    }

    public static boolean isValid(int x, int y) {
        return x >= 0 && x <= 8 && y >= 0 && y <= 9;
    }

    public int getX() {
        return x;
    }

    public int getY() {
        return y;
    }

    public boolean inRedPalace() {
        return x >= 3 && x <= 5 && y >= 0 && y <= 2;
    }

    public boolean inBlackPalace() {
        return x >= 3 && x <= 5 && y >= 7 && y <= 9;
    }

    public boolean inPalace(Side side) {
        return side == Side.RED ? inRedPalace() : inBlackPalace();
    }

    public boolean isAcrossRiver(Side side) {
        return side == Side.RED ? (y >= 5) : (y <= 4);
    }

    /**
     * Converts to string format: e.g. "x,y" or standard algebraic "a0".."i9"
     */
    public String toAlgebraic() {
        char colChar = (char) ('a' + x);
        return "" + colChar + y;
    }

    public static Position fromAlgebraic(String alg) {
        if (alg == null || alg.length() < 2) {
            throw new IllegalArgumentException("Invalid algebraic position: " + alg);
        }
        int col = alg.charAt(0) - 'a';
        int row = Integer.parseInt(alg.substring(1));
        return new Position(col, row);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Position position)) return false;
        return x == position.x && y == position.y;
    }

    @Override
    public int hashCode() {
        return Objects.hash(x, y);
    }

    @Override
    public String toString() {
        return "(" + x + "," + y + ")";
    }
}
