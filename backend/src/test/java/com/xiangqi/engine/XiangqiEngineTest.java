package com.xiangqi.engine;

import com.xiangqi.engine.core.CheckmateDetector;
import com.xiangqi.engine.core.FENParser;
import com.xiangqi.engine.core.MoveValidator;
import com.xiangqi.engine.core.XiangqiBoard;
import com.xiangqi.engine.core.XiangqiGame;
import com.xiangqi.engine.model.Piece;
import com.xiangqi.engine.model.PieceType;
import com.xiangqi.engine.model.Position;
import com.xiangqi.engine.model.Side;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Bộ Kiểm Thử Luật Cờ Tướng - Xiangqi Core Engine Tests")
class XiangqiEngineTest {

    private XiangqiBoard board;

    @BeforeEach
    void setUp() {
        board = new XiangqiBoard();
    }

    // --- TEST 1: Khởi tạo bàn cờ ban đầu ---
    @Test
    @DisplayName("1. Khởi tạo bàn cờ chuẩn xuất phát (32 quân, đúng vị trí)")
    void testInitialBoardSetup() {
        board.setupInitialPosition();

        assertEquals(Side.RED, board.getCurrentTurn());
        assertEquals(Piece.of(PieceType.KING, Side.RED), board.getPiece(4, 0));
        assertEquals(Piece.of(PieceType.KING, Side.BLACK), board.getPiece(4, 9));

        // Kiểm tra 2 Pháo Đỏ
        assertEquals(Piece.of(PieceType.CANNON, Side.RED), board.getPiece(1, 2));
        assertEquals(Piece.of(PieceType.CANNON, Side.RED), board.getPiece(7, 2));

        // Kiểm tra 5 Tốt Đỏ
        for (int x = 0; x < 9; x += 2) {
            assertEquals(Piece.of(PieceType.PAWN, Side.RED), board.getPiece(x, 3));
        }

        // Đếm tổng số quân
        int redCount = 0;
        int blackCount = 0;
        for (int x = 0; x < 9; x++) {
            for (int y = 0; y < 10; y++) {
                Piece p = board.getPiece(x, y);
                if (p != null) {
                    if (p.getSide() == Side.RED) redCount++;
                    else blackCount++;
                }
            }
        }
        assertEquals(16, redCount);
        assertEquals(16, blackCount);
    }

    // --- TEST 2: FEN Parser hai chiều ---
    @Test
    @DisplayName("2. Phân tích cú pháp FEN khởi đầu và xuất FEN chuẩn xác")
    void testFENParserInitialPosition() {
        XiangqiBoard parsedBoard = FENParser.parse(FENParser.INITIAL_FEN);
        assertEquals(Side.RED, parsedBoard.getCurrentTurn());
        assertEquals(Piece.of(PieceType.KING, Side.RED), parsedBoard.getPiece(4, 0));
        assertEquals(Piece.of(PieceType.KING, Side.BLACK), parsedBoard.getPiece(4, 9));

        String exportedFen = FENParser.toFEN(parsedBoard);
        assertTrue(exportedFen.startsWith("rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w"));
    }

    // --- TEST 3: Nước đi tự do của Xe ---
    @Test
    @DisplayName("3. Xe di chuyển ngang và dọc khi đường đi thông thoáng")
    void testRookMovesFree() {
        // Đặt Xe Đỏ tại (4, 4), Tướng Đỏ ở (4, 0), Tướng Đen ở (3, 9) (khác cột để tránh lộ mặt tướng)
        board.setPiece(4, 0, Piece.of(PieceType.KING, Side.RED));
        board.setPiece(3, 9, Piece.of(PieceType.KING, Side.BLACK));
        board.setPiece(4, 4, Piece.of(PieceType.ROOK, Side.RED));

        // Xe đi ngang sang trái (1, 4) và phải (7, 4)
        assertTrue(MoveValidator.isLegalMove(board, Position.of(4, 4), Position.of(1, 4)));
        assertTrue(MoveValidator.isLegalMove(board, Position.of(4, 4), Position.of(7, 4)));

        // Xe đi dọc lên (4, 6) và xuống (4, 1)
        assertTrue(MoveValidator.isLegalMove(board, Position.of(4, 4), Position.of(4, 6)));
        assertTrue(MoveValidator.isLegalMove(board, Position.of(4, 4), Position.of(4, 1)));

        // Xe không được đi chéo
        assertFalse(MoveValidator.isLegalMove(board, Position.of(4, 4), Position.of(5, 5)));
    }

