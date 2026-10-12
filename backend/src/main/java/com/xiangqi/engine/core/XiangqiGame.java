package com.xiangqi.engine.core;

import com.xiangqi.engine.model.Move;
import com.xiangqi.engine.model.Piece;
import com.xiangqi.engine.model.Position;
import com.xiangqi.engine.model.Side;

import java.util.ArrayList;
import java.util.List;

public class XiangqiGame {

    private final XiangqiBoard board;
    private final List<Move> moveHistory;

    public XiangqiGame() {
        this.board = new XiangqiBoard();
        this.board.setupInitialPosition();
        this.moveHistory = new ArrayList<>();
    }

    public XiangqiGame(String fen) {
        this.board = FENParser.parse(fen);
        this.moveHistory = new ArrayList<>();
    }

    public XiangqiBoard getBoard() {
        return board;
    }

    public Side getCurrentTurn() {
        return board.getCurrentTurn();
    }

    public List<Move> getMoveHistory() {
        return new ArrayList<>(moveHistory);
    }

    public List<Position> getLegalDestinations(Position from) {
        Piece piece = board.getPiece(from);
        if (piece == null || piece.getSide() != board.getCurrentTurn()) {
            return List.of();
        }

        List<Position> destinations = new ArrayList<>();
        for (int x = 0; x < XiangqiBoard.FILES; x++) {
            for (int y = 0; y < XiangqiBoard.RANKS; y++) {
                Position to = Position.of(x, y);
                if (MoveValidator.isLegalMove(board, from, to)) {
                    destinations.add(to);
                }
            }
        }
        return destinations;
    }

    public boolean makeMove(Position from, Position to) {
        Piece piece = board.getPiece(from);
        if (piece == null || piece.getSide() != board.getCurrentTurn()) {
            return false;
        }

        if (!MoveValidator.isLegalMove(board, from, to)) {
            return false;
        }

        Move executedMove = board.makeMove(from, to);
        moveHistory.add(executedMove);
        return true;
    }

    public CheckmateDetector.GameState getGameState() {
        return CheckmateDetector.evaluateGameState(board);
    }

    public boolean isCheck() {
        return CheckmateDetector.isCheck(board, board.getCurrentTurn());
    }

    public String toFEN() {
        return FENParser.toFEN(board);
    }
}
