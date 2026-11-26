import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { DatabaseService } from '../database/database.service';
import { GameEngineService } from '../game-engine/game-engine.service';
import { TikTokService } from '../integrations/tiktok/tiktok.service';
import { OptionLabel, QuestionDifficulty, QuestionStatus } from '../common/types';

const ttsCache = new Map<string, Buffer>();

async function fetchGoogleTtsChunk(textChunk: string, lang = 'vi'): Promise<Buffer> {
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(textChunk)}&tl=${encodeURIComponent(lang)}&client=tw-ob`;
  const response = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
  });
  if (!response.ok) {
    throw new Error(`Google TTS error: ${response.status} ${response.statusText}`);
  }
  const arrayBuf = await response.arrayBuffer();
  return Buffer.from(arrayBuf);
}

function splitTextIntoTtsChunks(text: string, maxLen = 130): string[] {
  const clean = text.replace(/[*_#`]/g, ' ').replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLen) return [clean];

  const rawParts = clean.split(/(?<=[.!?,:;\n])/);
  const chunks: string[] = [];
  let cur = '';

  for (const part of rawParts) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    if ((cur + ' ' + trimmed).trim().length <= maxLen) {
      cur = (cur + ' ' + trimmed).trim();
    } else {
      if (cur) chunks.push(cur);
      if (trimmed.length > maxLen) {
        const words = trimmed.split(' ');
        let sub = '';
        for (const w of words) {
          if ((sub + ' ' + w).trim().length <= maxLen) {
            sub = (sub + ' ' + w).trim();
          } else {
            if (sub) chunks.push(sub);
            sub = w;
          }
        }
        if (sub) chunks.push(sub);
        cur = '';
      } else {
        cur = trimmed;
      }
    }
  }
  if (cur) chunks.push(cur);
  return chunks.length > 0 ? chunks : [clean];
}