    // --- TEST 4: Xe bị cản bởi quân cùng phe ---
    @Test
    @DisplayName("4. Xe không thể nhảy qua hoặc ăn quân cùng phe")
    void testRookBlockedByFriendlyPiece() {
        board.setupInitialPosition();
        // Xe Đỏ góc (0, 0) bị Mã (1, 0) chặn ngang và (0, 1) trống nhưng Tốt (0, 3) chặn
        // Đi sang (1, 0) ăn Mã cùng phe -> Không hợp lệ
        assertFalse(MoveValidator.isLegalMove(board, Position.of(0, 0), Position.of(1, 0)));
        // Nhảy qua Mã tới (2, 0) -> Không hợp lệ
        assertFalse(MoveValidator.isLegalMove(board, Position.of(0, 0), Position.of(2, 0)));
        // Đi thẳng lên (0, 1) và (0, 2) -> Hợp lệ vì đường trống
        assertTrue(MoveValidator.isLegalMove(board, Position.of(0, 0), Position.of(0, 1)));
        assertTrue(MoveValidator.isLegalMove(board, Position.of(0, 0), Position.of(0, 2)));
        // Nhảy qua Tốt (0, 3) lên (0, 4) -> Không hợp lệ
        assertFalse(MoveValidator.isLegalMove(board, Position.of(0, 0), Position.of(0, 4)));
    }

    // --- TEST 5: Pháo di chuyển khi không ăn quân ---
    @Test
    @DisplayName("5. Pháo đi ngang dọc tự do khi không có quân cản (như Xe)")
    void testCannonNonCapturingMove() {
        board.setupInitialPosition();
        // Pháo Đỏ tại (1, 2) đi ngang sang (4, 2) qua tâm
        assertTrue(MoveValidator.isLegalMove(board, Position.of(1, 2), Position.of(4, 2)));
        // Pháo đi ngang tới (7, 2) là nơi có Pháo thứ 2 của Đỏ -> Không hợp lệ
        assertFalse(MoveValidator.isLegalMove(board, Position.of(1, 2), Position.of(7, 2)));
    }

    // --- TEST 6: Pháo ăn quân có đúng 1 ngòi ---
    @Test
    @DisplayName("6. Pháo ăn quân khi có đúng 1 quân làm ngòi ở giữa")
    void testCannonCaptureWithExactlyOneScreen() {
        board.setPiece(4, 0, Piece.of(PieceType.KING, Side.RED));
        board.setPiece(5, 9, Piece.of(PieceType.KING, Side.BLACK));

        // Pháo Đỏ tại (1, 2), Ngòi tại (1, 5), Quân đối phương tại (1, 8)
        board.setPiece(1, 2, Piece.of(PieceType.CANNON, Side.RED));
        board.setPiece(1, 5, Piece.of(PieceType.PAWN, Side.BLACK)); // Ngòi
        board.setPiece(1, 8, Piece.of(PieceType.ROOK, Side.BLACK)); // Mục tiêu

        assertTrue(MoveValidator.isLegalMove(board, Position.of(1, 2), Position.of(1, 8)));
    }

    // --- TEST 7: Pháo không thể ăn khi không có ngòi ---
    @Test
    @DisplayName("7. Pháo không thể ăn quân nếu đường đi trống không có ngòi")
    void testCannonCannotCaptureWithoutScreen() {
        board.setPiece(4, 0, Piece.of(PieceType.KING, Side.RED));
        board.setPiece(5, 9, Piece.of(PieceType.KING, Side.BLACK));

        board.setPiece(1, 2, Piece.of(PieceType.CANNON, Side.RED));
        board.setPiece(1, 8, Piece.of(PieceType.ROOK, Side.BLACK)); // Không có ngòi ở giữa

        assertFalse(MoveValidator.isLegalMove(board, Position.of(1, 2), Position.of(1, 8)));
    }

