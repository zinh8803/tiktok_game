import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
import { CrosswordService } from '../crossword/crossword.service';

@Controller('api/crossword')
export class CrosswordController {
  constructor(private readonly crossword: CrosswordService) {}

  private wrap<T>(fn: () => T): T {
    try {
      return fn();
    } catch (err: any) {
      throw new HttpException(err?.message || 'Lỗi game Giải Mã Ô Chữ', HttpStatus.BAD_REQUEST);
    }
  }

  // ===== Quản lý Bộ Câu Hỏi Ô Chữ (Section 10.1) =====

  @Get('question-sets')
  listQuestionSets() {
    return this.wrap(() => this.crossword.listQuestionSets());
  }

  @Get('question-sets/:id')
  getQuestionSet(@Param('id') id: string) {
    return this.wrap(() => this.crossword.getQuestionSet(id));
  }

  @Post('question-sets')
  createQuestionSet(@Body() body: any) {
    return this.wrap(() => this.crossword.createQuestionSet(body || {}));
  }

  @Put('question-sets/:id')
  updateQuestionSet(@Param('id') id: string, @Body() body: any) {
    return this.wrap(() => this.crossword.updateQuestionSet(id, body || {}));
  }

  @Post('generate-bulk')
  generateBulkSets(@Body() body?: { targetQuestionCount?: number }) {
    return this.wrap(() => this.crossword.generateBulkSets(body?.targetQuestionCount || 1000));
  }

  // ===== Điều khiển Ván Chơi Ô Chữ theo RoomCode =====

  @Get(':roomCode/state')
  getState(@Param('roomCode') roomCode: string, @Query('secret') secret?: string) {
    return this.wrap(() => this.crossword.getPublicState(roomCode, secret === '1'));
  }

  @Put(':roomCode/config')
  updateConfig(@Param('roomCode') roomCode: string, @Body() body: any) {
    return this.wrap(() => this.crossword.updateConfig(roomCode, body || {}));
  }

  @Post(':roomCode/select-set')
  selectQuestionSet(@Param('roomCode') roomCode: string, @Body() body: { questionSetId: string }) {
    return this.wrap(() => this.crossword.selectQuestionSet(roomCode, body?.questionSetId));
  }

  @Post(':roomCode/random-set')
  selectRandomSet(@Param('roomCode') roomCode: string) {
    return this.wrap(() => this.crossword.selectRandomQuestionSet(roomCode));
  }

  @Post(':roomCode/waiting')
  openWaitingRoom(@Param('roomCode') roomCode: string, @Body() body?: { questionSetId?: string }) {
    return this.wrap(() => this.crossword.openWaitingRoom(roomCode, body?.questionSetId));
  }

  @Post(':roomCode/start')
  startGame(@Param('roomCode') roomCode: string, @Body() body?: { questionSetId?: string }) {
    return this.wrap(() => this.crossword.startGame(roomCode, body?.questionSetId));
  }

  @Post(':roomCode/rows/:rowNumber/open')
  openRow(@Param('roomCode') roomCode: string, @Param('rowNumber') rowNumber: string) {
    return this.wrap(() => this.crossword.openRow(roomCode, Number(rowNumber)));
  }

  @Post(':roomCode/rows/:rowNumber/reveal')
  revealRow(@Param('roomCode') roomCode: string, @Param('rowNumber') rowNumber: string) {
    return this.wrap(() => this.crossword.revealRow(roomCode, Number(rowNumber)));
  }

  @Post(':roomCode/rows/:rowNumber/skip')
  skipRow(@Param('roomCode') roomCode: string, @Param('rowNumber') rowNumber: string) {
    return this.wrap(() => this.crossword.skipRow(roomCode, Number(rowNumber)));
  }

  @Post(':roomCode/hint')
  unlockHint(
    @Param('roomCode') roomCode: string,
    @Body() body?: { target?: 'ROW' | 'KEYWORD'; rowNumber?: number },
  ) {
    return this.wrap(() => this.crossword.unlockHint(roomCode, body?.target || 'ROW', body?.rowNumber));
  }

  @Post(':roomCode/keyword-final')
  startKeywordFinal(@Param('roomCode') roomCode: string) {
    return this.wrap(() => this.crossword.startKeywordFinalRound(roomCode));
  }

  @Post(':roomCode/pause')
  pauseGame(@Param('roomCode') roomCode: string) {
    return this.wrap(() => this.crossword.pauseGame(roomCode));
  }

  @Post(':roomCode/resume')
  resumeGame(@Param('roomCode') roomCode: string) {
    return this.wrap(() => this.crossword.resumeGame(roomCode));
  }

  @Post(':roomCode/finish')
  finishGame(@Param('roomCode') roomCode: string) {
    return this.wrap(() => this.crossword.finishGame(roomCode));
  }

  @Post(':roomCode/stop')
  stopGame(@Param('roomCode') roomCode: string) {
    return this.wrap(() => this.crossword.stopGame(roomCode));
  }

  @Post(':roomCode/reset-leaderboard')
  resetLeaderboard(@Param('roomCode') roomCode: string) {
    return this.wrap(() => this.crossword.resetSessionLeaderboard(roomCode));
  }

  @Get(':roomCode/leaderboard')
  getLeaderboard(@Param('roomCode') roomCode: string) {
    return this.wrap(() => {
      const state = this.crossword.getPublicState(roomCode, false);
      return {
        leaderboard: state.leaderboard,
        sessionLeaderboard: state.sessionLeaderboard,
      };
    });
  }

  @Post(':roomCode/simulate')
  simulate(
    @Param('roomCode') roomCode: string,
    @Body() body: { kind: any; count?: number },
  ) {
    return this.wrap(() => this.crossword.simulate(roomCode, body?.kind, { count: body?.count }));
  }
}
