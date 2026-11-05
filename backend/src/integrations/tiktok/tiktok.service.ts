import { Injectable, Logger } from '@nestjs/common';
import { EventProcessorService } from '../../event-processor/event-processor.service';
import { RealtimeGateway } from '../../realtime/realtime.gateway';
import { GameEvent, OptionLabel, TikTokConnectionState } from '../../common/types';
import { v4 as uuidv4 } from 'uuid';

// Định nghĩa kiểu dữ liệu rõ ràng cho sự kiện từ tiktok-live-connector v2.x & v1.x (Mục 6.3)
export interface TikTokConnectorChatPayload {
  common?: {
    msgId?: string;
    createTime?: string;
  };
  msgId?: string;
  userId?: string;
  uniqueId?: string;
  nickname?: string;
  profilePictureUrl?: string;
  comment?: string;
  content?: string;
  user?: {
    id?: string;
    userId?: string;
    displayId?: string;
    uniqueId?: string;
    nickname?: string;
    profilePictureUrl?: string;
    avatarThumb?: {
      url?: string[];
    };
  };
}

export interface TikTokConnectorGiftPayload {
  common?: {
    msgId?: string;
  };
  msgId?: string;
  userId?: string;
  uniqueId?: string;
  nickname?: string;
  profilePictureUrl?: string;
  giftId?: number | string;
  giftName?: string;
  repeatCount?: number;
  repeatEnd?: number | boolean;
  giftType?: number;
  diamondCount?: number;
  gift?: {
    id?: string | number;
    name?: string;
    diamondCount?: number;
    type?: number;
  };
  extendedGiftInfo?: {
    name?: string;
    diamond_count?: number;
  };
  user?: {
    id?: string;
    userId?: string;
    displayId?: string;
    uniqueId?: string;
    nickname?: string;
    profilePictureUrl?: string;
    avatarThumb?: {
      url?: string[];
    };
  };
}

export interface RoomTikTokConnectionInfo {
  roomCode: string;
  username: string;
  state: TikTokConnectionState;
  tiktokRoomId: string | null;
  eventsReceived: number;
  reconnectAttempts: number;
  maxReconnectAttempts: number;
  lastError: string | null;
  connectedAt: string | null;
  connectorInstance?: any;
  reconnectTimer?: NodeJS.Timeout;
}

@Injectable()
export class TikTokService {
  private readonly logger = new Logger(TikTokService.name);
  private readonly connections = new Map<string, RoomTikTokConnectionInfo>();

  constructor(
    private readonly eventProcessor: EventProcessorService,
    private readonly realtime: RealtimeGateway
  ) {}

  public getConnectionStatus(roomCode = 'KB2026') {
    const code = roomCode.toUpperCase();
    const info = this.connections.get(code);
    if (!info) {
      return {
        roomCode: code,
        username: '',
        state: 'DISCONNECTED' as TikTokConnectionState,
        tiktokRoomId: null,
        eventsReceived: 0,
        reconnectAttempts: 0,
        maxReconnectAttempts: Number(process.env.TIKTOK_MAX_RECONNECT_ATTEMPTS || 3),
        lastError: null,
        connectedAt: null,
      };
    }

    return {
      roomCode: info.roomCode,
      username: info.username,
      state: info.state,
      tiktokRoomId: info.tiktokRoomId,
      eventsReceived: info.eventsReceived,
      reconnectAttempts: info.reconnectAttempts,
      maxReconnectAttempts: info.maxReconnectAttempts,
      lastError: info.lastError,
      connectedAt: info.connectedAt,
    };
  }

  private emitStatus(roomCode: string) {
    const status = this.getConnectionStatus(roomCode);
    this.realtime.emitToRoom(roomCode.toUpperCase(), 'tiktok.status', status);
    return status;
  }