    // --- TEST 8: Pháo không thể ăn khi có 2 ngòi trở lên ---
    @Test
    @DisplayName("8. Pháo không thể ăn quân khi có 2 quân trở lên cản giữa")
    void testCannonCannotCaptureWithTwoScreens() {
        board.setPiece(4, 0, Piece.of(PieceType.KING, Side.RED));
        board.setPiece(5, 9, Piece.of(PieceType.KING, Side.BLACK));

        board.setPiece(1, 2, Piece.of(PieceType.CANNON, Side.RED));
        board.setPiece(1, 4, Piece.of(PieceType.PAWN, Side.RED));   // Ngòi 1
        board.setPiece(1, 6, Piece.of(PieceType.PAWN, Side.BLACK)); // Ngòi 2
        board.setPiece(1, 8, Piece.of(PieceType.ROOK, Side.BLACK)); // Mục tiêu

        assertFalse(MoveValidator.isLegalMove(board, Position.of(1, 2), Position.of(1, 8)));
    }

    // --- TEST 9: Mã nhảy chữ L tự do ---
    @Test
    @DisplayName("9. Mã di chuyển chữ L chuẩn khi không có cản chân")
    void testKnightValidLMove() {
        board.setPiece(4, 0, Piece.of(PieceType.KING, Side.RED));
        board.setPiece(3, 9, Piece.of(PieceType.KING, Side.BLACK));
        board.setPiece(4, 4, Piece.of(PieceType.KNIGHT, Side.RED)); // Mã tại giữa bàn cờ

        // 8 hướng nhảy của Mã
        assertTrue(MoveValidator.isLegalMove(board, Position.of(4, 4), Position.of(5, 6)));
        assertTrue(MoveValidator.isLegalMove(board, Position.of(4, 4), Position.of(3, 6)));
        assertTrue(MoveValidator.isLegalMove(board, Position.of(4, 4), Position.of(6, 5)));
        assertTrue(MoveValidator.isLegalMove(board, Position.of(4, 4), Position.of(6, 3)));
        assertTrue(MoveValidator.isLegalMove(board, Position.of(4, 4), Position.of(5, 2)));
        assertTrue(MoveValidator.isLegalMove(board, Position.of(4, 4), Position.of(3, 2)));
        assertTrue(MoveValidator.isLegalMove(board, Position.of(4, 4), Position.of(2, 5)));
        assertTrue(MoveValidator.isLegalMove(board, Position.of(4, 4), Position.of(2, 3)));
    }

    // --- TEST 10: Cản chân Mã hướng dọc ---
    @Test
    @DisplayName("10. Cản chân Mã theo hướng dọc (chân tiến lên bị chặn)")
    void testKnightBlockedByLegVertical() {
        board.setPiece(4, 0, Piece.of(PieceType.KING, Side.RED));
        board.setPiece(3, 9, Piece.of(PieceType.KING, Side.BLACK));

        board.setPiece(4, 4, Piece.of(PieceType.KNIGHT, Side.RED));
        // Đặt quân cản tại (4, 5) - ngay trên đầu Mã
        board.setPiece(4, 5, Piece.of(PieceType.PAWN, Side.BLACK));

        // 2 nước nhảy tiến lên (3, 6) và (5, 6) phải BỊ CẢN
        assertFalse(MoveValidator.isLegalMove(board, Position.of(4, 4), Position.of(3, 6)));
        assertFalse(MoveValidator.isLegalMove(board, Position.of(4, 4), Position.of(5, 6)));

        // Các hướng khác không bị cản vẫn đi được
        assertTrue(MoveValidator.isLegalMove(board, Position.of(4, 4), Position.of(6, 5)));
        assertTrue(MoveValidator.isLegalMove(board, Position.of(4, 4), Position.of(5, 2)));
    }

