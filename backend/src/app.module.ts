import { Module } from '@nestjs/common';
import { DatabaseService } from './database/database.service';
import { RealtimeGateway } from './realtime/realtime.gateway';
import { GameEngineService } from './game-engine/game-engine.service';
import { EventProcessorService } from './event-processor/event-processor.service';
import { TikTokService } from './integrations/tiktok/tiktok.service';
import { TugOfWarService } from './tug-of-war/tug-of-war.service';
import { CatchwordService } from './catchword/catchword.service';
import { CrosswordService } from './crossword/crossword.service';
import { ApiController } from './controllers/api.controller';
import { TugOfWarController } from './controllers/tug-of-war.controller';
import { CatchwordController } from './controllers/catchword.controller';
import { CrosswordController } from './controllers/crossword.controller';
import { AiController } from './controllers/ai.controller';
import { AiService } from './ai/ai.service';

@Module({
  imports: [],
  controllers: [
    ApiController,
    TugOfWarController,
    CatchwordController,
    CrosswordController,
    AiController,
  ],
  providers: [
    DatabaseService,
    RealtimeGateway,
    GameEngineService,
    TugOfWarService,
    CatchwordService,
    CrosswordService,
    EventProcessorService,
    TikTokService,
    AiService,
  ],
  exports: [
    DatabaseService,
    RealtimeGateway,
    GameEngineService,
    TugOfWarService,
    CatchwordService,
    CrosswordService,
    EventProcessorService,
    TikTokService,
    AiService,
  ],
})
export class AppModule {}