  /**
   * Chuẩn hóa input từ người dùng: hỗ trợ cả @username, username, hoặc full link https://www.tiktok.com/@username/live
   */
  private normalizeTikTokUsername(rawInput: string): string {
    const trimmed = rawInput.trim();
    const urlMatch = trimmed.match(/tiktok\.com\/@([a-zA-Z0-9._-]+)/i);
    if (urlMatch && urlMatch[1]) {
      return urlMatch[1];
    }
    return trimmed.replace(/^@+/, '').split(/[/?#&]/)[0].trim();
  }

  /**
   * Kết nối phiên TikTok LIVE thật qua username (không yêu cầu mật khẩu - Mục 6.1 & 6.4)
   */
  public async connect(roomCode: string, rawUsername: string) {
    const code = (roomCode || 'KB2026').toUpperCase();
    const username = this.normalizeTikTokUsername(rawUsername);

    if (!username) {
      throw new Error('Vui lòng nhập TikTok username hợp lệ.');
    }

    await this.disconnect(code);

    const connInfo: RoomTikTokConnectionInfo = {
      roomCode: code,
      username,
      state: 'CONNECTING',
      tiktokRoomId: null,
      eventsReceived: 0,
      reconnectAttempts: 0,
      maxReconnectAttempts: Number(process.env.TIKTOK_MAX_RECONNECT_ATTEMPTS || 3),
      lastError: null,
      connectedAt: null,
    };
    this.connections.set(code, connInfo);
    this.emitStatus(code);

    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const connectorPkg = require('tiktok-live-connector');
      const ConnectionClass =
        connectorPkg.TikTokLiveConnection || connectorPkg.WebcastPushConnection;
      const WebcastEvent = connectorPkg.WebcastEvent || {
        CHAT: 'chat',
        GIFT: 'gift',
        MEMBER: 'member',
        LIKE: 'like',
        SHARE: 'share',
        STREAM_END: 'streamEnd',
      };
      const ControlEvent = connectorPkg.ControlEvent || {
        CONNECTED: 'connected',
        DISCONNECTED: 'disconnected',
        ERROR: 'error',
      };

      // Lưu ý quan trọng cho tiktok-live-connector v2.5.0:
      // - enableExtendedGiftInfo phải để false (mặc định) vì bật true sẽ gọi endpoint gift/list cần chữ ký trả phí (403 PremiumFeatureError).
      // - Bản thân gói tin WebcastGiftMessage trong v2.5.0 đã chứa sẵn data.gift.name và data.giftId.
      // - fetchRoomInfoOnConnect để false để kết nối thẳng tới WebSocket mà không bị chặn bởi HTML scraping.
      const connectionOptions: Record<string, any> = {
        processInitialData: true,
        fetchRoomInfoOnConnect: false,
        enableExtendedGiftInfo: false,
      };
      if (process.env.TIKTOK_SIGN_API_KEY) {
        connectionOptions.signApiKey = process.env.TIKTOK_SIGN_API_KEY;
      }

      const connection = new ConnectionClass(username, connectionOptions);
      connInfo.connectorInstance = connection;

      connection.on(ControlEvent.CONNECTED || 'connected', (state: { roomId?: string }) => {
        connInfo.state = 'CONNECTED';
        connInfo.tiktokRoomId = state?.roomId ? String(state.roomId) : 'LIVE';
        connInfo.reconnectAttempts = 0;
        connInfo.lastError = null;
        connInfo.connectedAt = new Date().toISOString();
        this.logger.log(`Connected TikTok LIVE @${username} (roomId=${connInfo.tiktokRoomId})`);
        this.emitStatus(code);
      });

      connection.on(WebcastEvent.CHAT || 'chat', (data: TikTokConnectorChatPayload) => {
        connInfo.eventsReceived++;
        this.handleIncomingChat(code, data);
        this.emitStatus(code);
      });

      connection.on(WebcastEvent.GIFT || 'gift', (data: TikTokConnectorGiftPayload) => {
        const giftType = data.gift?.type ?? data.giftType;
        if (giftType === 1 && !data.repeatEnd) {
          return;
        }
        connInfo.eventsReceived++;
        this.handleIncomingGift(code, data);
        this.emitStatus(code);
      });

      connection.on(WebcastEvent.MEMBER || 'member', (data: TikTokConnectorChatPayload) => {
        connInfo.eventsReceived++;
        this.handleIncomingJoin(code, data);
      });

      connection.on(ControlEvent.DISCONNECTED || 'disconnected', () => {
        if (connInfo.state === 'DISCONNECTED') return;
        this.attemptBoundedReconnect(connInfo);
      });

      connection.on(WebcastEvent.STREAM_END || 'streamEnd', () => {
        connInfo.state = 'DISCONNECTED';
        connInfo.lastError = 'Phiên livestream TikTok đã kết thúc.';
        this.emitStatus(code);
      });

      connection.on(ControlEvent.ERROR || 'error', (err: any) => {
        const detail = err?.exception?.message || err?.message || JSON.stringify(err);
        this.logger.warn(`TikTok LIVE event warning (@${username}): ${detail}`);
      });

      const state = await connection.connect();
      connInfo.state = 'CONNECTED';
      connInfo.tiktokRoomId = state?.roomId ? String(state.roomId) : 'LIVE';
      connInfo.connectedAt = new Date().toISOString();
      connInfo.lastError = null;
      this.emitStatus(code);

      return this.getConnectionStatus(code);
    } catch (error: any) {
      const subErrors = Array.isArray(error?.config?.requestErrs)
        ? error.config.requestErrs.map((e: any) => e?.message).join(' | ')
        : '';
      const rawMessage = String(
        error?.message || error?.info || subErrors || error || ''
      );
      this.logger.error(`Failed to connect TikTok LIVE @${username}: ${rawMessage}`);

      let friendlyError = `Không thể kết nối tới @${username}. Chi tiết: ${rawMessage}`;
      if (
        rawMessage.toLowerCase().includes('offline') ||
        rawMessage.toLowerCase().includes('status') ||
        rawMessage.toLowerCase().includes('room id')
      ) {
        friendlyError = `Tài khoản @${username} hiện chưa mở phiên LIVE trên TikTok hoặc không lấy được Room ID (${rawMessage}). Hãy đảm bảo kênh đang phát LIVE công khai rồi thử lại.`;
      } else if (rawMessage.toLowerCase().includes('rate limit') || rawMessage.includes('429')) {
        friendlyError = `Máy chủ giải mã chữ ký TikTok miễn phí (EulerStream) đang giới hạn tần suất kết nối (Rate Limit). Vui lòng đợi 30 giây rồi bấm Kết nối lại.`;
      }

      connInfo.state = 'ERROR';
      connInfo.lastError = friendlyError;
      connInfo.tiktokRoomId = null;
      this.emitStatus(code);

      return {
        ...this.getConnectionStatus(code),
        connected: false,
        error: friendlyError,
      };
    }
  }

  private attemptBoundedReconnect(connInfo: RoomTikTokConnectionInfo) {
    if (connInfo.reconnectAttempts >= connInfo.maxReconnectAttempts) {
      connInfo.state = 'ERROR';
      connInfo.lastError = `Đã thử kết nối lại ${connInfo.maxReconnectAttempts} lần không thành công. Vui lòng kiểm tra đường truyền và phiên LIVE.`;
      this.emitStatus(connInfo.roomCode);
      return;
    }

    connInfo.reconnectAttempts++;
    connInfo.state = 'RECONNECTING';
    connInfo.lastError = `Mất kết nối, đang thử kết nối lại lần ${connInfo.reconnectAttempts}/${connInfo.maxReconnectAttempts}...`;
    this.emitStatus(connInfo.roomCode);

    const delayMs = 2000 * connInfo.reconnectAttempts;
    connInfo.reconnectTimer = setTimeout(async () => {
      try {
        if (!connInfo.connectorInstance) return;
        const state = await connInfo.connectorInstance.connect();
        connInfo.state = 'CONNECTED';
        connInfo.tiktokRoomId = state?.roomId ? String(state.roomId) : connInfo.tiktokRoomId;
        connInfo.reconnectAttempts = 0;
        connInfo.lastError = null;
        this.emitStatus(connInfo.roomCode);
      } catch {
        this.attemptBoundedReconnect(connInfo);
      }
    }, delayMs);
  }

  public async disconnect(roomCode = 'KB2026') {
    const code = roomCode.toUpperCase();
    const info = this.connections.get(code);
    if (!info) return this.getConnectionStatus(code);

    if (info.reconnectTimer) {
      clearTimeout(info.reconnectTimer);
      info.reconnectTimer = undefined;
    }

    info.state = 'DISCONNECTED';
    if (info.connectorInstance) {
      try {
        await info.connectorInstance.disconnect();
      } catch {
        // ignore disconnect errors
      }
      info.connectorInstance = undefined;
    }
    info.tiktokRoomId = null;
    info.lastError = null;
    this.emitStatus(code);
    return this.getConnectionStatus(code);
  }

  private handleIncomingChat(roomCode: string, payload: TikTokConnectorChatPayload) {
    const userId = String(
      payload.user?.id ||
        payload.user?.userId ||
        payload.userId ||
        payload.user?.displayId ||
        payload.user?.uniqueId ||
        payload.uniqueId ||
        uuidv4()
    );
    const username = String(
      payload.user?.displayId ||
        payload.user?.uniqueId ||
        payload.uniqueId ||
        userId
    );
    const nickname = String(
      payload.user?.nickname || payload.nickname || username
    );
    const avatarUrl =
      payload.user?.avatarThumb?.url?.[0] ||
      payload.user?.profilePictureUrl ||
      payload.profilePictureUrl;
    const content = String(payload.content ?? payload.comment ?? '');
    const rawMsgId = payload.common?.msgId || payload.msgId;
    const eventId =
      rawMsgId && String(rawMsgId) !== '0'
        ? `${rawMsgId}-${userId}`
        : `tt-chat-${userId}-${uuidv4()}`;

    const gameEvent: GameEvent = {
      id: eventId,
      roomId: roomCode,
      type: 'COMMENT',
      user: {
        id: userId,
        username,
        nickname,
        avatarUrl,
      },
      payload: {
        content,
      },
      receivedAt: Date.now(),
    };

    return this.eventProcessor.processEvent(gameEvent);
  }

  private handleIncomingGift(roomCode: string, payload: TikTokConnectorGiftPayload) {
    const userId = String(
      payload.user?.id ||
        payload.user?.userId ||
        payload.userId ||
        payload.user?.displayId ||
        payload.user?.uniqueId ||
        payload.uniqueId ||
        uuidv4()
    );
    const username = String(
      payload.user?.displayId ||
        payload.user?.uniqueId ||
        payload.uniqueId ||
        userId
    );
    const nickname = String(
      payload.user?.nickname || payload.nickname || username
    );
    const avatarUrl =
      payload.user?.avatarThumb?.url?.[0] ||
      payload.user?.profilePictureUrl ||
      payload.profilePictureUrl;
    const eventId = String(
      payload.common?.msgId || payload.msgId || `tt-gift-${uuidv4()}`
    );
    const giftName = String(
      payload.gift?.name ||
        payload.extendedGiftInfo?.name ||
        payload.giftName ||
        'Hoa Hồng'
    );
    const giftId = String(payload.giftId || payload.gift?.id || '5655');

    const gameEvent: GameEvent = {
      id: eventId,
      roomId: roomCode,
      type: 'GIFT',
      user: {
        id: userId,
        username,
        nickname,
        avatarUrl,
      },
      payload: {
        giftId,
        giftName,
        repeatCount: Number(payload.repeatCount || 1),
        diamondCount: Number(
          payload.gift?.diamondCount ||
            payload.extendedGiftInfo?.diamond_count ||
            payload.diamondCount ||
            1
        ),
      },
      receivedAt: Date.now(),
    };

    return this.eventProcessor.processEvent(gameEvent);
  }

  private handleIncomingJoin(roomCode: string, payload: TikTokConnectorChatPayload) {
    const userId = String(
      payload.user?.id ||
        payload.user?.userId ||
        payload.userId ||
        payload.user?.displayId ||
        payload.user?.uniqueId ||
        payload.uniqueId ||
        uuidv4()
    );
    const username = String(
      payload.user?.displayId ||
        payload.user?.uniqueId ||
        payload.uniqueId ||
        userId
    );
    const nickname = String(
      payload.user?.nickname || payload.nickname || username
    );
    const eventId = String(
      payload.common?.msgId || payload.msgId || `tt-join-${uuidv4()}`
    );

    const gameEvent: GameEvent = {
      id: eventId,
      roomId: roomCode,
      type: 'JOIN',
      user: {
        id: userId,
        username,
        nickname,
      },
      payload: {},
      receivedAt: Date.now(),
    };

    return this.eventProcessor.processEvent(gameEvent);
  }

  // =====================================================================
  // BỘ GIẢ LẬP SỰ KIỆN (SIMULATOR) CHO KIỂM THỬ MVP ĐỘC LẬP (Mục 1.1, 10.1, 14)
  // =====================================================================

  public simulateEvent(dto: {
    roomCode?: string;
    eventId?: string;
    type: 'COMMENT' | 'GIFT' | 'JOIN';
    userId?: string;
    username?: string;
    nickname?: string;
    content?: string;
    giftId?: string;
    giftName?: string;
  }) {
    const roomCode = (dto.roomCode || 'KB2026').toUpperCase();
    const userId = dto.userId || `sim-usr-${dto.username || 'player1'}`;
    const username = dto.username || 'nguoixem_01';
    const nickname = dto.nickname || 'Người Xem 01';

    const event: GameEvent = {
      id: dto.eventId || `sim-evt-${uuidv4()}`,
      roomId: roomCode,
      type: dto.type,
      user: {
        id: userId,
        username,
        nickname,
      },
      payload: {
        content: dto.content,
        giftId: dto.giftId,
        giftName: dto.giftName,
      },
      receivedAt: Date.now(),
    };

    return this.eventProcessor.processEvent(event);
  }

  public simulateCrowdWave(roomCode = 'KB2026', count = 8) {
    const sampleViewers = [
      { id: 'tt-101', username: 'minhanh_99', nickname: 'Minh Anh 🌸' },
      { id: 'tt-102', username: 'hoanglong.dev', nickname: 'Hoàng Long ⚡' },
      { id: 'tt-103', username: 'thao_vy_2k', nickname: 'Thảo Vy 🎀' },
      { id: 'tt-104', username: 'quocbao_official', nickname: 'Quốc Bảo 🏆' },
      { id: 'tt-105', username: 'khanhlinh.vn', nickname: 'Khánh Linh ✨' },
      { id: 'tt-106', username: 'tuankiet_gamer', nickname: 'Tuấn Kiệt 🔥' },
      { id: 'tt-107', username: 'ngoc_han_live', nickname: 'Ngọc Hân 💎' },
      { id: 'tt-108', username: 'duykhanh_pro', nickname: 'Duy Khánh 🚀' },
      { id: 'tt-109', username: 'phuongthao_xinh', nickname: 'Phương Thảo 🍀' },
      { id: 'tt-110', username: 'gia_huy_88', nickname: 'Gia Huy ⭐' },
      { id: 'tt-111', username: 'baochau_idol', nickname: 'Bảo Châu 🎵' },
      { id: 'tt-112', username: 'thanhdat_vn', nickname: 'Thành Đạt 🎯' },
    ];

    const options: OptionLabel[] = ['A', 'B', 'C', 'D'];
    const selectedViewers = sampleViewers.slice(0, Math.min(count, sampleViewers.length));

    const results: any[] = [];
    selectedViewers.forEach((viewer, idx) => {
      const choice = options[Math.floor(Math.random() * options.length)];
      setTimeout(() => {
        this.simulateEvent({
          roomCode,
          type: 'COMMENT',
          userId: viewer.id,
          username: viewer.username,
          nickname: viewer.nickname,
          content: choice,
        });
      }, idx * 140);
      results.push({ viewer: viewer.nickname, choice });
    });

    return {
      triggeredCount: selectedViewers.length,
      preview: results,
    };
  }
}