    // --- TEST 11: Cản chân Mã hướng ngang ---
    @Test
    @DisplayName("11. Cản chân Mã theo hướng ngang (chân sang phải bị chặn)")
    void testKnightBlockedByLegHorizontal() {
        board.setPiece(4, 0, Piece.of(PieceType.KING, Side.RED));
        board.setPiece(3, 9, Piece.of(PieceType.KING, Side.BLACK));

        board.setPiece(4, 4, Piece.of(PieceType.KNIGHT, Side.RED));
        // Đặt quân cản tại (5, 4) - ngay bên phải Mã
        board.setPiece(5, 4, Piece.of(PieceType.PAWN, Side.RED));

        // 2 nước nhảy sang phải (6, 5) và (6, 3) phải BỊ CẢN
        assertFalse(MoveValidator.isLegalMove(board, Position.of(4, 4), Position.of(6, 5)));
        assertFalse(MoveValidator.isLegalMove(board, Position.of(4, 4), Position.of(6, 3)));

        // Hướng tiến lên (5, 6) vẫn đi được
        assertTrue(MoveValidator.isLegalMove(board, Position.of(4, 4), Position.of(5, 6)));
    }

    // --- TEST 12: Tượng di chuyển chéo 2 ô ---
    @Test
    @DisplayName("12. Tượng di chuyển chéo đúng 2 ô (2x2) trong sân nhà")
    void testBishopDiagonalMove() {
        board.setPiece(4, 0, Piece.of(PieceType.KING, Side.RED));
        board.setPiece(3, 9, Piece.of(PieceType.KING, Side.BLACK));

        board.setPiece(2, 0, Piece.of(PieceType.BISHOP, Side.RED));
        // Nhảy chéo tới (4, 2) hoặc (0, 2)
        assertTrue(MoveValidator.isLegalMove(board, Position.of(2, 0), Position.of(4, 2)));
        assertTrue(MoveValidator.isLegalMove(board, Position.of(2, 0), Position.of(0, 2)));

        // Không được nhảy 1 ô chéo (như Sĩ)
        assertFalse(MoveValidator.isLegalMove(board, Position.of(2, 0), Position.of(3, 1)));
    }

    // --- TEST 13: Cản mắt Tượng ---
    @Test
    @DisplayName("13. Cản mắt Tượng khi có quân nằm giữa đường chéo")
    void testBishopBlockedByEye() {
        board.setPiece(4, 0, Piece.of(PieceType.KING, Side.RED));
        board.setPiece(3, 9, Piece.of(PieceType.KING, Side.BLACK));

        board.setPiece(2, 0, Piece.of(PieceType.BISHOP, Side.RED));
        // Đặt quân cản tại mắt Tượng (3, 1)
        board.setPiece(3, 1, Piece.of(PieceType.PAWN, Side.BLACK));

        // Nước nhảy tới (4, 2) bị cản
        assertFalse(MoveValidator.isLegalMove(board, Position.of(2, 0), Position.of(4, 2)));
        // Hướng còn lại (0, 2) mắt (1, 1) trống nên vẫn đi được
        assertTrue(MoveValidator.isLegalMove(board, Position.of(2, 0), Position.of(0, 2)));
    }

    // --- TEST 14: Tượng không được qua sông ---
    @Test
    @DisplayName("14. Tượng tuyệt đối không được qua sông (y <= 4 với Đỏ)")
    void testBishopCannotCrossRiver() {
        board.setPiece(4, 0, Piece.of(PieceType.KING, Side.RED));
        board.setPiece(3, 9, Piece.of(PieceType.KING, Side.BLACK));

        // Tượng Đỏ đứng tại mép sông (2, 4)
        board.setPiece(2, 4, Piece.of(PieceType.BISHOP, Side.RED));

        // Nước nhảy qua sông tới (4, 6) hoặc (0, 6) phải BỊ TỪ CHỐI
        assertFalse(MoveValidator.isLegalMove(board, Position.of(2, 4), Position.of(4, 6)));
        assertFalse(MoveValidator.isLegalMove(board, Position.of(2, 4), Position.of(0, 6)));

        // Nhảy lùi về sân nhà (0, 2) hoặc (4, 2) thì được
        assertTrue(MoveValidator.isLegalMove(board, Position.of(2, 4), Position.of(4, 2)));
    }

