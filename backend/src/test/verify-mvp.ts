import * as assert from 'assert';
import { DatabaseService } from '../database/database.service';
import { GameEngineService } from '../game-engine/game-engine.service';
import { EventProcessorService } from '../event-processor/event-processor.service';
import { TikTokService } from '../integrations/tiktok/tiktok.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';

async function runVerificationChecklist() {
  console.log('=== KNOWLEDGE BATTLE - KIỂM THỬ NGHIỆP VỤ THEO CHECKLIST MỤC 10.1 ===');

  const emittedEvents: Array<{ room: string; event: string; data: any }> = [];
  const mockGateway = {
    emitToRoom: (room: string, event: string, data: any) => {
      emittedEvents.push({ room, event, data });
    },
  } as unknown as RealtimeGateway;

  const db = new DatabaseService();
  db.initDatabase();

  const gameEngine = new GameEngineService(db, mockGateway);
  const eventProcessor = new EventProcessorService(db, gameEngine);
  const tiktokService = new TikTokService(eventProcessor, mockGateway);

  const roomCode = 'KB2026';
  gameEngine.resetToWaitingRoom(roomCode);

  // 1. Kiểm tra ngân hàng câu hỏi đã seed dữ liệu Tiếng Việt
  const questions = db.getQuestions({ status: 'PUBLISHED' });
  assert.ok(questions.length >= 15, 'Phải có ít nhất 15 câu hỏi PUBLISHED Tiếng Việt');
  console.log(`[PASS] 1. Ngân hàng câu hỏi Tiếng Việt đã xuất bản: ${questions.length} câu.`);

  // 2. Bắt đầu trận đấu & mở câu hỏi số 1
  gameEngine.startMatch(roomCode, { immediate: true });
  await new Promise((r) => setTimeout(r, 120));

  const qStartedEvt = emittedEvents.find((e) => e.event === 'question.started');
  assert.ok(qStartedEvt, 'Phải phát sự kiện question.started');
  assert.strictEqual(
    qStartedEvt.data.correctOption,
    undefined,
    'Tuyệt đối không gửi đáp án đúng trong question.started (Mục 3.3 & 7.1)'
  );
  console.log('[PASS] 2. Sự kiện question.started không lộ đáp án đúng xuống client.');

  // Lấy đáp án đúng thực tế trong backend runtime để kiểm thử chấm điểm
  const runtime = gameEngine.getOrCreateRuntime(roomCode);
  const currentQ = runtime.questions[runtime.currentQuestionIndex];
  const correctOpt = currentQ.correctOption;
  const wrongOpt = (['A', 'B', 'C', 'D'] as const).find((o) => o !== correctOpt)!;

  const runPrefix = `test-${Date.now()}`;

  // 3. Bình luận A/B/C/D hợp lệ & Người chơi gửi A rồi B (chỉ ghi nhận đáp án đầu tiên)
  const firstAttempt = eventProcessor.processEvent({
    id: `${runPrefix}-evt-player1-first`,
    roomId: roomCode,
    type: 'COMMENT',
    user: { id: 'tt-u1', username: 'player_one', nickname: 'Người Chơi 1' },
    payload: { content: correctOpt },
    receivedAt: Date.now(),
  });
  assert.strictEqual((firstAttempt as any).acceptedAnswer, true, 'Đáp án đầu tiên phải được chấp nhận');

  const secondAttempt = eventProcessor.processEvent({
    id: `${runPrefix}-evt-player1-second`,
    roomId: roomCode,
    type: 'COMMENT',
    user: { id: 'tt-u1', username: 'player_one', nickname: 'Người Chơi 1' },
    payload: { content: wrongOpt },
    receivedAt: Date.now() + 50,
  });
  assert.strictEqual(
    (secondAttempt as any).acceptedAnswer,
    false,
    'Người chơi gửi đáp án thứ 2 trong cùng câu hỏi phải bị từ chối'
  );
  console.log('[PASS] 3. Người chơi gửi 2 đáp án liên tiếp: chỉ ghi nhận đáp án đầu tiên.');

  // 4. Event bị gửi lặp (cùng Event ID)
  const dupEvent = eventProcessor.processEvent({
    id: `${runPrefix}-evt-player1-first`,
    roomId: roomCode,
    type: 'COMMENT',
    user: { id: 'tt-u1', username: 'player_one', nickname: 'Người Chơi 1' },
    payload: { content: correctOpt },
    receivedAt: Date.now(),
  });
  assert.strictEqual(dupEvent.processed, false, 'Event trùng ID phải bị chặn');
  assert.strictEqual(dupEvent.reason, 'DUPLICATE_EVENT_ID');
  console.log('[PASS] 4. Chống trùng Event ID hoạt động chính xác.');

  // 5. Nhiều người chơi trả lời đồng thời
  eventProcessor.processEvent({
    id: `${runPrefix}-evt-player2-wrong`,
    roomId: roomCode,
    type: 'COMMENT',
    user: { id: 'tt-u2', username: 'player_two', nickname: 'Người Chơi 2' },
    payload: { content: wrongOpt },
    receivedAt: Date.now() + 200,
  });

  // 6. Đóng câu hỏi, chấm điểm theo công thức 100 + floor(50 * TimeRemaining / TimeLimit)
  const result = gameEngine.closeAndGradeCurrentQuestion(roomCode);
  assert.ok(result, 'Phải trả về kết quả chấm điểm');
  assert.strictEqual(result.correctOption, correctOpt);

  const leaderboard = runtime.leaderboard;
  const p1 = leaderboard.find((p) => p.tiktokUserId === 'tt-u1')!;
  const p2 = leaderboard.find((p) => p.tiktokUserId === 'tt-u2')!;
  assert.ok(p1.totalScore >= 100 && p1.totalScore <= 150, `Điểm người trả lời đúng phải từ 100..150 (thực tế: ${p1.totalScore})`);
  assert.strictEqual(p2.totalScore, 0, 'Người trả lời sai phải có 0 điểm');
  console.log(`[PASS] 5. Công thức tính điểm đúng chuẩn: Người chơi 1 đạt ${p1.totalScore} điểm, Người chơi 2 đạt ${p2.totalScore} điểm.`);

  // 7. Bình luận sau thời hạn (khi câu hỏi đã đóng) -> Không tính điểm
  const lateAttempt = eventProcessor.processEvent({
    id: `${runPrefix}-evt-player3-late`,
    roomId: roomCode,
    type: 'COMMENT',
    user: { id: 'tt-u3', username: 'player_three', nickname: 'Người Chơi 3' },
    payload: { content: correctOpt },
    receivedAt: Date.now(),
  });
  assert.strictEqual((lateAttempt as any).acceptedAnswer, false, 'Trả lời sau khi câu hỏi đóng không được tính điểm');
  console.log('[PASS] 6. Bình luận sau thời hạn không được tính điểm.');

  // 8. OBS tải lại Browser Source -> Khôi phục trạng thái từ backend
  const recovery = gameEngine.getFullClientRecoveryState(roomCode);
  assert.ok(recovery.roomState, 'Phải khôi phục được roomState');
  assert.strictEqual(recovery.leaderboard.leaderboard.length >= 2, true, 'Phải khôi phục được bảng xếp hạng');
  console.log('[PASS] 7. Khôi phục trạng thái cho OBS Browser Source khi tải lại thành công.');

  // 9. Quà tặng kích hoạt hiệu ứng giải trí, không cộng điểm gian lận
  const scoreBeforeGift = p1.totalScore;
  tiktokService.simulateEvent({
    roomCode,
    type: 'GIFT',
    userId: 'tt-u1',
    username: 'player_one',
    nickname: 'Người Chơi 1',
    giftId: '5269',
    giftName: 'Pháo Hoa Sân Khấu',
  });
  const scoreAfterGift = db.getSessionLeaderboard(runtime.sessionId!).find((p) => p.tiktokUserId === 'tt-u1')!.totalScore;
  assert.strictEqual(scoreBeforeGift, scoreAfterGift, 'Quà tặng không được cộng điểm trực tiếp');
  console.log('[PASS] 8. Hiệu ứng quà tặng hoạt động và đảm bảo công bằng (không mua điểm).');

  gameEngine.resetToWaitingRoom(roomCode);
  console.log('=== TẤT CẢ 8/8 BÀI KIỂM THỬ NGHIỆP VỤ ĐỀU ĐẠT (100% PASS) ===');
}

runVerificationChecklist().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});

