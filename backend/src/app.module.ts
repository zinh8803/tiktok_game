import { Module } from '@nestjs/common';
import { DatabaseService } from './database/database.service';
import { RealtimeGateway } from './realtime/realtime.gateway';
import { GameEngineService } from './game-engine/game-engine.service';
import { EventProcessorService } from './event-processor/event-processor.service';
import { TikTokService } from './integrations/tiktok/tiktok.service';
import { TugOfWarService } from './tug-of-war/tug-of-war.service';
import { CatchwordService } from './catchword/catchword.service';
import { ApiController } from './controllers/api.controller';
import { TugOfWarController } from './controllers/tug-of-war.controller';
import { CatchwordController } from './controllers/catchword.controller';

@Module({
  imports: [],
  controllers: [ApiController, TugOfWarController, CatchwordController],
  providers: [
    DatabaseService,
    RealtimeGateway,
    GameEngineService,
    TugOfWarService,
    CatchwordService,
    EventProcessorService,
    TikTokService,
  ],
  exports: [
    DatabaseService,
    RealtimeGateway,
    GameEngineService,
    TugOfWarService,
    CatchwordService,
    EventProcessorService,
    TikTokService,
  ],
})
export class AppModule {}