    // --- TEST 15: Sĩ di chuyển trong Cung ---
    @Test
    @DisplayName("15. Sĩ chỉ di chuyển chéo 1 ô trong phạm vi Cung")
    void testAdvisorMoveInsidePalace() {
        board.setPiece(4, 0, Piece.of(PieceType.KING, Side.RED));
        board.setPiece(4, 9, Piece.of(PieceType.KING, Side.BLACK));

        board.setPiece(3, 0, Piece.of(PieceType.ADVISOR, Side.RED));
        // Sĩ đi chéo vào tâm cung (4, 1) -> Hợp lệ
        assertTrue(MoveValidator.isLegalMove(board, Position.of(3, 0), Position.of(4, 1)));

        // Sĩ đi thẳng lên (3, 1) -> Sai luật
        assertFalse(MoveValidator.isLegalMove(board, Position.of(3, 0), Position.of(3, 1)));
    }

    // --- TEST 16: Sĩ không được ra khỏi Cung ---
    @Test
    @DisplayName("16. Sĩ tuyệt đối không được bước ra ngoài Cung")
    void testAdvisorCannotLeavePalace() {
        board.setPiece(4, 0, Piece.of(PieceType.KING, Side.RED));
        board.setPiece(4, 9, Piece.of(PieceType.KING, Side.BLACK));

        // Sĩ Đỏ tại (5, 2) - góc trên bên phải của Cung Đỏ
        board.setPiece(5, 2, Piece.of(PieceType.ADVISOR, Side.RED));

        // Nhảy chéo ra ngoài cung tới (6, 3) -> Bị từ chối
        assertFalse(MoveValidator.isLegalMove(board, Position.of(5, 2), Position.of(6, 3)));
        // Lùi về tâm cung (4, 1) -> Hợp lệ
        assertTrue(MoveValidator.isLegalMove(board, Position.of(5, 2), Position.of(4, 1)));
    }

    // --- TEST 17: Tướng di chuyển trong Cung ---
    @Test
    @DisplayName("17. Tướng đi ngang/dọc 1 ô trong Cung")
    void testKingMoveInsidePalace() {
        board.setPiece(4, 1, Piece.of(PieceType.KING, Side.RED));
        board.setPiece(4, 9, Piece.of(PieceType.KING, Side.BLACK));
        // Đặt 1 quân chắn cột 4 để không vi phạm lộ mặt tướng khi kiểm tra
        board.setPiece(4, 5, Piece.of(PieceType.PAWN, Side.RED));

        // Tướng đi ngang sang (3, 1) hoặc (5, 1)
        assertTrue(MoveValidator.isLegalMove(board, Position.of(4, 1), Position.of(3, 1)));
        assertTrue(MoveValidator.isLegalMove(board, Position.of(4, 1), Position.of(5, 1)));

        // Tướng đi dọc xuống (4, 0) hoặc lên (4, 2)
        assertTrue(MoveValidator.isLegalMove(board, Position.of(4, 1), Position.of(4, 0)));
        assertTrue(MoveValidator.isLegalMove(board, Position.of(4, 1), Position.of(4, 2)));

        // Tướng không được đi chéo
        assertFalse(MoveValidator.isLegalMove(board, Position.of(4, 1), Position.of(5, 2)));
    }

    // --- TEST 18: Tướng không được ra khỏi Cung ---
    @Test
    @DisplayName("18. Tướng không được đi ra ngoài Cung")
    void testKingCannotLeavePalace() {
        board.setPiece(3, 1, Piece.of(PieceType.KING, Side.RED));
        board.setPiece(5, 9, Piece.of(PieceType.KING, Side.BLACK));

        // Bước sang trái ra cột 2 (2, 1) ngoài cung -> Bị từ chối
        assertFalse(MoveValidator.isLegalMove(board, Position.of(3, 1), Position.of(2, 1)));
    }

