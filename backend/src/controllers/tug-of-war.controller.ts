import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { TugOfWarService, TugTeam } from '../tug-of-war/tug-of-war.service';

@Controller('api/tug')
export class TugOfWarController {
  constructor(private readonly tug: TugOfWarService) {}

  private wrap<T>(fn: () => T): T {
    try {
      return fn();
    } catch (err: any) {
      throw new HttpException(err?.message || 'Lỗi game Kéo Co Tri Thức', HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':roomCode/state')
  getState(@Param('roomCode') roomCode: string) {
    return this.tug.getPublicState(roomCode);
  }

  @Put(':roomCode/config')
  updateConfig(@Param('roomCode') roomCode: string, @Body() body: any) {
    return this.wrap(() => this.tug.updateConfig(roomCode, body || {}));
  }

  @Post(':roomCode/lobby')
  openLobby(@Param('roomCode') roomCode: string) {
    return this.wrap(() => this.tug.openLobby(roomCode));
  }

  @Post(':roomCode/start')
  start(@Param('roomCode') roomCode: string) {
    return this.wrap(() => this.tug.start(roomCode));
  }

  @Post(':roomCode/next')
  next(@Param('roomCode') roomCode: string) {
    return this.wrap(() => this.tug.nextQuestion(roomCode));
  }

  @Post(':roomCode/finish')
  finish(@Param('roomCode') roomCode: string) {
    return this.wrap(() => this.tug.finish(roomCode));
  }

  @Post(':roomCode/stop')
  stop(@Param('roomCode') roomCode: string) {
    return this.wrap(() => this.tug.stop(roomCode));
  }

  @Post(':roomCode/simulate')
  simulate(
    @Param('roomCode') roomCode: string,
    @Body() body: { kind: any; coins?: number; team?: TugTeam; count?: number }
  ) {
    return this.wrap(() =>
      this.tug.simulate(roomCode, body?.kind, { coins: body?.coins, team: body?.team, count: body?.count })
    );
  }
}
