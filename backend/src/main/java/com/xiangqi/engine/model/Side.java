package com.xiangqi.engine.model;

public enum Side {
    RED,
    BLACK;

    public Side opponent() {
        return this == RED ? BLACK : RED;
    }
}