    // --- TEST 19: Luật Lộ Mặt Tướng khi rút quân cản ---
    @Test
    @DisplayName("19. Luật Lộ Mặt Tướng: Không được đi quân chắn khiến 2 tướng nhìn thấy nhau")
    void testFlyingGeneralRule() {
        // Tướng Đỏ (4, 0) và Tướng Đen (4, 9) cùng nằm trên cột 4
        board.setPiece(4, 0, Piece.of(PieceType.KING, Side.RED));
        board.setPiece(4, 9, Piece.of(PieceType.KING, Side.BLACK));

        // Xe Đỏ đứng tại (4, 4) là quân cản duy nhất giữa 2 tướng
        board.setPiece(4, 4, Piece.of(PieceType.ROOK, Side.RED));

        // Nếu Xe Đỏ đi ngang sang (2, 4) -> 2 tướng sẽ đối mặt trực tiếp -> BỊ CẤM
        assertFalse(MoveValidator.isLegalMove(board, Position.of(4, 4), Position.of(2, 4)));

        // Nếu Xe Đỏ đi dọc trên chính cột 4 tới (4, 5) -> Vẫn còn cản -> HỢP LỆ
        assertTrue(MoveValidator.isLegalMove(board, Position.of(4, 4), Position.of(4, 5)));
    }

    // --- TEST 20: Tướng không được tự đi vào cột lộ mặt đối thủ ---
    @Test
    @DisplayName("20. Tướng không được tự bước vào cột đối mặt tướng đối phương")
    void testFlyingGeneralKingMoveIllegal() {
        // Tướng Đen đứng tại (4, 9)
        board.setPiece(4, 9, Piece.of(PieceType.KING, Side.BLACK));
        // Tướng Đỏ đứng tại (3, 0), cột 4 hoàn toàn trống
        board.setPiece(3, 0, Piece.of(PieceType.KING, Side.RED));

        // Tướng Đỏ bước sang phải (4, 0) sẽ đối mặt Tướng Đen -> BỊ CẤM
        assertFalse(MoveValidator.isLegalMove(board, Position.of(3, 0), Position.of(4, 0)));

        // Tướng Đỏ bước lên (3, 1) -> HỢP LỆ
        assertTrue(MoveValidator.isLegalMove(board, Position.of(3, 0), Position.of(3, 1)));
    }

    // --- TEST 21: Tốt chưa qua sông ---
    @Test
    @DisplayName("21. Tốt chưa qua sông chỉ được tiến thẳng 1 ô, không được đi ngang")
    void testPawnBeforeRiver() {
        board.setupInitialPosition();
        // Tốt Đỏ tại (4, 3) tiến thẳng lên (4, 4)
        assertTrue(MoveValidator.isLegalMove(board, Position.of(4, 3), Position.of(4, 4)));

        // Tốt Đỏ đi ngang sang (3, 3) hoặc (5, 3) -> KHÔNG HỢP LỆ
        assertFalse(MoveValidator.isLegalMove(board, Position.of(4, 3), Position.of(3, 3)));
        assertFalse(MoveValidator.isLegalMove(board, Position.of(4, 3), Position.of(5, 3)));
    }

    // --- TEST 22: Tốt đã qua sông ---
    @Test
    @DisplayName("22. Tốt sau khi qua sông được tiến thẳng và đi ngang 1 ô")
    void testPawnAfterRiver() {
        board.setPiece(4, 0, Piece.of(PieceType.KING, Side.RED));
        board.setPiece(4, 9, Piece.of(PieceType.KING, Side.BLACK));

        // Tốt Đỏ tại (4, 6) đã qua sông (y >= 5)
        board.setPiece(4, 6, Piece.of(PieceType.PAWN, Side.RED));
        // Đặt quân chắn lộ mặt tướng
        board.setPiece(4, 5, Piece.of(PieceType.PAWN, Side.BLACK));

        // Tiến thẳng lên (4, 7)
        assertTrue(MoveValidator.isLegalMove(board, Position.of(4, 6), Position.of(4, 7)));
        // Đi ngang sang trái (3, 6) và phải (5, 6)
        assertTrue(MoveValidator.isLegalMove(board, Position.of(4, 6), Position.of(3, 6)));
        assertTrue(MoveValidator.isLegalMove(board, Position.of(4, 6), Position.of(5, 6)));
    }

