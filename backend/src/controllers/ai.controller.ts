import { Controller, Get, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AiService, GeneratedQuestion, GeneratedCatchword } from '../ai/ai.service';
import { QuestionDifficulty } from '../common/types';

@Controller('api/ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('status')
  getStatus() {
    return this.aiService.getStatus();
  }

  @Post('generate-questions')
  async generateQuestions(
    @Body()
    dto: {
      topic: string;
      count?: number;
      difficulty?: 'ALL' | QuestionDifficulty;
      apiKey?: string;
      provider?: 'GEMINI' | 'OPENAI' | 'OFFLINE';
      autoPublish?: boolean;
    },
  ) {
    if (!dto.topic || !dto.topic.trim()) {
      throw new HttpException('Chủ đề (topic) không được để trống', HttpStatus.BAD_REQUEST);
    }
    try {
      const questions = await this.aiService.generateQuestions({
        topic: dto.topic,
        count: dto.count,
        difficulty: dto.difficulty,
        apiKey: dto.apiKey,
        provider: dto.provider,
      });

      let savedRecords = null;
      if (dto.autoPublish) {
        savedRecords = this.aiService.saveQuestionsToDatabase(questions, true);
      }

      return {
        success: true,
        topic: dto.topic,
        count: questions.length,
        autoPublished: Boolean(dto.autoPublish),
        savedCount: savedRecords?.length || 0,
        questions,
      };
    } catch (err: any) {
      throw new HttpException(
        err.message || 'Lỗi khi sinh câu hỏi bằng AI',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('save-questions')
  saveQuestions(
    @Body()
    dto: {
      questions: GeneratedQuestion[];
      autoPublish?: boolean;
    },
  ) {
    if (!dto.questions || !Array.isArray(dto.questions) || dto.questions.length === 0) {
      throw new HttpException('Danh sách câu hỏi không hợp lệ', HttpStatus.BAD_REQUEST);
    }
    const saved = this.aiService.saveQuestionsToDatabase(dto.questions, dto.autoPublish ?? true);
    return {
      success: true,
      savedCount: saved.length,
      saved,
    };
  }

  @Post('generate-catchwords')
  async generateCatchwords(
    @Body()
    dto: {
      topic: string;
      count?: number;
      apiKey?: string;
      provider?: 'GEMINI' | 'OPENAI' | 'OFFLINE';
      autoSave?: boolean;
    },
  ) {
    if (!dto.topic || !dto.topic.trim()) {
      throw new HttpException('Chủ đề câu đố không được để trống', HttpStatus.BAD_REQUEST);
    }
    try {
      const puzzles = await this.aiService.generateCatchwords({
        topic: dto.topic,
        count: dto.count,
        apiKey: dto.apiKey,
        provider: dto.provider,
      });

      let savedPuzzles = null;
      if (dto.autoSave) {
        savedPuzzles = this.aiService.saveCatchwordsToBank(puzzles);
      }

      return {
        success: true,
        topic: dto.topic,
        count: puzzles.length,
        autoSaved: Boolean(dto.autoSave),
        savedCount: savedPuzzles?.length || 0,
        puzzles,
      };
    } catch (err: any) {
      throw new HttpException(
        err.message || 'Lỗi khi sinh câu đố bằng AI',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('save-catchwords')
  saveCatchwords(
    @Body()
    dto: {
      puzzles: GeneratedCatchword[];
    },
  ) {
    if (!dto.puzzles || !Array.isArray(dto.puzzles) || dto.puzzles.length === 0) {
      throw new HttpException('Danh sách câu đố không hợp lệ', HttpStatus.BAD_REQUEST);
    }
    const saved = this.aiService.saveCatchwordsToBank(dto.puzzles);
    return {
      success: true,
      savedCount: saved.length,
      saved,
    };
  }
}
