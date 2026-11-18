import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger, Inject, forwardRef } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { GameEngineService } from '../game-engine/game-engine.service';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(RealtimeGateway.name);
  private readonly roomLayoutConfigs = new Map<
    string,
    {
      frameWidth: number;
      frameHeight: number;
      scale: number;
      widthPercent: number;
      offsetX: number;
      offsetY: number;
      paddingTop?: number;
      paddingBottom?: number;
      preset: string;
      theme?: string;
      bgmEnabled?: boolean;
      bgmVolume?: number;
      sfxVolume?: number;
      lofiStyle?: string;
      avatarSize?: number;
      stageCalib?: {
        preset: string;
        maxWidth: number;
        scale: number;
        offsetX: number;
        offsetY: number;
        paddingTop: number;
        paddingBottom: number;
        avatarSize: number;
      };
    }
  >();

  @WebSocketServer()
  public server!: Server;

  constructor(
    @Inject(forwardRef(() => GameEngineService))
    private readonly gameEngine: GameEngineService
  ) {}

  handleConnection(client: Socket) {
    const roomCode = (
      (client.handshake.query.roomCode as string) ||
      (client.handshake.auth?.roomCode as string) ||
      'KB2026'
    ).toUpperCase();
    client.join(roomCode);
    this.logger.debug(`Socket client ${client.id} joined room ${roomCode}`);

    // Khôi phục trạng thái ngay lập tức khi OBS tải lại Browser Source (Mục 10.1 Checklist)
    const snapshot = this.gameEngine.getFullClientRecoveryState(roomCode);
    if (snapshot) {
      client.emit('room.state', snapshot.roomState);
      if (snapshot.activeQuestion) {
        client.emit('question.started', snapshot.activeQuestion);
      }
      if (snapshot.lastQuestionResult) {
        client.emit('question.result', snapshot.lastQuestionResult);
      }
      if (snapshot.leaderboard) {
        client.emit('leaderboard.updated', snapshot.leaderboard);
      }
      if (snapshot.gameFinished) {
        client.emit('game.finished', snapshot.gameFinished);
      }
    }
    const layoutConfig = this.roomLayoutConfigs.get(roomCode);
    if (layoutConfig) {
      client.emit('layout.config', layoutConfig);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.debug(`Socket client ${client.id} disconnected`);
  }

  @SubscribeMessage('room.join')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomCode: string }
  ) {
    const roomCode = (payload?.roomCode || 'KB2026').toUpperCase();
    client.join(roomCode);
    const snapshot = this.gameEngine.getFullClientRecoveryState(roomCode);
    if (snapshot) {
      client.emit('room.state', snapshot.roomState);
      if (snapshot.activeQuestion) {
        client.emit('question.started', snapshot.activeQuestion);
      }
      if (snapshot.lastQuestionResult) {
        client.emit('question.result', snapshot.lastQuestionResult);
      }
      if (snapshot.leaderboard) {
        client.emit('leaderboard.updated', snapshot.leaderboard);
      }
      if (snapshot.gameFinished) {
        client.emit('game.finished', snapshot.gameFinished);
      }
    }
    const layoutConfig = this.roomLayoutConfigs.get(roomCode);
    if (layoutConfig) {
      client.emit('layout.config', layoutConfig);
    }
    return { joined: roomCode };
  }

  @SubscribeMessage('layout.update')
  handleUpdateLayout(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: {
      roomCode?: string;
      frameWidth?: number;
      frameHeight?: number;
      scale?: number;
      widthPercent?: number;
      offsetX?: number;
      offsetY?: number;
      paddingTop?: number;
      paddingBottom?: number;
      preset?: string;
      theme?: string;
      bgmEnabled?: boolean;
      bgmVolume?: number;
      sfxVolume?: number;
      lofiStyle?: string;
      avatarSize?: number;
      stageCalib?: {
        preset?: string;
        maxWidth?: number;
        scale?: number;
        offsetX?: number;
        offsetY?: number;
        paddingTop?: number;
        paddingBottom?: number;
        avatarSize?: number;
      };
    }
  ) {
    const roomCode = (payload?.roomCode || 'KB2026').toUpperCase();
    const current = this.roomLayoutConfigs.get(roomCode) || {
      frameWidth: 1080,
      frameHeight: 1920,
      scale: 100,
      widthPercent: 100,
      offsetX: 0,
      offsetY: 0,
      paddingTop: 160,
      paddingBottom: 262,
      preset: 'fullscreen',
      theme: 'cute',
      bgmEnabled: true,
      bgmVolume: 40,
      sfxVolume: 80,
      lofiStyle: 'chill-cafe',
      avatarSize: 34,
    };
    const nextAvatarSize = Number(
      payload.avatarSize ?? payload.stageCalib?.avatarSize ?? current.avatarSize ?? 34
    );
    const updatedStageCalib = payload.stageCalib
      ? {
          preset: String(payload.stageCalib.preset || current.stageCalib?.preset || 'fullscreen'),
          maxWidth: Number(payload.stageCalib.maxWidth ?? current.stageCalib?.maxWidth ?? 760),
          scale: Number(payload.stageCalib.scale ?? current.stageCalib?.scale ?? 100),
          offsetX: Number(payload.stageCalib.offsetX ?? current.stageCalib?.offsetX ?? 0),
          offsetY: Number(payload.stageCalib.offsetY ?? current.stageCalib?.offsetY ?? 0),
          paddingTop: Number(payload.stageCalib.paddingTop ?? current.stageCalib?.paddingTop ?? 20),
          paddingBottom: Number(payload.stageCalib.paddingBottom ?? current.stageCalib?.paddingBottom ?? 24),
          avatarSize: nextAvatarSize,
        }
      : current.stageCalib;

    const updated = {
      frameWidth: Number(payload.frameWidth ?? current.frameWidth),
      frameHeight: Number(payload.frameHeight ?? current.frameHeight),
      scale: Number(payload.scale ?? current.scale),
      widthPercent: Number(payload.widthPercent ?? current.widthPercent),
      offsetX: Number(payload.offsetX ?? current.offsetX),
      offsetY: Number(payload.offsetY ?? current.offsetY),
      paddingTop: Number(payload.paddingTop ?? current.paddingTop),
      paddingBottom: Number(payload.paddingBottom ?? current.paddingBottom),
      preset: payload.preset || current.preset,
      theme: payload.theme || current.theme || 'cute',
      bgmEnabled: payload.bgmEnabled !== undefined ? Boolean(payload.bgmEnabled) : (current.bgmEnabled ?? true),
      bgmVolume: payload.bgmVolume !== undefined ? Number(payload.bgmVolume) : (current.bgmVolume ?? 40),
      sfxVolume: payload.sfxVolume !== undefined ? Number(payload.sfxVolume) : (current.sfxVolume ?? 80),
      lofiStyle: payload.lofiStyle || current.lofiStyle || 'chill-cafe',
      avatarSize: nextAvatarSize,
      stageCalib: updatedStageCalib,
    };
    this.roomLayoutConfigs.set(roomCode, updated);
    this.emitToRoom(roomCode, 'layout.config', updated);
    return { ok: true, config: updated };
  }

  public emitToRoom(roomCode: string, event: string, data: any) {
    if (!this.server) return;
    this.server.to(roomCode).emit(event, data);
  }
}

