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

  @WebSocketServer()
  public server!: Server;

  constructor(
    @Inject(forwardRef(() => GameEngineService))
    private readonly gameEngine: GameEngineService
  ) {}

  handleConnection(client: Socket) {
    const roomCode =
      (client.handshake.query.roomCode as string) ||
      (client.handshake.auth?.roomCode as string) ||
      'KB2026';
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
  }

  handleDisconnect(client: Socket) {
    this.logger.debug(`Socket client ${client.id} disconnected`);
  }

  @SubscribeMessage('room.join')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomCode: string }
  ) {
    const roomCode = payload?.roomCode || 'KB2026';
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
    return { joined: roomCode };
  }

  public emitToRoom(roomCode: string, event: string, data: any) {
    if (!this.server) return;
    this.server.to(roomCode).emit(event, data);
  }
}

