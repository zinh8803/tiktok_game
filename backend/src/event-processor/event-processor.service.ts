import { Injectable, Logger, Optional } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { GameEngineService } from '../game-engine/game-engine.service';
import { TugOfWarService } from '../tug-of-war/tug-of-war.service';
import { CatchwordService } from '../catchword/catchword.service';
import { CrosswordService } from '../crossword/crossword.service';
import { GameEvent, OptionLabel } from '../common/types';

@Injectable()
export class EventProcessorService {
  private readonly logger = new Logger(EventProcessorService.name);
  private readonly processedEventIds = new Set<string>();
  private readonly userLastCommentTimestamps = new Map<string, number[]>();

  constructor(
    private readonly db: DatabaseService,
    private readonly gameEngine: GameEngineService,
    private readonly tugOfWar: TugOfWarService,
    @Optional() private readonly catchword?: CatchwordService,
    @Optional() private readonly crossword?: CrosswordService
  ) {}

  /**
   * Trích xuất đáp án A/B/C/D từ nội dung bình luận của người xem (Mục 5.3)
   * Hỗ trợ đa dạng cách gõ trên TikTok LIVE: "A", "a", "AA", "A.", "A nha", "chọn B", "câu C", "1A"...
   */
  public parseAnswerFromComment(rawContent?: string): OptionLabel | null {
    if (!rawContent) return null;
    const cleaned = rawContent.trim();
    if (!cleaned) return null;

    // 1. Gõ trực tiếp A/B/C/D hoặc lặp ký tự (AA, BBB, CCC, DDD) để lách bộ lọc spam của TikTok
    const directOrRepeatMatch = cleaned.match(
      /^[\/#!\s\(\[\d\.\-]*([ABCDabcd])\1*[\.\)\]\!\?\s~,:;]*$/
    );
    if (directOrRepeatMatch) {
      return directOrRepeatMatch[1].toUpperCase() as OptionLabel;
    }

    // 2. Cụm từ chọn đáp án: "Đáp án A", "Chọn B nha", "Câu C ạ", "Em chọn D", "Ý A"...
    const phraseMatch = cleaned.match(
      /(?:DAP\s*AN|ĐÁP\s*ÁN|CHON|CHỌN|CAU|CÂU|PA|PHUONG\s*AN|PHƯƠNG\s*ÁN|Y|Ý)\s*[:\-\.]?\s*([ABCDabcd])(?:\b|[^a-zA-ZÀ-ỹ]|$)/i
    );
    if (phraseMatch) {
      return phraseMatch[1].toUpperCase() as OptionLabel;
    }

    // 3. Mở đầu bằng A/B/C/D độc lập kèm từ cảm thán ngắn (VD: "A nha", "B nhé", "C ạ", "D đi", "A đúng", "B 100%")
    const leadingChoiceMatch = cleaned.match(
      /^[\/#!\s]*([ABCDabcd])(?:[\.\,\!\-\:\)\s]+)(?:nha|nhé|nhe|ạ|a|đi|di|luôn|luon|đúng|dung|chắc|chac|shop|ad|ơi|oi|100%|chốt|chot|\d+|\s)*$/i
    );
    if (leadingChoiceMatch) {
      return leadingChoiceMatch[1].toUpperCase() as OptionLabel;
    }

    return null;
  }

  public isJoinCommand(rawContent?: string): boolean {
    if (!rawContent) return false;
    const cleaned = rawContent.trim().toLowerCase();
    return (
      cleaned === 'join' ||
      cleaned === '!join' ||
      cleaned === 'tham gia' ||
      cleaned === 'choi' ||
      cleaned === 'chơi'
    );
  }

  /**
   * Nhận diện lệnh "sẵn sàng" / "bắt đầu" trận đấu khi phòng đang ở sảnh chờ (WAITING)
   * Hỗ trợ các biến thể: "ss", "sss", "!ss", "sẵn sàng", "san sang", "ready", "start", "bắt đầu", "bat dau", "go"...
   */
  public isStartCommand(rawContent?: string): boolean {
    if (!rawContent) return false;
    const cleaned = rawContent.trim().toLowerCase();
    return /^(\/|!|#)?(ss+|sẵn\s*sàng|san\s*sang|sansang|ready|start|bắt\s*đầu|bat\s*dau|go)(\s+.*)?$/i.test(
      cleaned
    );
  }

  private checkRateLimit(userId: string, now: number): boolean {
    const windowMs = 2000;
    const maxCommentsPerWindow = 25;
    const history = (this.userLastCommentTimestamps.get(userId) || []).filter(
      (t) => now - t < windowMs
    );
    if (history.length >= maxCommentsPerWindow) {
      return false;
    }
    history.push(now);
    this.userLastCommentTimestamps.set(userId, history);
    return true;
  }

  /**
   * Xử lý một GameEvent chuẩn hóa (Mục 5.2 & 5.3 & 3.3)
   * - Kiểm tra chống trùng theo Event ID (cả bộ nhớ và bảng live_events)
   * - Kiểm tra tần suất (rate limit)
   * - Gắn timestamp server nhận
   * - Chuyển tiếp tới Knowledge Battle Engine
   */
  public processEvent(rawEvent: GameEvent) {
    const serverReceivedAt = rawEvent.receivedAt || Date.now();
    const event: GameEvent = {
      ...rawEvent,
      roomId: (rawEvent.roomId || 'KB2026').toUpperCase(),
      receivedAt: serverReceivedAt,
    };

    // 1. Chống xử lý trùng Event ID (Mục 3.3 & 10.1)
    if (this.processedEventIds.has(event.id)) {
      this.logger.debug(`Duplicate event ignored (memory): ${event.id}`);
      return {
        processed: false,
        reason: 'DUPLICATE_EVENT_ID',
        eventId: event.id,
      };
    }

    if (event.type !== 'JOIN' && event.type !== 'LIKE') {
      const isUniqueInDb = this.db.recordLiveEventIfUnique({
        id: event.id,
        roomId: event.roomId,
        type: event.type,
        userId: event.user.id,
        username: event.user.username,
        nickname: event.user.nickname,
        payload: event.payload,
        receivedAt: event.receivedAt,
      });

      if (!isUniqueInDb) {
        this.logger.debug(`Duplicate event ignored (database): ${event.id}`);
        return {
          processed: false,
          reason: 'DUPLICATE_EVENT_ID',
          eventId: event.id,
        };
      }
    }

    this.processedEventIds.add(event.id);
    if (this.processedEventIds.size > 20000) {
      const firstKey = this.processedEventIds.values().next().value;
      if (firstKey) this.processedEventIds.delete(firstKey);
    }

    // 2. Xử lý theo loại sự kiện
    if (event.type === 'COMMENT') {
      if (!this.checkRateLimit(event.user.id, serverReceivedAt)) {
        return {
          processed: false,
          reason: 'RATE_LIMITED',
          eventId: event.id,
        };
      }

      const normalizedAnswer = this.parseAnswerFromComment(event.payload.content);

      // Game Giải Mã Ô Chữ (Crossword Battle) đang mở -> chiếm quyền xử lý bình luận của phòng
      if (this.crossword?.isActive(event.roomId)) {
        const xwResult = this.crossword.handleComment(event);
        return { processed: true, eventId: event.id, game: 'CROSSWORD', ...xwResult };
      }

      // Game Đuổi Hình Bắt Chữ đang mở -> chiếm quyền xử lý bình luận của phòng
      if (this.catchword?.isActive(event.roomId)) {
        const cwResult = this.catchword.handleComment(event);
        return { processed: true, eventId: event.id, game: 'CATCHWORD', ...cwResult };
      }

      // Game Kéo Co Tri Thức đang mở -> chiếm quyền xử lý bình luận của phòng
      if (this.tugOfWar.isActive(event.roomId)) {
        const tugResult = this.tugOfWar.handleComment(event, normalizedAnswer);
        return { processed: true, eventId: event.id, normalizedAnswer, game: 'TUG_OF_WAR', ...tugResult };
      }

      const joinCmd = this.isJoinCommand(event.payload.content);
      const startCmd = this.isStartCommand(event.payload.content);
      const engineResult = this.gameEngine.handleCommentEvent(
        event,
        normalizedAnswer,
        joinCmd,
        startCmd
      );

      return {
        processed: true,
        eventId: event.id,
        normalizedAnswer,
        ...engineResult,
      };
    }

    if (event.type === 'GIFT') {
      if (this.catchword?.isActive(event.roomId)) {
        const cwResult = this.catchword.handleGift(event);
        return { processed: true, eventId: event.id, game: 'CATCHWORD', ...cwResult };
      }
      if (this.tugOfWar.isActive(event.roomId)) {
        const tugResult = this.tugOfWar.handleGift(event);
        return { processed: true, eventId: event.id, game: 'TUG_OF_WAR', ...tugResult };
      }
      const giftResult = this.gameEngine.handleGiftEvent(event);
      return {
        processed: true,
        eventId: event.id,
        action: 'GIFT_TRIGGERED',
        giftResult,
      };
    }

    if (event.type === 'JOIN') {
      if (this.catchword?.isActive(event.roomId)) {
        return { processed: true, eventId: event.id, game: 'CATCHWORD', action: 'IGNORED_JOIN' };
      }
      if (this.tugOfWar.isActive(event.roomId)) {
        return { processed: true, eventId: event.id, game: 'TUG_OF_WAR', action: 'IGNORED_JOIN' };
      }
      const engineResult = this.gameEngine.handleCommentEvent(event, null, true);
      return {
        processed: true,
        eventId: event.id,
        ...engineResult,
      };
    }

    if (event.type === 'LIKE') {
      const likeResult = this.gameEngine.handleLikeEvent(event);
      return {
        processed: true,
        eventId: event.id,
        action: 'LIKE_PROCESSED',
        likeResult,
      };
    }

    return {
      processed: true,
      eventId: event.id,
      action: 'IGNORED_EVENT_TYPE',
    };
  }
}

