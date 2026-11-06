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
    };
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
      theme: (payload as any).theme || (current as any).theme || 'cute',
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

