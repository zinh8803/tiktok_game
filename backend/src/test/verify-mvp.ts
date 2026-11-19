import * as assert from 'assert';
import { DatabaseService } from '../database/database.service';
import { GameEngineService } from '../game-engine/game-engine.service';
import { EventProcessorService } from '../event-processor/event-processor.service';
import { TikTokService } from '../integrations/tiktok/tiktok.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { TugOfWarService } from '../tug-of-war/tug-of-war.service';
import { CatchwordService } from '../catchword/catchword.service';
import { AiService } from '../ai/ai.service';

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
  const eventProcessor = new EventProcessorService(db, gameEngine, new TugOfWarService(db, mockGateway));
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

  // 7. Bình luận sau thời hạn:
  // 7a. Người chơi 1 đã trả lời trước đó cố gửi lại khi câu hỏi đóng -> Bị từ chối
  const reAnswerAttempt = eventProcessor.processEvent({
    id: `${runPrefix}-evt-player1-reanswer`,
    roomId: roomCode,
    type: 'COMMENT',
    user: { id: 'tt-u1', username: 'player_one', nickname: 'Người Chơi 1' },
    payload: { content: correctOpt },
    receivedAt: Date.now(),
  });
  assert.strictEqual((reAnswerAttempt as any).acceptedAnswer, false, 'Người chơi đã trả lời không được đổi đáp án khi câu hỏi đóng');

  // 7b. Người chơi 3 gửi sau khi đã hết cả cửa sổ bù trễ livestream (LATE_STREAM_GRACE_MS) -> Không tính điểm
  runtime.questionEndsAt = Date.now() - 10000;
  const lateAttempt = eventProcessor.processEvent({
    id: `${runPrefix}-evt-player3-late`,
    roomId: roomCode,
    type: 'COMMENT',
    user: { id: 'tt-u3', username: 'player_three', nickname: 'Người Chơi 3' },
    payload: { content: correctOpt },
    receivedAt: Date.now(),
  });
  assert.strictEqual((lateAttempt as any).acceptedAnswer, false, 'Trả lời sau khi hết thời gian bù trễ không được tính điểm');
  console.log('[PASS] 6. Bình luận sau thời hạn không được tính điểm.');

  // 8. OBS tải lại Browser Source -> Khôi phục trạng thái từ backend
  const recovery = gameEngine.getFullClientRecoveryState(roomCode);
  assert.ok(recovery.roomState, 'Phải khôi phục được roomState');
  assert.strictEqual(recovery.leaderboard.leaderboard.length >= 2, true, 'Phải khôi phục được bảng xếp hạng');
  console.log('[PASS] 7. Khôi phục trạng thái cho OBS Browser Source khi tải lại thành công.');

  // 9. Quà tặng kích hoạt hiệu ứng và cộng 100 điểm cho người tặng
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
  assert.strictEqual(scoreAfterGift, scoreBeforeGift + 100, 'Mỗi quà tặng phải cộng 100 điểm cho người gửi');
  console.log(`[PASS] 8. Quà tặng cộng 100 điểm cho người gửi (tổng: ${scoreAfterGift}).`);

  db.upsertGiftMapping({
    giftId: 'test-eliminate-wrong',
    giftName: 'Quà loại đáp án sai',
    effectType: 'CHEER_BANNER',
    rewardType: 'ELIMINATE_WRONG',
    displayMessage: 'đã loại một đáp án sai!',
  });
  gameEngine.resetToWaitingRoom(roomCode);
  gameEngine.startMatch(roomCode, { immediate: true });
  await new Promise((r) => setTimeout(r, 120));
  const eliminationGift = tiktokService.simulateEvent({
    roomCode,
    type: 'GIFT',
    userId: 'tt-u1',
    username: 'player_one',
    nickname: 'Người Chơi 1',
    giftId: 'test-eliminate-wrong',
    giftName: 'Quà loại đáp án sai',
  }) as any;
  assert.strictEqual(
    eliminationGift.giftResult.eliminatedHintOption !== null,
    true,
    'Quà cấu hình loại đáp án sai phải loại được một đáp án khi câu hỏi đang mở'
  );
  assert.strictEqual(
    eliminationGift.giftResult.giftPoints,
    0,
    'Quà loại đáp án sai không được cộng điểm'
  );
  console.log('[PASS] 9. Quà tặng có thể cấu hình để loại một đáp án sai thay vì cộng điểm.');

  gameEngine.resetToWaitingRoom(roomCode);

  // 10. Kiểm thử Kéo Co Tri Thức (Tug of War)
  const tugService = new TugOfWarService(db, mockGateway);
  tugService.openLobby(roomCode);
  tugService.start(roomCode);
  tugService.nextQuestion(roomCode); // Chuyển ngay vào câu hỏi 1
  const tugState1 = tugService.getPublicState(roomCode);
  assert.strictEqual(tugState1.status, 'QUESTION', 'Kéo Co phải vào status QUESTION sau khi mở câu hỏi');

  // Lấy câu hỏi hiện tại từ runtime để kiểm thử đáp án
  const tugRt = (tugService as any).getRuntime(roomCode);
  const currentTugQ = tugRt.questions[tugRt.questionIndex];
  assert.ok(currentTugQ, 'Kéo Co phải có câu hỏi khi bắt đầu');

  // Người chơi tham gia team Đỏ (bình luận '1')
  tugService.handleComment(
    {
      id: `${runPrefix}-tug-c1`,
      roomId: roomCode,
      type: 'COMMENT',
      user: { id: 'tt-tug-red1', username: 'red_champ', nickname: 'Anh Hùng Đỏ' },
      payload: { content: '1' }, // chọn Đỏ
      receivedAt: Date.now(),
    },
    null
  );

  // Người chơi gửi đáp án đúng
  const ansResult = tugService.handleComment(
    {
      id: `${runPrefix}-tug-ans1`,
      roomId: roomCode,
      type: 'COMMENT',
      user: { id: 'tt-tug-red1', username: 'red_champ', nickname: 'Anh Hùng Đỏ' },
      payload: { content: currentTugQ.correctOption },
      receivedAt: Date.now(),
    },
    currentTugQ.correctOption
  );
  assert.strictEqual(ansResult.action, 'TUG_ANSWER_RECORDED', 'Đáp án kéo co phải được ghi nhận');

  // Chốt câu hỏi (reveal) -> tính lực kéo và di chuyển dây
  tugService.reveal(roomCode);
  const tugStateAfterAns = tugService.getPublicState(roomCode);
  assert.ok(tugStateAfterAns.teams.RED.count >= 1, 'Đội Đỏ phải ghi nhận thành viên');
  assert.ok(tugStateAfterAns.teams.RED.contribution >= 1, 'Đội Đỏ phải được cộng điểm/lực kéo');
  assert.ok(tugStateAfterAns.rope < 0, 'Dây kéo phải dịch chuyển về phía đội Đỏ (âm)');
  tugService.stop(roomCode);
  console.log('[PASS] 10. Kéo Co Tri Thức: Chọn đội, ghi nhận đáp án, chốt điểm kéo dây chính xác.');

  // 11. Kiểm thử Đuổi Hình Bắt Chữ LIVE (Catchword)
  const catchwordService = new CatchwordService(mockGateway);
  catchwordService.openLobby(roomCode);
  catchwordService.start(roomCode);
  catchwordService.nextPuzzle(roomCode); // Chuyển ngay vào câu đố 1
  const cwState1 = catchwordService.getPublicState(roomCode, true);
  assert.strictEqual(cwState1.status, 'QUESTION', 'Đuổi Hình Bắt Chữ phải vào status QUESTION');
  assert.ok(cwState1.puzzle, 'Đuổi Hình Bắt Chữ phải có puzzle hiện tại');

  // Người chơi đoán đúng câu đố (lấy từ bí mật test)
  const cwAnswer = cwState1.secret.answer;
  catchwordService.handleComment({
    id: `${runPrefix}-cw-guess1`,
    roomId: roomCode,
    type: 'COMMENT',
    user: { id: 'tt-cw-u1', username: 'puzzle_master', nickname: 'Cao Thủ Bắt Chữ' },
    payload: { content: cwAnswer },
    receivedAt: Date.now(),
  });
  const cwStateAfterGuess = catchwordService.getPublicState(roomCode);
  assert.ok(cwStateAfterGuess.solvedCount >= 1, 'Người đoán đúng đầu tiên phải được ghi nhận');
  assert.ok(cwStateAfterGuess.leaderboard[0].score >= 80, 'Điểm người đoán đúng phải đạt điểm thưởng hợp lệ');
  catchwordService.stop(roomCode);
  console.log('[PASS] 11. Đuổi Hình Bắt Chữ LIVE: Khởi động vòng, nhận diện đáp án chuẩn hóa tiếng Việt, tính điểm xếp hạng.');

  // 12. Kiểm thử AI Engine: Tự động sinh câu hỏi và câu đố đuổi hình bắt chữ
  const aiService = new AiService(db, catchwordService);
  const aiQuestions = await aiService.generateQuestions({
    topic: 'Lịch sử Việt Nam hào hùng',
    count: 2,
    provider: 'OFFLINE',
  });
  assert.strictEqual(aiQuestions.length, 2, 'AI phải sinh đúng số lượng câu hỏi yêu cầu');
  assert.ok(aiQuestions[0].options.A, 'Câu hỏi AI phải có đầy đủ 4 đáp án');
  const savedAiQs = aiService.saveQuestionsToDatabase(aiQuestions, true);
  assert.strictEqual(savedAiQs.length, 2, 'Phải lưu thành công 2 câu hỏi AI vào SQLite');
  assert.strictEqual(savedAiQs[0].source?.sourceType, 'AI', 'Câu hỏi phải mang nhãn nguồn AI');

  const aiCatchwords = await aiService.generateCatchwords({
    topic: 'Ca dao tục ngữ',
    count: 2,
    provider: 'OFFLINE',
  });
  assert.strictEqual(aiCatchwords.length, 2, 'AI phải sinh đúng số lượng câu đố đuổi hình bắt chữ');
  const savedCatchwords = aiService.saveCatchwordsToBank(aiCatchwords);
  assert.strictEqual(savedCatchwords.length, 2, 'Phải lưu thành công 2 câu đố AI vào CatchwordService');
  console.log('[PASS] 12. AI Question & Puzzle Engine: Tự động sinh câu hỏi, câu đố và lưu trực tiếp vào ngân hàng.');

  console.log('=== TẤT CẢ 12/12 BÀI KIỂM THỬ NGHIỆP VỤ & AI ĐỀU ĐẠT (100% PASS) ===');
}

runVerificationChecklist().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