@Controller('api')
export class ApiController {
  constructor(
    private readonly db: DatabaseService,
    private readonly gameEngine: GameEngineService,
    private readonly tiktokService: TikTokService
  ) {}

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      service: 'Knowledge Battle Engine',
      timestamp: new Date().toISOString(),
      stats: this.db.getSystemStats(),
    };
  }

  // =====================================================================
  // ROOM & GAME CONTROL ENDPOINTS (Mục 2, 3, 7)
  // =====================================================================

  @Get('rooms/:roomCode')
  getRoom(@Param('roomCode') roomCode: string) {
    const recovery = this.gameEngine.getFullClientRecoveryState(roomCode);
    const tiktokStatus = this.tiktokService.getConnectionStatus(roomCode);
    return {
      ...recovery,
      tiktokStatus,
    };
  }

  @Put('rooms/:roomCode/config')
  updateRoomConfig(@Param('roomCode') roomCode: string, @Body() body: any) {
    const updated = this.db.updateRoomConfig(roomCode, body);
    if (!updated) {
      throw new HttpException('Không tìm thấy phòng chơi', HttpStatus.NOT_FOUND);
    }
    this.gameEngine.emitRoomState(roomCode);
    return updated;
  }

  @Post('rooms/:roomCode/start')
  startGame(
    @Param('roomCode') roomCode: string,
    @Body() body?: { immediate?: boolean }
  ) {
    try {
      return this.gameEngine.startMatch(roomCode, body);
    } catch (err: any) {
      throw new HttpException(
        err?.message || 'Không thể bắt đầu trận đấu',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post('rooms/:roomCode/next')
  nextQuestionOrReveal(@Param('roomCode') roomCode: string) {
    return this.gameEngine.nextStep(roomCode);
  }

  @Post('rooms/:roomCode/reveal')
  revealCurrentQuestion(@Param('roomCode') roomCode: string) {
    return this.gameEngine.closeAndGradeCurrentQuestion(roomCode);
  }

  @Post('rooms/:roomCode/leaderboard')
  showLeaderboard(@Param('roomCode') roomCode: string) {
    return {
      leaderboard: this.gameEngine.showLeaderboardPhase(roomCode),
    };
  }

  @Post('rooms/:roomCode/pause')
  pauseGame(@Param('roomCode') roomCode: string) {
    return this.gameEngine.pauseMatch(roomCode);
  }

  @Post('rooms/:roomCode/resume')
  resumeGame(@Param('roomCode') roomCode: string) {
    return this.gameEngine.resumeMatch(roomCode);
  }

  @Post('rooms/:roomCode/finish')
  finishGame(@Param('roomCode') roomCode: string) {
    return this.gameEngine.finishMatch(roomCode);
  }

  @Post('rooms/:roomCode/reset')
  resetGame(@Param('roomCode') roomCode: string) {
    return this.gameEngine.resetToWaitingRoom(roomCode);
  }

  @Post('rooms/:roomCode/reset-question-history')
  resetQuestionHistory(@Param('roomCode') roomCode: string) {
    const stats = this.db.resetRoomQuestionHistory(roomCode);
    this.gameEngine.emitRoomState(roomCode);
    return {
      ok: true,
      randomPoolStats: stats,
    };
  }

  // =====================================================================
  // TIKTOK LIVE CONNECTOR & SIMULATOR ENDPOINTS (Mục 5, 6, 10)
  // =====================================================================

  @Get('tiktok/:roomCode/status')
  getTikTokStatus(@Param('roomCode') roomCode: string) {
    return this.tiktokService.getConnectionStatus(roomCode);
  }

  @Post('tiktok/:roomCode/connect')
  async connectTikTok(
    @Param('roomCode') roomCode: string,
    @Body() body: { username: string }
  ) {
    if (!body?.username) {
      throw new HttpException('Vui lòng nhập TikTok username', HttpStatus.BAD_REQUEST);
    }
    this.db.updateRoomConfig(roomCode, { tiktokUsername: body.username.trim().replace(/^@/, '') });
    return this.tiktokService.connect(roomCode, body.username);
  }

  @Post('tiktok/:roomCode/disconnect')
  async disconnectTikTok(@Param('roomCode') roomCode: string) {
    return this.tiktokService.disconnect(roomCode);
  }

  @Post('simulator/:roomCode/event')
  simulateSingleEvent(@Param('roomCode') roomCode: string, @Body() body: any) {
    return this.tiktokService.simulateEvent({
      ...body,
      roomCode,
    });
  }

  @Post('simulator/:roomCode/crowd')
  simulateCrowd(
    @Param('roomCode') roomCode: string,
    @Body() body?: { count?: number }
  ) {
    return this.tiktokService.simulateCrowdWave(roomCode, body?.count || 8);
  }

  @Post('simulator/:roomCode/auto-crowd')
  toggleAutoCrowd(
    @Param('roomCode') roomCode: string,
    @Body() body?: { enabled?: boolean; minPlayers?: number; maxPlayers?: number }
  ) {
    return this.gameEngine.toggleAutoCrowd(
      roomCode,
      body?.enabled,
      body?.minPlayers ?? 50,
      body?.maxPlayers ?? 100
    );
  }

  // =====================================================================
  // QUESTION BANK, CATEGORIES, REVIEWS & GIFT MAPPINGS (Mục 4 & Mục 9)
  // =====================================================================

  @Get('categories')
  getCategories() {
    return this.db.getCategories();
  }

  @Post('categories')
  createCategory(@Body() body: { name: string; slug?: string; description?: string; icon?: string }) {
    if (!body?.name) {
      throw new HttpException('Tên danh mục không được để trống', HttpStatus.BAD_REQUEST);
    }
    return this.db.createCategory(body);
  }

  @Get('questions')
  getQuestions(
    @Query('categoryId') categoryId?: string,
    @Query('difficulty') difficulty?: string,
    @Query('status') status?: string,
    @Query('search') search?: string
  ) {
    return this.db.getQuestions({ categoryId, difficulty, status, search });
  }

  @Post('questions')
  createQuestion(
    @Body()
    body: {
      categoryId: string;
      content: string;
      difficulty: QuestionDifficulty;
      options: Record<OptionLabel, string>;
      correctOption: OptionLabel;
      explanation: string;
      topicTags?: string[];
      status?: QuestionStatus;
      sourceType?: 'OPEN_TRIVIA_DB' | 'WIKIDATA' | 'WIKIPEDIA' | 'AI' | 'MANUAL';
      sourceUrl?: string;
      license?: string;
      attribution?: string;
    }
  ) {
    if (!body?.content || !body?.options?.A || !body?.options?.B) {
      throw new HttpException('Vui lòng nhập đầy đủ nội dung câu hỏi và 4 đáp án A/B/C/D', HttpStatus.BAD_REQUEST);
    }
    return this.db.createQuestion(body);
  }

  @Put('questions/:id')
  updateQuestion(@Param('id') id: string, @Body() body: any) {
    const updated = this.db.updateQuestion(id, body);
    if (!updated) {
      throw new HttpException('Không tìm thấy câu hỏi', HttpStatus.NOT_FOUND);
    }
    return updated;
  }

  @Patch('questions/:id/review')
  reviewQuestion(
    @Param('id') id: string,
    @Body() body: { status: QuestionStatus; notes?: string }
  ) {
    const updated = this.db.reviewQuestion(id, body.status, body.notes);
    if (!updated) {
      throw new HttpException('Không tìm thấy câu hỏi', HttpStatus.NOT_FOUND);
    }
    return updated;
  }

  @Post('questions/random')
  generateRandomQuestions(
    @Body() body?: { count?: number; targetStatus?: QuestionStatus }
  ) {
    const count = Math.min(Math.max(Number(body?.count) || 10, 1), 50);
    const status: QuestionStatus = body?.targetStatus || 'PUBLISHED';
    const created = this.db.generateRandomQuestions(count, status);
    return {
      generatedCount: created.length,
      questions: created,
    };
  }

  @Post('questions/import')
  importQuestions(@Body() body: { questions: any[]; targetStatus?: QuestionStatus }) {
    if (!Array.isArray(body?.questions) || body.questions.length === 0) {
      throw new HttpException('Danh sách câu hỏi nhập không hợp lệ', HttpStatus.BAD_REQUEST);
    }
    const created: any[] = [];
    for (const item of body.questions) {
      const q = this.db.createQuestion({
        categoryId: item.categoryId || 'cat-geo',
        content: item.content || item.question,
        difficulty: item.difficulty || 'MEDIUM',
        options: item.options || { A: '', B: '', C: '', D: '' },
        correctOption: item.correctOption || 'A',
        explanation: item.explanation || '',
        topicTags: item.topicTags || [],
        status: body.targetStatus || item.status || 'PENDING',
        sourceType: item.sourceType || 'OPEN_TRIVIA_DB',
        sourceUrl: item.sourceUrl || 'https://opentdb.com/',
        license: item.license || 'CC BY-SA 4.0',
        attribution: item.attribution || 'Open Trivia DB Import',
      });
      created.push(q);
    }
    return {
      importedCount: created.length,
      questions: created,
    };
  }

  @Get('reviews')
  getReviews(@Query('questionId') questionId?: string) {
    return this.db.getQuestionReviews(questionId);
  }

  @Get('quiz-sets')
  getQuizSets() {
    return this.db.getQuizSets();
  }

  @Get('gifts')
  getGifts() {
    return this.db.getGiftMappings();
  }

  @Post('gifts')
  upsertGift(@Body() body: any) {
    return this.db.upsertGiftMapping(body);
  }

  // =====================================================================
  // TTS (TEXT-TO-SPEECH) PROXY ENDPOINT CHO CHỊ GOOGLE & TIẾNG VIỆT
  // =====================================================================

  @Get('tts')
  async streamTtsAudio(
    @Query('text') text: string,
    @Query('lang') lang = 'vi',
    @Res() res: Response
  ) {
    if (!text || !text.trim()) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Missing text parameter' });
    }

    const clean = text.trim();
    const cacheKey = `${lang}:${clean}`;

    if (ttsCache.has(cacheKey)) {
      const cached = ttsCache.get(cacheKey)!;
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Content-Length', cached.length);
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return res.end(cached);
    }

    try {
      const chunks = splitTextIntoTtsChunks(clean);
      const buffers = await Promise.all(
        chunks.map((c) => fetchGoogleTtsChunk(c, lang))
      );
      const combined = Buffer.concat(buffers);

      if (ttsCache.size > 300) {
        const firstKey = ttsCache.keys().next().value;
        if (firstKey) ttsCache.delete(firstKey);
      }
      ttsCache.set(cacheKey, combined);

      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Content-Length', combined.length);
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return res.end(combined);
    } catch (err: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'TTS generation failed',
        error: err?.message,
      });
    }
  }
}

