import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
import { CatchwordService } from '../catchword/catchword.service';

@Controller('api/catchword')
export class CatchwordController {
  constructor(private readonly catchword: CatchwordService) {}

  private wrap<T>(fn: () => T): T {
    try {
      return fn();
    } catch (err: any) {
      throw new HttpException(err?.message || 'Lỗi game Đuổi Hình Bắt Chữ', HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':roomCode/state')
  getState(@Param('roomCode') roomCode: string, @Query('secret') secret?: string) {
    return this.catchword.getPublicState(roomCode, secret === '1');
  }

  @Put(':roomCode/config')
  updateConfig(@Param('roomCode') roomCode: string, @Body() body: any) {
    return this.wrap(() => this.catchword.updateConfig(roomCode, body || {}));
  }

  @Post('puzzles')
  addCustomPuzzle(@Body() body: any) {
    return this.wrap(() => this.catchword.addCustomPuzzle(body || {}));
  }

  @Post(':roomCode/lobby')
  openLobby(@Param('roomCode') roomCode: string) {
    return this.wrap(() => this.catchword.openLobby(roomCode));
  }

  @Post(':roomCode/start')
  start(@Param('roomCode') roomCode: string) {
    return this.wrap(() => this.catchword.start(roomCode));
  }

  @Post(':roomCode/next')
  next(@Param('roomCode') roomCode: string) {
    return this.wrap(() => this.catchword.nextPuzzle(roomCode));
  }

  @Post(':roomCode/reveal-letter')
  revealLetter(@Param('roomCode') roomCode: string, @Body() body?: { count?: number }) {
    return this.wrap(() => this.catchword.revealLetterManual(roomCode, body?.count || 1));
  }

  @Post(':roomCode/unlock-hint')
  unlockHint(@Param('roomCode') roomCode: string) {
    return this.wrap(() => this.catchword.unlockHintManual(roomCode));
  }

  @Post(':roomCode/finish')
  finish(@Param('roomCode') roomCode: string) {
    return this.wrap(() => this.catchword.finish(roomCode));
  }

  @Post(':roomCode/stop')
  stop(@Param('roomCode') roomCode: string) {
    return this.wrap(() => this.catchword.stop(roomCode));
  }

  @Post(':roomCode/simulate')
  simulate(
    @Param('roomCode') roomCode: string,
    @Body() body: { kind: any; coins?: number; count?: number }
  ) {
    return this.wrap(() =>
      this.catchword.simulate(roomCode, body?.kind, { coins: body?.coins, count: body?.count })
    );
  }
}