    // --- TEST 23: Tốt tuyệt đối không được đi lùi ---
    @Test
    @DisplayName("23. Tốt tuyệt đối không được đi lùi dù trước hay sau khi qua sông")
    void testPawnNeverBackward() {
        board.setPiece(4, 0, Piece.of(PieceType.KING, Side.RED));
        board.setPiece(5, 9, Piece.of(PieceType.KING, Side.BLACK));

        // Tốt Đỏ tại (4, 6) lùi về (4, 5) -> BỊ CẤM
        board.setPiece(4, 6, Piece.of(PieceType.PAWN, Side.RED));
        assertFalse(MoveValidator.isLegalMove(board, Position.of(4, 6), Position.of(4, 5)));
    }

    // --- TEST 24: Phát hiện trạng thái Chiếu tướng (Check) ---
    @Test
    @DisplayName("24. Phát hiện chính xác khi Tướng đang bị đối phương Chiếu")
    void testKingInCheck() {
        board.setPiece(4, 0, Piece.of(PieceType.KING, Side.RED));
        board.setPiece(5, 9, Piece.of(PieceType.KING, Side.BLACK));

        // Xe Đen tại (4, 5) chiếu thẳng Tướng Đỏ tại (4, 0)
        board.setPiece(4, 5, Piece.of(PieceType.ROOK, Side.BLACK));

        assertTrue(CheckmateDetector.isCheck(board, Side.RED));
        assertFalse(CheckmateDetector.isCheck(board, Side.BLACK));
    }

    // --- TEST 25: Nước đi bắt buộc phải giải Chiếu ---
    @Test
    @DisplayName("25. Đang bị Chiếu tướng: Chỉ được đi nước cờ giải Chiếu, cấm đi nước khác")
    void testCannotMakeMoveLeavingKingInCheck() {
        board.setPiece(4, 0, Piece.of(PieceType.KING, Side.RED));
        board.setPiece(3, 9, Piece.of(PieceType.KING, Side.BLACK));

        // Xe Đen tại (4, 5) đang chiếu Tướng Đỏ (4, 0)
        board.setPiece(4, 5, Piece.of(PieceType.ROOK, Side.BLACK));

        // Đỏ có Xe tại (0, 0)
        board.setPiece(0, 0, Piece.of(PieceType.ROOK, Side.RED));

        // Xe Đỏ đi (0, 0) lên (0, 2) KHÔNG giải chiếu -> BỊ CẤM
        assertFalse(MoveValidator.isLegalMove(board, Position.of(0, 0), Position.of(0, 2)));

        // Tướng Đỏ né sang (5, 0) thoát chiếu và không bị lộ mặt tướng -> HỢP LỆ
        assertTrue(MoveValidator.isLegalMove(board, Position.of(4, 0), Position.of(5, 0)));

        // Tướng Đỏ né sang (3, 0) sẽ đối mặt Tướng Đen (3, 9) trên cột 3 -> BỊ CẤM
        assertFalse(MoveValidator.isLegalMove(board, Position.of(4, 0), Position.of(3, 0)));
    }

    // --- TEST 26: Thế cờ Chiếu Bí (Checkmate) ---
    @Test
    @DisplayName("26. Phát hiện thế cờ Chiếu Bí (Checkmate - Đối thủ hết đường giải)")
    void testCheckmate() {
        // Tướng Đen kẹt tại góc Cung (3, 9)
        board.setPiece(3, 9, Piece.of(PieceType.KING, Side.BLACK));
        board.setPiece(4, 0, Piece.of(PieceType.KING, Side.RED));

        // Sĩ Đen cản các ô thoát
        board.setPiece(4, 8, Piece.of(PieceType.ADVISOR, Side.BLACK));
        board.setPiece(3, 8, Piece.of(PieceType.ADVISOR, Side.BLACK));

        // Xe Đỏ tại (3, 5) chiếu thẳng Tướng Đen tại (3, 9)
        board.setPiece(3, 5, Piece.of(PieceType.ROOK, Side.RED));
        // Xe Đỏ thứ hai tại (2, 9) bảo kê hoặc khống chế
        board.setPiece(2, 9, Piece.of(PieceType.ROOK, Side.RED));

        board.setCurrentTurn(Side.BLACK);

        assertTrue(CheckmateDetector.isCheck(board, Side.BLACK));
        assertTrue(CheckmateDetector.isCheckmate(board, Side.BLACK));
        assertEquals(CheckmateDetector.GameState.CHECKMATE, CheckmateDetector.evaluateGameState(board));
    }

    // --- TEST 27: Thế cờ Hết nước đi (Stalemate -> Xử Thua) ---
    @Test
    @DisplayName("27. Phát hiện Hết Nước Đi (Stalemate - Không bị chiếu nhưng hết nước đi hợp lệ)")
    void testStalemate() {
        // Tướng Đen tại (4, 9), Tướng Đỏ tại (3, 0) (khác cột)
        board.setPiece(4, 9, Piece.of(PieceType.KING, Side.BLACK));
        board.setPiece(3, 0, Piece.of(PieceType.KING, Side.RED));

        // Xe Đỏ 1 tại (3, 8) khống chế cột 3 (ngăn Tướng sang 3, 9)
        board.setPiece(3, 8, Piece.of(PieceType.ROOK, Side.RED));
        // Xe Đỏ 2 tại (5, 8) khống chế cột 5 (ngăn Tướng sang 5, 9)
        board.setPiece(5, 8, Piece.of(PieceType.ROOK, Side.RED));
        // Mã Đỏ tại (3, 6) khống chế ô (4, 8) (nhảy L tới 4, 8 nhưng không chiếu tới 4, 9)
        board.setPiece(3, 6, Piece.of(PieceType.KNIGHT, Side.RED));

        board.setCurrentTurn(Side.BLACK);

        assertFalse(CheckmateDetector.isCheck(board, Side.BLACK)); // Đang không bị chiếu trực tiếp tại (4, 9)
        assertTrue(CheckmateDetector.isStalemate(board, Side.BLACK));
        assertEquals(CheckmateDetector.GameState.STALEMATE, CheckmateDetector.evaluateGameState(board));
    }

    // --- TEST 28: Trận đấu thực tế theo lượt với XiangqiGame facade ---
    @Test
    @DisplayName("28. Mô phỏng khai cuộc thực tế: Pháo 2 bình 5 (b2-e2), Đen lên Mã 8 tấn 7 (h9-g7)")
    void testXiangqiGamePlaySequence() {
        XiangqiGame game = new XiangqiGame();
        assertEquals(Side.RED, game.getCurrentTurn());

        // Nước 1: Đỏ đi Pháo 2 bình 5: (1, 2) sang (4, 2)
        boolean move1 = game.makeMove(Position.of(1, 2), Position.of(4, 2));
        assertTrue(move1);
        assertEquals(Side.BLACK, game.getCurrentTurn());
        assertEquals(1, game.getMoveHistory().size());

        // Nước 2: Đen lên Mã 8 tấn 7: (7, 9) sang (6, 7)
        boolean move2 = game.makeMove(Position.of(7, 9), Position.of(6, 7));
        assertTrue(move2);
        assertEquals(Side.RED, game.getCurrentTurn());
        assertEquals(2, game.getMoveHistory().size());

        // Thử đi một nước sai luật: Xe Đỏ (0, 0) nhảy xuyên qua quân mình sang (5, 0)
        boolean illegalMove = game.makeMove(Position.of(0, 0), Position.of(5, 0));
        assertFalse(illegalMove);
        assertEquals(Side.RED, game.getCurrentTurn()); // Lượt đi vẫn giữ nguyên
    }
}
